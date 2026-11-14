import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Artifact, CelestialBody } from '../types/space';
import { getArtifactColor, getArtifactColorHex } from '../utils/space-data';
import { playRadarPing, playTelemetryBeep } from '../utils/audio';
import {
  createSunTexture,
  createMercuryTexture,
  createVenusTexture,
  createEarthTexture,
  createMarsTexture,
  createJupiterTexture,
  createSaturnTexture,
  createSaturnRingsTexture,
  createUranusTexture,
  createNeptuneTexture,
  createPlutoTexture,
} from '../utils/solar-system-textures';
import {
  updateSolarSystem,
  getHardwarePosition,
  getHardwareTrajectoryPath,
  getPlanetPosition,
  getPlanetOrbitPath,
  BASE_YEAR,
  AU_IN_KM,
  EARTH_ORBITAL_SPEED_KMS,
  PlanetState,
  HardwareTrajectory,
  SolarSystemState,
} from '../utils/orbitalEngine';
import {
  Compass,
  Radio,
  ChevronRight,
  Info,
  Layers,
  Sparkles,
  Zap,
  Globe,
  Satellite,
  Pause,
  Play,
  RotateCcw,
  Crosshair,
  ZoomIn,
  ZoomOut,
  X,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  Gauge,
  Calendar,
  Menu,
} from 'lucide-react';

export interface DeepSpaceExplorerProps {
  artifacts: Artifact[];
  selectedArtifact: Artifact | null;
  onSelectArtifact: (artifact: Artifact | null) => void;
  searchQuery?: string;
  onSwitchBody?: (body: CelestialBody) => void;
}

type DeepSpaceFilter = 'all' | 'interstellar' | 'orbiters' | 'small_bodies' | 'telescopes';

export interface SolarPlanetData {
  id: string;
  name: string;
  category: 'star' | 'terrestrial' | 'gas_giant' | 'ice_giant' | 'dwarf_planet';
  semiMajorAxisAU: number;
  radius: number; // 3D Sphere radius
  eccentricity: number;
  axialTiltDeg: number;
  colorHex: number;
  description: string;
  relicsPresent: string[];
  hasRings?: boolean;
  ringInner?: number;
  ringOuter?: number;
  ringTilt?: number;
  hasMoon?: boolean;
}

export const SOLAR_PLANETS: SolarPlanetData[] = [
  {
    id: 'sun',
    name: 'The Sun (Sol)',
    category: 'star',
    semiMajorAxisAU: 0,
    radius: 2.4,
    eccentricity: 0,
    axialTiltDeg: 7.25,
    colorHex: 0xffbb22,
    description: 'G-type main-sequence star containing 99.86% of the solar system mass. Gravitational anchor driving all Keplerian planetary orbits and solar wind dynamics.',
    relicsPresent: ['Solar Wind & Heliospheric Science'],
  },
  {
    id: 'mercury',
    name: 'Mercury',
    category: 'terrestrial',
    semiMajorAxisAU: 0.387,
    radius: 0.38,
    eccentricity: 0.2056,
    axialTiltDeg: 0.034,
    colorHex: 0x8a847e,
    description: 'Innermost planet with the highest orbital velocity (~47.4 km/s) and highest eccentricity of any major planet. Completes an orbit in just 88 Earth days.',
    relicsPresent: ['Inner Terrestrial Zone'],
  },
  {
    id: 'venus',
    name: 'Venus',
    category: 'terrestrial',
    semiMajorAxisAU: 0.723,
    radius: 0.58,
    eccentricity: 0.0068,
    axialTiltDeg: 177.3,
    colorHex: 0xe0be86,
    description: 'Sister world enveloped in dense carbon dioxide and sulfuric acid clouds. Retrograde axial spin with crushing 92-bar surface atmospheric pressure.',
    relicsPresent: ['Inner Terrestrial Zone'],
  },
  {
    id: 'earth',
    name: 'Earth & Moon System',
    category: 'terrestrial',
    semiMajorAxisAU: 1.000,
    radius: 0.62,
    eccentricity: 0.0167,
    axialTiltDeg: 23.44,
    colorHex: 0x2766a8,
    description: 'Astrodynamic baseline world (1.0 AU = 1.0 orbital year, mean velocity 29.78 km/s). Origin of all exploratory hardware and home to historic lunar landing sites.',
    relicsPresent: ['Kepler / K2 (Earth-Trailing)', '4 Moon Hardware Monuments'],
    hasMoon: true,
  },
  {
    id: 'mars',
    name: 'Mars',
    category: 'terrestrial',
    semiMajorAxisAU: 1.524,
    radius: 0.46,
    eccentricity: 0.0934,
    axialTiltDeg: 25.19,
    colorHex: 0xb54d24,
    description: 'The Red Planet, orbital period 687 days (1.88 Earth years). Site of monumental ancient volcanoes (Olympus Mons) and historic NASA landers, rovers, and rotorcraft.',
    relicsPresent: ['Viking 1 Lander', 'Pathfinder & Sojourner', 'Spirit & Opportunity', 'Phoenix Lander', 'InSight Lander', 'Ingenuity Helicopter'],
  },
  {
    id: 'ceres',
    name: 'Ceres (Asteroid Belt)',
    category: 'dwarf_planet',
    semiMajorAxisAU: 2.767,
    radius: 0.30,
    eccentricity: 0.0758,
    axialTiltDeg: 4.0,
    colorHex: 0x7c7873,
    description: 'Largest object in the main asteroid belt between Mars and Jupiter. Harboring subsurface brine reservoirs and bright sodium carbonate faculae in Occator crater.',
    relicsPresent: ['Dawn Spacecraft (Quiescent Orbit)', 'NEAR Shoemaker (433 Eros)'],
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    category: 'gas_giant',
    semiMajorAxisAU: 5.204,
    radius: 1.65,
    eccentricity: 0.0485,
    axialTiltDeg: 3.13,
    colorHex: 0xc8945f,
    description: 'Colossal gas giant with 11.86-year orbital period and 95 known moons. Acted as the primary gravitational slingshot for Pioneer 10 and Pioneer 11.',
    relicsPresent: ['Pioneer 10 (1973 Flyby)', 'Pioneer 11 (1974 Flyby)'],
  },
  {
    id: 'saturn',
    name: 'Saturn',
    category: 'gas_giant',
    semiMajorAxisAU: 9.583,
    radius: 1.35,
    eccentricity: 0.0556,
    axialTiltDeg: 26.73,
    colorHex: 0xd9be8b,
    description: 'Ringed gas giant with 29.45-year orbital period. First visited by Pioneer 11 in September 1979, discovering the narrow F ring.',
    relicsPresent: ['Pioneer 11 (1979 First Flyby)'],
    hasRings: true,
    ringInner: 1.6,
    ringOuter: 2.9,
    ringTilt: 26.73,
  },
  {
    id: 'uranus',
    name: 'Uranus',
    category: 'ice_giant',
    semiMajorAxisAU: 19.218,
    radius: 0.90,
    eccentricity: 0.0463,
    axialTiltDeg: 97.77,
    colorHex: 0x67d4de,
    description: 'Aquamarine ice giant tilted 98 degrees on its rotational axis in the outer solar system.',
    relicsPresent: ['Outer Ice Giant Zone'],
    hasRings: true,
    ringInner: 1.15,
    ringOuter: 1.45,
    ringTilt: 97.77,
  },
  {
    id: 'neptune',
    name: 'Neptune',
    category: 'ice_giant',
    semiMajorAxisAU: 30.070,
    radius: 0.88,
    eccentricity: 0.0095,
    axialTiltDeg: 28.32,
    colorHex: 0x3060c2,
    description: 'Outermost major planet, completing an orbit every 164.8 Earth years. Crossed by Pioneer 10 in June 1983 on its path to interstellar space.',
    relicsPresent: ['Pioneer 10 Orbit Crossing (1983)'],
  },
  {
    id: 'pluto',
    name: 'Pluto & Kuiper Belt',
    category: 'dwarf_planet',
    semiMajorAxisAU: 39.482,
    radius: 0.32,
    eccentricity: 0.2488,
    axialTiltDeg: 122.5,
    colorHex: 0x98806c,
    description: 'Dwarf planet in the icy Kuiper Belt boasting vast nitrogen-ice glaciers and marking the outer frontier toward interstellar space.',
    relicsPresent: ['Outer Kuiper Frontier'],
  },
];

