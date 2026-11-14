/**
 * ORBITAL ENGINE - Physics Engine & Astrodynamics Trajectory Propagation Module
 * Built for NASA Space Apps Challenge ("Abandoned But Not Forgotten")
 *
 * Implements:
 * 1. Kepler's 3rd Law (T² = a³) & Keplerian conic orbits with eccentric anomaly iteration
 * 2. Planetary orbital velocities: ω_planet = ω_Earth * a^(-3/2)
 * 3. Deep space hardware trajectory classifications:
 *    - Hyperbolic escape vectors (Voyager 1 & 2, Pioneer 10 & 11, New Horizons)
 *    - Sun-Earth L2 Lagrangian Halo orbits (James Webb Space Telescope)
 *    - Earth-trailing heliocentric drift (Kepler Space Telescope)
 *    - Highly eccentric solar corona orbits (Parker Solar Probe, e = 0.881)
 *    - Planetary orbiters & asteroid rendezvous (Cassini, Galileo, Magellan, Dawn, etc.)
 */

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface PlanetState {
  id: string;
  name: string;
  semiMajorAxisAU: number;
  eccentricity: number;
  orbitalPeriodYears: number;
  orbitalPeriodDays: number;
  meanAngularVelocityRadPerYear: number;
  currentVelocityKmS: number;
  positionAU: Vector3D;
  positionScene: Vector3D;
  trueAnomalyRad: number;
  distanceFromSunAU: number;
}

export interface HardwareTrajectory {
  id: string;
  name: string;
  orbitalClass: 'hyperbolic_escape' | 'lagrange_l2' | 'earth_trailing' | 'eccentric_solar' | 'planetary_orbiter' | 'asteroid_rendezvous';
  positionAU: Vector3D;
  positionScene: Vector3D;
  distanceFromSunAU: number;
  velocityKmS: number;
  parentBodyId?: string;
  statusDescription: string;
}

export interface SolarSystemState {
  timestampYears: number;
  dateString: string;
  planets: Map<string, PlanetState>;
  hardware: Map<string, HardwareTrajectory>;
}

// Astronomical Constants
export const AU_IN_KM = 149597870.7; // 1 AU in km
export const EARTH_ORBITAL_SPEED_KMS = 29.78; // Mean Earth velocity in km/s
export const BASE_YEAR = 2026.0;

// Internal Planetary Keplerian Orbital Elements (epoch J2000 / mean)
interface PlanetKeplerianElements {
  id: string;
  name: string;
  a: number; // semi-major axis in AU
  e: number; // orbital eccentricity
  iDeg: number; // orbital inclination in degrees
  omegaPeriDeg: number; // argument of perihelion
  nodeDeg: number; // longitude of ascending node
  meanAnomalyEpochDeg: number; // mean anomaly at epoch J2000
}

const PLANETARY_ELEMENTS: Record<string, PlanetKeplerianElements> = {
  mercury: {
    id: 'mercury',
    name: 'Mercury',
    a: 0.387098,
    e: 0.20563,
    iDeg: 7.005,
    omegaPeriDeg: 29.124,
    nodeDeg: 48.331,
    meanAnomalyEpochDeg: 174.79,
  },
  venus: {
    id: 'venus',
    name: 'Venus',
    a: 0.723332,
    e: 0.006773,
    iDeg: 3.3946,
    omegaPeriDeg: 54.884,
    nodeDeg: 76.68,
    meanAnomalyEpochDeg: 50.11,
  },
  earth: {
    id: 'earth',
    name: 'Earth',
    a: 1.000002,
    e: 0.016709,
    iDeg: 0.0,
    omegaPeriDeg: 114.208,
    nodeDeg: 0.0,
    meanAnomalyEpochDeg: 358.62,
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    a: 1.523679,
    e: 0.093405,
    iDeg: 1.8497,
    omegaPeriDeg: 286.502,
    nodeDeg: 49.558,
    meanAnomalyEpochDeg: 19.37,
  },
  ceres: {
    id: 'ceres',
    name: 'Ceres',
    a: 2.767,
    e: 0.0758,
    iDeg: 10.59,
    omegaPeriDeg: 73.1,
    nodeDeg: 80.3,
    meanAnomalyEpochDeg: 95.9,
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jupiter',
    a: 5.204267,
    e: 0.048498,
    iDeg: 1.303,
    omegaPeriDeg: 273.867,
    nodeDeg: 100.464,
    meanAnomalyEpochDeg: 20.02,
  },
  saturn: {
    id: 'saturn',
    name: 'Saturn',
    a: 9.5826,
    e: 0.05555,
    iDeg: 2.485,
    omegaPeriDeg: 339.39,
    nodeDeg: 113.665,
    meanAnomalyEpochDeg: 317.02,
  },
  uranus: {
    id: 'uranus',
    name: 'Uranus',
    a: 19.2184,
    e: 0.0463,
    iDeg: 0.773,
    omegaPeriDeg: 96.999,
    nodeDeg: 74.006,
    meanAnomalyEpochDeg: 142.24,
  },
  neptune: {
    id: 'neptune',
    name: 'Neptune',
    a: 30.0700,
    e: 0.00946,
    iDeg: 1.77,
    omegaPeriDeg: 273.187,
    nodeDeg: 131.784,
    meanAnomalyEpochDeg: 256.23,
  },
  pluto: {
    id: 'pluto',
    name: 'Pluto',
    a: 39.482,
    e: 0.2488,
    iDeg: 17.16,
    omegaPeriDeg: 113.76,
    nodeDeg: 110.3,
    meanAnomalyEpochDeg: 14.88,
  },
};

