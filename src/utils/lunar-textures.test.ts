import { test, describe } from 'node:test';
import assert from 'node:assert';
import { latLonToPixel } from './lunar-textures';
import { getLunarLandmarks, LUNAR_LANDMARKS } from './space-data';

describe('Lunar Textures and Landmarks Verification', () => {
  test('latLonToPixel correctly maps lunar coordinates to pixel space', () => {
    const width = 2048;
    const height = 1024;

    // Equator and Prime Meridian (0°, 0°) -> (width/2, height/2)
    const center = latLonToPixel(0, 0, width, height);
    assert.strictEqual(center.x, 1024);
    assert.strictEqual(center.y, 512);

    // North Pole (90°N, 0°) -> y = 0
    const northPole = latLonToPixel(90, 0, width, height);
    assert.strictEqual(northPole.y, 0);

    // South Pole (-90°S, 0°) -> y = height
    const southPole = latLonToPixel(-90, 0, width, height);
    assert.strictEqual(southPole.y, 1024);

    // Date line wraps cleanly
    const east180 = latLonToPixel(0, 180, width, height);
    assert.strictEqual(east180.x, 2048);
  });

  test('LUNAR_LANDMARKS contains benchmark craters and maria', () => {
    const landmarks = getLunarLandmarks();
    assert.ok(landmarks.length >= 8);

    const tycho = landmarks.find((l) => l.id === 'tycho');
    assert.ok(tycho, 'Tycho crater must be present');
    assert.strictEqual(tycho?.type, 'crater');
    assert.strictEqual(tycho?.diameterKm, 85);

    const copernicus = landmarks.find((l) => l.id === 'copernicus');
    assert.ok(copernicus, 'Copernicus crater must be present');
    assert.strictEqual(copernicus?.diameterKm, 93);

    const mareTranquilitatis = landmarks.find((l) => l.id === 'tranquillitatis');
    assert.ok(mareTranquilitatis, 'Mare Tranquilitatis must be present');
    assert.strictEqual(mareTranquilitatis?.associatedArtifactId, 'apollo-11');
  });

  test('All lunar landmarks have valid coordinates within [-90, 90] and [-180, 180]', () => {
    for (const lm of LUNAR_LANDMARKS) {
      assert.ok(
        lm.coordinates.lat >= -90 && lm.coordinates.lat <= 90,
        `Landmark ${lm.name} has invalid latitude: ${lm.coordinates.lat}`
      );
      assert.ok(
        lm.coordinates.lon >= -180 && lm.coordinates.lon <= 180,
        `Landmark ${lm.name} has invalid longitude: ${lm.coordinates.lon}`
      );
    }
  });
});
