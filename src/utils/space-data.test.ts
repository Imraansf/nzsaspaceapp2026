import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MOON_ARTIFACTS,
  MARS_ARTIFACTS,
  DEEP_SPACE_ARTIFACTS,
  getArtifacts,
  getAllArtifacts,
  getArtifactById,
} from './space-data';

test('Exactly 15 artifacts across Moon (4), Mars (6), and Deep Space (5)', () => {
  assert.equal(MOON_ARTIFACTS.length, 4);
  assert.equal(MARS_ARTIFACTS.length, 6);
  assert.equal(DEEP_SPACE_ARTIFACTS.length, 5);
  assert.equal(getAllArtifacts().length, 15);
});

test('MOON_ARTIFACTS includes Apollo 11, Apollo 15, Apollo 12, and Surveyor 3', () => {
  const apollo11 = getArtifactById('apollo-11-eagle-easep');
  assert.ok(apollo11, 'Should include Apollo 11');
  assert.equal(apollo11?.year, 1969);
  assert.equal(apollo11?.body, 'moon');
  assert.ok(apollo11?.youtubeUrl);
});

test('MARS_ARTIFACTS includes Spirit & Opportunity, InSight, Viking 1, Pathfinder, Phoenix, Ingenuity', () => {
  const rovers = getArtifactById('spirit-and-opportunity');
  assert.ok(rovers, 'Should include Spirit & Opportunity');
  assert.equal(rovers?.coordinates.secondaryLat, -2.28);
  assert.equal(rovers?.coordinates.secondaryLon, 354.77);
});

test('getArtifacts returns correct list by body', () => {
  const moon = getArtifacts('moon');
  const mars = getArtifacts('mars');
  const deep = getArtifacts('deep_space');
  assert.ok(moon.every((a) => a.body === 'moon'));
  assert.ok(mars.every((a) => a.body === 'mars'));
  assert.ok(deep.every((a) => a.body === 'deep_space'));
});

test('All 15 artifacts have complete dossiers and monologues', () => {
  const all = getAllArtifacts();
  for (const a of all) {
    assert.ok(a.coordinates.lat >= -90 && a.coordinates.lat <= 90);
    assert.ok(a.coordinates.lon >= -180 && a.coordinates.lon <= 360);
    assert.ok(a.firstPersonMonologue.length > 40);
    assert.ok(a.instruments.length >= 1);
    assert.ok(a.timeline.summary.length > 10);
  }
});