/**
 * Solve Kepler's Equation: M = E - e * sin(E)
 * Uses high-precision Newton-Raphson iteration
 */
export function solveKeplerEquation(M: number, e: number): number {
  // Normalize M to [0, 2π)
  let mNorm = M % (Math.PI * 2);
  if (mNorm < 0) mNorm += Math.PI * 2;

  // Initial estimate
  let E = e > 0.8 ? Math.PI : mNorm;

  for (let iter = 0; iter < 12; iter++) {
    const deltaM = E - e * Math.sin(E) - mNorm;
    const deltaE = deltaM / (1 - e * Math.cos(E));
    E -= deltaE;
    if (Math.abs(deltaE) < 1e-8) break;
  }
  return E;
}

/**
 * Maps Astronomical Units (AU) to smooth Three.js scenic units
 * Provides smooth, monotonic scaling so inner worlds and deep interstellar
 * escape trajectories are both visually distinguishable.
 */
export function auToSceneDistance(rAU: number): number {
  if (rAU <= 0) return 0;
  if (rAU <= 1.5) {
    // Inner solar system: linear 10x scale (Earth 1.0 AU = 10.0 scene units)
    return rAU * 10.5;
  }
  if (rAU <= 10.0) {
    // Asteroid belt through Saturn: smooth quadratic dampening
    const base = 1.5 * 10.5; // ~15.75
    return base + (Math.sqrt(rAU) - Math.sqrt(1.5)) * 18.0;
  }
  // Outer giants, Kuiper belt, and interstellar space: logarithmic expansion
  const saturnScene = 15.75 + (Math.sqrt(10.0) - Math.sqrt(1.5)) * 18.0; // ~49.5
  return saturnScene + Math.log(rAU / 9.58) * 31.0;
}

/**
 * Converts Right Ascension (hours) and Declination (degrees) to a 3D unit vector
 * aligned with the solar ecliptic coordinate system.
 */
function raDecToEclipticVector(raHours: number, decDeg: number): Vector3D {
  const raRad = (raHours * 15 * Math.PI) / 180;
  const decRad = (decDeg * Math.PI) / 180;

  // Equatorial unit vector
  const eqX = Math.cos(decRad) * Math.cos(raRad);
  const eqY = Math.cos(decRad) * Math.sin(raRad);
  const eqZ = Math.sin(decRad);

  // Rotate by obliquity of the ecliptic (ε ≈ 23.44°) to get ecliptic coordinates
  const epsRad = (23.43929 * Math.PI) / 180;
  const eclX = eqX;
  const eclY = eqY * Math.cos(epsRad) + eqZ * Math.sin(epsRad);
  const eclZ = -eqY * Math.sin(epsRad) + eqZ * Math.cos(epsRad);

  // Return with Three.js convention: X is lateral, Y is vertical out-of-plane, Z is depth
  return {
    x: eclX,
    y: eclZ * 0.45, // slightly compress vertical dispersion for 3D visibility
    z: eclY,
  };
}

/**
 * 1. PLANETARY ORBITAL MECHANICS
 * Calculates realistic Keplerian planetary position in Astronomical Units (AU) and scene coordinates
 * using Kepler's 3rd Law: T² = a³ => ω = 2π * a^(-3/2)
 */
export function getPlanetPosition(
  planetId: string,
  timeInYears: number = BASE_YEAR
): PlanetState {
  const elem = PLANETARY_ELEMENTS[planetId.toLowerCase()] || PLANETARY_ELEMENTS.earth;

  // Kepler's 3rd Law: orbital period in Earth years
  const T = Math.pow(elem.a, 1.5);
  const omega = (Math.PI * 2) / T; // rad per Earth year

  // Elapsed time since epoch J2000 (2000.0)
  const dtYears = timeInYears - 2000.0;

  // Mean anomaly at current time
  const M0 = (elem.meanAnomalyEpochDeg * Math.PI) / 180;
  const M = M0 + omega * dtYears;

  // Solve Kepler's equation for Eccentric Anomaly E
  const E = solveKeplerEquation(M, elem.e);

  // True Anomaly ν
  const cosNu = (Math.cos(E) - elem.e) / (1 - elem.e * Math.cos(E));
  const sinNu = (Math.sqrt(1 - elem.e * elem.e) * Math.sin(E)) / (1 - elem.e * Math.cos(E));
  const nu = Math.atan2(sinNu, cosNu);

  // Distance from Sun focus in AU: r = a * (1 - e * cos(E))
  const rAU = elem.a * (1 - elem.e * Math.cos(E));

  // Current orbital speed via vis-viva equation: v = v_earth * sqrt(2/r - 1/a)
  const currentSpeedKmS = EARTH_ORBITAL_SPEED_KMS * Math.sqrt(Math.max(0.01, 2 / rAU - 1 / elem.a));

  // Coordinates in orbital plane
  const omegaPeriRad = (elem.omegaPeriDeg * Math.PI) / 180;
  const iRad = (elem.iDeg * Math.PI) / 180;
  const nodeRad = (elem.nodeDeg * Math.PI) / 180;

  const u = nu + omegaPeriRad; // argument of latitude
  const xOrb = rAU * Math.cos(u);
  const yOrb = rAU * Math.sin(u);

  // 3D coordinates in ecliptic space (AU)
  const xAU = xOrb * Math.cos(nodeRad) - yOrb * Math.sin(nodeRad) * Math.cos(iRad);
  const zAU = xOrb * Math.sin(nodeRad) + yOrb * Math.cos(nodeRad) * Math.cos(iRad);
  const yAU = yOrb * Math.sin(iRad);

  // Convert to scene coordinates using monotonic radial scaling
  const sceneScale = rAU > 0 ? auToSceneDistance(rAU) / rAU : 10.0;
  const positionScene: Vector3D = {
    x: xAU * sceneScale,
    y: yAU * sceneScale,
    z: zAU * sceneScale,
  };

  return {
    id: elem.id,
    name: elem.name,
    semiMajorAxisAU: elem.a,
    eccentricity: elem.e,
    orbitalPeriodYears: T,
    orbitalPeriodDays: T * 365.25,
    meanAngularVelocityRadPerYear: omega,
    currentVelocityKmS: currentSpeedKmS,
    positionAU: { x: xAU, y: yAU, z: zAU },
    positionScene,
    trueAnomalyRad: nu,
    distanceFromSunAU: rAU,
  };
}