export const DeepSpaceExplorer: React.FC<DeepSpaceExplorerProps> = React.memo(({
  artifacts,
  selectedArtifact,
  onSelectArtifact,
  searchQuery = '',
  onSwitchBody,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const systemGroupRef = useRef<THREE.Group | null>(null);

  // Mesh registries for fast updates without GC
  const probeMeshesRef = useRef<{
    group: THREE.Group;
    beacon: THREE.Mesh;
    ring: THREE.Mesh;
    artifact: Artifact;
    pos: THREE.Vector3;
  }[]>([]);
  const planetMeshesRef = useRef<{ mesh: THREE.Mesh; planet: SolarPlanetData }[]>([]);
  const orbitLinesGroupRef = useRef<THREE.Group | null>(null);
  const trajectoryLinesGroupRef = useRef<THREE.Group | null>(null);

  // Simulation Astrodynamics Timing State
  const simTimeYearsRef = useRef<number>(BASE_YEAR);
  const [currentYearNumber, setCurrentYearNumber] = useState<number>(BASE_YEAR);
  const [currentSimDate, setCurrentSimDate] = useState<string>('Jan 1, 2026');
  const [simSpeed, setSimSpeed] = useState<number>(1); // 0 = pause, 1 = 1x (normal), 5 = 5x, 25 = 25x

  // UI state
  const [activeFilter, setActiveFilter] = useState<DeepSpaceFilter>('all');
  const [hoveredArtifact, setHoveredArtifact] = useState<Artifact | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<SolarPlanetData | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<SolarPlanetData | null>(null);
  const [showCoordinateInfo, setShowCoordinateInfo] = useState(false);
  const [showOrbits, setShowOrbits] = useState(true);
  const [isTimelineCollapsed, setIsTimelineCollapsed] = useState(false);
  const [isDockVisible, setIsDockVisible] = useState(true);

  // Live telemetry state for selected item
  const [liveTelemetry, setLiveTelemetry] = useState<{
    velocityKmS: number;
    distanceAU: number;
    orbitalClass?: string;
  } | null>(null);

  // Camera Orbit & Object Tracking Controls
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.55, y: -0.2 });
  const currentRotationRef = useRef({ x: 0.55, y: -0.2 });
  const zoomDistanceRef = useRef(105);
  const targetZoomDistanceRef = useRef(105);

  // Active Dynamic Orbit & Trajectory Tracking
  const selectedPlanetRef = useRef<SolarPlanetData | null>(null);
  const selectedArtifactRef = useRef<Artifact | null>(null);
  const currentLookAtRef = useRef(new THREE.Vector3(0, 0, 0));
  const targetLookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  const getPlanetTrackingDistance = (planet: SolarPlanetData): number => {
    if (planet.id === 'sun') return 12;
    if (planet.id === 'saturn') return 9.5;
    if (planet.id === 'jupiter') return 8.5;
    if (planet.id === 'uranus' || planet.id === 'neptune') return 5.0;
    if (planet.id === 'earth') return 3.2;
    if (planet.id === 'venus') return 3.0;
    if (planet.id === 'mars') return 2.6;
    if (planet.id === 'mercury') return 2.2;
    if (planet.id === 'pluto' || planet.id === 'ceres') return 2.0;
    return Math.max(2.2, planet.radius * 5.0);
  };

  // Filter artifacts
  const filteredArtifacts = useMemo(() => {
    return artifacts.filter((a) => {
      const matchesSearch =
        !searchQuery.trim() ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.moniker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.nssdcaId && a.nssdcaId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (a.trajectoryOrRegion && a.trajectoryOrRegion.toLowerCase().includes(searchQuery.toLowerCase())) ||
        a.story.headline.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === 'all') return true;
      if (activeFilter === 'interstellar') {
        return a.category === 'interstellar_probe' || a.id.includes('pioneer');
      }
      if (activeFilter === 'small_bodies') {
        return (
          a.category === 'asteroid_impactor' ||
          a.category === 'planetary_orbiter' ||
          a.id === 'near-shoemaker' ||
          a.id === 'dawn'
        );
      }
      if (activeFilter === 'telescopes') {
        return a.category === 'space_telescope' || a.id === 'kepler';
      }
      return true;
    });
  }, [artifacts, searchQuery, activeFilter]);

  // Artifact IDs list for the orbital engine
  const artifactIds = useMemo(() => artifacts.map((a) => a.id), [artifacts]);

  // Colors are now managed in space-data utilities

  // 1. Initialize Three.js Scene: Sun, Planets, True Keplerian Orbits, Relic Trails
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 42, zoomDistanceRef.current);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const systemGroup = new THREE.Group();
    scene.add(systemGroup);
    systemGroupRef.current = systemGroup;

    // Groups for orbits and trajectories
    const orbitLinesGroup = new THREE.Group();
    systemGroup.add(orbitLinesGroup);
    orbitLinesGroupRef.current = orbitLinesGroup;

    const trajectoryLinesGroup = new THREE.Group();
    systemGroup.add(trajectoryLinesGroup);
    trajectoryLinesGroupRef.current = trajectoryLinesGroup;

    // Lighting Rig
    const sunLight = new THREE.PointLight(0xfff6d6, 3.4, 600, 0.25);
    sunLight.position.set(0, 0, 0);
    systemGroup.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x334155, 0.7);
    scene.add(ambientLight);

    // Sun 3D Render
    const sunTexture = createSunTexture();
    const sunGeo = new THREE.SphereGeometry(2.4, 36, 36);
    const sunMat = new THREE.MeshBasicMaterial({ map: sunTexture });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    (sunMesh as any).isPlanet = true;
    (sunMesh as any).planetData = SOLAR_PLANETS[0];
    systemGroup.add(sunMesh);

    // Solar Corona
    const coronaGeo1 = new THREE.SphereGeometry(2.8, 28, 28);
    const coronaMat1 = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.28,
      side: THREE.BackSide,
    });
    systemGroup.add(new THREE.Mesh(coronaGeo1, coronaMat1));

    const coronaGeo2 = new THREE.SphereGeometry(3.5, 24, 24);
    const coronaMat2 = new THREE.MeshBasicMaterial({
      color: 0xff7700,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    systemGroup.add(new THREE.Mesh(coronaGeo2, coronaMat2));

    // Texture mapper for planets
    const getTextureForPlanet = (id: string): THREE.CanvasTexture => {
      switch (id) {
        case 'mercury':
          return createMercuryTexture();
        case 'venus':
          return createVenusTexture();
        case 'earth':
          return createEarthTexture();
        case 'mars':
          return createMarsTexture();
        case 'ceres':
          return createMercuryTexture();
        case 'jupiter':
          return createJupiterTexture();
        case 'saturn':
          return createSaturnTexture();
        case 'uranus':
          return createUranusTexture();
        case 'neptune':
          return createNeptuneTexture();
        case 'pluto':
          return createPlutoTexture();
        default:
          return createMercuryTexture();
      }
    };

    // 2. Build True Keplerian Planetary Orbits & Spheres
    planetMeshesRef.current = [];

    SOLAR_PLANETS.forEach((planet) => {
      if (planet.semiMajorAxisAU === 0) return; // Sun handled above

      // A. Keplerian Orbit Line via Kepler's Equation
      const orbitPoints = getPlanetOrbitPath(planet.id, 144);
      const threePoints = orbitPoints.map((p) => new THREE.Vector3(p.x, p.y, p.z));
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(threePoints);
      const orbitMat = new THREE.LineBasicMaterial({
        color: planet.colorHex,
        transparent: true,
        opacity: 0.28,
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      orbitLinesGroup.add(orbitLine);

      // B. Planetary Sphere
      const texture = getTextureForPlanet(planet.id);
      const planetGeo = new THREE.SphereGeometry(planet.radius, 32, 32);
      const planetMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.8,
        metalness: 0.1,
      });
      const planetMesh = new THREE.Mesh(planetGeo, planetMat);
      planetMesh.rotation.z = (planet.axialTiltDeg * Math.PI) / 180;

      // Initial position from Kepler's equation at BASE_YEAR
      const initialState = getPlanetPosition(planet.id, simTimeYearsRef.current);
      planetMesh.position.set(
        initialState.positionScene.x,
        initialState.positionScene.y,
        initialState.positionScene.z
      );

      (planetMesh as any).isPlanet = true;
      (planetMesh as any).planetData = planet;
      systemGroup.add(planetMesh);

      // C. Saturn Rings
      if (planet.hasRings && planet.ringInner && planet.ringOuter) {
        const ringGeo = new THREE.RingGeometry(planet.ringInner, planet.ringOuter, 64);
        const ringTex = createSaturnRingsTexture();
        const ringMat = new THREE.MeshBasicMaterial({
          map: ringTex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        planetMesh.add(ringMesh);
      }

      // D. Earth's Moon
      if (planet.hasMoon) {
        const moonGeo = new THREE.SphereGeometry(0.16, 16, 16);
        const moonMat = new THREE.MeshStandardMaterial({
          color: 0xcccccc,
          roughness: 0.9,
        });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.position.set(1.3, 0.1, 0);
        planetMesh.add(moonMesh);
      }

      planetMeshesRef.current.push({
        mesh: planetMesh,
        planet,
      });
    });

    // 3. Asteroid Belt Particulate Field
    const asteroidCount = 450;
    const asteroidGeo = new THREE.BufferGeometry();
    const asteroidPos = new Float32Array(asteroidCount * 3);
    for (let i = 0; i < asteroidCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 18.5 + Math.random() * 6.5;
      const heightOffset = (Math.random() - 0.5) * 1.5;
      asteroidPos[i] = Math.cos(angle) * dist;
      asteroidPos[i + 1] = heightOffset;
      asteroidPos[i + 2] = Math.sin(angle) * dist;
    }
    asteroidGeo.setAttribute('position', new THREE.BufferAttribute(asteroidPos, 3));
    const asteroidMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.22,
      transparent: true,
      opacity: 0.6,
    });
    systemGroup.add(new THREE.Points(asteroidGeo, asteroidMat));

    // 4. Kuiper Belt Particle Ring
    const kuiperCount = 380;
    const kuiperGeo = new THREE.BufferGeometry();
    const kuiperPos = new Float32Array(kuiperCount * 3);
    for (let i = 0; i < kuiperCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 82 + Math.random() * 26;
      kuiperPos[i] = Math.cos(angle) * dist;
      kuiperPos[i + 1] = (Math.random() - 0.5) * 4.0;
      kuiperPos[i + 2] = Math.sin(angle) * dist;
    }
    kuiperGeo.setAttribute('position', new THREE.BufferAttribute(kuiperPos, 3));
    const kuiperMat = new THREE.PointsMaterial({
      color: 0x64748b,
      size: 0.25,
      transparent: true,
      opacity: 0.45,
    });
    systemGroup.add(new THREE.Points(kuiperGeo, kuiperMat));

    // 5. Deep Space Starfield
    const starCount = 800;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 600;
      starPos[i + 1] = (Math.random() - 0.5) * 350;
      starPos[i + 2] = (Math.random() - 0.5) * 600;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.24,
      transparent: true,
      opacity: 0.8,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // 6. Astrodynamics Animation Frame Loop (Kepler's 3rd Law + Trajectory Propagation)
    let animId = 0;
    let lastTime = performance.now();
    let lastUiUpdate = 0;

    const animate = (currentTime: number) => {
      animId = requestAnimationFrame(animate);
      const deltaSec = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Rotate Sun on its axis
      sunMesh.rotation.y += 0.002;

      // Time Scaling Multiplier based on simSpeed
      // 0 = paused, 1 = 0.08 yr/s (smooth orbital revolution), 5 = 0.4 yr/s, 25 = 2.0 yr/s
      const speedFactor = simSpeed === 0 ? 0 : simSpeed === 1 ? 0.08 : simSpeed === 5 ? 0.4 : 2.0;

      if (speedFactor > 0) {
        simTimeYearsRef.current += deltaSec * speedFactor;
      }

      // Propagate Solar System state with Keplerian mechanics
      const systemState = updateSolarSystem(simTimeYearsRef.current, artifactIds);

      // Throttled UI state sync (every 120ms)
      if (currentTime - lastUiUpdate > 120) {
        lastUiUpdate = currentTime;
        setCurrentYearNumber(Math.round(simTimeYearsRef.current * 10) / 10);
        setCurrentSimDate(systemState.dateString);

        // Update live telemetry for selected target
        if (selectedArtifact) {
          const h = systemState.hardware.get(selectedArtifact.id);
          if (h) {
            setLiveTelemetry({
              velocityKmS: Math.round(h.velocityKmS * 10) / 10,
              distanceAU: Math.round(h.distanceFromSunAU * 100) / 100,
              orbitalClass: h.orbitalClass,
            });
          }
        } else if (selectedPlanet && selectedPlanet.id !== 'sun') {
          const p = systemState.planets.get(selectedPlanet.id);
          if (p) {
            setLiveTelemetry({
              velocityKmS: Math.round(p.currentVelocityKmS * 10) / 10,
              distanceAU: Math.round(p.distanceFromSunAU * 100) / 100,
            });
          }
        }
      }

      // Update 3D Planet Positions
      planetMeshesRef.current.forEach(({ mesh, planet }) => {
        const pState = systemState.planets.get(planet.id);
        if (pState) {
          mesh.position.set(
            pState.positionScene.x,
            pState.positionScene.y,
            pState.positionScene.z
          );
          mesh.rotation.y += 0.012;
        }
      });

      // Update 3D Deep Space Hardware Positions
      probeMeshesRef.current.forEach(({ group, ring, artifact, pos }) => {
        const hState = systemState.hardware.get(artifact.id);
        if (hState) {
          group.position.set(
            hState.positionScene.x,
            hState.positionScene.y,
            hState.positionScene.z
          );
          pos.set(hState.positionScene.x, hState.positionScene.y, hState.positionScene.z);
          ring.rotation.z += 0.02;
        }
      });

      // 1. Determine camera tracking target coordinate
      if (selectedPlanetRef.current) {
        const match = planetMeshesRef.current.find(
          (p) => p.planet.id === selectedPlanetRef.current?.id
        );
        if (match) {
          targetLookAtRef.current.copy(match.mesh.position);
        }
      } else if (selectedArtifactRef.current) {
        const match = probeMeshesRef.current.find(
          (p) => p.artifact.id === selectedArtifactRef.current?.id
        );
        if (match) {
          targetLookAtRef.current.copy(match.group.position);
        }
      } else {
        targetLookAtRef.current.set(0, 0, 0);
      }

      // Smooth tracking interpolation towards target celestial body or spacecraft
      currentLookAtRef.current.lerp(targetLookAtRef.current, 0.08);

      // Damped camera rotation and smooth zoom
      currentRotationRef.current.x +=
        (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y +=
        (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;

      zoomDistanceRef.current +=
        (targetZoomDistanceRef.current - zoomDistanceRef.current) * 0.1;

      if (systemGroupRef.current) {
        systemGroupRef.current.rotation.set(0, 0, 0);
      }

      if (cameraRef.current) {
        const pitch = currentRotationRef.current.x;
        const yaw = currentRotationRef.current.y;
        const dist = zoomDistanceRef.current;

        cameraRef.current.position.set(
          currentLookAtRef.current.x + dist * Math.cos(pitch) * Math.sin(yaw),
          currentLookAtRef.current.y + dist * Math.sin(pitch),
          currentLookAtRef.current.z + dist * Math.cos(pitch) * Math.cos(yaw)
        );
        cameraRef.current.lookAt(currentLookAtRef.current);
      }

      renderer.render(scene, camera);
    };
    animate(performance.now());

    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.innerHTML = '';
      }
      renderer.dispose();
    };
  }, [simSpeed, artifactIds]);

  // Toggle orbit and trajectory lines visibility
  useEffect(() => {
    if (orbitLinesGroupRef.current) {
      orbitLinesGroupRef.current.visible = showOrbits;
    }
    if (trajectoryLinesGroupRef.current) {
      trajectoryLinesGroupRef.current.visible = showOrbits;
    }
  }, [showOrbits]);

  // 7. Render Deep Space Hardware Beacons and Trajectory Lines
  useEffect(() => {
    const systemGroup = systemGroupRef.current;
    const trajectoryGroup = trajectoryLinesGroupRef.current;
    if (!systemGroup || !trajectoryGroup) return;

    // Clean up old probes
    const oldChildren = systemGroup.children.filter((c: any) => c.isProbe);
    oldChildren.forEach((c: any) => {
      systemGroup.remove(c);
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
    });

    // Clean up old trajectory trails
    while (trajectoryGroup.children.length > 0) {
      const child: any = trajectoryGroup.children[0];
      trajectoryGroup.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    }

    probeMeshesRef.current = [];

    // Add Probes and their Astrodynamic Trajectory Trails
    artifacts.forEach((artifact) => {
      const isSelected = selectedArtifact?.id === artifact.id;
      const hardwarePos = getHardwarePosition(artifact.id, simTimeYearsRef.current);
      const colorHex = getArtifactColorHex(artifact, isSelected);

      const probeGroup = new THREE.Group();
      probeGroup.position.set(
        hardwarePos.positionScene.x,
        hardwarePos.positionScene.y,
        hardwarePos.positionScene.z
      );
      (probeGroup as any).isProbe = true;

      // Simplistic representation: A single geometric point (Sphere) and a minimal ring
      const beaconGeo = new THREE.SphereGeometry(isSelected ? 0.35 : 0.18, 12, 12);
      const beaconMat = new THREE.MeshBasicMaterial({ 
        color: colorHex,
        transparent: true,
        opacity: isSelected ? 1 : 0.7
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      probeGroup.add(beaconMesh);

      // Orbital highlight: A subtle selection halo
      if (isSelected) {
        const haloGeo = new THREE.SphereGeometry(0.7, 24, 24);
        const haloMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: 0.12,
          side: THREE.BackSide
        });
        const haloMesh = new THREE.Mesh(haloGeo, haloMat);
        probeGroup.add(haloMesh);

        // Selection Pulse Ring - highlights the orbit
        const pulseGeo = new THREE.RingGeometry(0.85, 0.88, 48);
        const pulseMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: 0.35,
          side: THREE.DoubleSide
        });
        const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
        pulseMesh.rotation.x = Math.PI / 2;
        probeGroup.add(pulseMesh);
      }

      // Minimalist flat representation
      const ringGeo = new THREE.RingGeometry(0.4, 0.42, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isSelected ? 0.5 : 0.1,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      probeGroup.add(ringMesh);

      systemGroup.add(probeGroup);

      probeMeshesRef.current.push({
        group: probeGroup,
        beacon: beaconMesh,
        ring: ringMesh,
        artifact,
        pos: new THREE.Vector3(
          hardwarePos.positionScene.x,
          hardwarePos.positionScene.y,
          hardwarePos.positionScene.z
        ),
      });

      // B. True Astrodynamics Trajectory Path (Hyperbolic escape vector / Halo orbit / Ellipse)
      const pathPoints = getHardwareTrajectoryPath(artifact.id, 120);
      if (pathPoints.length > 1) {
        const threePath = pathPoints.map((p) => new THREE.Vector3(p.x, p.y, p.z));
        const trailGeo = new THREE.BufferGeometry().setFromPoints(threePath);
        const trailMat = new THREE.LineBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: isSelected ? 0.65 : 0.22,
        });
        const trailLine = new THREE.Line(trailGeo, trailMat);
        trajectoryGroup.add(trailLine);
      }
    });
  }, [artifacts, selectedArtifact]);

  // Sync tracking refs when selectedArtifact changes
  useEffect(() => {
    selectedArtifactRef.current = selectedArtifact;
    if (selectedArtifact) {
      const isInterstellar =
        selectedArtifact.category === 'interstellar_probe' ||
        selectedArtifact.id.includes('voyager') ||
        selectedArtifact.id.includes('pioneer') ||
        selectedArtifact.id === 'new-horizons';

      setSelectedPlanet(null);
      selectedPlanetRef.current = null;

      if (isInterstellar) {
        // Interstellar probes: show big overview from our solar system
        selectedArtifactRef.current = null;
        targetLookAtRef.current.set(0, 0, 0);
        targetZoomDistanceRef.current = 480;
        targetRotationRef.current.x = 0.38;
        targetRotationRef.current.y = -0.85;
      } else {
        // Non-interstellar deep space objects: keep camera further away for comfortable context
        targetZoomDistanceRef.current = 22.0;
        targetRotationRef.current.x = 0.35;
      }
    }
  }, [selectedArtifact]);

  // Preset Camera Flights (Return to solar system overview)
  const handleFlyToPreset = (
    preset: 'solar_system' | 'inner' | 'gas_giants' | 'interstellar' | 'sun'
  ) => {
    playTelemetryBeep(520);
    setSelectedPlanet(null);
    selectedPlanetRef.current = null;
    onSelectArtifact(null);
    selectedArtifactRef.current = null;
    targetLookAtRef.current.set(0, 0, 0);

    switch (preset) {
      case 'solar_system':
        setActiveFilter('all');
        targetRotationRef.current.x = 0.6;
        targetRotationRef.current.y = -0.2;
        targetZoomDistanceRef.current = 105;
        break;
      case 'inner':
        setActiveFilter('all');
        targetRotationRef.current.x = 0.55;
        targetRotationRef.current.y = -0.1;
        targetZoomDistanceRef.current = 30;
        break;
      case 'gas_giants':
        setActiveFilter('all');
        targetRotationRef.current.x = 0.45;
        targetRotationRef.current.y = -0.8;
        targetZoomDistanceRef.current = 65;
        break;
      case 'interstellar':
        setActiveFilter('interstellar');
        targetRotationRef.current.x = 0.35;
        targetRotationRef.current.y = -0.9;
        targetZoomDistanceRef.current = 480;
        break;
      case 'sun':
        const sun = SOLAR_PLANETS[0];
        setSelectedPlanet(sun);
        selectedPlanetRef.current = sun;
        targetRotationRef.current.x = 0.5;
        targetRotationRef.current.y = 0;
        targetZoomDistanceRef.current = 12;
        break;
    }
  };

  const handleFocusPlanet = (planet: SolarPlanetData) => {
    playRadarPing();
    setSelectedPlanet(planet);
    selectedPlanetRef.current = planet;
    onSelectArtifact(null);
    selectedArtifactRef.current = null;

    targetZoomDistanceRef.current = getPlanetTrackingDistance(planet);
    targetRotationRef.current.x = 0.35;
  };

  // Time scrubber handler
  const handleTimeScrub = (newYear: number) => {
    simTimeYearsRef.current = newYear;
    setCurrentYearNumber(Math.round(newYear * 10) / 10);
    const systemState = updateSolarSystem(newYear, artifactIds);
    setCurrentSimDate(systemState.dateString);

    // Update positions immediately
    planetMeshesRef.current.forEach(({ mesh, planet }) => {
      const pState = systemState.planets.get(planet.id);
      if (pState) {
        mesh.position.set(pState.positionScene.x, pState.positionScene.y, pState.positionScene.z);
      }
    });

    probeMeshesRef.current.forEach(({ group, artifact, pos }) => {
      const hState = systemState.hardware.get(artifact.id);
      if (hState) {
        group.position.set(hState.positionScene.x, hState.positionScene.y, hState.positionScene.z);
        pos.set(hState.positionScene.x, hState.positionScene.y, hState.positionScene.z);
      }
    });
  };

  // Pointer interactions
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      targetRotationRef.current.y += deltaX * 0.005;
      targetRotationRef.current.x += deltaY * 0.005;
      targetRotationRef.current.x = THREE.MathUtils.clamp(
        targetRotationRef.current.x,
        0.05,
        1.45
      );

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    // Raycast hover check
    const container = mountRef.current;
    const camera = cameraRef.current;
    if (!container || !camera) return;

    const rect = container.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

    // 1. Check probe beacons
    const interactiveProbes = probeMeshesRef.current.map((p) => p.beacon);
    const probeIntersects = raycaster.intersectObjects(interactiveProbes);

    if (probeIntersects.length > 0) {
      const hit = probeMeshesRef.current.find((p) => p.beacon === probeIntersects[0].object);
      if (hit && hoveredArtifact?.id !== hit.artifact.id) {
        setHoveredArtifact(hit.artifact);
        setHoveredPlanet(null);
        playTelemetryBeep(720, 0.03);
      }
      return;
    } else {
      if (hoveredArtifact !== null) {
        setHoveredArtifact(null);
      }
    }

    // 2. Check planets
    const planetMeshes = planetMeshesRef.current.map((p) => p.mesh);
    const planetIntersects = raycaster.intersectObjects(planetMeshes);

    if (planetIntersects.length > 0) {
      const hit = planetMeshesRef.current.find((p) => p.mesh === planetIntersects[0].object);
      if (hit && hoveredPlanet?.id !== hit.planet.id) {
        setHoveredPlanet(hit.planet);
        playTelemetryBeep(640, 0.03);
      }
    } else {
      if (hoveredPlanet !== null) {
        setHoveredPlanet(null);
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

      // 1. Check probe clicks
      const interactiveProbes = probeMeshesRef.current.map((p) => p.beacon);
      const probeHits = raycaster.intersectObjects(interactiveProbes);

      if (probeHits.length > 0) {
        const hit = probeMeshesRef.current.find((p) => p.beacon === probeHits[0].object);
        if (hit) {
          playRadarPing();
          onSelectArtifact(hit.artifact);
          setSelectedPlanet(null);
          return;
        }
      }

      // 2. Check planet clicks
      const planetMeshes = planetMeshesRef.current.map((p) => p.mesh);
      const planetHits = raycaster.intersectObjects(planetMeshes);

      if (planetHits.length > 0) {
        const hit = planetMeshesRef.current.find((p) => p.mesh === planetHits[0].object);
        if (hit) {
          handleFocusPlanet(hit.planet);
        }
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * 0.05;
    const minZoom = selectedPlanetRef.current || selectedArtifactRef.current ? 1.6 : 8;
    targetZoomDistanceRef.current = THREE.MathUtils.clamp(
      targetZoomDistanceRef.current + delta,
      minZoom,
      600
    );
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#050608]">
      {/* 1. Fullscreen 3D Solar System Orrery Canvas */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* 2. Top-Left NASA Solar System Control Dock */}
      <div 
        className={`absolute top-1/2 -translate-y-1/2 left-4 z-20 flex flex-col gap-2 pointer-events-auto max-w-[240px] w-full transition-all duration-500 ease-in-out ${
          isDockVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Main Control Panel */}
        <div className="bg-[#1e1f20]/90 border border-white/10 rounded-2xl p-3 shadow-2xl backdrop-blur-xl flex flex-col gap-2.5 text-[11px] leading-[12px]">
          {/* Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
            <span className="flex items-center gap-1.5 font-bold text-white uppercase tracking-widest text-[9px] font-mono">
              <span className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              System Orrery
            </span>
            <button 
              onClick={() => setIsDockVisible(false)}
              className="group flex items-center gap-1.5 p-2 hover:bg-white/10 rounded-xl text-zinc-500 hover:text-white transition-all active:scale-95"
              aria-label="Close panel"
            >
              <span className="text-[8px] font-bold font-mono tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">CLOSE</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 gap-1.5 font-sans">
            <button
              onClick={() => handleFlyToPreset('solar_system')}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-[10px] font-medium transition-all"
            >
              Full System
            </button>
            <button
              onClick={() => handleFlyToPreset('inner')}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-[10px] font-medium transition-all"
            >
              Inner Worlds
            </button>
            <button
              onClick={() => handleFlyToPreset('gas_giants')}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-[10px] font-medium transition-all"
            >
              Gas Giants
            </button>
            <button
              onClick={() => handleFlyToPreset('interstellar')}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-[10px] font-medium transition-all"
            >
              Interstellar
            </button>
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Display Layers</span>
            <button
              onClick={() => setShowOrbits(!showOrbits)}
              className={`p-1.5 rounded-lg transition-colors ${showOrbits ? 'text-blue-400 bg-blue-400/10' : 'text-zinc-600 bg-white/5'}`}
              title="Toggle Orbits & Trajectories"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>

          {selectedArtifact && (
            <button
              onClick={() => {
                playTelemetryBeep(650);
                const match = probeMeshesRef.current.find((p) => p.artifact.id === selectedArtifact.id);
                if (match) {
                  const angle = Math.atan2(match.pos.x, match.pos.z);
                  targetRotationRef.current.y = -angle + 0.3;
                  targetRotationRef.current.x = 0.45;
                  targetZoomDistanceRef.current = Math.max(36, match.pos.length() * 1.3);
                }
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-blue-500 text-white text-[10px] font-medium shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Target Focus</span>
            </button>
          )}

          {/* Quick Planet Selector */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Inspect</span>
              <button
                onClick={() => handleFlyToPreset('sun')}
                className="text-amber-400 hover:text-amber-300 text-[10px] font-medium underline-offset-2 hover:underline"
              >
                Sol (Sun)
              </button>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              {SOLAR_PLANETS.filter((p) => p.id !== 'sun').map((planet) => {
                const isSelected = selectedPlanet?.id === planet.id;
                return (
                  <button
                    key={planet.id}
                    onClick={() => handleFocusPlanet(planet)}
                    className={`px-3 py-1 rounded-full text-[10px] font-medium shrink-0 transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/30 scale-105'
                        : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                    title={`Lock camera to follow ${planet.name} as it orbits`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                    <span>{planet.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Astrodynamics Simulation Time Controls */}
          <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-zinc-300">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold text-white">{currentSimDate}</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                {currentYearNumber.toFixed(1)} CE
              </span>
            </div>

            {/* Time Scrubber Slider */}
            <input
              type="range"
              min="1970"
              max="2040"
              step="0.1"
              value={currentYearNumber}
              onChange={(e) => handleTimeScrub(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
            />

            {/* Simulation Speed & Controls */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSimSpeed(simSpeed === 0 ? 1 : 0)}
                  className="p-2 rounded-full bg-white/5 border border-white/5 text-zinc-300 hover:text-white transition-all"
                >
                  {simSpeed === 0 ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
                </button>

                <div className="flex items-center bg-white/5 p-0.5 rounded-full border border-white/5 ml-1">
                  {[1, 5, 25].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setSimSpeed(speed)}
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold transition-all ${
                        simSpeed === speed
                          ? 'bg-white text-zinc-950 shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {speed}×
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleTimeScrub(BASE_YEAR)}
                className="p-2 rounded-full bg-white/5 text-zinc-400 hover:text-white transition-all"
                title="Reset to 2026"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
        {/* Live Telemetry Display */}
        {(selectedArtifact || (selectedPlanet && selectedPlanet.id !== 'sun')) && liveTelemetry && (
          <div className="bg-[#1e1f20]/80 border border-white/5 rounded-2xl p-4 shadow-xl backdrop-blur-xl flex flex-col gap-2 animate-in slide-in-from-left-2 duration-300 text-[12px] leading-[13px]">
            <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-widest text-zinc-500 border-b border-white/5 pb-2">
              <span className="flex items-center gap-2">
                <span 
                  style={{ backgroundColor: selectedArtifact ? getArtifactColor(selectedArtifact) : '#3b82f6' }}
                  className="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                />
                Live Telemetry
              </span>
              <button
                onClick={() => {
                  setSelectedPlanet(null);
                  selectedPlanetRef.current = null;
                  onSelectArtifact(null);
                  selectedArtifactRef.current = null;
                  targetLookAtRef.current.set(0, 0, 0);
                }}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Close telemetry"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3 pt-1">
              <div>
                <h4 
                  style={{ color: selectedArtifact ? getArtifactColor(selectedArtifact) : undefined }}
                  className={`text-xs font-semibold mb-0.5 ${!selectedArtifact ? 'text-white' : ''}`}
                >
                  {selectedArtifact ? selectedArtifact.name : selectedPlanet?.name}
                </h4>
                <p className="text-[10px] text-zinc-400 font-medium tracking-tight">
                  {selectedArtifact ? selectedArtifact.trajectoryOrRegion : 'Planetary Orbit'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Velocity</span>
                  <p className="text-xs font-semibold text-white">{liveTelemetry.velocityKmS} km/s</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Distance</span>
                  <p className="text-xs font-semibold text-white">{liveTelemetry.distanceAU} AU</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Minimal Engine Info Shortcut */}
        <div className="bg-[#1e1f20]/60 border border-white/5 rounded-full px-3 py-1.5 backdrop-blur-md flex items-center justify-between text-[10px] font-medium text-zinc-500">
          <button
            onClick={() => setShowCoordinateInfo(true)}
            className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
          >
            <div className="w-1 h-1 rounded-full bg-blue-500/50" />
            <span>Astrodynamics Engine</span>
          </button>
        </div>
      </div>

      {/* 3. Floating Planetary Spec Card */}
      {selectedPlanet && (
        <div className="absolute top-16 right-4 z-30 max-w-sm w-full bg-[#1e1f20]/95 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-right-4 text-zinc-100">
          <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-widest text-blue-400 block mb-1">
                {selectedPlanet.category.replace('_', ' ')}
              </span>
              <h3 className="text-lg font-semibold text-white tracking-tight">
                {selectedPlanet.name}
              </h3>
            </div>
            <button
              onClick={() => {
                setSelectedPlanet(null);
                selectedPlanetRef.current = null;
                targetLookAtRef.current.set(0, 0, 0);
              }}
              className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors active:scale-90"
              aria-label="Close planet info"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-zinc-300 mt-3 leading-relaxed">
            {selectedPlanet.description}
          </p>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { label: 'Distance', value: liveTelemetry && selectedPlanet.id !== 'sun' ? `${liveTelemetry.distanceAU} AU` : `${selectedPlanet.semiMajorAxisAU} AU` },
              { label: 'Velocity', value: liveTelemetry && selectedPlanet.id !== 'sun' ? `${liveTelemetry.velocityKmS} km/s` : 'Orbital Center', color: 'text-blue-400' },
              { label: 'Eccentricity', value: selectedPlanet.eccentricity },
              { label: 'Axial Tilt', value: `${selectedPlanet.axialTiltDeg}°` },
            ].map((metric, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-0.5">{metric.label}</span>
                <span className={`text-[11px] font-semibold ${metric.color || 'text-zinc-200'}`}>{metric.value}</span>
              </div>
            ))}
          </div>

          {/* Associated Relics */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block mb-2">
              Mission Hardware
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedPlanet.relicsPresent.map((relic, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-zinc-300">
                  {relic}
                </span>
              ))}
            </div>
          </div>

          {/* Cesium Shortcut */}
          {(selectedPlanet.id === 'mars' || selectedPlanet.id === 'earth') && onSwitchBody && (
            <button
              onClick={() => onSwitchBody(selectedPlanet.id === 'mars' ? 'mars' : 'moon')}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
            >
              <span>Inspect Surface</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* 3. Floating Restore Dock Button */}
      <button
        onClick={() => setIsDockVisible(true)}
        className={`absolute top-16 left-4 z-20 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#1e1f20]/95 border border-white/10 text-white shadow-2xl backdrop-blur-xl transition-all duration-500 ease-in-out active:scale-95 ${
          isDockVisible ? '-translate-x-32 opacity-0' : 'translate-x-0 opacity-100'
        }`}
        aria-label="Restore controls"
      >
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-[10px] font-bold font-mono tracking-widest uppercase">Restore Controls</span>
        <ChevronRight className="w-4 h-4 text-blue-400" />
      </button>

      {/* 4. Filter Category Tabs */}
      <div className="absolute top-16 right-4 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 z-20 pointer-events-auto flex items-center gap-1 bg-[#1e1f20]/95 border border-white/10 p-1 rounded-full backdrop-blur-xl shadow-2xl overflow-x-auto max-w-[calc(100vw-32px)]">
        {[
          { id: 'all', label: 'All', count: artifacts.length },
          {
            id: 'interstellar',
            label: 'Interstellar',
            count: artifacts.filter((a) => a.category === 'interstellar_probe' || a.id.includes('pioneer')).length,
          },
          {
            id: 'small_bodies',
            label: 'Asteroids & Ceres',
            count: artifacts.filter(
              (a) =>
                a.category === 'asteroid_impactor' ||
                a.category === 'planetary_orbiter' ||
                a.id === 'near-shoemaker' ||
                a.id === 'dawn'
            ).length,
          },
          {
            id: 'telescopes',
            label: 'Observatory',
            count: artifacts.filter((a) => a.category === 'space_telescope' || a.id === 'kepler').length,
          },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => {
              playTelemetryBeep(520);
              const filterId = filter.id as DeepSpaceFilter;
              setActiveFilter(filterId);
              if (filterId === 'interstellar') {
                handleFlyToPreset('interstellar');
              } else if (filterId === 'all') {
                handleFlyToPreset('solar_system');
              } else {
                setSelectedPlanet(null);
                selectedPlanetRef.current = null;
                onSelectArtifact(null);
                selectedArtifactRef.current = null;
                targetLookAtRef.current.set(0, 0, 0);
                targetZoomDistanceRef.current = 50;
              }
            }}
            className={`px-3.5 py-1.5 rounded-full text-[10px] font-semibold transition-all whitespace-nowrap ${
              activeFilter === filter.id
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      {/* 4B. Active Planetary & Trajectory Follow-Cam Banner */}
      {(selectedPlanet || selectedArtifact) && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#1e1f20]/95 border border-blue-500/30 text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-wide">
            Follow Cam: {selectedPlanet ? selectedPlanet.name : selectedArtifact?.name}
          </span>
          <span className="text-[9px] font-mono uppercase text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            Live Locked
          </span>
          <button
            onClick={() => {
              playTelemetryBeep(450);
              setSelectedPlanet(null);
              selectedPlanetRef.current = null;
              onSelectArtifact(null);
              selectedArtifactRef.current = null;
              targetLookAtRef.current.set(0, 0, 0);
              targetZoomDistanceRef.current = 105;
            }}
            className="ml-0.5 p-1 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
            title="Release Follow Cam and Return to Solar System Overview"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 5. Hover preview tooltip */}
      {hoveredArtifact && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none bg-[#1e1f20]/95 border border-white/10 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-xl text-center max-w-xs animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-widest text-zinc-400">
            <span>{hoveredArtifact.nssdcaId}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            <span className="truncate">{hoveredArtifact.trajectoryOrRegion}</span>
          </div>
          <h4 className="text-sm font-semibold text-white mt-1">
            {hoveredArtifact.name}
          </h4>
          <p className="text-xs text-zinc-400 mt-1 line-clamp-1 italic">
            "{hoveredArtifact.story.headline}"
          </p>
        </div>
      )}

      {hoveredPlanet && !hoveredArtifact && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none bg-[#1e1f20]/95 border border-white/10 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-xl text-center max-w-xs animate-in fade-in zoom-in-95">
          <span className="text-[10px] font-medium uppercase tracking-widest text-amber-400 block">
            {hoveredPlanet.category.replace('_', ' ')}
          </span>
          <h4 className="text-sm font-semibold text-white mt-1">
            {hoveredPlanet.name}
          </h4>
          <span className="text-[10px] text-zinc-400 block mt-1">
            {hoveredPlanet.semiMajorAxisAU} AU Semi-Major Axis
          </span>
        </div>
      )}

      {/* 6. Astrodynamics Specification Modal */}
      {showCoordinateInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-[#1e1f20] border border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95 text-zinc-100">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Compass className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white tracking-tight">
                  Astrodynamics Engine
                </h3>
              </div>
              <button
                onClick={() => setShowCoordinateInfo(false)}
                className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {[
                { title: "Kepler's Harmonic Law", content: "Planetary velocity decreases with distance: T² = a³. Outer worlds orbit slower than inner worlds.", icon: <Zap className="w-3.5 h-3.5" /> },
                { title: "Trajectory Physics", content: "Probes use hyperbolic escape vectors, halo orbits, or heliocentric drifts based on NASA mission data.", icon: <Radio className="w-3.5 h-3.5" /> },
                { title: "Multi-Engine Pipeline", content: "Combines Cesium High-Res topography with Three.js multi-body propagation logic.", icon: <Layers className="w-3.5 h-3.5" /> }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-blue-400">{item.icon}</span>
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">{item.title}</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowCoordinateInfo(false)}
              className="mt-6 w-full py-3 rounded-2xl bg-white text-zinc-950 font-semibold text-sm transition-transform active:scale-[0.98]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 7. Collapsible Bottom Missions Timeline */}
      <div
        className={`absolute bottom-4 inset-x-0 z-20 flex flex-col items-center gap-2 px-4 pointer-events-none transition-transform duration-500 ${
          isTimelineCollapsed ? 'translate-y-36' : 'translate-y-0'
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => {
            playTelemetryBeep(400);
            setIsTimelineCollapsed(!isTimelineCollapsed);
          }}
          className="pointer-events-auto px-4 py-1.5 rounded-full bg-[#08090d]/90 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white backdrop-blur-md flex items-center gap-2 transition-all shadow-xl"
        >
          {isTimelineCollapsed ? (
            <>
              <ChevronUp className="w-4 h-4" />
              <span>Show Timeline</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              <span>Hide Timeline</span>
            </>
          )}
        </button>

        {/* Carousel Strip */}
        <div className="pointer-events-auto w-full max-w-3xl bg-[#08090d]/80 border border-white/5 rounded-2xl p-1.5 backdrop-blur-xl shadow-2xl flex items-center gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory">
          {filteredArtifacts.map((artifact) => {
            const isSelected = selectedArtifact?.id === artifact.id;
            return (
              <button
                key={artifact.id}
                onClick={() => {
                  playRadarPing();
                  onSelectArtifact(artifact);
                  setSelectedPlanet(null);
                }}
                className={`flex-shrink-0 snap-center min-w-[120px] sm:min-w-[160px] px-3 py-2 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-zinc-800 border-blue-500/50 text-white shadow-lg scale-105'
                    : 'bg-[#18191a]/80 border-transparent text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                <div className="text-[10px] font-medium uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                  <span 
                    style={{ color: isSelected ? getArtifactColor(artifact) : undefined }} 
                    className={!isSelected ? 'text-zinc-500 font-mono' : 'font-mono'}
                  >
                    {artifact.year}
                  </span>
                  {isSelected && (
                    <span 
                      style={{ backgroundColor: getArtifactColor(artifact) }} 
                      className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]" 
                    />
                  )}
                </div>
                <h4 className={`text-xs font-medium truncate ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                  {artifact.moniker}
                </h4>
              </button>
            );
          })}
        </div>
      </div>
      {/* 8. Restore Dock Button */}
      {!isDockVisible && (
        <button
          onClick={() => {
            playTelemetryBeep(400);
            setIsDockVisible(true);
          }}
          className="absolute top-16 left-4 z-30 p-3 rounded-2xl bg-[#1e1f20]/90 border border-white/10 text-zinc-400 hover:text-white backdrop-blur-xl shadow-2xl transition-all hover:scale-110 active:scale-95"
          title="Show Mission Control"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
    </div>
  );
});
