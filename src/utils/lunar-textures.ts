import * as THREE from 'three';

// Coordinate projection helper: converts lunar (lat, lon) in degrees to canvas pixel (x, y)
export function latLonToPixel(
  lat: number,
  lon: number,
  width: number,
  height: number
): { x: number; y: number } {
  // Normalize lon to [-180, 180]
  let normalizedLon = lon;
  while (normalizedLon > 180) normalizedLon -= 360;
  while (normalizedLon < -180) normalizedLon += 360;

  const x = ((normalizedLon + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}

// Draw a realistic impact crater with raised rim, depressed interior, and optional central peak
export function drawCrater(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  lat: number,
  lon: number,
  radiusKm: number,
  options: {
    hasCentralPeak?: boolean;
    hasRaySystem?: boolean;
    rayLengthMultiplier?: number;
    rayCount?: number;
    isDarkFloor?: boolean;
    rimBrightness?: number;
  } = {}
) {
  const { x, y } = latLonToPixel(lat, lon, width, height);

  // Convert km radius to pixels (Moon circumference is ~10,921 km)
  const kmPerPixelX = 10921 / width;
  const r = Math.max(3, (radiusKm / kmPerPixelX) * Math.cos((lat * Math.PI) / 180));

  // 1. Bright Ejecta Rays (for young craters like Tycho, Copernicus, Kepler)
  if (options.hasRaySystem) {
    const rayLength = r * (options.rayLengthMultiplier || 12);
    const count = options.rayCount || 24;
    ctx.save();
    for (let i = 0; i < count; i++) {
      const angle = (i * Math.PI * 2) / count + (Math.random() - 0.5) * 0.2;
      const len = rayLength * (0.6 + Math.random() * 0.7);
      const grad = ctx.createLinearGradient(x, y, x + Math.cos(angle) * len, y + Math.sin(angle) * len);
      grad.addColorStop(0, 'rgba(240, 245, 255, 0.45)');
      grad.addColorStop(0.3, 'rgba(230, 240, 255, 0.2)');
      grad.addColorStop(1, 'rgba(230, 240, 255, 0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(1, r * 0.18 * (0.5 + Math.random()));
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
      ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 2. Raised Outer Rim (bright crest)
  ctx.save();
  const rimGrad = ctx.createRadialGradient(x, y, r * 0.75, x, y, r * 1.35);
  const rimAlpha = options.rimBrightness || 0.7;
  rimGrad.addColorStop(0, 'rgba(40, 42, 48, 0.8)');
  rimGrad.addColorStop(0.7, `rgba(220, 225, 235, ${rimAlpha})`);
  rimGrad.addColorStop(1, 'rgba(160, 165, 175, 0)');

  ctx.fillStyle = rimGrad;
  ctx.beginPath();
  ctx.arc(x, y, r * 1.35, 0, Math.PI * 2);
  ctx.fill();

  // 3. Crater Floor
  ctx.fillStyle = options.isDarkFloor ? '#1e2025' : '#454850';
  ctx.beginPath();
  ctx.arc(x, y, r * 0.82, 0, Math.PI * 2);
  ctx.fill();

  // 4. Subtle interior shadow (simulating sun from left)
  const shadowGrad = ctx.createRadialGradient(x + r * 0.2, y, 0, x, y, r * 0.8);
  shadowGrad.addColorStop(0, 'rgba(20, 22, 26, 0.55)');
  shadowGrad.addColorStop(1, 'rgba(180, 185, 195, 0.1)');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.8, 0, Math.PI * 2);
  ctx.fill();

  // 5. Central Peak
  if (options.hasCentralPeak) {
    ctx.fillStyle = '#f0f3fa';
    ctx.beginPath();
    ctx.arc(x, y, Math.max(1.5, r * 0.15), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Generate geographically authentic Lunar Albedo (Color) Map with adaptive detail
export function createGeographicLunarTexture(
  width = 1024,
  height = 512,
  detailLevel: 'base' | 'high' | 'ultra' = 'base'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 1. Base Lunar Highlands (Anorthosite crust - silver-gray regolith)
  ctx.fillStyle = '#8e929c';
  ctx.fillRect(0, 0, width, height);

  // Micro-noise for powdery lunar regolith
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const noiseScale = detailLevel === 'ultra' ? 36 : 24;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * noiseScale;
    data[i] = Math.min(255, Math.max(0, data[i] + n));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n));
  }
  ctx.putImageData(imgData, 0, 0);

  // 2. Accurate Lunar Maria (Dark Volcanic Basaltic Lava Plains)
  // Each mare drawn at exact geographical latitude and longitude bounds
  ctx.fillStyle = 'rgba(32, 35, 42, 0.78)';

  const drawMareEllipse = (
    lat: number,
    lon: number,
    radiusKmLat: number,
    radiusKmLon: number,
    rotationRad = 0
  ) => {
    const { x, y } = latLonToPixel(lat, lon, width, height);
    const rx = ((radiusKmLon / 10921) * width) / Math.max(0.2, Math.cos((lat * Math.PI) / 180));
    const ry = (radiusKmLat / 5460) * height;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotationRad);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // Oceanus Procellarum (Ocean of Storms - vast western expanse)
  drawMareEllipse(20, -50, 950, 750, -0.15);
  drawMareEllipse(0, -40, 700, 600, 0.1);
  drawMareEllipse(-15, -45, 600, 500, 0);

  // Mare Imbrium (Sea of Rains - 33°N, 16°W)
  drawMareEllipse(33, -16, 600, 650, 0.05);

  // Mare Serenitatis (Sea of Serenity - 28°N, 17°E)
  drawMareEllipse(28, 17, 360, 380, 0);

  // Mare Tranquilitatis (Sea of Tranquility - Apollo 11 at 8°N, 31°E)
  drawMareEllipse(8, 31, 440, 480, 0.2);

  // Mare Crisium (Sea of Crises - 17°N, 59°E)
  drawMareEllipse(17, 59, 280, 310, 0);

  // Mare Fecunditatis (Sea of Fertility - 8°S, 51°E)
  drawMareEllipse(-8, 51, 420, 380, -0.2);

  // Mare Nectaris (Sea of Nectar - 15°S, 35°E)
  drawMareEllipse(-15, 35, 230, 220, 0);

  // Mare Nubium (Sea of Clouds - 21°S, 17°W)
  drawMareEllipse(-21, -17, 380, 380, 0);

  // Mare Humorum (Sea of Moisture - 24°S, 38°W)
  drawMareEllipse(-24, -38, 220, 210, 0);

  // Mare Frigoris (Sea of Cold - long northern strip near 56°N)
  drawMareEllipse(56, 1, 140, 800, 0);

  // Mare Orientale (Western limb concentric rings - 20°S, 95°W)
  drawMareEllipse(-20, -95, 450, 450, 0);

  // Far-Side: Tsiolkovsky Crater (Dark basalt floor - 20°S, 129°E)
  drawMareEllipse(-20, 129, 120, 120, 0);

  // Far-Side: Mare Moscoviense (27°N, 147°E)
  drawMareEllipse(27, 147, 160, 160, 0);

  // 3. Mountain Ranges (Montes Apenninus, Caucasus, Alpes)
  const drawRidge = (
    pts: Array<{ lat: number; lon: number }>,
    color = '#cbd2e0',
    widthPx = 3
  ) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = widthPx;
    ctx.lineCap = 'round';
    ctx.beginPath();
    pts.forEach((p, idx) => {
      const pix = latLonToPixel(p.lat, p.lon, width, height);
      if (idx === 0) ctx.moveTo(pix.x, pix.y);
      else ctx.lineTo(pix.x, pix.y);
    });
    ctx.stroke();
    ctx.restore();
  };

  // Montes Apenninus (Border of Mare Imbrium - Apollo 15 site!)
  drawRidge([
    { lat: 18, lon: -2 },
    { lat: 21, lon: 0 },
    { lat: 25, lon: 3 },
    { lat: 28, lon: 6 },
  ]);

  // Montes Caucasus
  drawRidge([
    { lat: 31, lon: 7 },
    { lat: 38, lon: 10 },
  ]);

  // Montes Alpes & Vallis Alpes
  drawRidge([
    { lat: 45, lon: -1 },
    { lat: 50, lon: -5 },
  ]);

  // 4. Prominent Impact Craters with Geographically Accurate Positions
  // Tycho: 43.3°S, 11.2°W, 85 km diameter with massive ray system!
  drawCrater(ctx, width, height, -43.3, -11.2, 55, {
    hasCentralPeak: true,
    hasRaySystem: true,
    rayLengthMultiplier: 16,
    rayCount: 32,
    rimBrightness: 0.95,
  });

  // Copernicus: 9.6°N, 20.1°W, 93 km diameter with ray system
  drawCrater(ctx, width, height, 9.6, -20.1, 58, {
    hasCentralPeak: true,
    hasRaySystem: true,
    rayLengthMultiplier: 8,
    rayCount: 20,
    rimBrightness: 0.9,
  });

  // Kepler: 8.1°N, 38.0°W, 32 km
  drawCrater(ctx, width, height, 8.1, -38.0, 32, {
    hasRaySystem: true,
    rayLengthMultiplier: 6,
    rayCount: 16,
    rimBrightness: 0.85,
  });

  // Aristarchus: 23.7°N, 47.4°W (Ultra-bright high-albedo plateau!)
  drawCrater(ctx, width, height, 23.7, -47.4, 40, {
    hasCentralPeak: true,
    rimBrightness: 1.0,
  });

  // Plato: 51.6°N, 9.3°W, 101 km (Dark lava-filled floor)
  drawCrater(ctx, width, height, 51.6, -9.3, 62, {
    isDarkFloor: true,
    rimBrightness: 0.75,
  });

  // Archimedes: 29.7°N, 4.0°W, 83 km
  drawCrater(ctx, width, height, 29.7, -4.0, 52, {
    isDarkFloor: true,
    rimBrightness: 0.7,
  });

  // Clavius: 58.4°S, 14.4°W, 231 km (Gigantic southern crater)
  drawCrater(ctx, width, height, -58.4, -14.4, 115, {
    isDarkFloor: false,
    rimBrightness: 0.8,
  });

  // Langrenus: 8.9°S, 61.1°E, 132 km
  drawCrater(ctx, width, height, -8.9, 61.1, 75, {
    hasCentralPeak: true,
    rimBrightness: 0.8,
  });

  // Cabeus (LCROSS Water Ice crater near South Pole): -84.7°S, -48.7°E
  drawCrater(ctx, width, height, -84.7, -48.7, 50, {
    isDarkFloor: true,
    rimBrightness: 0.65,
  });

  // Far-Side Craters (Jackson, Korolev, Hertzsprung)
  drawCrater(ctx, width, height, 22.4, -163.3, 45, {
    hasRaySystem: true,
    rayLengthMultiplier: 10,
    rimBrightness: 0.9,
  });
  drawCrater(ctx, width, height, 4.0, -157.0, 95, { rimBrightness: 0.7 });
  drawCrater(ctx, width, height, 1.5, -128.5, 120, { rimBrightness: 0.7 });

  // 5. Scatter hundreds of realistic medium & small craters across the highlands
  const seedRandom = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 0; i < 180; i++) {
    const rLat = (seedRandom(i * 3 + 1) - 0.5) * 160;
    const rLon = (seedRandom(i * 3 + 2) - 0.5) * 360;
    const sizeKm = 15 + seedRandom(i * 3 + 3) * 45;

    // Skip central parts of major maria to preserve smooth plains
    const inImbrium = Math.hypot(rLat - 33, rLon - (-16)) < 14;
    const inSerenitatis = Math.hypot(rLat - 28, rLon - 17) < 9;
    const inTranquility = Math.hypot(rLat - 8, rLon - 31) < 11;
    if (inImbrium || inSerenitatis || inTranquility) continue;

    drawCrater(ctx, width, height, rLat, rLon, sizeKm, {
      rimBrightness: 0.4 + seedRandom(i) * 0.35,
    });
  }

  // 6. High-detail zoom features (Crater terraces, secondary rays, micro-regolith)
  if (detailLevel !== 'base') {
    // Copernicus terrace rings
    const cop = latLonToPixel(9.6, -20.1, width, height);
    ctx.strokeStyle = 'rgba(230, 235, 245, 0.45)';
    ctx.lineWidth = Math.max(1, width * 0.0015);
    ctx.beginPath();
    ctx.arc(cop.x, cop.y, width * 0.016, 0, Math.PI * 2);
    ctx.stroke();

    // Tycho central peak detail & ray filaments
    const tyc = latLonToPixel(-43.3, -11.2, width, height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = Math.max(1, width * 0.001);
    ctx.beginPath();
    ctx.arc(tyc.x, tyc.y, width * 0.012, 0, Math.PI * 2);
    ctx.stroke();

    // Secondary craterlets in highlands
    for (let j = 0; j < (detailLevel === 'ultra' ? 120 : 60); j++) {
      const sjLat = (seedRandom(j * 7 + 10) - 0.5) * 150;
      const sjLon = (seedRandom(j * 7 + 20) - 0.5) * 360;
      const pix = latLonToPixel(sjLat, sjLon, width, height);
      ctx.fillStyle = 'rgba(240, 245, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(pix.x, pix.y, Math.max(0.8, width * 0.0012), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter; // Guarantees zero pixelation when zoomed in
  return texture;
}

// Generate matching Lunar Canvas element for WebGL / Cesium / 2D use
export function createGeographicLunarCanvas(width = 1024, height = 512): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Highland Regolith Base
  ctx.fillStyle = '#6e737c';
  ctx.fillRect(0, 0, width, height);

  // Subtle tonal variation
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#5a5e66');
  grad.addColorStop(0.5, '#757a84');
  grad.addColorStop(1, '#5a5e66');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  const drawMare = (lat: number, lon: number, rLatKm: number, rLonKm: number, color = '#2c2f35') => {
    const { x, y } = latLonToPixel(lat, lon, width, height);
    const rx = ((rLonKm / 10921) * width) / Math.max(0.2, Math.cos((lat * Math.PI) / 180));
    const ry = (rLatKm / 5460) * height;

    const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry));
    g.addColorStop(0, color);
    g.addColorStop(0.7, color);
    g.addColorStop(1, 'rgba(110, 115, 124, 0)');

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  // Near-Side Major Maria (Oceanus Procellarum, Imbrium, Serenitatis, Tranquilitatis, Crisium, Nubium, etc.)
  drawMare(20, -50, 900, 700, '#22252a'); // Oceanus Procellarum
  drawMare(33, -16, 580, 620, '#26292f'); // Mare Imbrium
  drawMare(28, 17, 350, 370, '#272a30'); // Mare Serenitatis
  drawMare(8, 31, 420, 460, '#282c32'); // Mare Tranquillitatis
  drawMare(17, 59, 270, 300, '#25282e'); // Mare Crisium
  drawMare(-3, 50, 400, 430, '#282b31'); // Mare Fecunditatis
  drawMare(-15, 35, 230, 240, '#292c32'); // Mare Nectaris
  drawMare(-21, -17, 360, 370, '#282b31'); // Mare Nubium
  drawMare(-24, -39, 210, 230, '#272a30'); // Mare Humorum
  drawMare(14, 5, 220, 240, '#292c33'); // Sinus Aestuum

  // Prominent Craters with Accurate Coordinates
  drawCrater(ctx, width, height, -43.3, -11.2, 55, {
    hasCentralPeak: true,
    hasRaySystem: true,
    rayLengthMultiplier: 16,
    rayCount: 32,
    rimBrightness: 0.95,
  }); // Tycho
  drawCrater(ctx, width, height, 9.6, -20.1, 58, {
    hasCentralPeak: true,
    hasRaySystem: true,
    rayLengthMultiplier: 8,
    rayCount: 20,
    rimBrightness: 0.9,
  }); // Copernicus
  drawCrater(ctx, width, height, 8.1, -38.0, 32, {
    hasRaySystem: true,
    rayLengthMultiplier: 6,
    rayCount: 16,
    rimBrightness: 0.85,
  }); // Kepler
  drawCrater(ctx, width, height, 23.7, -47.4, 40, {
    hasRaySystem: true,
    rayLengthMultiplier: 7,
    rimBrightness: 1.0,
  }); // Aristarchus
  drawCrater(ctx, width, height, 51.6, -9.3, 50, {
    isDarkFloor: true,
    rimBrightness: 0.75,
  }); // Plato

  return canvas;
}

// Generate matching Lunar Bump/Elevation Map (White = elevated rims/peaks, Dark = deep floors)
export function createGeographicLunarBumpMap(width = 1024, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Neutral gray base elevation
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, width, height);

  // Maria are depressed lowlands (Darker gray)
  ctx.fillStyle = '#555555';

  const drawMareDepression = (lat: number, lon: number, rLatKm: number, rLonKm: number) => {
    const { x, y } = latLonToPixel(lat, lon, width, height);
    const rx = ((rLonKm / 10921) * width) / Math.max(0.2, Math.cos((lat * Math.PI) / 180));
    const ry = (rLatKm / 5460) * height;

    const grad = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry));
    grad.addColorStop(0, '#3a3a3a');
    grad.addColorStop(0.75, '#4f4f4f');
    grad.addColorStop(1, '#808080');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  drawMareDepression(33, -16, 600, 650); // Imbrium
  drawMareDepression(20, -50, 950, 750); // Oceanus Procellarum
  drawMareDepression(28, 17, 360, 380); // Serenitatis
  drawMareDepression(8, 31, 440, 480); // Tranquilitatis
  drawMareDepression(17, 59, 280, 310); // Crisium
  drawMareDepression(-21, -17, 380, 380); // Nubium

  // Draw crater elevation profiles (Rims = Bright, Floor = Dark)
  const drawBumpCrater = (lat: number, lon: number, radiusKm: number, hasPeak = false) => {
    const { x, y } = latLonToPixel(lat, lon, width, height);
    const kmPerPixelX = 10921 / width;
    const r = Math.max(3, (radiusKm / kmPerPixelX) * Math.cos((lat * Math.PI) / 180));

    // Raised rim
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(2, r * 0.22);
    ctx.beginPath();
    ctx.arc(x, y, r * 0.95, 0, Math.PI * 2);
    ctx.stroke();

    // Depressed floor
    ctx.fillStyle = '#222222';
    ctx.beginPath();
    ctx.arc(x, y, r * 0.75, 0, Math.PI * 2);
    ctx.fill();

    // Central peak
    if (hasPeak) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, Math.max(1.5, r * 0.18), 0, Math.PI * 2);
      ctx.fill();
    }
  };

  drawBumpCrater(-43.3, -11.2, 55, true); // Tycho
  drawBumpCrater(9.6, -20.1, 58, true); // Copernicus
  drawBumpCrater(8.1, -38.0, 32, false); // Kepler
  drawBumpCrater(23.7, -47.4, 40, true); // Aristarchus
  drawBumpCrater(51.6, -9.3, 62, false); // Plato
  drawBumpCrater(29.7, -4.0, 52, false); // Archimedes
  drawBumpCrater(-58.4, -14.4, 115, false); // Clavius
  drawBumpCrater(-84.7, -48.7, 50, false); // Cabeus

  // Apennines Mountain Elevation Ridge (bright white crests)
  const drawBumpRidge = (pts: Array<{ lat: number; lon: number }>) => {
    ctx.save();
    ctx.strokeStyle = '#f5f5f5';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    pts.forEach((p, idx) => {
      const pix = latLonToPixel(p.lat, p.lon, width, height);
      if (idx === 0) ctx.moveTo(pix.x, pix.y);
      else ctx.lineTo(pix.x, pix.y);
    });
    ctx.stroke();
    ctx.restore();
  };

  drawBumpRidge([
    { lat: 18, lon: -2 },
    { lat: 21, lon: 0 },
    { lat: 25, lon: 3 },
    { lat: 28, lon: 6 },
  ]);

  const bumpTexture = new THREE.CanvasTexture(canvas);
  bumpTexture.wrapS = THREE.RepeatWrapping;
  bumpTexture.wrapT = THREE.ClampToEdgeWrapping;
  bumpTexture.generateMipmaps = true;
  bumpTexture.minFilter = THREE.LinearMipmapLinearFilter;
  bumpTexture.magFilter = THREE.LinearFilter;
  return bumpTexture;
}

