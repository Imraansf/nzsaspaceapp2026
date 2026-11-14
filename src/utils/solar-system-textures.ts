import * as THREE from 'three';

// Cache generated textures so they are created once and reused
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Procedural Sun Texture:
 * Convective granulation, bright solar flares, and turbulent sunspot zones
 */
export function createSunTexture(width = 1024, height = 512): THREE.CanvasTexture {
  const cacheKey = `sun_${width}_${height}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Base radiant gradient
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#fff3a8');
  grad.addColorStop(0.5, '#ffbb22');
  grad.addColorStop(1, '#ff8800');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Solar convection granulation & turbulent cells
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const noise =
        Math.sin(x * 0.08) * Math.cos(y * 0.08) * 20 +
        Math.sin(x * 0.2 + y * 0.15) * 15 +
        (Math.random() - 0.5) * 25;

      data[idx] = Math.min(255, Math.max(220, data[idx] + noise * 0.8)); // R
      data[idx + 1] = Math.min(255, Math.max(140, data[idx + 1] + noise * 1.2)); // G
      data[idx + 2] = Math.min(255, Math.max(10, data[idx + 2] + noise * 0.5)); // B
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // Solar flares and active magnetic regions
  ctx.fillStyle = 'rgba(255, 255, 230, 0.45)';
  for (let i = 0; i < 18; i++) {
    const cx = Math.random() * width;
    const cy = height * 0.3 + Math.random() * height * 0.4;
    const r = 15 + Math.random() * 45;
    const flareGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    flareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    flareGrad.addColorStop(0.5, 'rgba(255, 210, 80, 0.3)');
    flareGrad.addColorStop(1, 'rgba(255, 140, 0, 0)');
    ctx.fillStyle = flareGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Procedural Mercury Texture:
 * Desolate grey-brown silicate crust with heavy cratering and impact plains (Caloris Basin)
 */
export function createMercuryTexture(width = 1024, height = 512): THREE.CanvasTexture {
  const cacheKey = `mercury_${width}_${height}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Base metallic silicate grey
  ctx.fillStyle = '#7a7672';
  ctx.fillRect(0, 0, width, height);

  // Large impact plains
  for (let i = 0; i < 8; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    const r = 60 + Math.random() * 90;
    const pGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    pGrad.addColorStop(0, 'rgba(95, 90, 85, 0.5)');
    pGrad.addColorStop(1, 'rgba(122, 118, 114, 0)');
    ctx.fillStyle = pGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Cratering noise
  for (let i = 0; i < 240; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    const r = 2 + Math.random() * 12;
    ctx.fillStyle = 'rgba(40, 38, 36, 0.6)';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Raised rim
    ctx.strokeStyle = 'rgba(180, 175, 170, 0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Procedural Venus Texture:
 * Dense opaque sulfuric acid and carbon dioxide atmosphere with yellowish cloud bands
 */
export function createVenusTexture(width = 1024, height = 512): THREE.CanvasTexture {
  const cacheKey = `venus_${width}_${height}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Pale amber/buttercream base
  ctx.fillStyle = '#e8c99b';
  ctx.fillRect(0, 0, width, height);

  // Swirling zonal atmospheric wind bands
  for (let y = 0; y < height; y += 4) {
    const v = Math.sin(y * 0.05) * 0.5 + Math.cos(y * 0.02) * 0.5;
    const alpha = 0.12 + Math.abs(v) * 0.2;
    ctx.fillStyle = y % 8 === 0 ? `rgba(215, 175, 120, ${alpha})` : `rgba(250, 235, 195, ${alpha})`;
    ctx.fillRect(0, y, width, 4);
  }

  // Planetary chevron clouds
  ctx.strokeStyle = 'rgba(190, 150, 95, 0.15)';
  ctx.lineWidth = 16;
  ctx.beginPath();
  for (let x = 0; x < width; x += 30) {
    ctx.moveTo(x, 0);
    ctx.quadraticCurveTo(x + 50, height * 0.5, x, height);
  }
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Procedural Earth Texture:
 * Deep blue oceans, continental landmasses (Africa, Americas, Eurasia), ice caps, and cloud swirl overlay
 */
export function createEarthTexture(width = 1024, height = 512): THREE.CanvasTexture {
  const cacheKey = `earth_${width}_${height}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Deep oceanic blue
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#102542');
  oceanGrad.addColorStop(0.5, '#143666');
  oceanGrad.addColorStop(1, '#0e2038');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Simplified Continents Representation
  ctx.fillStyle = '#2d5a37'; // Foliage green

  // North America & South America
  ctx.beginPath();
  ctx.ellipse(width * 0.22, height * 0.32, width * 0.09, height * 0.14, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(width * 0.28, height * 0.65, width * 0.06, height * 0.18, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Eurasia & Africa
  ctx.fillStyle = '#485e3a';
  ctx.beginPath();
  ctx.ellipse(width * 0.62, height * 0.30, width * 0.16, height * 0.13, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#7a6f4d'; // Sahara / Savannah
  ctx.beginPath();
  ctx.ellipse(width * 0.54, height * 0.54, width * 0.08, height * 0.16, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Australia
  ctx.fillStyle = '#8a6538';
  ctx.beginPath();
  ctx.ellipse(width * 0.82, height * 0.70, width * 0.05, height * 0.07, 0, 0, Math.PI * 2);
  ctx.fill();

  // Polar Ice Caps (Arctic and Antarctic)
  ctx.fillStyle = '#f0f6ff';
  ctx.fillRect(0, 0, width, height * 0.08); // North Pole
  ctx.fillRect(0, height * 0.90, width, height * 0.10); // Antarctica

  // Swirling White Clouds Layer
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  for (let i = 0; i < 40; i++) {
    const cx = Math.random() * width;
    const cy = height * 0.15 + Math.random() * height * 0.7;
    const rx = 40 + Math.random() * 90;
    const ry = 8 + Math.random() * 22;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, (Math.random() - 0.5) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Procedural Mars Texture:
 * Iron-oxide rust red with darker basaltic volcanic regions (Syrtis Major, Valles Marineris) and polar ice
 */
export function createMarsTexture(width = 1024, height = 512): THREE.CanvasTexture {
  const cacheKey = `mars_${width}_${height}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Rust orange/red base
  const rustGrad = ctx.createLinearGradient(0, 0, 0, height);
  rustGrad.addColorStop(0, '#c45a2c');
  rustGrad.addColorStop(0.5, '#b04922');
  rustGrad.addColorStop(1, '#963c1a');
  ctx.fillStyle = rustGrad;
  ctx.fillRect(0, 0, width, height);

  // Dark volcanic basalt regions (Syrtis Major, Acidalia Planitia)
  ctx.fillStyle = 'rgba(70, 35, 20, 0.55)';
  for (let i = 0; i < 9; i++) {
    const cx = (i * 0.12 + 0.1) * width;
    const cy = height * 0.45 + (Math.sin(i) * height * 0.15);
    const rx = 50 + Math.random() * 80;
    const ry = 30 + Math.random() * 50;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Polar Ice Caps
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.04, width * 0.25, height * 0.04, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.96, width * 0.20, height * 0.04, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Procedural Jupiter Texture:
 * Alternating atmospheric ammonia/methane cloud belts, swirling storms, and the iconic Great Red Spot
 */
export function createJupiterTexture(width = 1024, height = 512): THREE.CanvasTexture {
  const cacheKey = `jupiter_${width}_${height}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Jupiter color palette bands
  const colors = [
    '#e3d3b6', // Polar haze
    '#c89f74', // North North Temperate Belt
    '#eddac2', // North Temperate Zone
    '#a86d44', // North Equatorial Belt
    '#f5ebdc', // Equatorial Zone
    '#b36d3f', // South Equatorial Belt (contains GRS)
    '#ecd6be', // South Tropical Zone
    '#9e6c46', // South Temperate Belt
    '#d6c1a4', // South Polar Region
  ];

  const bandHeight = height / colors.length;
  colors.forEach((col, idx) => {
    ctx.fillStyle = col;
    ctx.fillRect(0, idx * bandHeight, width, bandHeight);
  });

  // Wavy turbulence along belt boundaries
  for (let i = 0; i < colors.length - 1; i++) {
    const y = (i + 1) * bandHeight;
    ctx.strokeStyle = 'rgba(70, 35, 15, 0.35)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x < width; x += 15) {
      const dy = Math.sin(x * 0.04) * 4 + Math.cos(x * 0.08) * 2;
      ctx.lineTo(x, y + dy);
    }
    ctx.stroke();
  }

  // The Great Red Spot (at ~65% latitude down, 45% x)
  const grsX = width * 0.48;
  const grsY = height * 0.62;
  const grsGrad = ctx.createRadialGradient(grsX, grsY, 5, grsX, grsY, 35);
  grsGrad.addColorStop(0, '#c73b22');
  grsGrad.addColorStop(0.7, '#d95a3a');
  grsGrad.addColorStop(1, 'rgba(215, 120, 80, 0)');
  ctx.fillStyle = grsGrad;
  ctx.beginPath();
  ctx.ellipse(grsX, grsY, 40, 24, 0, 0, Math.PI * 2);
  ctx.fill();

  // White oval storms in temperate belts
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  for (let i = 0; i < 6; i++) {
    const wx = (i * 0.16 + 0.08) * width;
    const wy = height * 0.72;
    ctx.beginPath();
    ctx.ellipse(wx, wy, 10, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Procedural Saturn Texture:
 * Pale golden butterscotch methane cloud bands
 */
export function createSaturnTexture(width = 1024, height = 512): THREE.CanvasTexture {
  const cacheKey = `saturn_${width}_${height}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const colors = [
    '#c8bc96', // Polar hexagon region
    '#ded2b2',
    '#e8dcbe',
    '#d6c59c',
    '#eddcb8',
    '#e0cb9d',
    '#d4bd8f',
    '#c8b68c',
  ];

  const bandHeight = height / colors.length;
  colors.forEach((col, idx) => {
    ctx.fillStyle = col;
    ctx.fillRect(0, idx * bandHeight, width, bandHeight);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Procedural Saturn Rings Texture:
 * Concentric multi-ring structure with distinct A, B, and C rings, and Cassini Division gap
 */
export function createSaturnRingsTexture(size = 512): THREE.CanvasTexture {
  const cacheKey = `saturn_rings_${size}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const center = size / 2;
  const maxRadius = size / 2;

  ctx.clearRect(0, 0, size, size);

  // Concentric ring gradients
  const ringGrad = ctx.createRadialGradient(center, center, maxRadius * 0.45, center, center, maxRadius);
  ringGrad.addColorStop(0, 'rgba(0,0,0,0)'); // Inner transparent
  ringGrad.addColorStop(0.48, 'rgba(160, 140, 110, 0.4)'); // C Ring (crepe ring)
  ringGrad.addColorStop(0.55, 'rgba(215, 195, 150, 0.95)'); // B Ring (densest, brightest)
  ringGrad.addColorStop(0.74, 'rgba(195, 175, 135, 0.9)');
  ringGrad.addColorStop(0.75, 'rgba(0, 0, 0, 0)'); // Cassini Division Gap
  ringGrad.addColorStop(0.79, 'rgba(0, 0, 0, 0)');
  ringGrad.addColorStop(0.80, 'rgba(180, 160, 125, 0.75)'); // A Ring
  ringGrad.addColorStop(0.96, 'rgba(150, 135, 105, 0.4)');
  ringGrad.addColorStop(1.0, 'rgba(0,0,0,0)'); // Outer edge

  ctx.fillStyle = ringGrad;
  ctx.beginPath();
  ctx.arc(center, center, maxRadius, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Procedural Uranus Texture:
 * Pale cyan/aquamarine uniform atmosphere with subtle methane haze
 */
export function createUranusTexture(width = 512, height = 256): THREE.CanvasTexture {
  const cacheKey = `uranus_${width}_${height}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#98e5ed');
  grad.addColorStop(0.5, '#75d3df');
  grad.addColorStop(1, '#62c2ce');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Procedural Neptune Texture:
 * Deep azure electric-blue with upper-atmosphere white methane cirrus streaks
 */
export function createNeptuneTexture(width = 512, height = 256): THREE.CanvasTexture {
  const cacheKey = `neptune_${width}_${height}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#2d59b8');
  grad.addColorStop(0.5, '#3a6fe2');
  grad.addColorStop(1, '#24489a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Great Dark Spot
  ctx.fillStyle = 'rgba(15, 30, 80, 0.6)';
  ctx.beginPath();
  ctx.ellipse(width * 0.4, height * 0.42, 28, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // White methane cloud streaks
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    const y = height * 0.35 + i * 16;
    ctx.beginPath();
    ctx.moveTo(width * 0.2 + i * 20, y);
    ctx.lineTo(width * 0.5 + i * 30, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Procedural Pluto Texture:
 * Muted reddish-brown and tan surface with the bright heart-shaped Tombaugh Regio
 */
export function createPlutoTexture(width = 512, height = 256): THREE.CanvasTexture {
  const cacheKey = `pluto_${width}_${height}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#9c816c';
  ctx.fillRect(0, 0, width, height);

  // Dark tholin patches (Cthulhu Macula)
  ctx.fillStyle = '#543d2f';
  ctx.fillRect(0, height * 0.55, width * 0.45, height * 0.3);

  // Tombaugh Regio (The Heart)
  ctx.fillStyle = '#f3e8dc';
  const hx = width * 0.65;
  const hy = height * 0.52;
  ctx.beginPath();
  ctx.ellipse(hx - 15, hy, 25, 35, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(hx + 15, hy, 25, 35, -0.3, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}