/**
 * 2. DEEP SPACE HARDWARE TRAJECTORY CALCULATIONS
 * Evaluates the precise 3D kinematic state of a space relic based on its physical orbital class
 */
export function getHardwarePosition(
  hardwareId: string,
  timeInYears: number = BASE_YEAR
): HardwareTrajectory {
  const earth = getPlanetPosition('earth', timeInYears);
  const venus = getPlanetPosition('venus', timeInYears);
  const mars = getPlanetPosition('mars', timeInYears);
  const ceres = getPlanetPosition('ceres', timeInYears);
  const jupiter = getPlanetPosition('jupiter', timeInYears);
  const saturn = getPlanetPosition('saturn', timeInYears);

  switch (hardwareId) {
    // ==========================================
    // A. HYPERBOLIC ESCAPE PROBES (Interstellar)
    // ==========================================
    case 'voyager-1': {
      // Launch: 1977.68. Distance in 2026: ~163.5 AU. V_escape: ~3.6 AU/yr (~17.0 km/s)
      // Vector: North Solar Ecliptic (RA: 17h 28m, Dec: +12.0°)
      const launchYear = 1977.68;
      const vEscapeAUYear = 3.59;
      const rAU = Math.max(1.0, 163.5 + (timeInYears - 2026.0) * vEscapeAUYear);
      const dir = raDecToEclipticVector(17.467, 12.0);
      const sceneDist = auToSceneDistance(rAU);

      return {
        id: hardwareId,
        name: 'Voyager 1',
        orbitalClass: 'hyperbolic_escape',
        distanceFromSunAU: rAU,
        velocityKmS: 17.0,
        positionAU: { x: dir.x * rAU, y: dir.y * rAU, z: dir.z * rAU },
        positionScene: { x: dir.x * sceneDist, y: dir.y * sceneDist, z: dir.z * sceneDist },
        statusDescription: `Interstellar Space (Farthest Human-Made Monument: ~${rAU.toFixed(1)} AU)`,
      };
    }

    case 'voyager-2': {
      // Launch: 1977.63. Distance in 2026: ~136.2 AU. V_escape: ~3.2 AU/yr (~15.2 km/s)
      // Vector: South Solar Ecliptic (RA: 20h 00m, Dec: -62.0°)
      const vEscapeAUYear = 3.21;
      const rAU = Math.max(1.0, 136.2 + (timeInYears - 2026.0) * vEscapeAUYear);
      const dir = raDecToEclipticVector(20.0, -62.0);
      const sceneDist = auToSceneDistance(rAU);

      return {
        id: hardwareId,
        name: 'Voyager 2',
        orbitalClass: 'hyperbolic_escape',
        distanceFromSunAU: rAU,
        velocityKmS: 15.2,
        positionAU: { x: dir.x * rAU, y: dir.y * rAU, z: dir.z * rAU },
        positionScene: { x: dir.x * sceneDist, y: dir.y * sceneDist, z: dir.z * sceneDist },
        statusDescription: `Southern Interstellar Trajectory (~${rAU.toFixed(1)} AU from Sun)`,
      };
    }

    case 'pioneer-10': {
      // Launch: 1972.17. Distance in 2026: ~133.4 AU. V_escape: ~2.5 AU/yr (~11.9 km/s)
      // Vector: Taurus / Aldebaran (RA: 4h 30m, Dec: +26.0°)
      const vEscapeAUYear = 2.51;
      const rAU = Math.max(1.0, 133.4 + (timeInYears - 2026.0) * vEscapeAUYear);
      const dir = raDecToEclipticVector(4.5, 26.0);
      const sceneDist = auToSceneDistance(rAU);

      return {
        id: hardwareId,
        name: 'Pioneer 10',
        orbitalClass: 'hyperbolic_escape',
        distanceFromSunAU: rAU,
        velocityKmS: 11.9,
        positionAU: { x: dir.x * rAU, y: dir.y * rAU, z: dir.z * rAU },
        positionScene: { x: dir.x * sceneDist, y: dir.y * sceneDist, z: dir.z * sceneDist },
        statusDescription: `Outer Heliosphere toward Aldebaran (~${rAU.toFixed(1)} AU)`,
      };
    }

    case 'pioneer-11': {
      // Launch: 1973.26. Distance in 2026: ~111.2 AU. V_escape: ~2.4 AU/yr (~11.4 km/s)
      // Vector: Scutum / Aquila (RA: 18h 50m, Dec: -8.5°)
      const vEscapeAUYear = 2.41;
      const rAU = Math.max(1.0, 111.2 + (timeInYears - 2026.0) * vEscapeAUYear);
      const dir = raDecToEclipticVector(18.83, -8.5);
      const sceneDist = auToSceneDistance(rAU);

      return {
        id: hardwareId,
        name: 'Pioneer 11',
        orbitalClass: 'hyperbolic_escape',
        distanceFromSunAU: rAU,
        velocityKmS: 11.4,
        positionAU: { x: dir.x * rAU, y: dir.y * rAU, z: dir.z * rAU },
        positionScene: { x: dir.x * sceneDist, y: dir.y * sceneDist, z: dir.z * sceneDist },
        statusDescription: `Termination Shock Scutum Trajectory (~${rAU.toFixed(1)} AU)`,
      };
    }

    case 'new-horizons': {
      // Launch: 2006.05. Pluto flyby 2015. Distance in 2026: ~58.4 AU. V_escape: ~2.9 AU/yr (~13.8 km/s)
      // Vector: Sagittarius / Kuiper Belt (RA: 19h 05m, Dec: -20.5°)
      const vEscapeAUYear = 2.91;
      const rAU = Math.max(1.0, 58.4 + (timeInYears - 2026.0) * vEscapeAUYear);
      const dir = raDecToEclipticVector(19.08, -20.5);
      const sceneDist = auToSceneDistance(rAU);

      return {
        id: hardwareId,
        name: 'New Horizons',
        orbitalClass: 'hyperbolic_escape',
        distanceFromSunAU: rAU,
        velocityKmS: 13.8,
        positionAU: { x: dir.x * rAU, y: dir.y * rAU, z: dir.z * rAU },
        positionScene: { x: dir.x * sceneDist, y: dir.y * sceneDist, z: dir.z * sceneDist },
        statusDescription: `Trans-Neptunian Kuiper Belt Odyssey (~${rAU.toFixed(1)} AU)`,
      };
    }

    // ==========================================
    // B. LAGRANGE L2 HALO ORBIT (JWST)
    // ==========================================
    case 'jwst': {
      // JWST orbits Sun-Earth L2 (1.5 million km = 0.01003 AU outward from Earth)
      // Halo orbit period is ~6 months (~0.5 yr) with ~800,000 km amplitude (0.0053 AU)
      const earthAngle = Math.atan2(earth.positionAU.z, earth.positionAU.x);
      const l2DistanceAU = 0.01003; // 1.5 million km
      const haloRadiusAU = 0.0053; // 800,000 km
      const haloPeriodYears = 0.5;
      const haloAngle = ((timeInYears % haloPeriodYears) / haloPeriodYears) * Math.PI * 2;

      // Base L2 point along Sun-Earth vector outward
      const l2BaseX = earth.positionAU.x + Math.cos(earthAngle) * l2DistanceAU;
      const l2BaseZ = earth.positionAU.z + Math.sin(earthAngle) * l2DistanceAU;

      // Halo Lissajous perturbation (perpendicular to Sun-Earth axis)
      const haloX = -Math.sin(earthAngle) * (Math.cos(haloAngle) * haloRadiusAU);
      const haloZ = Math.cos(earthAngle) * (Math.cos(haloAngle) * haloRadiusAU);
      const haloY = Math.sin(haloAngle) * (haloRadiusAU * 0.8);

      const posAU: Vector3D = {
        x: l2BaseX + haloX,
        y: haloY,
        z: l2BaseZ + haloZ,
      };

      // In scene units: offset slightly outward from Earth's scene position for clean visibility
      const earthSceneAngle = Math.atan2(earth.positionScene.z, earth.positionScene.x);
      const posScene: Vector3D = {
        x: earth.positionScene.x + Math.cos(earthSceneAngle) * 1.8 + haloX * 80,
        y: earth.positionScene.y + 0.35 + haloY * 80,
        z: earth.positionScene.z + Math.sin(earthSceneAngle) * 1.8 + haloZ * 80,
      };

      const distAU = Math.sqrt(posAU.x * posAU.x + posAU.z * posAU.z);

      return {
        id: hardwareId,
        name: 'James Webb Space Telescope',
        orbitalClass: 'lagrange_l2',
        parentBodyId: 'earth',
        distanceFromSunAU: distAU,
        velocityKmS: 30.2,
        positionAU: posAU,
        positionScene: posScene,
        statusDescription: 'Sun-Earth L2 Lagrangian Halo Orbit (~1.5M km from Earth)',
      };
    }

    // ==========================================
    // C. EARTH-TRAILING HELIOCENTRIC DRIFT (Kepler)
    // ==========================================
    case 'kepler': {
      // Semi-major axis a = 1.013 AU, period T = 1.0196 years (drifts slowly behind Earth)
      const a = 1.013;
      const e = 0.035;
      const T = Math.pow(a, 1.5);
      const omega = (Math.PI * 2) / T;

      // Drift phase offset relative to Earth
      const dt = timeInYears - 2009.18; // Launched March 2009
      const M = omega * dt;
      const E = solveKeplerEquation(M, e);
      const rAU = a * (1 - e * Math.cos(E));
      const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));

      const angle = nu + 1.2; // perihelion alignment
      const posAU: Vector3D = {
        x: Math.cos(angle) * rAU,
        y: Math.sin(dt * 0.1) * 0.02,
        z: Math.sin(angle) * rAU,
      };

      const sceneDist = auToSceneDistance(rAU);
      const posScene: Vector3D = {
        x: Math.cos(angle) * sceneDist,
        y: 0.25,
        z: Math.sin(angle) * sceneDist,
      };

      return {
        id: hardwareId,
        name: 'Kepler Space Telescope',
        orbitalClass: 'earth_trailing',
        distanceFromSunAU: rAU,
        velocityKmS: 29.4,
        positionAU: posAU,
        positionScene: posScene,
        statusDescription: 'Earth-Trailing Heliocentric Orbit (a = 1.013 AU, T = 1.02 yrs)',
      };
    }

    // ==========================================
    // D. HIGHLY ECCENTRIC SOLAR CORONA ORBIT (Parker)
    // ==========================================
    case 'parker-solar-probe': {
      // Perihelion q = 0.046 AU (~6.9M km), Aphelion Q = 0.73 AU (Venus assist resonance)
      // a = 0.388 AU, e = 0.881, T = a^1.5 = 0.242 yr (88.4 days)
      const a = 0.388;
      const e = 0.881;
      const T = Math.pow(a, 1.5);
      const omega = (Math.PI * 2) / T;

      const dt = timeInYears - 2018.61; // Launched Aug 2018
      const M = omega * dt;
      const E = solveKeplerEquation(M, e);

      // True anomaly & distance
      const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
      const rAU = a * (1 - e * Math.cos(E));

      // Vis-viva velocity: reaches 192 km/s (692,000 km/h) at perihelion!
      const currentSpeedKmS = EARTH_ORBITAL_SPEED_KMS * Math.sqrt(Math.max(0.01, 2 / rAU - 1 / a));

      // Fixed orbital orientation aligned toward Venus
      const perihelionAngle = 0.85;
      const theta = nu + perihelionAngle;

      const posAU: Vector3D = {
        x: Math.cos(theta) * rAU,
        y: Math.sin(nu) * 0.015,
        z: Math.sin(theta) * rAU,
      };

      // In scene: preserve high eccentricity shape
      const sceneScale = auToSceneDistance(rAU) / rAU;
      const posScene: Vector3D = {
        x: posAU.x * sceneScale,
        y: 0.2,
        z: posAU.z * sceneScale,
      };

      return {
        id: hardwareId,
        name: 'Parker Solar Probe',
        orbitalClass: 'eccentric_solar',
        distanceFromSunAU: rAU,
        velocityKmS: currentSpeedKmS,
        positionAU: posAU,
        positionScene: posScene,
        statusDescription: `Extreme Solar Corona Orbit (Perihelion: 0.04 AU, V: ~${Math.round(currentSpeedKmS)} km/s)`,
      };
    }

    // ==========================================
    // E. PLANETARY ORBITERS & ASTEROID MISSIONS
    // ==========================================
    case 'magellan': {
      // Anchored to Venus with minor orbital offset
      const offsetAngle = (timeInYears * 12.0) % (Math.PI * 2);
      const posScene: Vector3D = {
        x: venus.positionScene.x + Math.cos(offsetAngle) * 0.9,
        y: venus.positionScene.y + 0.15,
        z: venus.positionScene.z + Math.sin(offsetAngle) * 0.9,
      };
      return {
        id: hardwareId,
        name: 'Magellan Radar Orbiter',
        orbitalClass: 'planetary_orbiter',
        parentBodyId: 'venus',
        distanceFromSunAU: venus.distanceFromSunAU,
        velocityKmS: 35.0,
        positionAU: venus.positionAU,
        positionScene: posScene,
        statusDescription: 'Venusian Atmospheric Entry Memorial (Radar Mapping Legacy 1989-1994)',
      };
    }

    case 'galileo': {
      // Anchored to Jupiter with Jovian atmospheric plunge marker
      const offsetAngle = (timeInYears * 4.0) % (Math.PI * 2);
      const posScene: Vector3D = {
        x: jupiter.positionScene.x + Math.cos(offsetAngle) * 2.2,
        y: jupiter.positionScene.y + 0.25,
        z: jupiter.positionScene.z + Math.sin(offsetAngle) * 2.2,
      };
      return {
        id: hardwareId,
        name: 'Galileo Orbiter & Probe',
        orbitalClass: 'planetary_orbiter',
        parentBodyId: 'jupiter',
        distanceFromSunAU: jupiter.distanceFromSunAU,
        velocityKmS: 13.1,
        positionAU: jupiter.positionAU,
        positionScene: posScene,
        statusDescription: 'Jovian Atmosphere Grand Plunge (Explored Galilean Moons 1995-2003)',
      };
    }

    case 'cassini': {
      // Anchored to Saturn's ring plane
      const offsetAngle = (timeInYears * 3.5) % (Math.PI * 2);
      const posScene: Vector3D = {
        x: saturn.positionScene.x + Math.cos(offsetAngle) * 2.1,
        y: saturn.positionScene.y + 0.35,
        z: saturn.positionScene.z + Math.sin(offsetAngle) * 2.1,
      };
      return {
        id: hardwareId,
        name: 'Cassini-Huygens',
        orbitalClass: 'planetary_orbiter',
        parentBodyId: 'saturn',
        distanceFromSunAU: saturn.distanceFromSunAU,
        velocityKmS: 9.6,
        positionAU: saturn.positionAU,
        positionScene: posScene,
        statusDescription: 'Saturnian Atmosphere & Ring-Plane Grand Finale (2004-2017)',
      };
    }

    case 'dawn': {
      // In permanent quiescent orbit around dwarf planet Ceres in the Asteroid Belt
      const offsetAngle = (timeInYears * 5.0) % (Math.PI * 2);
      const posScene: Vector3D = {
        x: ceres.positionScene.x + Math.cos(offsetAngle) * 0.8,
        y: ceres.positionScene.y + 0.15,
        z: ceres.positionScene.z + Math.sin(offsetAngle) * 0.8,
      };
      return {
        id: hardwareId,
        name: 'Dawn Spacecraft',
        orbitalClass: 'planetary_orbiter',
        parentBodyId: 'ceres',
        distanceFromSunAU: ceres.distanceFromSunAU,
        velocityKmS: 17.9,
        positionAU: ceres.positionAU,
        positionScene: posScene,
        statusDescription: 'Permanent Quiescent Orbit at Dwarf Planet Ceres (2.77 AU)',
      };
    }

    case 'near-shoemaker': {
      // Asteroid 433 Eros: a = 1.458 AU, e = 0.223, T = 1.76 yrs
      const a = 1.458;
      const e = 0.223;
      const T = Math.pow(a, 1.5);
      const M = ((timeInYears - 2001.0) / T) * Math.PI * 2 + 1.4;
      const E = solveKeplerEquation(M, e);
      const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
      const rAU = a * (1 - e * Math.cos(E));
      const theta = nu + 0.6;
      const posAU: Vector3D = { x: Math.cos(theta) * rAU, y: 0.1, z: Math.sin(theta) * rAU };
      const sDist = auToSceneDistance(rAU);

      return {
        id: hardwareId,
        name: 'NEAR Shoemaker',
        orbitalClass: 'asteroid_rendezvous',
        distanceFromSunAU: rAU,
        velocityKmS: 24.5,
        positionAU: posAU,
        positionScene: { x: Math.cos(theta) * sDist, y: 0.2, z: Math.sin(theta) * sDist },
        statusDescription: 'Soft-Landed on Asteroid 433 Eros Surface (First Asteroid Touchdown)',
      };
    }

    case 'osiris-rex': {
      // Near-Earth Asteroid 101955 Bennu: a = 1.126 AU, e = 0.204
      const a = 1.126;
      const e = 0.204;
      const T = Math.pow(a, 1.5);
      const M = ((timeInYears - 2016.0) / T) * Math.PI * 2 + 2.1;
      const E = solveKeplerEquation(M, e);
      const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
      const rAU = a * (1 - e * Math.cos(E));
      const theta = nu + 1.8;
      const posAU: Vector3D = { x: Math.cos(theta) * rAU, y: -0.05, z: Math.sin(theta) * rAU };
      const sDist = auToSceneDistance(rAU);

      return {
        id: hardwareId,
        name: 'OSIRIS-REx',
        orbitalClass: 'asteroid_rendezvous',
        distanceFromSunAU: rAU,
        velocityKmS: 28.0,
        positionAU: posAU,
        positionScene: { x: Math.cos(theta) * sDist, y: -0.15, z: Math.sin(theta) * sDist },
        statusDescription: 'Sample Return from Asteroid Bennu (Now on OSIRIS-APEX Trajectory)',
      };
    }

    case 'dart': {
      // Near-Earth Asteroid Dimorphos: a = 1.644 AU, e = 0.384
      const a = 1.644;
      const e = 0.384;
      const T = Math.pow(a, 1.5);
      const M = ((timeInYears - 2021.0) / T) * Math.PI * 2 + 0.4;
      const E = solveKeplerEquation(M, e);
      const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
      const rAU = a * (1 - e * Math.cos(E));
      const theta = nu + 2.6;
      const posAU: Vector3D = { x: Math.cos(theta) * rAU, y: 0.12, z: Math.sin(theta) * rAU };
      const sDist = auToSceneDistance(rAU);

      return {
        id: hardwareId,
        name: 'DART Impactor',
        orbitalClass: 'asteroid_rendezvous',
        distanceFromSunAU: rAU,
        velocityKmS: 22.8,
        positionAU: posAU,
        positionScene: { x: Math.cos(theta) * sDist, y: 0.25, z: Math.sin(theta) * sDist },
        statusDescription: 'Kinetic Impactor on Dimorphos (Planetary Defense Monument)',
      };
    }

    case 'deep-impact': {
      // Comet 9P/Tempel 1: a = 3.12 AU, e = 0.517
      const a = 3.12;
      const e = 0.517;
      const T = Math.pow(a, 1.5);
      const M = ((timeInYears - 2005.0) / T) * Math.PI * 2 + 1.7;
      const E = solveKeplerEquation(M, e);
      const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
      const rAU = a * (1 - e * Math.cos(E));
      const theta = nu - 0.9;
      const posAU: Vector3D = { x: Math.cos(theta) * rAU, y: 0.18, z: Math.sin(theta) * rAU };
      const sDist = auToSceneDistance(rAU);

      return {
        id: hardwareId,
        name: 'Deep Impact',
        orbitalClass: 'asteroid_rendezvous',
        distanceFromSunAU: rAU,
        velocityKmS: 16.9,
        positionAU: posAU,
        positionScene: { x: Math.cos(theta) * sDist, y: 0.35, z: Math.sin(theta) * sDist },
        statusDescription: 'Comet Tempel 1 Impactor (Cometary Nucleus Excavation 2005)',
      };
    }

    default: {
      // Fallback for any other deep space artifact: stable heliocentric orbit
      const fallbackA = 2.0;
      const T = Math.pow(fallbackA, 1.5);
      const angle = ((timeInYears % T) / T) * Math.PI * 2;
      const sDist = auToSceneDistance(fallbackA);

      return {
        id: hardwareId,
        name: hardwareId,
        orbitalClass: 'planetary_orbiter',
        distanceFromSunAU: fallbackA,
        velocityKmS: 21.0,
        positionAU: { x: Math.cos(angle) * fallbackA, y: 0, z: Math.sin(angle) * fallbackA },
        positionScene: { x: Math.cos(angle) * sDist, y: 0, z: Math.sin(angle) * sDist },
        statusDescription: `Solar Orbit (~${fallbackA.toFixed(1)} AU)`,
      };
    }
  }
}

