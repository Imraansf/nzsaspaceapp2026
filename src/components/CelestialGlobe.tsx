import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Artifact, CelestialBody, LunarLandmark } from '../types/space';
import { playRadarPing, playTelemetryBeep } from '../utils/audio';
import {
  Compass,
  Crosshair,
} from 'lucide-react';
import {
  createGeographicLunarTexture,
  createGeographicLunarBumpMap,
  createGeographicMarsTexture,
} from '../utils/lunar-textures';
import { TelemetryHUD } from './TelemetryHUD';

interface CelestialGlobeProps {
  body: CelestialBody;
  artifacts: Artifact[];
  selectedArtifact: Artifact | null;
  onSelectArtifact: (artifact: Artifact) => void;
  landmarks?: LunarLandmark[];
  showLandmarks?: boolean;
  onSelectLandmark?: (landmark: LunarLandmark) => void;
  selectedLandmark?: LunarLandmark | null;
}

export const CelestialGlobe: React.FC<CelestialGlobeProps> = React.memo(({
  body,
  artifacts,
  selectedArtifact,
  onSelectArtifact,
  landmarks = [],
  showLandmarks = true,
  onSelectLandmark,
  selectedLandmark,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const markerGroupRef = useRef<THREE.Group | null>(null);
  const landmarkGroupRef = useRef<THREE.Group | null>(null);

  const pinMeshesRef = useRef<{ mesh: THREE.Mesh; artifact: Artifact }[]>([]);
  const landmarkMeshesRef = useRef<{ mesh: THREE.Mesh; landmark: LunarLandmark }[]>([]);

  // Drag and camera control state in refs for 60fps smoothness
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.1, y: 0 });
  const currentRotationRef = useRef({ x: 0.1, y: 0 });
  const zoomDistanceRef = useRef(4.6);
  const targetZoomDistanceRef = useRef(4.6);
  const autoRotateRef = useRef(true);

  const [hoveredArtifact, setHoveredArtifact] = useState<Artifact | null>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<LunarLandmark | null>(null);
  const [activePreset, setActivePreset] = useState<'orbital' | 'north' | 'equator' | 'target'>('orbital');

  const handleFlyToPreset = (preset: 'orbital' | 'north' | 'equator' | 'target') => {
    playTelemetryBeep(520);
    autoRotateRef.current = false;
    setActivePreset(preset);

    switch (preset) {
      case 'orbital': {
        targetRotationRef.current.x = 0.1;
        targetRotationRef.current.y = 0;
        targetZoomDistanceRef.current = 4.6;
        break;
      }
      case 'north': {
        targetRotationRef.current.x = 1.35;
        targetRotationRef.current.y = 0;
        targetZoomDistanceRef.current = 3.8;
        break;
      }
      case 'equator': {
        targetRotationRef.current.x = 0;
        targetRotationRef.current.y = 0;
        targetZoomDistanceRef.current = 3.8;
        break;
      }
      case 'target': {
        if (selectedArtifact && selectedArtifact.coordinates) {
          const lat = selectedArtifact.coordinates.lat;
          const lon = selectedArtifact.coordinates.lon;
          const targetX = (lat * Math.PI) / 180;
          const targetY = -((lon + 90) * Math.PI) / 180;
          targetRotationRef.current.x = THREE.MathUtils.clamp(targetX, -1.2, 1.2);
          targetRotationRef.current.y = targetY;
          targetZoomDistanceRef.current = 2.45;
        }
        break;
      }
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const factor = direction === 'in' ? -0.8 : 0.8;
    targetZoomDistanceRef.current = THREE.MathUtils.clamp(
      targetZoomDistanceRef.current + factor,
      2.1,
      6.5
    );
  };

  const currentLat = (currentRotationRef.current.x * 180) / Math.PI;
  let currentLon = -((currentRotationRef.current.y * 180) / Math.PI) - 90;
  while (currentLon > 180) currentLon -= 360;
  while (currentLon < -180) currentLon += 360;

  const crosshairCoords = { lat: currentLat, lon: currentLon };
  const cameraHeightKm = Math.round((zoomDistanceRef.current - 1.4) * 800);

  // Convert lat/long to 3D point on globe of radius R
  const latLongToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  // Mount Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, zoomDistanceRef.current);
    cameraRef.current = camera;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.85);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(
      body === 'mars' ? 0xff7744 : 0x88bbff,
      0.65
    );
    rimLight.position.set(-5, -2, -4);
    scene.add(rimLight);

    // 3. Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // Celestial Sphere Mesh
    const globeRadius = 1.4;
    const geometry = new THREE.SphereGeometry(globeRadius, 64, 64);

    // Geographically accurate textures generated from NASA coordinates
    const texture =
      body === 'mars'
        ? createGeographicMarsTexture(2048, 1024)
        : createGeographicLunarTexture(2048, 1024);

    const bumpMap =
      body === 'moon' ? createGeographicLunarBumpMap(1024, 512) : null;

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      bumpMap: bumpMap || undefined,
      bumpScale: 0.045,
      roughness: body === 'mars' ? 0.85 : 0.92,
      metalness: 0.04,
    });
    const globeMesh = new THREE.Mesh(geometry, material);
    globeGroup.add(globeMesh);

    // Subtle atmospheric rim ring
    const atmosphereGeo = new THREE.SphereGeometry(globeRadius * 1.015, 32, 32);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: body === 'mars' ? 0xcc5533 : 0x7799cc,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    globeGroup.add(atmosphereMesh);

    // 4. Marker Pins Group (NASA Hardware)
    const markerGroup = new THREE.Group();
    globeGroup.add(markerGroup);
    markerGroupRef.current = markerGroup;

    // 4b. Landmark Markers Group (Lunar Craters & Maria)
    const landmarkGroup = new THREE.Group();
    globeGroup.add(landmarkGroup);
    landmarkGroupRef.current = landmarkGroup;

    // 5. Starfield Background (Zero external asset dependency)
    const starCount = 350;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 50;
      starPositions[i + 1] = (Math.random() - 0.5) * 50;
      starPositions[i + 2] = -10 - Math.random() * 30;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.12,
      transparent: true,
      opacity: 0.7,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // 6. Animation Frame Loop with Silky Exponential Damping
    let animationFrameId = 0;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Gentle auto-rotation when user is not dragging
      if (autoRotateRef.current && !isDraggingRef.current) {
        targetRotationRef.current.y += 0.0012;
      }

      // Smoothly interpolate rotation
      currentRotationRef.current.x +=
        (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y +=
        (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;

      if (globeGroupRef.current) {
        globeGroupRef.current.rotation.x = currentRotationRef.current.x;
        globeGroupRef.current.rotation.y = currentRotationRef.current.y;
      }

      // Smoothly interpolate camera zoom
      zoomDistanceRef.current +=
        (targetZoomDistanceRef.current - zoomDistanceRef.current) * 0.1;
      if (cameraRef.current) {
        cameraRef.current.position.z = zoomDistanceRef.current;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 7. Resize Handler & Observer for Smooth Container Layout Transitions
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    const ro = new ResizeObserver(() => {
      handleResize();
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      ro.disconnect();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      if (bumpMap) bumpMap.dispose();
      renderer.dispose();
    };
  }, [body]);

  // Update Marker Pins when artifacts or selectedArtifact changes
  useEffect(() => {
    const markerGroup = markerGroupRef.current;
    if (!markerGroup) return;

    // Clear existing pins
    while (markerGroup.children.length > 0) {
      const child = markerGroup.children[0];
      markerGroup.remove(child);
      if ((child as any).geometry) (child as any).geometry.dispose();
      if ((child as any).material) (child as any).material.dispose();
    }
    pinMeshesRef.current = [];

    const globeRadius = 1.4;

    artifacts.forEach((artifact) => {
      const isSelected = selectedArtifact?.id === artifact.id;
      const pos = latLongToVector3(
        artifact.coordinates.lat,
        artifact.coordinates.lon,
        globeRadius * 1.008
      );

      // Pin base group
      const pinGroup = new THREE.Group();
      pinGroup.position.copy(pos);
      pinGroup.lookAt(new THREE.Vector3(0, 0, 0)); // Orient perpendicular to sphere

      // Pin core sphere
      const pinGeo = new THREE.SphereGeometry(isSelected ? 0.045 : 0.03, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: isSelected
          ? 0x38bdf8
          : artifact.status === 'active_passive'
          ? 0x34d399
          : 0xf59e0b,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinGroup.add(pinMesh);

      // Outer glowing beacon ring
      const ringGeo = new THREE.RingGeometry(0.045, 0.065, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0x38bdf8 : 0xf59e0b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isSelected ? 0.8 : 0.45,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      pinGroup.add(ringMesh);

      markerGroup.add(pinGroup);
      pinMeshesRef.current.push({ mesh: pinMesh, artifact });
    });
  }, [artifacts, selectedArtifact]);

  // Update Landmark Markers (Craters, Maria, Mountains)
  useEffect(() => {
    const landmarkGroup = landmarkGroupRef.current;
    if (!landmarkGroup) return;

    // Clear existing landmarks
    while (landmarkGroup.children.length > 0) {
      const child = landmarkGroup.children[0];
      landmarkGroup.remove(child);
      if ((child as any).geometry) (child as any).geometry.dispose();
      if ((child as any).material) (child as any).material.dispose();
    }
    landmarkMeshesRef.current = [];

    if (!showLandmarks) return;

    const globeRadius = 1.4;

    landmarks.forEach((landmark) => {
      const isSelected = selectedLandmark?.id === landmark.id;
      const pos = latLongToVector3(
        landmark.coordinates.lat,
        landmark.coordinates.lon,
        globeRadius * 1.006
      );

      const lmGroup = new THREE.Group();
      lmGroup.position.copy(pos);
      lmGroup.lookAt(new THREE.Vector3(0, 0, 0));

      // Visual radius scaled by crater diameter
      const scaleRadius = landmark.diameterKm
        ? Math.min(0.09, Math.max(0.03, (landmark.diameterKm / 1000) * 0.4))
        : 0.04;

      // Outer landmark ring
      const ringGeo = new THREE.RingGeometry(
        scaleRadius * 0.85,
        scaleRadius * 1.05,
        28
      );
      const ringMat = new THREE.MeshBasicMaterial({
        color: isSelected
          ? 0xe879f9
          : landmark.type === 'volcano'
          ? 0xf87171
          : landmark.type === 'canyon'
          ? 0xfbbf24
          : landmark.type === 'crater'
          ? 0xa855f7
          : landmark.type === 'mare'
          ? 0x60a5fa
          : 0x34d399,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isSelected ? 0.85 : 0.4,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      lmGroup.add(ringMesh);

      // Central hit dot
      const dotGeo = new THREE.SphereGeometry(0.016, 12, 12);
      const dotMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xffffff : 0xd8b4fe,
      });
      const dotMesh = new THREE.Mesh(dotGeo, dotMat);
      lmGroup.add(dotMesh);

      landmarkGroup.add(lmGroup);
      landmarkMeshesRef.current.push({ mesh: dotMesh, landmark });
    });
  }, [body, landmarks, showLandmarks, selectedLandmark]);

  // When selectedArtifact changes from outside, smoothly rotate globe to face it and zoom in!
  useEffect(() => {
    if (!selectedArtifact) {
      targetZoomDistanceRef.current = 4.6;
      return;
    }

    autoRotateRef.current = false;
    const lat = selectedArtifact.coordinates.lat;
    const lon = selectedArtifact.coordinates.lon;

    const targetX = (lat * Math.PI) / 180;
    const targetY = -((lon + 90) * Math.PI) / 180;

    targetRotationRef.current.x = THREE.MathUtils.clamp(targetX, -1.2, 1.2);
    targetRotationRef.current.y = targetY;
    // Zoom in on the celestial body so the relic is highlighted in the left viewport
    targetZoomDistanceRef.current = 2.45;
  }, [selectedArtifact]);

  // When selectedLandmark changes from outside, smoothly rotate globe to face it!
  useEffect(() => {
    if (!selectedLandmark) return;

    autoRotateRef.current = false;
    const lat = selectedLandmark.coordinates.lat;
    const lon = selectedLandmark.coordinates.lon;

    const targetX = (lat * Math.PI) / 180;
    const targetY = -((lon + 90) * Math.PI) / 180;

    targetRotationRef.current.x = THREE.MathUtils.clamp(targetX, -1.2, 1.2);
    targetRotationRef.current.y = targetY;
  }, [selectedLandmark]);

  // Mouse & Touch Controls: Free Drag & Scroll Zoom
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    autoRotateRef.current = false;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // 1. Handle dragging rotation
    if (isDraggingRef.current) {
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      targetRotationRef.current.y += deltaX * 0.005;
      targetRotationRef.current.x += deltaY * 0.005;
      targetRotationRef.current.x = THREE.MathUtils.clamp(
        targetRotationRef.current.x,
        -1.3,
        1.3
      );

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    // 2. Handle hover raycast over pins & landmarks
    const container = mountRef.current;
    const camera = cameraRef.current;
    if (!container || !camera) return;

    const rect = container.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

    // Check artifact pins first
    const interactiveMeshes = pinMeshesRef.current.map((p) => p.mesh);
    const intersects = raycaster.intersectObjects(interactiveMeshes);

    if (intersects.length > 0) {
      const hit = pinMeshesRef.current.find((p) => p.mesh === intersects[0].object);
      if (hit && hoveredArtifact?.id !== hit.artifact.id) {
        setHoveredArtifact(hit.artifact);
        setHoveredLandmark(null);
        playTelemetryBeep(700, 0.04);
      }
      return;
    } else {
      if (hoveredArtifact !== null) {
        setHoveredArtifact(null);
      }
    }

    // Check landmark markers if enabled
    if (showLandmarks && landmarkMeshesRef.current.length > 0) {
      const landmarkMeshes = landmarkMeshesRef.current.map((l) => l.mesh);
      const lmIntersects = raycaster.intersectObjects(landmarkMeshes);
      if (lmIntersects.length > 0) {
        const hitLm = landmarkMeshesRef.current.find(
          (l) => l.mesh === lmIntersects[0].object
        );
        if (hitLm && hoveredLandmark?.id !== hitLm.landmark.id) {
          setHoveredLandmark(hitLm.landmark);
          playTelemetryBeep(600, 0.03);
        }
        return;
      } else {
        if (hoveredLandmark !== null) {
          setHoveredLandmark(null);
        }
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const wasDraggingLong =
      Math.abs(e.clientX - previousMousePositionRef.current.x) > 3 ||
      Math.abs(e.clientY - previousMousePositionRef.current.y) > 3;

    isDraggingRef.current = false;

    if (!wasDraggingLong) {
      const container = mountRef.current;
      const camera = cameraRef.current;
      if (!container || !camera) return;

      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

      // Check artifact pins
      const interactiveMeshes = pinMeshesRef.current.map((p) => p.mesh);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const hit = pinMeshesRef.current.find((p) => p.mesh === intersects[0].object);
        if (hit) {
          playRadarPing();
          onSelectArtifact(hit.artifact);
          return;
        }
      }

      // Check landmarks
      if (showLandmarks && landmarkMeshesRef.current.length > 0) {
        const landmarkMeshes = landmarkMeshesRef.current.map((l) => l.mesh);
        const lmIntersects = raycaster.intersectObjects(landmarkMeshes);
        if (lmIntersects.length > 0) {
          const hitLm = landmarkMeshesRef.current.find(
            (l) => l.mesh === lmIntersects[0].object
          );
          if (hitLm) {
            playRadarPing();
            onSelectLandmark?.(hitLm.landmark);
            return;
          }
        }
      }
    }
  };

  // Scroll to Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * 0.0025;
    targetZoomDistanceRef.current = THREE.MathUtils.clamp(
      targetZoomDistanceRef.current + zoomDelta,
      2.1, // closest zoom for inspecting craters up close
      6.5 // farthest zoom
    );
  };

  return (
    <div
      ref={mountRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden"
    >
      {/* Telemetry HUD & Viewport Controls */}
      <div className="absolute top-14 sm:top-20 left-2 sm:left-4 z-30 flex flex-col gap-2 pointer-events-none">
        <TelemetryHUD
          selectedBody={body as any}
          activeRelic={selectedArtifact as any}
          crosshairCoords={crosshairCoords}
          cameraHeightKm={cameraHeightKm}
          activePreset={activePreset}
          onFlyToPreset={handleFlyToPreset}
          onZoom={handleZoom}
          onSelectRelic={(relic) => onSelectArtifact(relic as Artifact)}
        />
      </div>

      {/* Hover preview tooltip */}
      {hoveredArtifact && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-[#1e1f20]/95 border border-white/10 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-xl text-center max-w-xs animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-widest text-zinc-400">
            <span>{hoveredArtifact.year}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            <span className="truncate">{hoveredArtifact.locationName}</span>
          </div>
          <h4 className="text-sm font-semibold text-white mt-1">
            {hoveredArtifact.name}
          </h4>
          <p className="text-xs text-zinc-400 mt-1 line-clamp-1 italic">
            "{hoveredArtifact.story.headline}"
          </p>
        </div>
      )}

      {hoveredLandmark && !hoveredArtifact && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-[#1e1f20]/95 border border-white/10 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-xl text-center max-w-xs animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-widest text-amber-400">
            <span>{hoveredLandmark.type}</span>
            {hoveredLandmark.diameterKm && (
              <>
                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                <span>{hoveredLandmark.diameterKm} km</span>
              </>
            )}
          </div>
          <h4 className="text-sm font-semibold text-white mt-1">
            {hoveredLandmark.name}
          </h4>
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-snug">
            {hoveredLandmark.description}
          </p>
        </div>
      )}
    </div>
  );
});
