export type CelestialBody = 'moon' | 'mars' | 'deep_space';

export type ArtifactCategory =
  | 'apollo_crewed'
  | 'uncrewed_lander'
  | 'rover'
  | 'instrument'
  | 'impact_probe'
  | 'interstellar_probe'
  | 'space_telescope'
  | 'planetary_orbiter'
  | 'asteroid_impactor';

export interface AstromaterialSample {
  sampleId: string;
  name: string;
  weightGrams: number;
  description: string;
  significance: string;
}

export interface MissionTimeline {
  launched: string;
  landed?: string | null;
  ended?: string;
  summary: string;
}

export interface Artifact {
  id: string;
  artifactNumber: string;
  name: string;
  mission: string;
  moniker: string;
  body: CelestialBody;
  category: ArtifactCategory;
  categoryLabel: string;
  agency: string;
  date: string;
  year: number;
  status:
    | 'historic_monument'
    | 'active_passive'
    | 'impact_site'
    | 'operational'
    | 'interstellar_escape'
    | 'disposed';
  statusLabel: string;
  locationName: string;
  coordinates: {
    lat: number; // degrees -90 to +90
    lon: number; // degrees -180 to +180
    secondaryLat?: number;
    secondaryLon?: number;
    display: string;
  };
  hasSurfaceCoordinates?: boolean;
  timeline: MissionTimeline;
  plannedVsActual: string;
  specs: string;
  instruments: string[];
  scientificDiscoveries: string;
  storytellingHook: string;
  firstPersonMonologue: string;
  youtubeUrl?: string;
  officialSource?: string;
  nssdcaId?: string;
  trajectoryOrRegion?: string;
  distanceAu?: string;
  targetBodyName?: string;
  massKg?: number;
  catalogRef?: string;
  story: {
    headline: string;
    introduction: string;
    theScience: string;
    whyLeftBehind: string;
    forSchoolKids: string;
  };
  famousQuote: string;
  astromaterials?: AstromaterialSample[];
  funFacts: string[];
  keyComponents: string[];
  model3dUrl?: string;
  nasa3dResourceUrl?: string;
}

export interface PlanetaryLandmark {
  id: string;
  name: string;
  body?: CelestialBody;
  type: 'crater' | 'mare' | 'mountain' | 'volcano' | 'canyon' | 'plain';
  coordinates: {
    lat: number;
    lon: number;
  };
  diameterKm?: number;
  description: string;
  significance: string;
  associatedArtifactId?: string;
}

export type LunarLandmark = PlanetaryLandmark;