/**
 * 3. TRAJECTORY PATH GENERATOR
 * Generates an array of {x, y, z} Vector3D points in scene units to render
 * high-fidelity orbital trails on Three.js or Cesium canvases.
 */
export function getHardwareTrajectoryPath(
  hardwareId: string,
  segments = 120
): Vector3D[] {
  const points: Vector3D[] = [];

  switch (hardwareId) {
    case 'voyager-1': {
      // Hyperbolic vector from Earth to ~180 AU
      const dir = raDecToEclipticVector(17.467, 12.0);
      for (let i = 0; i <= segments; i++) {
        const rAU = 1.0 + (i / segments) * 175.0;
        const sDist = auToSceneDistance(rAU);
        points.push({ x: dir.x * sDist, y: dir.y * sDist, z: dir.z * sDist });
      }
      return points;
    }

    case 'voyager-2': {
      const dir = raDecToEclipticVector(20.0, -62.0);
      for (let i = 0; i <= segments; i++) {
        const rAU = 1.0 + (i / segments) * 150.0;
        const sDist = auToSceneDistance(rAU);
        points.push({ x: dir.x * sDist, y: dir.y * sDist, z: dir.z * sDist });
      }
      return points;
    }

    case 'pioneer-10': {
      const dir = raDecToEclipticVector(4.5, 26.0);
      for (let i = 0; i <= segments; i++) {
        const rAU = 1.0 + (i / segments) * 145.0;
        const sDist = auToSceneDistance(rAU);
        points.push({ x: dir.x * sDist, y: dir.y * sDist, z: dir.z * sDist });
      }
      return points;
    }

    case 'pioneer-11': {
      const dir = raDecToEclipticVector(18.83, -8.5);
      for (let i = 0; i <= segments; i++) {
        const rAU = 1.0 + (i / segments) * 125.0;
        const sDist = auToSceneDistance(rAU);
        points.push({ x: dir.x * sDist, y: dir.y * sDist, z: dir.z * sDist });
      }
      return points;
    }

    case 'new-horizons': {
      const dir = raDecToEclipticVector(19.08, -20.5);
      for (let i = 0; i <= segments; i++) {
        const rAU = 1.0 + (i / segments) * 90.0;
        const sDist = auToSceneDistance(rAU);
        points.push({ x: dir.x * sDist, y: dir.y * sDist, z: dir.z * sDist });
      }
      return points;
    }

    case 'parker-solar-probe': {
      // Full highly eccentric ellipse: a = 0.388 AU, e = 0.881
      const a = 0.388;
      const e = 0.881;
      const perihelionAngle = 0.85;

      for (let i = 0; i <= segments; i++) {
        const E = (i / segments) * Math.PI * 2;
        const rAU = a * (1 - e * Math.cos(E));
        const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
        const theta = nu + perihelionAngle;
        const sDist = auToSceneDistance(rAU);

        points.push({
          x: Math.cos(theta) * sDist,
          y: Math.sin(nu) * 0.15,
          z: Math.sin(theta) * sDist,
        });
      }
      return points;
    }

    case 'kepler': {
      // Earth-trailing drift ellipse: a = 1.013 AU, e = 0.035
      const a = 1.013;
      const e = 0.035;
      for (let i = 0; i <= segments; i++) {
        const E = (i / segments) * Math.PI * 2;
        const rAU = a * (1 - e * Math.cos(E));
        const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
        const theta = nu + 1.2;
        const sDist = auToSceneDistance(rAU);
        points.push({
          x: Math.cos(theta) * sDist,
          y: 0.25,
          z: Math.sin(theta) * sDist,
        });
      }
      return points;
    }

    case 'near-shoemaker':
    case 'osiris-rex':
    case 'dart':
    case 'deep-impact': {
      // Sample asteroid/comet rendezvous orbits
      const a = hardwareId === 'near-shoemaker' ? 1.458 : hardwareId === 'dart' ? 1.644 : hardwareId === 'deep-impact' ? 3.12 : 1.126;
      const e = hardwareId === 'deep-impact' ? 0.517 : 0.22;
      for (let i = 0; i <= segments; i++) {
        const E = (i / segments) * Math.PI * 2;
        const rAU = a * (1 - e * Math.cos(E));
        const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
        const sDist = auToSceneDistance(rAU);
        points.push({
          x: Math.cos(nu) * sDist,
          y: 0.15,
          z: Math.sin(nu) * sDist,
        });
      }
      return points;
    }

    default: {
      // Generic circular trail
      const state = getHardwarePosition(hardwareId, BASE_YEAR);
      const rScene = Math.sqrt(state.positionScene.x * state.positionScene.x + state.positionScene.z * state.positionScene.z);
      for (let i = 0; i <= segments; i++) {
        const th = (i / segments) * Math.PI * 2;
        points.push({
          x: Math.cos(th) * rScene,
          y: state.positionScene.y,
          z: Math.sin(th) * rScene,
        });
      }
      return points;
    }
  }
}

