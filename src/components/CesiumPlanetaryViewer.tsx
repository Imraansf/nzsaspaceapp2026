import React, { useEffect, useRef, useState } from 'react';
import { Artifact, CelestialBody, PlanetaryLandmark } from '../types/space';
import { playRadarPing, playTelemetryBeep } from '../utils/audio';
import { Key, Check } from 'lucide-react';

declare const Cesium: any;

interface CesiumPlanetaryViewerProps {
  body: CelestialBody;
  artifacts: Artifact[];
  selectedArtifact: Artifact | null;
  onSelectArtifact: (artifact: Artifact) => void;
  landmarks?: PlanetaryLandmark[];
  showLandmarks?: boolean;
  onSelectLandmark?: (landmark: PlanetaryLandmark) => void;
  selectedLandmark?: PlanetaryLandmark | null;
}

export const CesiumPlanetaryViewer: React.FC<CesiumPlanetaryViewerProps> = ({
  body,
  artifacts,
  selectedArtifact,
  onSelectArtifact,
  landmarks = [],
  showLandmarks = true,
  onSelectLandmark,
  selectedLandmark,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const handlerRef = useRef<any>(null);
  const tilesetRef = useRef<any>(null);

  const [isCesiumReady, setIsCesiumReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hoveredArtifact, setHoveredArtifact] = useState<Artifact | null>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<PlanetaryLandmark | null>(null);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [ionToken, setIonToken] = useState(() => localStorage.getItem('cesium_ion_token') || '');
  const [streamStatus, setStreamStatus] = useState<'streaming_nasa' | 'streaming_tileset' | 'base_highres'>('streaming_nasa');

  // 1. Wait for Cesium library from CDN if not yet ready
  useEffect(() => {
    if (typeof Cesium !== 'undefined') {
      setIsCesiumReady(true);
      return;
    }

    const interval = setInterval(() => {
      if (typeof Cesium !== 'undefined') {
        setIsCesiumReady(true);
        clearInterval(interval);
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (typeof Cesium === 'undefined') {
        setLoadError('Cesium 3D planetary engine could not be loaded from CDN.');
      }
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // 2. Initialize Cesium with accurate planetary Ellipsoid and high-resolution NASA tiles
  useEffect(() => {
    if (!isCesiumReady || !containerRef.current) return;

    setLoadError(null);

    // Clean container completely of any previous elements
    containerRef.current.innerHTML = '';

    try {
      if (typeof window !== 'undefined') {
        (window as any).CESIUM_BASE_URL = 'https://cesium.com/downloads/cesiumjs/releases/1.127/Build/Cesium/';
      }

      if (ionToken.trim()) {
        Cesium.Ion.defaultAccessToken = ionToken.trim();
      } else if (typeof Cesium !== 'undefined' && Cesium.Ion) {
        Cesium.Ion.defaultAccessToken = '';
      }

      // Set Planetary Ellipsoid:
      // Moon: mean radius 1,737,400 meters (Cesium.Ellipsoid.MOON)
      // Mars: mean radius 3,389,500 meters
      const planetaryEllipsoid =
        body === 'mars'
          ? new Cesium.Ellipsoid(3396190.0, 3396190.0, 3396190.0)
          : Cesium.Ellipsoid.MOON;

      Cesium.Ellipsoid.default = planetaryEllipsoid;

      // Note: skyAtmosphere must be false for both Moon and Mars because Cesium's
      // SkyAtmosphere is hardcoded specifically to Earth WGS84 and causes crashes on other bodies
      const viewer = new Cesium.Viewer(containerRef.current, {
        animation: false,
        timeline: false,
        baseLayer: false,
        geocoder: false,
        baseLayerPicker: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        skyAtmosphere: false,
        shadows: true,
      });

      viewerRef.current = viewer;

      // Enable high-DPI retina rendering for crisp high resolution
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      viewer.resolutionScale = dpr;

      // Visual rendering settings
      viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString(
        body === 'mars' ? '#3d180f' : '#12151b'
      );
      viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#020408');
      viewer.scene.globe.enableLighting = true;
      viewer.scene.globe.showGroundAtmosphere = false;
      viewer.scene.globe.maximumScreenSpaceError = 1.35;
      viewer.scene.globe.tileCacheSize = 250;

      // Camera distance constraints
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = body === 'mars' ? 800.0 : 500.0;
      viewer.scene.screenSpaceCameraController.maximumZoomDistance = body === 'mars' ? 35000000.0 : 25000000.0;

      // Remove default Earth imagery layers
      viewer.imageryLayers.removeAll();

      // Layer 1: High-Resolution 2K Base Photographic Texture (Equirectangular)
      const baseMapUrl =
        body === 'mars'
          ? 'https://upload.wikimedia.org/wikipedia/commons/4/46/Solarsystemscope_texture_2k_mars.jpg'
          : 'https://upload.wikimedia.org/wikipedia/commons/2/26/Solarsystemscope_texture_2k_moon.jpg';

      try {
        const baseImagery = new Cesium.SingleTileImageryProvider({
          url: baseMapUrl,
          credit: body === 'mars' ? 'NASA / Viking / SolarSystemScope' : 'NASA / LROC / SolarSystemScope',
          rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90),
          ellipsoid: planetaryEllipsoid,
        });
        viewer.imageryLayers.addImageryProvider(baseImagery);
      } catch (err) {
        console.warn('Base photographic map load warning:', err);
      }

      // Layer 2: NASA Solar System Treks Multi-Resolution Scientific Tile Streaming
      // - Moon: NASA LRO WAC Global Mosaic (303 pixels per degree)
      // - Mars: NASA Mars Viking MDIM 2.1 Color Mosaic (232m per pixel)
      const trekUrl =
        body === 'mars'
          ? 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg'
          : 'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/{z}/{y}/{x}.jpg';

      try {
        const highResTrek = new Cesium.UrlTemplateImageryProvider({
          url: trekUrl,
          tilingScheme: new Cesium.GeographicTilingScheme({
            ellipsoid: planetaryEllipsoid,
            numberOfLevelZeroTilesX: 2,
            numberOfLevelZeroTilesY: 1,
          }),
          maximumLevel: 7,
          credit:
            body === 'mars'
              ? 'NASA / USGS / JPL Mars Trek (Viking Color 232m)'
              : 'NASA / GSFC / ASU Lunar Trek (LRO WAC 303 PPD)',
        });
        viewer.imageryLayers.addImageryProvider(highResTrek);
        setStreamStatus('streaming_nasa');
      } catch (trekErr) {
        console.info('NASA Trek tiles note, base high-res active:', trekErr);
        setStreamStatus('base_highres');
      }

      // Layer 3 (Optional): Cesium Ion Moon 3D Tileset if valid token configured
      if (body === 'moon' && ionToken.trim() && ionToken.trim().length > 20) {
        (async () => {
          try {
            const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(2684829, {
              enableCollision: true,
            });
            viewer.scene.primitives.add(tileset);
            tilesetRef.current = tileset;
            setStreamStatus('streaming_tileset');
          } catch (tilesetErr) {
            console.info('Cesium Ion 3D tileset optional note: token invalid or asset restricted', tilesetErr);
            localStorage.removeItem('cesium_ion_token');
            setStreamStatus('streaming_nasa');
          }
        })();
      }

      // Initial camera positioning
      const initialAlt = body === 'mars' ? 9500000 : 5200000;
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(body === 'mars' ? 10 : 0, 0, initialAlt),
        orientation: {
          heading: 0.0,
          pitch: -Cesium.Math.PI_OVER_TWO,
          roll: 0.0,
        },
      });

      // Mouse interaction handler
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handlerRef.current = handler;

      // Mouse Move (Hover preview)
      handler.setInputAction((movement: any) => {
        const picked = viewer.scene.pick(movement.endPosition);
        if (Cesium.defined(picked) && picked.id) {
          if (picked.id.artifactData) {
            setHoveredArtifact(picked.id.artifactData);
            setHoveredLandmark(null);
            return;
          }
          if (picked.id.landmarkData) {
            setHoveredLandmark(picked.id.landmarkData);
            setHoveredArtifact(null);
            return;
          }
        }
        setHoveredArtifact(null);
        setHoveredLandmark(null);
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      // Left Click
      handler.setInputAction((movement: any) => {
        const picked = viewer.scene.pick(movement.position);
        if (Cesium.defined(picked) && picked.id) {
          if (picked.id.artifactData) {
            playRadarPing();
            onSelectArtifact(picked.id.artifactData);
            return;
          }
          if (picked.id.landmarkData) {
            playRadarPing();
            onSelectLandmark?.(picked.id.landmarkData);
            return;
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      return () => {
        if (handlerRef.current) {
          try {
            handlerRef.current.destroy();
          } catch (_) {}
          handlerRef.current = null;
        }
        if (viewerRef.current && !viewerRef.current.isDestroyed()) {
          try {
            viewerRef.current.destroy();
          } catch (_) {}
          viewerRef.current = null;
        }
      };
    } catch (err: any) {
      console.error('Cesium planetary initialization error:', err);
      setLoadError(err?.message || 'Failed to initialize Cesium 3D planetary engine');
    }
  }, [isCesiumReady, body, ionToken]);

  // 3. Render Hardware Artifacts as 3D Beacons
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed()) return;

    // Remove previous artifact entities
    const entities = viewer.entities.values.filter((e: any) => e.isArtifact);
    entities.forEach((e: any) => viewer.entities.remove(e));

    artifacts.forEach((artifact) => {
      const isSelected = selectedArtifact?.id === artifact.id;
      const lat = artifact.coordinates.lat;
      let lon = artifact.coordinates.lon;
      while (lon > 180) lon -= 360;
      while (lon < -180) lon += 360;

      const color = isSelected
        ? Cesium.Color.fromCssColorString('#38bdf8')
        : artifact.status === 'active_passive'
        ? Cesium.Color.fromCssColorString('#34d399')
        : body === 'mars'
        ? Cesium.Color.fromCssColorString('#fb923c')
        : Cesium.Color.fromCssColorString('#f59e0b');

      viewer.entities.add({
        id: `artifact-${artifact.id}`,
        isArtifact: true,
        artifactData: artifact,
        position: Cesium.Cartesian3.fromDegrees(lon, lat, body === 'mars' ? 200 : 100),
        point: {
          pixelSize: isSelected ? 16 : 10,
          color: color,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
          text: artifact.moniker,
          font: '11px Chakra Petch, monospace, sans-serif',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 3,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -15),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            0,
            body === 'mars' ? 7500000 : 4500000
          ),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      });
    });
  }, [artifacts, selectedArtifact, isCesiumReady, body]);

  // 4. Render Planetary Landmarks (Craters, Volcanoes, Canyons, Maria)
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed()) return;

    const entities = viewer.entities.values.filter((e: any) => e.isLandmark);
    entities.forEach((e: any) => viewer.entities.remove(e));

    if (!showLandmarks) return;

    landmarks.forEach((landmark) => {
      const isSelected = selectedLandmark?.id === landmark.id;
      const lat = landmark.coordinates.lat;
      let lon = landmark.coordinates.lon;
      while (lon > 180) lon -= 360;
      while (lon < -180) lon += 360;

      const color = isSelected
        ? Cesium.Color.fromCssColorString('#f472b6')
        : landmark.type === 'volcano'
        ? Cesium.Color.fromCssColorString('#f87171')
        : landmark.type === 'canyon'
        ? Cesium.Color.fromCssColorString('#fbbf24')
        : landmark.type === 'crater'
        ? Cesium.Color.fromCssColorString('#c084fc')
        : landmark.type === 'mare'
        ? Cesium.Color.fromCssColorString('#60a5fa')
        : Cesium.Color.fromCssColorString('#34d399');

      viewer.entities.add({
        id: `landmark-${landmark.id}`,
        isLandmark: true,
        landmarkData: landmark,
        position: Cesium.Cartesian3.fromDegrees(lon, lat, body === 'mars' ? 120 : 50),
        point: {
          pixelSize: isSelected ? 12 : 7,
          color: color.withAlpha(0.9),
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 1.5,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
          text: landmark.name,
          font: '10px Space Grotesk, sans-serif',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          fillColor: color,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.TOP,
          pixelOffset: new Cesium.Cartesian2(0, 10),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            0,
            body === 'mars' ? 8500000 : 5000000
          ),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      });
    });
  }, [landmarks, showLandmarks, selectedLandmark, isCesiumReady, body]);

  // 5. Active Surface 3D Model Rendering & Cinematic Surface flyTo when selectedArtifact changes
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed()) return;

    // Clean up existing surface 3D model entity
    const existingModel = viewer.entities.getById('active-surface-3d-planetary-relic');
    if (existingModel) {
      viewer.entities.remove(existingModel);
    }

    if (!selectedArtifact) {
      viewer.scene.requestRender();
      return;
    }

    const lat = selectedArtifact.coordinates.lat;
    let lon = selectedArtifact.coordinates.lon;
    while (lon > 180) lon -= 360;
    while (lon < -180) lon += 360;

    const planetaryEllipsoid =
      body === 'mars'
        ? new Cesium.Ellipsoid(3396190.0, 3396190.0, 3396190.0)
        : Cesium.Ellipsoid.MOON;

    const gltfUrl = selectedArtifact.model3dUrl || (
      body === 'mars'
        ? 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Mars%20Exploration%20Rover%20-%20Opportunity%20(MER-B)/Mars%20Exploration%20Rover%20-%20Opportunity%20(MER-B).glb'
        : '/models/Apollo_Lunar_Module.glb'
    );

    const position = Cesium.Cartesian3.fromDegrees(lon, lat, 0.0, planetaryEllipsoid);

    const heading = Cesium.Math.toRadians(0);
    const pitch = Cesium.Math.toRadians(0);
    const roll = Cesium.Math.toRadians(0);
    const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

    const modelScale = body === 'mars' ? 2.5 : 2.0;

    viewer.entities.add({
      id: 'active-surface-3d-planetary-relic',
      name: `3D Surface Model: ${selectedArtifact.name}`,
      isSurface3DModel: true,
      position: position,
      orientation: orientation,
      model: {
        uri: gltfUrl,
        minimumPixelSize: 128,
        maximumScale: 1000,
        scale: modelScale,
        runAnimations: true,
        clampAnimations: true,
        shadows: Cesium.ShadowMode.ENABLED,
        heightReference: Cesium.HeightReference.NONE,
      },
      ellipse: {
        semiMajorAxis: 20.0,
        semiMinorAxis: 20.0,
        material: Cesium.Color.fromCssColorString('#00E5FF').withAlpha(0.25),
        outline: true,
        outlineColor: Cesium.Color.fromCssColorString('#00E5FF').withAlpha(0.9),
        outlineWidth: 2.5,
      },
      label: {
        text: `📍 ${selectedArtifact.name.toUpperCase()} (SURFACE 3D MODEL)`,
        font: 'bold 12px "Space Mono", "Chakra Petch", monospace',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: Cesium.Color.fromCssColorString('#FEF08A'),
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 3,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -35),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 500000),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });

    // Fly camera down smoothly to 35 meters altitude above regolith
    const cameraLat = lat - 0.0003;
    const cameraLon = lon;
    const cameraAlt = 35.0;

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(cameraLon, cameraLat, cameraAlt, planetaryEllipsoid),
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-22.0),
        roll: 0.0,
      },
      duration: 2.8,
      easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
      complete: () => {
        if (viewer && !viewer.isDestroyed()) {
          viewer.scene.requestRender();
        }
      },
    });
  }, [selectedArtifact, body]);

  // 6. Cinematic flyTo when selectedLandmark changes
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed() || !selectedLandmark) return;

    let lon = selectedLandmark.coordinates.lon;
    while (lon > 180) lon -= 360;
    while (lon < -180) lon += 360;

    const alt = selectedLandmark.diameterKm
      ? Math.max(
          body === 'mars' ? 180000 : 120000,
          selectedLandmark.diameterKm * (body === 'mars' ? 2000 : 2600)
        )
      : body === 'mars'
      ? 400000
      : 300000;

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lon, selectedLandmark.coordinates.lat, alt),
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-68.0),
        roll: 0.0,
      },
      duration: 2.0,
    });
  }, [selectedLandmark, body]);

  const handleSaveToken = () => {
    localStorage.setItem('cesium_ion_token', ionToken.trim());
    setIsTokenModalOpen(false);
    playTelemetryBeep(880, 0.08);
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#03050a]">
      {/* Cesium Viewer Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Loading state */}
      {!isCesiumReady && !loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-20 gap-3">
          <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-sm text-cyan-300 tracking-wider uppercase">
            INITIALIZING CESIUM 3D {body === 'mars' ? 'MARS' : 'LUNAR'} ENGINE...
          </p>
          <span className="text-xs text-slate-400">
            Connecting to Planetary High-Res Stream
          </span>
        </div>
      )}

      {/* Error state */}
      {loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-20 p-6 text-center">
          <p className="text-amber-400 font-bold mb-2">Notice: {loadError}</p>
          <p className="text-xs text-slate-400 max-w-md">
            Please ensure you have an active network connection to load the Cesium library.
          </p>
        </div>
      )}

      {/* Planetary Engine & Status HUD (Top Left) */}
      <div className="absolute top-20 left-4 z-10 pointer-events-none text-slate-400 text-xs font-mono bg-slate-950/80 border border-slate-800/90 rounded-2xl px-4 py-3 backdrop-blur-md shadow-2xl hidden sm:block">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              body === 'mars' ? 'bg-amber-400' : 'bg-cyan-400'
            } animate-pulse`}
          />
          <span className="text-white font-bold font-telemetry tracking-wide">
            CESIUM 3D {body === 'mars' ? 'MARS' : 'MOON'}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
            HIGH-RES
          </span>
        </div>

        <div className="mt-2 text-[11px] text-slate-300 space-y-0.5">
          <div>
            <span className="text-slate-400">Ellipsoid: </span>
            <span className="text-white font-medium">
              {body === 'mars' ? 'Mars (3,389.5 km)' : 'Moon (1,737.4 km)'}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Stream: </span>
            <span className="text-cyan-300 font-bold">
              {body === 'mars'
                ? 'NASA Mars Viking 232m'
                : 'NASA LRO WAC 303 PPD'}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 pt-1">
            • Left-drag: Rotate • Right-drag: 3D Tilt • Scroll: Zoom
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between pointer-events-auto gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-slate-300">
              {streamStatus === 'streaming_tileset'
                ? '3D Tiles Active'
                : 'Multi-Res Streaming'}
            </span>
          </div>

          <button
            onClick={() => setIsTokenModalOpen(true)}
            className="text-[10px] text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1"
            title="Optional Cesium Ion token for custom 3D Tiles"
          >
            <Key className="w-2.5 h-2.5" />
            <span>Ion Token</span>
          </button>
        </div>
      </div>

      {/* Quick Flight Controls (Top Right) */}
      <div className="absolute top-20 right-4 z-10 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={() => {
            const viewer = viewerRef.current;
            if (viewer) {
              playTelemetryBeep(520, 0.05);
              const alt = body === 'mars' ? 9500000 : 5200000;
              viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(
                  body === 'mars' ? 10 : 0,
                  0,
                  alt
                ),
                orientation: {
                  heading: 0.0,
                  pitch: -Cesium.Math.PI_OVER_TWO,
                  roll: 0.0,
                },
                duration: 1.6,
              });
            }
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white hover:bg-slate-900 backdrop-blur-md shadow-md transition-all flex items-center gap-1.5"
          title="Reset Global View"
        >
          <span>{body === 'mars' ? '🔴 Mars Overview' : '🌕 Moon Overview'}</span>
        </button>

        {body === 'moon' ? (
          <>
            <button
              onClick={() => {
                const viewer = viewerRef.current;
                if (viewer) {
                  playTelemetryBeep(620, 0.05);
                  viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(23.47, 0.67, 140000),
                    orientation: {
                      heading: Cesium.Math.toRadians(0),
                      pitch: Cesium.Math.toRadians(-55),
                      roll: 0,
                    },
                    duration: 2.0,
                  });
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-cyan-300 hover:text-cyan-100 hover:bg-cyan-950/40 backdrop-blur-md shadow-md transition-all flex items-center gap-1.5"
              title="Fly to Apollo 11 Base"
            >
              <span>🦅 Apollo 11 Base</span>
            </button>
            <button
              onClick={() => {
                const viewer = viewerRef.current;
                if (viewer) {
                  playTelemetryBeep(680, 0.05);
                  viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(-48.7, -84.7, 180000),
                    orientation: {
                      heading: Cesium.Math.toRadians(0),
                      pitch: Cesium.Math.toRadians(-60),
                      roll: 0,
                    },
                    duration: 2.0,
                  });
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-purple-300 hover:text-purple-100 hover:bg-purple-950/40 backdrop-blur-md shadow-md transition-all flex items-center gap-1.5"
              title="Fly to Lunar South Pole Ice"
            >
              <span>❄️ South Pole Cabeus Ice</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                const viewer = viewerRef.current;
                if (viewer) {
                  playTelemetryBeep(620, 0.05);
                  viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(-133.8, 18.65, 320000),
                    orientation: {
                      heading: Cesium.Math.toRadians(0),
                      pitch: Cesium.Math.toRadians(-58),
                      roll: 0,
                    },
                    duration: 2.0,
                  });
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-red-300 hover:text-red-100 hover:bg-red-950/40 backdrop-blur-md shadow-md transition-all flex items-center gap-1.5"
              title="Fly to Olympus Mons Summit"
            >
              <span>🌋 Olympus Mons Summit</span>
            </button>
            <button
              onClick={() => {
                const viewer = viewerRef.current;
                if (viewer) {
                  playTelemetryBeep(660, 0.05);
                  viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(-59.2, -14.0, 420000),
                    orientation: {
                      heading: Cesium.Math.toRadians(0),
                      pitch: Cesium.Math.toRadians(-62),
                      roll: 0,
                    },
                    duration: 2.0,
                  });
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-amber-300 hover:text-amber-100 hover:bg-amber-950/40 backdrop-blur-md shadow-md transition-all flex items-center gap-1.5"
              title="Fly to Grand Canyon of Mars"
            >
              <span>🏜️ Valles Marineris Canyon</span>
            </button>
            <button
              onClick={() => {
                const viewer = viewerRef.current;
                if (viewer) {
                  playTelemetryBeep(700, 0.05);
                  viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(77.58, 18.38, 160000),
                    orientation: {
                      heading: Cesium.Math.toRadians(0),
                      pitch: Cesium.Math.toRadians(-60),
                      roll: 0,
                    },
                    duration: 2.0,
                  });
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-cyan-300 hover:text-cyan-100 hover:bg-cyan-950/40 backdrop-blur-md shadow-md transition-all flex items-center gap-1.5"
              title="Fly to Jezero Crater (Perseverance & Ingenuity)"
            >
              <span>🚁 Jezero Delta (Percy)</span>
            </button>
          </>
        )}
      </div>

      {/* Hover preview tooltip for Artifact */}
      {hoveredArtifact && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-slate-950/95 border border-cyan-500/40 rounded-xl px-4 py-2.5 shadow-2xl backdrop-blur-md text-center max-w-sm animate-in fade-in zoom-in-95">
          <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider block">
            {hoveredArtifact.date} • {hoveredArtifact.locationName}
          </span>
          <h4 className="text-sm font-bold text-white font-telemetry">
            {hoveredArtifact.name}
          </h4>
          <p className="text-xs text-slate-300 mt-1 line-clamp-1 italic">
            "{hoveredArtifact.story.headline}"
          </p>
          <span className="text-[10px] font-mono text-emerald-400 block mt-1">
            Click to open mission dossier
          </span>
        </div>
      )}

      {/* Hover preview tooltip for Landmark */}
      {hoveredLandmark && !hoveredArtifact && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-slate-950/95 border border-purple-500/50 rounded-xl px-4 py-2.5 shadow-2xl backdrop-blur-md text-center max-w-sm animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono uppercase text-purple-400 font-bold tracking-wider">
            <span>
              {hoveredLandmark.type === 'volcano'
                ? 'Martian Volcano'
                : hoveredLandmark.type === 'canyon'
                ? 'Martian Canyon System'
                : hoveredLandmark.type === 'crater'
                ? 'Impact Crater'
                : hoveredLandmark.type === 'mare'
                ? 'Basaltic Plain'
                : 'Planetary Plain'}
            </span>
            {hoveredLandmark.diameterKm && (
              <>
                <span>•</span>
                <span>{hoveredLandmark.diameterKm} km</span>
              </>
            )}
          </div>
          <h4 className="text-sm font-bold text-white font-telemetry mt-0.5">
            {hoveredLandmark.name}
          </h4>
          <p className="text-xs text-slate-300 mt-1 line-clamp-2">
            {hoveredLandmark.description}
          </p>
          {hoveredLandmark.associatedArtifactId && (
            <span className="inline-block mt-1 text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
              NASA Mission Site Nearby • Click to explore
            </span>
          )}
        </div>
      )}

      {/* Cesium Ion Access Token Modal */}
      {isTokenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm font-telemetry">
                  Cesium Ion Access Token (Optional)
                </h3>
              </div>
              <button
                onClick={() => setIsTokenModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Cesium 3D natively renders using ultra-high-resolution NASA scientific multi-resolution tile streams (LRO Lunar Reconnaissance Orbiter & Mars Viking MDIM 2.1). If you have private Cesium Ion assets or want to stream custom 3D Tilesets, you can supply your free personal{' '}
              <a
                href="https://cesium.com/ion/"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 underline"
              >
                Cesium ion token
              </a>.
            </p>
            <input
              type="text"
              value={ionToken}
              onChange={(e) => setIonToken(e.target.value)}
              placeholder="Paste Cesium Ion token here..."
              className="mt-3 w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsTokenModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveToken}
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-md flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Token & Reload</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