// Generate geographically authentic Martian Albedo Canvas
export function createGeographicMarsCanvas(width = 1024, height = 512): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Base rust-red terrain
  ctx.fillStyle = '#b34728';
  ctx.fillRect(0, 0, width, height);

  // Procedural noise for Martian desert
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * 25;
    data[i] = Math.min(255, Math.max(0, data[i] + n));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n * 0.6));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n * 0.3));
  }
  ctx.putImageData(imgData, 0, 0);

  // Darker basaltic volcanic terrains (Syrtis Major, Acidalia Planitia)
  ctx.fillStyle = 'rgba(55, 24, 15, 0.65)';
  const drawMarsFeature = (lat: number, lon: number, rX: number, rY: number) => {
    const { x, y } = latLonToPixel(lat, lon, width, height);
    ctx.beginPath();
    ctx.ellipse(x, y, rX, rY, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  drawMarsFeature(10, 70, 180, 140); // Syrtis Major
  drawMarsFeature(45, -30, 260, 150); // Acidalia Planitia
  drawMarsFeature(-25, -40, 200, 120); // Mare Erythraeum

  // Valles Marineris (14°S, -60° to -90° lon)
  const vStart = latLonToPixel(-14, -90, width, height);
  const vEnd = latLonToPixel(-14, -40, width, height);
  ctx.strokeStyle = '#2b1007';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(vStart.x, vStart.y);
  ctx.quadraticCurveTo((vStart.x + vEnd.x) / 2, vStart.y + 15, vEnd.x, vEnd.y);
  ctx.stroke();

  // Olympus Mons (18.6°N, -134° lon / 226°E)
  const oPix = latLonToPixel(18.6, -134, width, height);
  ctx.fillStyle = '#9c381c';
  ctx.beginPath();
  ctx.arc(oPix.x, oPix.y, 45, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3d140a';
  ctx.beginPath();
  ctx.arc(oPix.x, oPix.y, 14, 0, Math.PI * 2);
  ctx.fill();

  // Polar Ice Caps
  ctx.fillStyle = 'rgba(245, 250, 255, 0.9)';
  ctx.beginPath();
  ctx.ellipse(width / 2, 28, width / 2, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(width / 2, height - 25, width * 0.4, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

// Generate geographically authentic Martian Albedo Map for Three.js
export function createGeographicMarsTexture(width = 2048, height = 1024): THREE.CanvasTexture {
  const canvas = createGeographicMarsCanvas(width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