/**
 * Generates Keplerian orbital path points for any planet
 */
export function getPlanetOrbitPath(
  planetId: string,
  segments = 144
): Vector3D[] {
  const elem = PLANETARY_ELEMENTS[planetId.toLowerCase()] || PLANETARY_ELEMENTS.earth;
  const points: Vector3D[] = [];

  const omegaPeriRad = (elem.omegaPeriDeg * Math.PI) / 180;
  const iRad = (elem.iDeg * Math.PI) / 180;
  const nodeRad = (elem.nodeDeg * Math.PI) / 180;

  for (let s = 0; s <= segments; s++) {
    const E = (s / segments) * Math.PI * 2;
    const rAU = elem.a * (1 - elem.e * Math.cos(E));
    const cosNu = (Math.cos(E) - elem.e) / (1 - elem.e * Math.cos(E));
    const sinNu = (Math.sqrt(1 - elem.e * elem.e) * Math.sin(E)) / (1 - elem.e * Math.cos(E));
    const nu = Math.atan2(sinNu, cosNu);

    const u = nu + omegaPeriRad;
    const xOrb = rAU * Math.cos(u);
    const yOrb = rAU * Math.sin(u);

    const xAU = xOrb * Math.cos(nodeRad) - yOrb * Math.sin(nodeRad) * Math.cos(iRad);
    const zAU = xOrb * Math.sin(nodeRad) + yOrb * Math.cos(nodeRad) * Math.cos(iRad);
    const yAU = yOrb * Math.sin(iRad);

    const sceneDist = auToSceneDistance(rAU);
    const scale = sceneDist / rAU;

    points.push({
      x: xAU * scale,
      y: yAU * scale,
      z: zAU * scale,
    });
  }

  return points;
}

export const ALL_HARDWARE_IDS = [
  'pioneer-10',
  'pioneer-11',
  'near-shoemaker',
  'dawn',
  'kepler',
];

/**
 * High-level propagation function that returns the full system state
 * at a given simulation timestamp (in fractional years, e.g., 2026.5)
 */
export function updateSolarSystem(
  timeInYears: number = BASE_YEAR,
  hardwareIds: string[] = ALL_HARDWARE_IDS
): SolarSystemState {
  const planetsMap = new Map<string, PlanetState>();
  const hardwareMap = new Map<string, HardwareTrajectory>();

  // Propagate all planets
  Object.keys(PLANETARY_ELEMENTS).forEach((pid) => {
    planetsMap.set(pid, getPlanetPosition(pid, timeInYears));
  });

  // Propagate all requested deep space hardware
  hardwareIds.forEach((hid) => {
    hardwareMap.set(hid, getHardwarePosition(hid, timeInYears));
  });

  // Calculate formatted Gregorian date string
  const yearInt = Math.floor(timeInYears);
  const frac = timeInYears - yearInt;
  const dayOfYear = Math.floor(frac * 365.25);
  const dateObj = new Date(Date.UTC(yearInt, 0, 1));
  dateObj.setUTCDate(dateObj.getUTCDate() + dayOfYear);
  const dateString = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return {
    timestampYears: timeInYears,
    dateString,
    planets: planetsMap,
    hardware: hardwareMap,
  };
}
