import { Artifact, PlanetaryLandmark, CelestialBody } from '../types/space';

/**
 * Source of truth for artifact category colors
 */
export const getArtifactColor = (artifact: Artifact, isSelected?: boolean): string => {
  if (isSelected) return '#ffffff';
  switch (artifact.category) {
    case 'interstellar_probe':
      return '#a855f7'; // Purple Interstellar
    case 'space_telescope':
      return '#eab308'; // Gold Telescopes
    case 'planetary_orbiter':
      return '#f97316'; // Orange Orbiters
    case 'asteroid_impactor':
      return '#38bdf8'; // Cyan Asteroids
    case 'apollo_crewed':
      return '#3b82f6'; // Blue Apollo
    case 'uncrewed_lander':
      return '#10b981'; // Green Landers
    case 'rover':
      return '#ef4444'; // Red Rovers
    default:
      return '#64748b'; // Gray/Zinc for others
  }
};

/**
 * Hex number version for Three.js
 */
export const getArtifactColorHex = (artifact: Artifact, isSelected?: boolean): number => {
  const color = getArtifactColor(artifact, isSelected);
  return parseInt(color.replace('#', '0x'), 16);
};

// ============================================================================
// 1. MOON ARTIFACTS (4 Items)
// ============================================================================
export const MOON_ARTIFACTS: Artifact[] = [
  {
    id: 'surveyor-3',
    artifactNumber: '04',
    name: 'Surveyor 3',
    mission: 'Surveyor 3',
    moniker: 'Surveyor 3',
    body: 'moon',
    category: 'uncrewed_lander',
    categoryLabel: 'Robotic Lunar Soft-Lander',
    agency: 'NASA',
    date: 'April 20, 1967',
    year: 1967,
    status: 'historic_monument',
    statusLabel: 'Visited Monument',
    locationName: 'Southeastern Oceanus Procellarum, Moon',
    coordinates: {
      lat: -3.0,
      lon: -23.41,
      display: '3.00° S, 23.41° W',
    },
    hasSurfaceCoordinates: true,
    timeline: {
      launched: '1967-04-17',
      landed: '1967-04-20',
      ended: '1967-05-04',
      summary: 'Launched: April 17, 1967 | Landed: April 20, 1967 | Last Contact: May 4, 1967',
    },
    plannedVsActual:
      'Operated through its primary lunar day until 2 days after lunar night fell (May 4, 1967); revisited in person by Apollo 12 in November 1969.',
    specs:
      'Mass: 997.9 kg (2,200 lbs) at launch. Equipped with a deployable surface-sampler arm reaching 1.5 m (5 ft) and digging 18 cm (7 in) deep.',
    instruments: [
      'Surveillance TV Camera (25 mm and 100 mm lenses beneath a movable mirror)',
      'Robotic Surface Sampler Scoop',
    ],
    scientificDiscoveries:
      'Transmitted 6,326 television images and used its robotic claw to dig four trenches and perform 13 impact tests, proving lunar soil had the firmness of wet sand (~10 psi) and could safely support the weight of an Apollo Lunar Module.',
    storytellingHook:
      "During landing, bright lunar rocks confused Surveyor 3's radar, causing its engines to keep firing so it bounced twice on the Moon—once 10 meters into the air!—before settling safely, only to be visited by human astronauts 31 months later.",
    firstPersonMonologue:
      'When I arrived at the Ocean of Storms in April 1967, bright lunar rocks confused my radar and tricked my engines into keeping their fire going, causing me to bounce twice on the Moon—once jumping 10 meters high into the air!—before finally settling safely in the dust. For 31 months I sat completely silent, taking photos and digging trenches with my mechanical arm, until two human astronauts from Apollo 12 walked right up to my metallic frame in November 1969. They unbolted my television camera and soil scoop to bring back to Earth, making me the first and only robot on another world to ever be visited face-to-face by people.',
    officialSource: 'https://science.nasa.gov/mission/surveyor-3/',
    nssdcaId: '1967-035A',
    catalogRef: 'NSSDCA ID 1967-035A',
    massKg: 998,
    story: {
      headline: 'The Only Robot on Another World Visited Face-to-Face by Humans',
      introduction:
        "During landing, bright lunar rocks confused Surveyor 3's radar, causing its engines to keep firing so it bounced twice on the Moon—once 10 meters into the air!—before settling safely, only to be visited by human astronauts 31 months later.",
      theScience:
        'Transmitted 6,326 television images and used its robotic claw to dig four trenches and perform 13 impact tests, proving lunar soil had the firmness of wet sand (~10 psi) and could safely support the weight of an Apollo Lunar Module.',
      whyLeftBehind:
        'Designed as a one-way robotic lunar scout, Surveyor 3 entered hibernation in May 1967 and remained in Oceanus Procellarum, where Apollo 12 astronauts Pete Conrad and Alan Bean visited it in November 1969.',
      forSchoolKids:
        'Surveyor 3 tested whether Moon dust was solid enough for astronauts to walk on—and two years later, Apollo 12 astronauts walked right up to it and brought its camera home!',
    },
    famousQuote:
      'Making me the first and only robot on another world to ever be visited face-to-face by people.',
    funFacts: [
      'Bounced twice during touchdown—once rising 10 meters high—before coming to rest inside a small crater.',
      'Transmitted 6,326 television images and dug four soil trenches.',
      'Apollo 12 astronauts retrieved its TV camera and soil scoop 31 months later.',
    ],
    keyComponents: [
      'Surveillance TV Camera (25 mm and 100 mm lenses beneath a movable mirror)',
      'Robotic Surface Sampler Scoop',
    ],
    nasa3dResourceUrl: 'https://github.com/nasa/NASA-3D-Resources',
  },
  {
    id: 'apollo-11-eagle-easep',
    artifactNumber: '01',
    name: "Apollo 11 Lunar Module 'Eagle' & EASEP",
    mission: 'Apollo 11',
    moniker: 'Eagle & EASEP',
    body: 'moon',
    category: 'apollo_crewed',
    categoryLabel: 'Crewed Lunar Module (Descent Stage) & Surface Science Package',
    agency: 'NASA',
    date: 'July 20, 1969',
    year: 1969,
    status: 'historic_monument',
    statusLabel: 'Tranquility Base Monument',
    locationName: 'Mare Tranquillitatis (Sea of Tranquility), Moon',
    coordinates: {
      lat: 0.67416,
      lon: 23.47314,
      display: 'Descent Stage: 0.67416° N, 23.47314° E | EASEP: 0.6735° N, 23.4730° E',
    },
    hasSurfaceCoordinates: true,
    timeline: {
      launched: '1969-07-16',
      landed: '1969-07-20',
      ended: '1969-08-27',
      summary:
        'Launched: July 16, 1969 | Landed: July 20, 1969 | Ascent Liftoff: July 21, 1969 (21h 36m on surface) | EASEP Ended: Aug 27, 1969',
    },
    plannedVsActual:
      'EASEP designed for 1 lunar day (~14 Earth days); survived into its 2nd lunar day despite temperatures 30°C above max design limit. Laser retroreflector remains active today.',
    specs:
      'Total LM Mass: 15,103 kg (Descent dry mass: 2,034 kg; 4.2 m octagonal prism, 9.4 m across footpads). EASEP: 48 kg, powered by 2 solar panels + isotope heater.',
    instruments: [
      'Passive Seismometer',
      'Lunar Dust Detector',
      'Laser Ranging Retroreflector (LRRR)',
      'Solar Wind Composition Foil Collector',
    ],
    scientificDiscoveries:
      "Achieved humanity's first crewed landing on another celestial body and returned 21.55 kg of lunar rock and soil. EASEP recorded the first lunar seismic data, while the power-free LRRR mirror still bounces laser beams from Earth to measure the Moon's distance to millimeter precision.",
    storytellingHook:
      "The lower descent stage of 'Eagle' still stands upright at Tranquility Base as a silent launch pad, bearing a stainless-steel plaque signed by the crew and President Nixon: 'Here men from the planet Earth first set foot upon the Moon July 1969, A.D. We came in peace for all mankind.'",
    firstPersonMonologue:
      "In July 1969, my golden four-legged base settled gently into the gray dust of Tranquility Base, carrying the very first humans to walk on the Moon. After 21 hours and 36 minutes on the surface, my top half blasted off to carry the crew back to Earth, leaving my lower frame standing upright in the quiet dust like a silent launch pad. Attached to my front leg is a shiny stainless-steel plaque signed by the astronauts and President Nixon that still reads: 'Here men from the planet Earth first set foot upon the Moon July 1969, A.D. We came in peace for all mankind.'",
    youtubeUrl: 'https://www.youtube.com/watch?v=nOcDftgR5UQ',
    officialSource: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C',
    nssdcaId: '1969-059C',
    catalogRef: 'NSSDCA ID 1969-059C',
    massKg: 2034,
    story: {
      headline: 'The First Crewed Landing Site on Another World',
      introduction:
        "The lower descent stage of 'Eagle' still stands upright at Tranquility Base as a silent launch pad, bearing a stainless-steel plaque signed by the crew and President Nixon: 'Here men from the planet Earth first set foot upon the Moon July 1969, A.D. We came in peace for all mankind.'",
      theScience:
        "Achieved humanity's first crewed landing on another celestial body and returned 21.55 kg of lunar rock and soil. EASEP recorded the first lunar seismic data, while the power-free LRRR mirror still bounces laser beams from Earth to measure the Moon's distance to millimeter precision.",
      whyLeftBehind:
        'The descent stage acted as a stationary launch platform so the ascent stage could lift Neil Armstrong and Buzz Aldrin back to lunar orbit with minimum weight, while EASEP continued gathering surface data.',
      forSchoolKids:
        'The Eagle descent stage is still standing upright on the Moon today, and astronomers still bounce lasers off its mirror array to measure the Moon moving away by 3.8 centimeters every year!',
    },
    famousQuote: 'The Eagle has landed.',
    funFacts: [
      'Returned 21.55 kg of lunar rock and soil to Earth.',
      'The power-free LRRR mirror array still reflects Earth laser pulses more than 55 years later.',
      'EASEP survived into a second lunar day despite extreme temperatures 30°C above its design limit.',
    ],
    keyComponents: [
      'Passive Seismometer',
      'Lunar Dust Detector',
      'Laser Ranging Retroreflector (LRRR)',
      'Solar Wind Composition Foil Collector',
    ],
    model3dUrl: '/models/Apollo_Lunar_Module.glb',
    nasa3dResourceUrl: 'https://github.com/nasa/NASA-3D-Resources',
  },
  {
    id: 'apollo-12-intrepid-alsep',
    artifactNumber: '03',
    name: "Apollo 12 Lunar Module 'Intrepid' & ALSEP",
    mission: 'Apollo 12',
    moniker: 'Intrepid & ALSEP',
    body: 'moon',
    category: 'apollo_crewed',
    categoryLabel: 'Crewed Lunar Module & Full Nuclear ALSEP Station',
    agency: 'NASA',
    date: 'November 19, 1969',
    year: 1969,
    status: 'historic_monument',
    statusLabel: 'Ocean of Storms Monument',
    locationName: 'Oceanus Procellarum (Ocean of Storms), Moon',
    coordinates: {
      lat: -3.0128,
      lon: -23.4219,
      display:
        'LM Descent Stage: 3.0128° S, 23.4219° W (just 180 m from Surveyor 3) | ALSEP: 3.0094° S, 23.4246° W',
    },
    hasSurfaceCoordinates: true,
    timeline: {
      launched: '1969-11-14',
      landed: '1969-11-19',
      ended: '1977-09-30',
      summary:
        'Launched: Nov 14, 1969 | Landed: Nov 19, 1969 | Ascent Liftoff: Nov 20, 1969 (31h 31m on surface) | ALSEP Shutdown: Sept 30, 1977',
    },
    plannedVsActual:
      'ALSEP operated for nearly 8 full years (Nov 1969 – Sept 1977), making it one of the longest-running surface stations on the Moon.',
    specs:
      'Total LM Mass: 15,235 kg (Descent dry mass: 2,118 kg). ALSEP Central Station: 25 kg + SNAP-27 Plutonium-238 RTG (17 kg, ~70 W DC).',
    instruments: [
      'Passive Seismometer',
      'Suprathermal Ion Detector',
      'Cold Cathode Ion Gauge',
      'Lunar Dust Detector',
      'Lunar Surface Magnetometer',
      'Solar Wind Spectrometer',
    ],
    scientificDiscoveries:
      'Demonstrated pinpoint landing accuracy by touching down within walking distance of Surveyor 3, returning 34.35 kg of lunar rocks plus 10 kg of Surveyor 3 hardware. When the empty ascent stage was crashed 60 km away, the ALSEP seismometer recorded the Moon vibrating like a bell for nearly an hour.',
    storytellingHook:
      'Astronauts Pete Conrad and Alan Bean strolled right up to the robotic Surveyor 3 lander—which had sat silent in the lunar dust for two and a half years—snapped photos beside it, and unbolted its camera and soil scoop to bring home to Earth.',
    firstPersonMonologue:
      "I pulled off history's very first pinpoint landing in the Ocean of Storms in November 1969, touching down just 180 meters away from a quiet robot named Surveyor 3. Astronauts Pete Conrad and Alan Bean strolled right up to that old lander—which had sat silent in the lunar dust for two and a half years—snapped photos beside it, and unbolted its camera and soil scoop to bring home to Earth. Along with those robot parts and 34.35 kilograms of moon rocks, I left behind a science station and an empty top stage that later crashed into the Moon, making it ring like a giant bell for nearly an hour.",
    youtubeUrl: 'https://www.youtube.com/watch?v=l11sW5KOi_g',
    officialSource: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C',
    nssdcaId: '1969-099C',
    catalogRef: 'NSSDCA ID 1969-099C',
    massKg: 2118,
    story: {
      headline: 'Pinpoint Touchdown Beside Surveyor 3 & Eight Years of ALSEP Science',
      introduction:
        'Astronauts Pete Conrad and Alan Bean strolled right up to the robotic Surveyor 3 lander—which had sat silent in the lunar dust for two and a half years—snapped photos beside it, and unbolted its camera and soil scoop to bring home to Earth.',
      theScience:
        'Demonstrated pinpoint landing accuracy by touching down within walking distance of Surveyor 3, returning 34.35 kg of lunar rocks plus 10 kg of Surveyor 3 hardware. When the empty ascent stage was crashed 60 km away, the ALSEP seismometer recorded the Moon vibrating like a bell for nearly an hour.',
      whyLeftBehind:
        'Intrepid’s descent stage served as the launch platform for the crew’s departure, while its nuclear-powered ALSEP science station stayed behind to transmit data until September 1977.',
      forSchoolKids:
        'Apollo 12 landed so accurately that the astronauts walked down a crater slope straight to Surveyor 3—and when their empty top stage crashed on the Moon, the Moon rang like a bell for nearly an hour!',
    },
    famousQuote:
      'Whoopee! Man, that may have been a small one for Neil, but that’s a long one for me!',
    funFacts: [
      'Landed just 180 meters from Surveyor 3 in Oceanus Procellarum.',
      'Its SNAP-27 nuclear ALSEP station operated continuously for nearly eight years.',
      'Returned 34.35 kg of lunar samples plus 10 kg of Surveyor 3 hardware.',
    ],
    keyComponents: [
      'Passive Seismometer',
      'Suprathermal Ion Detector',
      'Cold Cathode Ion Gauge',
      'Lunar Dust Detector',
      'Lunar Surface Magnetometer',
      'Solar Wind Spectrometer',
    ],
    model3dUrl: '/models/Apollo_Lunar_Module.glb',
    nasa3dResourceUrl: 'https://github.com/nasa/NASA-3D-Resources',
  },
  {
    id: 'apollo-15-falcon-lrv-alsep',
    artifactNumber: '02',
    name: "Apollo 15 Lunar Module 'Falcon', LRV-1 & ALSEP",
    mission: 'Apollo 15',
    moniker: 'Falcon, LRV-1 & ALSEP',
    body: 'moon',
    category: 'apollo_crewed',
    categoryLabel: 'Crewed Lunar Module, First Electric Lunar Roving Vehicle & Nuclear Science Station',
    agency: 'NASA',
    date: 'July 30, 1971',
    year: 1971,
    status: 'historic_monument',
    statusLabel: 'Hadley-Apennine Monument',
    locationName: 'Mare Imbrium at the foot of the Apennine Mountains (Hadley-Apennine), Moon',
    coordinates: {
      lat: 26.13239,
      lon: 3.6333,
      display:
        'LM Descent Stage: 26.13239° N, 3.63330° E | ALSEP Central Station: 26.1341° N, 3.6298° E',
    },
    hasSurfaceCoordinates: true,
    timeline: {
      launched: '1971-07-26',
      landed: '1971-07-30',
      ended: '1977-09-30',
      summary:
        'Launched: July 26, 1971 | Landed: July 30, 1971 | Ascent Liftoff: Aug 2, 1971 (66h 55m on surface) | ALSEP Shutdown: Sept 30, 1977',
    },
    plannedVsActual:
      'ALSEP operated continuously for over 6 years (July 1971 – Sept 1977), transmitting lunar interior and space environment data back to Earth.',
    specs:
      'Total LM Mass: 16,430 kg (Descent dry mass: 2,797 kg). ALSEP Central Station: 25 kg, powered by a 17 kg SNAP-27 Plutonium-238 RTG (~70 W DC). LRV: electric 4-wheel rover.',
    instruments: [
      'Lunar Roving Vehicle (LRV-1)',
      'Passive Seismometer',
      'Lunar Surface Magnetometer',
      'Solar Wind Spectrometer',
      'Suprathermal Ion Detector',
      'Cold Cathode Ion Gauge',
      'Lunar Dust Detector',
      'Heat Flow Experiment',
    ],
    scientificDiscoveries:
      "First mission to drive an electric 'moon buggy' (covering 27.9 km across three EVAs and venturing up to 5 km from the lander) and collected 77.31 kg of samples, including the ancient 'Genesis Rock.' ALSEP measured moonquakes and heat escaping from the Moon's core.",
    storytellingHook:
      "Before blasting off, Commander David Scott dropped a geologist's hammer and a falcon feather at the same time in the airless lunar vacuum—proving Galileo right as both hit the dust simultaneously. The crew also left a small aluminum figurine ('Fallen Astronaut') honoring 14 deceased American and Soviet space explorers.",
    firstPersonMonologue:
      "After launching from Earth in July 1971, I touched down at the foot of the Apennine Mountains on July 30, 1971, bringing the first electric moon buggy to drive 27.9 kilometers across the craters. Near the end of our 66-hour and 55-minute visit, Commander David Scott dropped a heavy hammer and a falcon feather at the exact same time in the airless space around me, proving Galileo right as both hit the dust together. Before lifting off on August 2, 1971, the crew also placed a small aluminum figurine called 'Fallen Astronaut' in the ground to remember 14 American and Soviet space explorers, while my science station stayed awake collecting data until September 1977.",
    youtubeUrl: 'https://www.youtube.com/watch?v=oYEgdZ3iEKA',
    officialSource: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C',
    nssdcaId: '1971-063C',
    catalogRef: 'NSSDCA ID 1971-063C',
    massKg: 2797,
    story: {
      headline: 'First Electric Moon Buggy & Galileo’s Hammer-and-Feather Test',
      introduction:
        "Before blasting off, Commander David Scott dropped a geologist's hammer and a falcon feather at the same time in the airless lunar vacuum—proving Galileo right as both hit the dust simultaneously. The crew also left a small aluminum figurine ('Fallen Astronaut') honoring 14 deceased American and Soviet space explorers.",
      theScience:
        "First mission to drive an electric 'moon buggy' (covering 27.9 km across three EVAs and venturing up to 5 km from the lander) and collected 77.31 kg of samples, including the ancient 'Genesis Rock.' ALSEP measured moonquakes and heat escaping from the Moon's core.",
      whyLeftBehind:
        'Falcon’s descent stage remained as the crew’s surface launch pad while LRV-1 was parked beside Hadley-Apennine and the nuclear ALSEP station ran continuously for over six years.',
      forSchoolKids:
        'Apollo 15 brought the first electric car to the Moon and proved Galileo’s gravity law live on television using a hammer and a falcon feather!',
    },
    famousQuote:
      'How about that! Mr. Galileo was correct in his findings.',
    funFacts: [
      'LRV-1 drove 27.9 kilometers across three moonwalks.',
      'Collected 77.31 kg of samples including the 4.1-billion-year-old Genesis Rock.',
      'Left the Fallen Astronaut memorial sculpture honoring 14 space explorers.',
    ],
    keyComponents: [
      'Lunar Roving Vehicle (LRV-1)',
      'Passive Seismometer',
      'Lunar Surface Magnetometer',
      'Solar Wind Spectrometer',
      'Suprathermal Ion Detector',
      'Cold Cathode Ion Gauge',
      'Lunar Dust Detector',
      'Heat Flow Experiment',
    ],
    model3dUrl: '/models/Apollo_Lunar_Module.glb',
    nasa3dResourceUrl: 'https://github.com/nasa/NASA-3D-Resources',
  },
];

// ============================================================================
// 2. MARS ARTIFACTS (6 Items)
// ============================================================================
export const MARS_ARTIFACTS: Artifact[] = [
  {
    id: 'viking-1-lander',
    artifactNumber: '07',
    name: 'Viking 1 Lander (Thomas Mutch Memorial Station)',
    mission: 'Viking 1',
    moniker: 'Viking 1 Lander',
    body: 'mars',
    category: 'uncrewed_lander',
    categoryLabel: 'Orbiter & Stationary Lander Pair',
    agency: 'NASA',
    date: 'July 20, 1976',
    year: 1976,
    status: 'historic_monument',
    statusLabel: 'Thomas Mutch Memorial Station',
    locationName: "Western slopes of Chryse Planitia ('Golden Plain'), Mars",
    coordinates: {
      lat: 22.483,
      lon: -47.94,
      display: '22.483° N, 47.94° W',
    },
    hasSurfaceCoordinates: true,
    timeline: {
      launched: '1975-08-20',
      landed: '1976-07-20',
      ended: '1982-11-11',
      summary:
        'Launched: Aug 20, 1975 | Entered Orbit: June 19, 1976 | Landed: July 20, 1976 | Last Contact: Nov 11, 1982',
    },
    plannedVsActual:
      'Planned for a 90-day primary surface mission; operated for over 6 years on Mars (1976–1982) before an accidental command interruption.',
    specs:
      'Total Spacecraft: 3,527 kg (7,776 lbs); Lander: 978 kg (2,156 lbs), powered by two SNAP-19 Plutonium-238 RTG nuclear generators.',
    instruments: [
      '2 Facsimile Color Cameras',
      'Gas Chromatograph Mass Spectrometer (GCMS)',
      'Biological Laboratory',
      'X-Ray Fluorescence Spectrometer',
      'Remote Sampler Arm',
      'Weather Package',
    ],
    scientificDiscoveries:
      'First spacecraft to successfully land and operate on Mars; captured the very first high-resolution color photographs from the Martian surface; conducted the first soil biology experiments and recorded 6+ years of Martian weather (-86°C pre-dawn to -33°C afternoon).',
    storytellingHook:
      'Renamed the Thomas Mutch Memorial Station in 1982, Viking 1 faithfully beamed back weekly weather reports for over six years until a routine software update sent from Earth accidentally pointed its antenna away from home.',
    firstPersonMonologue:
      'After I touched down on the rusty red plains of Mars in July 1976, my mission was renamed the Thomas Mutch Memorial Station in 1982 to honor a great scientist. For more than six years, I faithfully beamed back weekly weather reports and panoramic pictures of my rocky home, until a routine software update sent from Earth accidentally turned my dish antenna away from home, cutting off our connection forever. My whole journey had started back in August 1975 when I launched from Earth, landing on July 20, 1976, for a mission planned to last just 90 days. Instead, I kept working until November 1982, turning a three-month trip into a six-year adventure on the Red Planet.',
    youtubeUrl: 'https://www.youtube.com/watch?v=991yOhGC32c',
    officialSource: 'https://science.nasa.gov/mission/viking-1/',
    nssdcaId: '1975-075C',
    catalogRef: 'NSSDCA ID 1975-075C',
    massKg: 978,
    story: {
      headline: 'First Successful Martian Soft-Landing & Six Years of Weather Reports',
      introduction:
        'Renamed the Thomas Mutch Memorial Station in 1982, Viking 1 faithfully beamed back weekly weather reports for over six years until a routine software update sent from Earth accidentally pointed its antenna away from home.',
      theScience:
        'First spacecraft to successfully land and operate on Mars; captured the very first high-resolution color photographs from the Martian surface; conducted the first soil biology experiments and recorded 6+ years of Martian weather (-86°C pre-dawn to -33°C afternoon).',
      whyLeftBehind:
        'A stationary nuclear-powered lander built to stay on Chryse Planitia, Viking 1 lost contact in November 1982 after an inadvertent antenna-pointing command overwrite.',
      forSchoolKids:
        'Viking 1 sent back the very first clear color photos from the surface of Mars and lasted more than six years instead of its 90-day plan!',
    },
    famousQuote:
      'Turning a three-month trip into a six-year adventure on the Red Planet.',
    funFacts: [
      'Captured the first clear surface photographs of Mars on July 20, 1976.',
      'Powered by two SNAP-19 Plutonium-238 radioisotope thermoelectric generators.',
      'Renamed the Thomas Mutch Memorial Station in 1982.',
    ],
    keyComponents: [
      '2 Facsimile Color Cameras',
      'Gas Chromatograph Mass Spectrometer (GCMS)',
      'Biological Laboratory',
      'X-Ray Fluorescence Spectrometer',
      'Remote Sampler Arm',
      'Weather Package',
    ],
    model3dUrl:
      'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Viking%20Lander/Viking%20Lander.glb',
    nasa3dResourceUrl: 'https://github.com/nasa/NASA-3D-Resources',
  },
  {
    id: 'mars-pathfinder-sojourner',
    artifactNumber: '05',
    name: 'Mars Pathfinder & Sojourner Rover',
    mission: 'Mars Pathfinder',
    moniker: 'Pathfinder & Sojourner',
    body: 'mars',
    category: 'rover',
    categoryLabel: 'Stationary Lander (Carl Sagan Memorial Station) & First Wheeled Mars Rover',
    agency: 'NASA',
    date: 'July 4, 1997',
    year: 1997,
    status: 'historic_monument',
    statusLabel: 'Carl Sagan Memorial Station',
    locationName: 'Ares Vallis (ancient flood plain in Chryse Planitia), Mars',
    coordinates: {
      lat: 19.3,
      lon: -33.52,
      display: '19.30° N, 33.52° W (19.13° N, 33.22° W aerographic)',
    },
    hasSurfaceCoordinates: true,
    timeline: {
      launched: '1996-12-04',
      landed: '1997-07-04',
      ended: '1997-09-27',
      summary:
        'Launched: Dec 4, 1996 | Landed: July 4, 1997 | Final Transmission: Sept 27, 1997',
    },
    plannedVsActual:
      'Sojourner was built for a 7-day primary mission (lander for 30 days) and operated for 83 Martian sols—nearly 12 times longer than planned.',
    specs:
      'Sojourner Rover Mass: 10.6 kg (23 lbs), standing 30 cm (1 ft) tall—roughly the size of a microwave oven. Powered by solar panels + batteries.',
    instruments: [
      'Alpha Proton X-Ray Spectrometer (APXS)',
      'Imager for Mars Pathfinder (IMP) stereo camera',
      'Rover cameras',
      'Atmospheric Structure & Meteorology Package',
    ],
    scientificDiscoveries:
      'Returned 2.3 billion bits of data, 16,500+ lander photos, 550+ rover photos, and 15+ chemical rock/soil analyses. Rounded pebbles and cobbles proved liquid water once rushed across a warmer, wetter Mars.',
    storytellingHook:
      'Encased in a 5.8-meter cluster of giant airbags, Pathfinder slammed into Mars at 31 mph and bounced like a beach ball 15 times—up to 15 meters high—before coming to rest and letting microwave-sized Sojourner roll down its ramp onto Martian soil.',
    firstPersonMonologue:
      'I slammed into the rusty red ground of Mars in July 1997 at 31 miles per hour wrapped inside a 5.8-meter cluster of giant airbags, bouncing across the rocks like a giant beach ball 15 times—launching up to 15 meters high into the air! Once I finally came to rest and opened up my petals, I let my microwave-sized companion, the Sojourner rover, roll down my ramp onto the Martian soil. Even though we were only built to last for a quick 7 Martian days back in 1996 and 1997, we kept working for nearly three months, sending back over 16,500 images and checking the chemistry of neighboring stones.',
    officialSource: 'https://science.nasa.gov/mission/mars-pathfinder/',
    nssdcaId: '1996-068A',
    catalogRef: 'NSSDCA ID 1996-068A',
    massKg: 11,
    story: {
      headline: 'Airbag Bounce Touchdown & First Wheeled Rover on Mars',
      introduction:
        'Encased in a 5.8-meter cluster of giant airbags, Pathfinder slammed into Mars at 31 mph and bounced like a beach ball 15 times—up to 15 meters high—before coming to rest and letting microwave-sized Sojourner roll down its ramp onto Martian soil.',
      theScience:
        'Returned 2.3 billion bits of data, 16,500+ lander photos, 550+ rover photos, and 15+ chemical rock/soil analyses. Rounded pebbles and cobbles proved liquid water once rushed across a warmer, wetter Mars.',
      whyLeftBehind:
        'After 83 sols—nearly 12 times Sojourner’s 7-day design life—battery depletion and Martian winter ended transmissions in September 1997.',
      forSchoolKids:
        'Pathfinder bounced across Mars inside giant airbags like a beach ball before opening its petals and letting the microwave-sized Sojourner rover drive onto another planet for the first time!',
    },
    famousQuote:
      'Wrapping a lander in giant airbags and unleashing the first wheeled rover onto Martian soil.',
    funFacts: [
      'Bounced 15 times on giant airbags up to 15 meters high during landing.',
      'Sojourner was roughly the size of a microwave oven at just 10.6 kg.',
      'Sent back over 16,500 lander images and 550+ rover images.',
    ],
    keyComponents: [
      'Alpha Proton X-Ray Spectrometer (APXS)',
      'Imager for Mars Pathfinder (IMP) stereo camera',
      'Rover cameras',
      'Atmospheric Structure & Meteorology Package',
    ],
    nasa3dResourceUrl: 'https://github.com/nasa/NASA-3D-Resources',
  },
  {
    id: 'spirit-and-opportunity',
    artifactNumber: '06',
    name: 'Mars Exploration Rovers: Spirit & Opportunity',
    mission: 'Mars Exploration Rovers',
    moniker: 'Spirit & Opportunity',
    body: 'mars',
    category: 'rover',
    categoryLabel: 'Twin Robotic Geologist Rovers',
    agency: 'NASA',
    date: 'January 2004',
    year: 2004,
    status: 'historic_monument',
    statusLabel: 'Twin Field Geologists',
    locationName: 'Spirit: Gusev Crater | Opportunity: Meridiani Planum (Perseverance Valley), Mars',
    coordinates: {
      lat: -14.57,
      lon: 175.47,
      secondaryLat: -2.28,
      secondaryLon: 354.77,
      display:
        'Spirit: 14.57° S, 175.47° E | Opportunity: Landed 1.95° S, 354.47° E; final resting site 2.28° S, 354.77° E',
    },
    hasSurfaceCoordinates: true,
    timeline: {
      launched: '2003-06-10 / 2003-07-07',
      landed: '2004-01-03 / 2004-01-24',
      ended: '2010-03-22 / 2018-06-10',
      summary:
        'Spirit Landed: Jan 3, 2004 (Ended: 2010) | Opportunity Landed: Jan 24, 2004 (Last Contact: June 10, 2018)',
    },
    plannedVsActual:
      'Designed for 90-sol (3-month) missions; Spirit explored for over 6 years (7.73 km driven) and Opportunity lasted nearly 15 years (45.16 km / 28.06 mi driven).',
    specs:
      'Golf-cart-sized six-wheeled rovers powered by solar arrays (periodically cleaned by lucky Martian wind gusts) and rechargeable lithium-ion batteries.',
    instruments: [
      'Panoramic Camera (Pancam)',
      'Microscopic Imager',
      'Rock Abrasion Tool (RAT)',
      'Mössbauer Spectrometer',
      'Alpha Particle X-Ray Spectrometer (APXS)',
      'Mini-TES',
    ],
    scientificDiscoveries:
      "Found decisive geological and chemical proof—including tiny iron-rich mineral spheres nicknamed 'blueberries'—that liquid water once flowed and pooled on ancient Mars, creating environments that could have supported microbial life.",
    storytellingHook:
      'Opportunity outlived its 90-day warranty by 55 times, trekking over 28 miles until a massive, planet-wide dust storm blotted out the Sun in June 2018, leaving the marathon explorer silent on the rim of Perseverance Valley.',
    firstPersonMonologue:
      'Launching from Earth in June and July 2003 and landing on opposite sides of Mars in January 2004, my twin Spirit and I set out on a 90-day mission to search for clues of past water. Spirit kept rolling and studying rocks until March 2010, while I—Opportunity—outlived my 90-day warranty by 55 times, trekking over 28 miles across the Martian surface. After nearly 15 years of exploring, a massive, planet-wide dust storm blotted out the Sun in June 2018, leaving me silent on the rim of Perseverance Valley before NASA officially ended our mission in February 2019.',
    youtubeUrl: 'https://www.youtube.com/watch?v=8u6gNH6xIfc',
    officialSource:
      'https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/',
    nssdcaId: '2003-027A / 2003-032A',
    catalogRef: 'NSSDCA ID 2003-027A / 2003-032A',
    massKg: 185,
    story: {
      headline: 'Twin Robot Geologists That Outlived a 90-Day Warranty for Years',
      introduction:
        'Opportunity outlived its 90-day warranty by 55 times, trekking over 28 miles until a massive, planet-wide dust storm blotted out the Sun in June 2018, leaving the marathon explorer silent on the rim of Perseverance Valley.',
      theScience:
        "Found decisive geological and chemical proof—including tiny iron-rich mineral spheres nicknamed 'blueberries'—that liquid water once flowed and pooled on ancient Mars, creating environments that could have supported microbial life.",
      whyLeftBehind:
        'Spirit became trapped in soft sand at Troy in 2009 and went silent in 2010; Opportunity fell silent in June 2018 when a global dust storm blocked sunlight to its solar panels.',
      forSchoolKids:
        'Spirit and Opportunity were only built to last 90 days on Mars—yet Spirit worked for over 6 years and Opportunity drove 28 miles across nearly 15 years!',
    },
    famousQuote:
      'My battery is low and it’s getting dark.',
    funFacts: [
      'Opportunity drove 45.16 km (28.06 miles)—an off-world distance record for years.',
      'Lucky Martian dust devils periodically swept dust off their solar panels.',
      'Discovered hematite spheres nicknamed Martian blueberries formed in ancient water.',
    ],
    keyComponents: [
      'Panoramic Camera (Pancam)',
      'Microscopic Imager',
      'Rock Abrasion Tool (RAT)',
      'Mössbauer Spectrometer',
      'Alpha Particle X-Ray Spectrometer (APXS)',
      'Mini-TES',
    ],
    model3dUrl:
      'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Mars%20Exploration%20Rover%20-%20Opportunity%20(MER-B)/Mars%20Exploration%20Rover%20-%20Opportunity%20(MER-B).glb',
    nasa3dResourceUrl: 'https://github.com/nasa/NASA-3D-Resources',
  },
  {
    id: 'phoenix-mars-lander',
    artifactNumber: '08',
    name: 'Phoenix Mars Lander',
    mission: 'Phoenix',
    moniker: 'Phoenix Lander',
    body: 'mars',
    category: 'uncrewed_lander',
    categoryLabel: 'Stationary Martian Arctic Lander',
    agency: 'NASA',
    date: 'May 25, 2008',
    year: 2008,
    status: 'historic_monument',
    statusLabel: 'Arctic Permafrost Monument',
    locationName: 'Green Valley, Vastitas Borealis (Martian Arctic), Mars',
    coordinates: {
      lat: 68.2188,
      lon: -125.7492,
      display: '68.2188° N, 125.7492° W',
    },
    hasSurfaceCoordinates: true,
    timeline: {
      launched: '2007-08-04',
      landed: '2008-05-25',
      ended: '2008-11-02',
      summary:
        'Launched: Aug 4, 2007 | Landed: May 25, 2008 | Last Contact: Nov 2, 2008 (Declared Complete: May 24, 2010)',
    },
    plannedVsActual:
      'Designed for a 90-sol primary mission; operated for 157 Martian sols before the dark, freezing Arctic winter cut off sunlight to its solar panels.',
    specs:
      'Landing Mass: 350 kg (770 lbs); powered by twin octagonal solar arrays + NiH2 battery. Equipped with a 2.35-meter (7.7 ft) titanium/aluminum robotic digging arm.',
    instruments: [
      'Robotic Arm (RA) & Robotic Arm Camera (RAC)',
      'Surface Stereo Imager (SSI)',
      'Thermal & Evolved Gas Analyzer (TEGA)',
      'MECA Wet Chemistry & Microscopy Lab',
      'Meteorological Station (MET)',
    ],
    scientificDiscoveries:
      'Directly scooped up and verified water ice just centimeters beneath the Martian Arctic soil, discovered perchlorate salts and calcium carbonate in Martian dirt, and observed snow falling from high-altitude clouds.',
    storytellingHook:
      'Named after the mythical bird reborn from ashes because it was built from the hardware of a canceled 2001 lander, Phoenix dug into Martian permafrost to taste real water ice—and later passed its exact spacecraft design on to the InSight lander.',
    firstPersonMonologue:
      'Named after the mythical bird reborn from ashes because I was built from the hardware of a canceled 2001 lander, I touched down in the icy arctic plains of Mars in May 2008. Using my robotic digging arm, I scooped into the frozen Martian permafrost to taste and confirm real water ice—and later passed my exact spacecraft design on to the InSight lander, which launched in 2018. My own journey had started when I launched from Earth in August 2007 and landed on May 25, 2008 for a planned 90-day mission, working through the Martian summer until shrinking winter sunlight put me to sleep in November 2008.',
    youtubeUrl: 'https://www.youtube.com/watch?v=hH5pNFROlYU',
    officialSource: 'https://science.nasa.gov/mission/phoenix/',
    nssdcaId: '2007-034A',
    catalogRef: 'NSSDCA ID 2007-034A',
    massKg: 350,
    story: {
      headline: 'Reborn From Canceled Hardware to Taste Water Ice in Mars’ Arctic',
      introduction:
        'Named after the mythical bird reborn from ashes because it was built from the hardware of a canceled 2001 lander, Phoenix dug into Martian permafrost to taste real water ice—and later passed its exact spacecraft design on to the InSight lander.',
      theScience:
        'Directly scooped up and verified water ice just centimeters beneath the Martian Arctic soil, discovered perchlorate salts and calcium carbonate in Martian dirt, and observed snow falling from high-altitude clouds.',
      whyLeftBehind:
        'After working for 157 Martian sols in Vastitas Borealis, Martian Arctic winter darkness and heavy dry-ice frost cut off sunlight to its solar arrays in November 2008.',
      forSchoolKids:
        'Phoenix dug right into Mars’ icy north pole and confirmed real frozen water ice just a few inches under the dirt—and even watched Martian snow fall from clouds!',
    },
    famousQuote:
      'We have water ice on Mars—verified directly in the Martian Arctic soil.',
    funFacts: [
      'Built from hardware originally constructed for a canceled 2001 Mars lander.',
      'Its 2.35-meter robotic arm uncovered bright subsurface water ice just centimeters deep.',
      'Observed snow falling from high-altitude Martian cirrus clouds.',
    ],
    keyComponents: [
      'Robotic Arm (RA) & Robotic Arm Camera (RAC)',
      'Surface Stereo Imager (SSI)',
      'Thermal & Evolved Gas Analyzer (TEGA)',
      'MECA Wet Chemistry & Microscopy Lab',
      'Meteorological Station (MET)',
    ],
    nasa3dResourceUrl: 'https://github.com/nasa/NASA-3D-Resources',
  },
  {
    id: 'insight-lander',
    artifactNumber: '09',
    name: 'InSight Lander',
    mission: 'InSight',
    moniker: 'InSight Lander',
    body: 'mars',
    category: 'uncrewed_lander',
    categoryLabel: 'Stationary Geophysical Lander',
    agency: 'NASA',
    date: 'November 26, 2018',
    year: 2018,
    status: 'historic_monument',
    statusLabel: 'Elysium Planitia Seismic Station',
    locationName: 'Western Elysium Planitia, Mars',
    coordinates: {
      lat: 4.5,
      lon: 135.62,
      display: "4.50° N, 135.62° E (about 600 km from Curiosity's Gale Crater)",
    },
    hasSurfaceCoordinates: true,
    timeline: {
      launched: '2018-05-05',
      landed: '2018-11-26',
      ended: '2022-12-15',
      summary:
        'Launched: May 5, 2018 | Landed: Nov 26, 2018 | End of Mission: Dec 15, 2022',
    },
    plannedVsActual:
      'Designed for a 1-Mars-year (~2 Earth years) primary mission; operated for over 4 Earth years until Martian dust covered its solar panels.',
    specs:
      'Built on the Mars Phoenix lander frame with two circular solar arrays and a 1.8-meter (5 ft 9 in) robotic arm used to place instruments directly onto the ground.',
    instruments: [
      'SEIS (ultra-sensitive dome seismometer)',
      'HP³ heat-flow probe',
      'RISE radio-science experiment',
      'Wind and air-pressure sensors',
      'Deployment cameras',
    ],
    scientificDiscoveries:
      "First mission to measure Mars' 'vital signs'—detecting over 1,300 marsquakes and meteoroid impacts, mapping the thickness of Mars' crust, lumpy mantle, and liquid iron core, and recording the first audio of Martian wind.",
    storytellingHook:
      'As thick red dust gradually blanketed its solar arrays over four years, InSight used its final trickle of energy in December 2022 to snap and send home one last dusty selfie before going to sleep forever.',
    firstPersonMonologue:
      'Built from the proven design of the Phoenix lander, I spent four years sitting on the flat plains of Mars giving the Red Planet its very first medical checkup—listening closely for marsquakes and meteoroid impacts with my 5-foot-9-inch robotic arm and seismometer. As thick red dust gradually blanketed my two round solar arrays over those four years, I used my final trickle of energy in December 2022 to snap and send home one last dusty selfie before going to sleep forever. My journey had begun when I launched from Earth on May 5, 2018, and landed on Elysium Planitia on November 26, 2018, working hard for four years until my mission officially ended on December 15, 2022.',
    youtubeUrl: 'https://www.youtube.com/watch?v=JJZ6UlH_TfQ',
    officialSource: 'https://science.nasa.gov/mission/insight/',
    nssdcaId: '2018-042A',
    catalogRef: 'NSSDCA ID 2018-042A',
    massKg: 358,
    story: {
      headline: 'Taking the Planetary Pulse of Mars With Over 1,300 Marsquakes',
      introduction:
        'As thick red dust gradually blanketed its solar arrays over four years, InSight used its final trickle of energy in December 2022 to snap and send home one last dusty selfie before going to sleep forever.',
      theScience:
        "First mission to measure Mars' 'vital signs'—detecting over 1,300 marsquakes and meteoroid impacts, mapping the thickness of Mars' crust, lumpy mantle, and liquid iron core, and recording the first audio of Martian wind.",
      whyLeftBehind:
        'Stationary geophysical lander whose solar panels gradually accumulated thick Martian dust until battery reserves ran out in December 2022.',
      forSchoolKids:
        'InSight placed a super-sensitive seismometer right onto Mars’ ground, acting like a doctor’s stethoscope to listen to over 1,300 marsquakes deep inside the planet!',
    },
    famousQuote:
      'Don’t worry about me though: my time here has been both productive and serene.',
    funFacts: [
      'Detected over 1,300 marsquakes and meteoroid impacts across four Earth years.',
      'Recorded the first direct audio of Martian winds.',
      'Measured the size and liquid iron composition of Mars’ planetary core.',
    ],
    keyComponents: [
      'SEIS (ultra-sensitive dome seismometer)',
      'HP³ heat-flow probe',
      'RISE radio-science experiment',
      'Wind and air-pressure sensors',
      'Deployment cameras',
    ],
    model3dUrl:
      'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/InSight%20Cruise%20Lander/InSight%20Cruise%20Lander%20(arm%20deployed).glb',
    nasa3dResourceUrl: 'https://github.com/nasa/NASA-3D-Resources',
  },
  {
    id: 'ingenuity-mars-helicopter',
    artifactNumber: '10',
    name: 'Ingenuity Mars Helicopter',
    mission: 'Mars 2020 / Ingenuity',
    moniker: 'Ingenuity Helicopter',
    body: 'mars',
    category: 'rover',
    categoryLabel: 'Autonomous Solar-Powered Rotorcraft',
    agency: 'NASA',
    date: 'February 18, 2021',
    year: 2021,
    status: 'historic_monument',
    statusLabel: 'First Off-World Aircraft',
    locationName: 'Valinor Hills, Jezero Crater, Mars',
    coordinates: {
      lat: 18.49,
      lon: 77.42,
      display: 'Landed at 18.44° N, 77.45° E; final resting site at Valinor Hills (18.49° N, 77.42° E)',
    },
    hasSurfaceCoordinates: true,
    timeline: {
      launched: '2020-07-30',
      landed: '2021-02-18',
      ended: '2024-01-25',
      summary:
        'Launched: July 30, 2020 | Landed: Feb 18, 2021 | First Flight: April 19, 2021 | Final Flight (#72): Jan 18, 2024 | Retired: Jan 25, 2024',
    },
    plannedVsActual:
      'Built for a 30-day demo of up to 5 flights; completed 72 flights across nearly 3 years (128.8 flying minutes, 17.0 km distance, 24.0 m max altitude).',
    specs:
      'Mass: 1.8 kg (3.97 lbs on Earth; weighs just 0.68 kg / 1.5 lbs in Mars gravity). Counter-rotating carbon-fiber rotors spanning 1.2 m (4 ft); solar-charged Li-ion batteries.',
    instruments: [
      'High-resolution downward navigation camera',
      'Horizon-facing color camera',
      'Laser altimeter',
      'Inclinometer',
      'Two-way radio link via Perseverance',
    ],
    scientificDiscoveries:
      "Achieved humanity's 'Wright Brothers moment' on another planet, proving controlled aerodynamic flight is possible in Mars' ultra-thin atmosphere (<1% of Earth's air density), and served as an aerial scout for the Perseverance rover.",
    storytellingHook:
      'Tucked inside Ingenuity was a postage-stamp-sized swatch of fabric from the original 1903 Wright Flyer; after soaring 72 times across Jezero Crater and chipping a rotor blade, the tiny 4-pound pioneer now serves as a stationary weather monument on Mars.',
    firstPersonMonologue:
      'I carried a tiny, postage-stamp-sized piece of fabric from the original 1903 Wright Flyer tucked inside me, linking the very first airplane on Earth to the first flight on another planet. Even though I was only built for a 30-day test of five short flights, I soared 72 times across Jezero Crater—flying 24 meters high and covering over 17 kilometers—before chipping a rotor blade and becoming a quiet weather station on Mars. My adventure started when I launched from Earth in July 2020 and landed on February 18, 2021, making my first historic flight on April 19, 2021 and my very last flight on January 18, 2024.',
    youtubeUrl: 'https://www.youtube.com/watch?v=qMbHE_VXI-8',
    officialSource:
      'https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/',
    nssdcaId: '2020-052A',
    catalogRef: 'NSSDCA ID 2020-052A',
    massKg: 2,
    story: {
      headline: 'Humanity’s First Powered Flight on Another World (72 Sorties)',
      introduction:
        'Tucked inside Ingenuity was a postage-stamp-sized swatch of fabric from the original 1903 Wright Flyer; after soaring 72 times across Jezero Crater and chipping a rotor blade, the tiny 4-pound pioneer now serves as a stationary weather monument on Mars.',
      theScience:
        "Achieved humanity's 'Wright Brothers moment' on another planet, proving controlled aerodynamic flight is possible in Mars' ultra-thin atmosphere (<1% of Earth's air density), and served as an aerial scout for the Perseverance rover.",
      whyLeftBehind:
        'Following rotor blade damage during its 72nd landing in January 2024, Ingenuity can no longer fly and remains at Valinor Hills in Jezero Crater.',
      forSchoolKids:
        'Ingenuity weighs only 4 pounds on Earth and carried a tiny piece of the Wright brothers’ 1903 airplane wing fabric across 72 Martian flights!',
    },
    famousQuote:
      'Airfield Alpha on Mars—proving powered flight beyond Earth.',
    funFacts: [
      'Carried a postage-stamp-sized piece of fabric from the 1903 Wright Flyer.',
      'Completed 72 flights instead of the 5 flights originally planned.',
      'Reaches ~2,400 RPM with its 1.2 m counter-rotating carbon-fiber rotors.',
    ],
    keyComponents: [
      'High-resolution downward navigation camera',
      'Horizon-facing color camera',
      'Laser altimeter',
      'Inclinometer',
      'Two-way radio link via Perseverance',
    ],
    model3dUrl:
      'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Ingenuity%20Mars%20Helicopter/Ingenuity%20Mars%20Helicopter.glb',
    nasa3dResourceUrl: 'https://github.com/nasa/NASA-3D-Resources',
  },
];

// ============================================================================
// 3. DEEP SPACE ARTIFACTS (5 Items)
// ============================================================================
export const DEEP_SPACE_ARTIFACTS: Artifact[] = [
  {
    id: 'pioneer-10',
    artifactNumber: '13',
    name: 'Pioneer 10',
    mission: 'Pioneer 10',
    moniker: 'Pioneer 10',
    body: 'deep_space',
    category: 'interstellar_probe',
    categoryLabel: 'Outer-Planet Flyby & Interstellar Probe',
    agency: 'NASA',
    date: 'March 2, 1972',
    year: 1972,
    status: 'interstellar_escape',
    statusLabel: 'Interstellar Escape (Taurus)',
    locationName:
      'Drifting silently through interstellar space (over 11 billion miles from Earth) toward the red giant star Aldebaran in Taurus.',
    coordinates: {
      lat: 0,
      lon: 0,
      display: 'Interstellar trajectory toward Aldebaran (Constellation Taurus)',
    },
    hasSurfaceCoordinates: false,
    timeline: {
      launched: '1972-03-02',
      landed: null,
      ended: '2003-01-23',
      summary:
        "Launched: March 2, 1972 | Jupiter Flyby: Dec 4, 1973 | Crossed Neptune's Orbit: June 13, 1983 | Last Signal: Jan 23, 2003",
    },
    plannedVsActual:
      'Designed for a 21-month mission to Jupiter; operated for over 30 years until its nuclear power dropped too low to transmit from 7.6 billion miles away.',
    specs:
      'Mass: 258 kg (569 lbs); reached 51,682 km/h (32,110 mph) at launch. First all-nuclear spacecraft (two SNAP-19 Plutonium-238 RTGs).',
    instruments: [
      'Imaging Photopolarimeter',
      'Helium Vector Magnetometer',
      'Plasma Analyzer',
      'Cosmic Ray & Geiger Tube Telescopes',
      'Meteoroid Detectors',
    ],
    scientificDiscoveries:
      "First spacecraft to cross the asteroid belt, fly past Jupiter, and cross Neptune's orbit; captured the first close-up photos of Jupiter's Great Red Spot and moons (Ganymede, Europa, Callisto) and mapped Jupiter's intense radiation belts.",
    storytellingHook:
      "Bolted to Pioneer 10's antenna struts is a gold-anodized aluminum plaque engraved with a man, a woman, our solar system, and a pulsar map showing Earth's cosmic address—a message in a bottle drifting toward Aldebaran for the next two million years.",
    firstPersonMonologue:
      'I carry a shiny, gold-colored metal plaque bolted to my side with pictures of a man, a woman, our planets, and a star map showing where Earth is—like a message in a bottle floating toward a distant star called Aldebaran for the next two million years. My big adventure began when I launched from Earth on March 2, 1972, flying past Jupiter in December 1973 and leaving all the planets behind, before sending my very last whisper back home on January 23, 2003.',
    officialSource: 'https://science.nasa.gov/mission/pioneer-10/',
    nssdcaId: '1972-012A',
    catalogRef: 'NSSDCA ID 1972-012A',
    trajectoryOrRegion: 'Interstellar Space toward Aldebaran (Taurus)',
    targetBodyName: 'Jupiter & Interstellar Space',
    distanceAu: '>133 AU (>11 Billion Miles from Earth)',
    massKg: 258,
    story: {
      headline: 'First Through the Asteroid Belt & Messenger to Taurus',
      introduction:
        "Bolted to Pioneer 10's antenna struts is a gold-anodized aluminum plaque engraved with a man, a woman, our solar system, and a pulsar map showing Earth's cosmic address—a message in a bottle drifting toward Aldebaran for the next two million years.",
      theScience:
        "First spacecraft to cross the asteroid belt, fly past Jupiter, and cross Neptune's orbit; captured the first close-up photos of Jupiter's Great Red Spot and moons (Ganymede, Europa, Callisto) and mapped Jupiter's intense radiation belts.",
      whyLeftBehind:
        'Jupiter’s gravity accelerated Pioneer 10 onto an eternal solar-system escape trajectory; its nuclear power dropped below transmitter threshold in January 2003.',
      forSchoolKids:
        'Pioneer 10 carries a golden plaque showing where Earth is in the galaxy as it drifts silently toward the star Aldebaran over the next two million years!',
    },
    famousQuote:
      'A message in a bottle drifting toward Aldebaran for the next two million years.',
    funFacts: [
      'First spacecraft to cross the asteroid belt and fly past Jupiter.',
      'Carries the famous gold-anodized Pioneer Plaque designed by Carl Sagan and Frank Drake.',
      'Communicated for over 30 years—last faint signal received January 23, 2003.',
    ],
    keyComponents: [
      'Imaging Photopolarimeter',
      'Helium Vector Magnetometer',
      'Plasma Analyzer',
      'Cosmic Ray & Geiger Tube Telescopes',
      'Meteoroid Detectors',
    ],
    model3dUrl:
      'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Pioneer%2010/Pioneer%2010.glb',
    nasa3dResourceUrl: 'https://github.com/nasa/NASA-3D-Resources',
  },
  {
    id: 'pioneer-11',
    artifactNumber: '14',
    name: 'Pioneer 11',
    mission: 'Pioneer 11',
    moniker: 'Pioneer 11',
    body: 'deep_space',
    category: 'interstellar_probe',
    categoryLabel: 'Outer-Planet Flyby & Interstellar Probe',
    agency: 'NASA',
    date: 'April 6, 1973',
    year: 1973,
    status: 'interstellar_escape',
    statusLabel: 'Interstellar Escape (Aquila)',
    locationName:
      'Drifting silently through interstellar space (over 9.1 billion miles from Earth) toward the constellation Aquila (passing star Lambda Aquila in ~4 million years).',
    coordinates: {
      lat: 0,
      lon: 0,
      display: 'Interstellar trajectory toward Constellation Aquila',
    },
    hasSurfaceCoordinates: false,
    timeline: {
      launched: '1973-04-06',
      landed: null,
      ended: '1995-11-24',
      summary:
        'Launched: April 6, 1973 | Jupiter Flyby: Dec 3, 1974 | Saturn Flyby: Sept 1, 1979 | Last Signal: Nov 24, 1995',
    },
    plannedVsActual:
      'Designed for a 21-month outer-planet flyby mission; operated for over 22 years until declining nuclear RTG power prevented antenna pointing.',
    specs:
      'Mass: 258.5 kg (570 lbs); hexagonal bus with a 2.74-meter (9 ft) high-gain dish antenna, powered by two SNAP-19 Plutonium-238 RTGs.',
    instruments: [
      'Imaging Photopolarimeter',
      'Helium Vector & Triaxial Fluxgate Magnetometers',
      'Infrared Radiometer',
      'Plasma Analyzer',
      'Charged Particle & Cosmic Ray Telescopes',
    ],
    scientificDiscoveries:
      "First spacecraft to fly past Saturn (skimming within 21,000 km of its cloud tops), discovering Saturn's narrow F ring and a new moon, and captured the first close-up images of Jupiter's polar regions.",
    storytellingHook:
      "Like its twin Pioneer 10, Pioneer 11 carries Carl Sagan's golden plaque depicting humanity and Earth's location relative to 14 pulsars—now coasting silently like a cosmic ghost ship toward the heart of the Milky Way.",
    firstPersonMonologue:
      'Just like my twin brother Pioneer 10, I carry a shiny golden plaque showing pictures of humans and a star map pointing straight back to Earth—and now I am coasting silently like a cosmic ghost ship toward the heart of the Milky Way galaxy. My journey started when I launched from Earth in April 1973, flying past Jupiter in December 1974 and becoming the first visitor to Saturn in September 1979, before sending my final signal home in September 1995.',
    officialSource: 'https://science.nasa.gov/mission/pioneer-11/',
    nssdcaId: '1973-019A',
    catalogRef: 'NSSDCA ID 1973-019A',
    trajectoryOrRegion: 'Interstellar Space toward Constellation Aquila',
    targetBodyName: 'Jupiter, Saturn & Interstellar Space',
    distanceAu: '>111 AU (>9.1 Billion Miles from Earth)',
    massKg: 259,
    story: {
      headline: 'First Explorer to Reach Saturn & Cosmic Ghost Ship Toward Aquila',
      introduction:
        "Like its twin Pioneer 10, Pioneer 11 carries Carl Sagan's golden plaque depicting humanity and Earth's location relative to 14 pulsars—now coasting silently like a cosmic ghost ship toward the heart of the Milky Way.",
      theScience:
        "First spacecraft to fly past Saturn (skimming within 21,000 km of its cloud tops), discovering Saturn's narrow F ring and a new moon, and captured the first close-up images of Jupiter's polar regions.",
      whyLeftBehind:
        'Saturn’s gravity flung Pioneer 11 out of the solar system toward Aquila; declining nuclear power ended routine transmissions in late 1995.',
      forSchoolKids:
        'Pioneer 11 was the very first spacecraft to visit Saturn, threading safely past its icy rings before flying out of our solar system forever!',
    },
    famousQuote:
      'Coasting silently like a cosmic ghost ship toward the heart of the Milky Way.',
    funFacts: [
      'First spacecraft to fly past Saturn in September 1979.',
      'Discovered Saturn’s narrow F ring while skimming 21,000 km above its clouds.',
      'Carries the second gold-anodized Pioneer Plaque toward Constellation Aquila.',
    ],
    keyComponents: [
      'Imaging Photopolarimeter',
      'Helium Vector & Triaxial Fluxgate Magnetometers',
      'Infrared Radiometer',
      'Plasma Analyzer',
      'Charged Particle & Cosmic Ray Telescopes',
    ],
    model3dUrl:
      'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Pioneer%2010/Pioneer%2010.glb',
    nasa3dResourceUrl: 'https://github.com/nasa/NASA-3D-Resources',
  },
  {
    id: 'near-shoemaker',
    artifactNumber: '12',
    name: 'NEAR Shoemaker',
    mission: 'NEAR Shoemaker',
    moniker: 'NEAR Shoemaker',
    body: 'deep_space',
    category: 'asteroid_impactor',
    categoryLabel: 'Asteroid Orbiter Turned Improvised Lander',
    agency: 'NASA',
    date: 'February 17, 1996',
    year: 1996,
    status: 'historic_monument',
    statusLabel: 'Resting on Asteroid 433 Eros',
    locationName:
      'Resting intact on the surface of 21-mile-long asteroid 433 Eros, just south of the saddle-shaped feature named Himeros.',
    coordinates: {
      lat: 0,
      lon: 0,
      display: 'Surface of Asteroid 433 Eros (south of Himeros)',
    },
    hasSurfaceCoordinates: false,
    timeline: {
      launched: '1996-02-17',
      landed: '2001-02-12',
      ended: '2001-02-28',
      summary:
        'Launched: Feb 17, 1996 | Entered Eros Orbit: Feb 14, 2000 | Landed on Eros: Feb 12, 2001 | Last Contact: Feb 28, 2001',
    },
    plannedVsActual:
      'Operated for 5 years, including an unexpected 16-day bonus surface mission after touching down on an asteroid it was never built to land on.',
    specs:
      'Mass: 805 kg (1,775 lbs); first spacecraft to rely on solar cells for power beyond the orbit of Mars. Had no landing gear.',
    instruments: [
      'Multi-Spectral Imager (MSI)',
      'Near-Infrared Spectrometer (NIS)',
      'X-Ray/Gamma-Ray Spectrometer (XGRS)',
      'Magnetometer (MAG)',
      'Laser Rangefinder (NLR)',
    ],
    scientificDiscoveries:
      "First human-made object to orbit and land on an asteroid; returned 10 times more data than planned (160,000 images), mapped over 70% of Eros, and showed the asteroid has no magnetic field and a density like Earth's crust.",
    storytellingHook:
      "Built strictly as an orbiter with zero landing legs, NEAR Shoemaker was gently guided down onto Eros at a walking pace of 4 mph—where it survived touchdown and broadcast gamma-ray science from the asteroid's surface for two weeks until -173°C (-279°F) cold froze its systems.",
    firstPersonMonologue:
      'Built strictly to fly around space rocks with zero landing legs, I was gently guided down onto the asteroid Eros at a slow walking pace of 4 miles per hour! Surviving the touchdown made me the first spacecraft ever to land on an asteroid, and I broadcast gamma-ray science right from the dusty surface for two weeks until freezing -173°C (-279°F) cold finally put my systems to sleep. My mission had started when I launched from Earth in February 1996, orbiting Eros starting on February 14, 2000, before making my surprise landing on February 12, 2001 and sending my final signal on February 28, 2001.',
    youtubeUrl: 'https://www.youtube.com/watch?v=4bWn_DgmNqc',
    officialSource: 'https://science.nasa.gov/mission/near-shoemaker/',
    nssdcaId: '1996-008A',
    catalogRef: 'NSSDCA ID 1996-008A',
    trajectoryOrRegion: 'Surface of Asteroid 433 Eros (~1.46 AU)',
    targetBodyName: 'Asteroid 433 Eros',
    distanceAu: '~1.46 AU (Near-Earth Asteroid Orbit)',
    massKg: 805,
    story: {
      headline: 'The Legless Orbiter That Soft-Landed on Asteroid 433 Eros',
      introduction:
        "Built strictly as an orbiter with zero landing legs, NEAR Shoemaker was gently guided down onto Eros at a walking pace of 4 mph—where it survived touchdown and broadcast gamma-ray science from the asteroid's surface for two weeks until -173°C (-279°F) cold froze its systems.",
      theScience:
        "First human-made object to orbit and land on an asteroid; returned 10 times more data than planned (160,000 images), mapped over 70% of Eros, and showed the asteroid has no magnetic field and a density like Earth's crust.",
      whyLeftBehind:
        'Engineered to end its primary mission with a controlled descent onto Eros, NEAR Shoemaker survived intact and transmitted surface gamma-ray science for 16 days until extreme cold ended operations.',
      forSchoolKids:
        'Even though NEAR Shoemaker had zero landing legs, engineers gently set it down on asteroid Eros at 4 mph—making it the first spacecraft ever to land on an asteroid!',
    },
    famousQuote:
      'Surviving touchdown at 4 mph with zero landing legs on an asteroid.',
    funFacts: [
      'First spacecraft ever to orbit and soft-land on an asteroid.',
      'Returned 160,000 images—10 times more data than originally planned.',
      'First spacecraft powered by solar cells beyond Mars’ orbit.',
    ],
    keyComponents: [
      'Multi-Spectral Imager (MSI)',
      'Near-Infrared Spectrometer (NIS)',
      'X-Ray/Gamma-Ray Spectrometer (XGRS)',
      'Magnetometer (MAG)',
      'Laser Rangefinder (NLR)',
    ],
    model3dUrl:
      'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/NEAR%20Shoemaker/NEAR%20Shoemaker.glb',
    nasa3dResourceUrl: 'https://github.com/nasa/NASA-3D-Resources',
  },
  {
    id: 'dawn',
    artifactNumber: '11',
    name: 'Dawn Spacecraft',
    mission: 'Dawn',
    moniker: 'Dawn Spacecraft',
    body: 'deep_space',
    category: 'planetary_orbiter',
    categoryLabel: 'Ion-Propelled Deep-Space Orbiter',
    agency: 'NASA',
    date: 'September 27, 2007',
    year: 2007,
    status: 'disposed',
    statusLabel: 'Quiescent Orbit at Ceres',
    locationName:
      'Perpetual, silent, unpowered orbit around dwarf planet Ceres in the main asteroid belt between Mars and Jupiter.',
    coordinates: {
      lat: 0,
      lon: 0,
      display: 'High planetary-protection orbit around Dwarf Planet Ceres',
    },
    hasSurfaceCoordinates: false,
    timeline: {
      launched: '2007-09-27',
      landed: null,
      ended: '2018-11-01',
      summary:
        'Launched: Sept 27, 2007 | Orbited Vesta: 2011–2012 | Orbited Ceres: 2015–2018 | End of Mission: Oct/Nov 2018',
    },
    plannedVsActual:
      'Operated for 11 years across two deep-space destinations until exhausting its hydrazine attitude-control propellant in late 2018.',
    specs:
      'Solar-powered spacecraft propelled by three high-efficiency Xenon Ion Thrusters alongside hydrazine attitude-control thrusters.',
    instruments: [
      'Framing Camera (FC)',
      'Visible and Infrared Mapping Spectrometer (VIR)',
      'Gamma Ray and Neutron Detector (GRaND)',
    ],
    scientificDiscoveries:
      'First spacecraft ever to orbit two extraterrestrial bodies—giant protoplanet Vesta and dwarf planet Ceres. Revealed bright sodium carbonate salt deposits and signs of recent cryovolcanism and subsurface brines on Ceres.',
    storytellingHook:
      "Before Dawn ran out of thruster fuel after 11 years, NASA carefully parked it in a high, stable 'planetary protection' orbit so it will silently circle dwarf planet Ceres for decades without risking a crash onto its potentially habitable surface.",
    firstPersonMonologue:
      'I used special blue-glowing ion engines to become the very first spacecraft to orbit two different worlds beyond Earth—the giant asteroid Vesta and the dwarf planet Ceres. Before I ran out of thruster fuel after 11 years in deep space, NASA carefully parked me in a high, safe orbit so I will silently circle Ceres for decades without risking a crash onto its icy, potentially habitable surface. My long road trip started when I launched in September 2007, orbiting Vesta from July 2011 to September 2012 before arriving at Ceres in March 2015 and completing my mission in November 2018.',
    youtubeUrl: 'https://www.youtube.com/watch?v=MGpRPpfeIAw',
    officialSource: 'https://science.nasa.gov/mission/dawn/',
    nssdcaId: '2007-043A',
    catalogRef: 'NSSDCA ID 2007-043A',
    trajectoryOrRegion: 'Ceres Planetary-Protection Orbit (2.77 AU Asteroid Belt)',
    targetBodyName: 'Vesta & Dwarf Planet Ceres',
    distanceAu: '~2.77 AU (Main Asteroid Belt)',
    massKg: 1218,
    story: {
      headline: 'The Ion-Propelled Explorer of Two Worlds: Vesta and Ceres',
      introduction:
        "Before Dawn ran out of thruster fuel after 11 years, NASA carefully parked it in a high, stable 'planetary protection' orbit so it will silently circle dwarf planet Ceres for decades without risking a crash onto its potentially habitable surface.",
      theScience:
        'First spacecraft ever to orbit two extraterrestrial bodies—giant protoplanet Vesta and dwarf planet Ceres. Revealed bright sodium carbonate salt deposits and signs of recent cryovolcanism and subsurface brines on Ceres.',
      whyLeftBehind:
        'Once its hydrazine attitude-control propellant ran out in 2018, Dawn remained in a decades-long quarantine orbit to protect Ceres’ icy subsurface brines from contamination.',
      forSchoolKids:
        'Dawn used futuristic blue-glowing xenon ion thrusters to orbit Vesta first and then fly on to orbit dwarf planet Ceres—the only spacecraft ever to orbit two deep-space worlds!',
    },
    famousQuote:
      'Silently circling dwarf planet Ceres in a high planetary-protection orbit.',
    funFacts: [
      'First spacecraft ever to orbit two separate extraterrestrial bodies (Vesta and Ceres).',
      'Propelled by three high-efficiency Xenon Ion Thrusters.',
      'Revealed bright salt deposits left behind by ancient cryovolcanic brines on Ceres.',
    ],
    keyComponents: [
      'Framing Camera (FC)',
      'Visible and Infrared Mapping Spectrometer (VIR)',
      'Gamma Ray and Neutron Detector (GRaND)',
    ],
    model3dUrl:
      'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Dawn/Dawn.glb',
    nasa3dResourceUrl: 'https://github.com/nasa/NASA-3D-Resources',
  },
  {
    id: 'kepler',
    artifactNumber: '15',
    name: 'Kepler Space Telescope (Kepler / K2)',
    mission: 'Kepler / K2',
    moniker: 'Kepler / K2',
    body: 'deep_space',
    category: 'space_telescope',
    categoryLabel: 'Deep-Space Planet-Hunting Observatory',
    agency: 'NASA',
    date: 'March 6, 2009',
    year: 2009,
    status: 'historic_monument',
    statusLabel: 'Safe Heliocentric Orbit',
    locationName:
      'Decommissioned and drifting silently in a safe, Earth-trailing heliocentric orbit around the Sun.',
    coordinates: {
      lat: 0,
      lon: 0,
      display: 'Earth-trailing Heliocentric Orbit around the Sun',
    },
    hasSurfaceCoordinates: false,
    timeline: {
      launched: '2009-03-06',
      landed: null,
      ended: '2018-10-30',
      summary:
        'Launched: March 6, 2009 | K2 Extended Mission: May 2013 | Retired: Oct 30, 2018',
    },
    plannedVsActual:
      "Designed for a 3.5-year primary mission; operated for 9.5 years across its primary survey and 19 'K2' sky campaigns until running out of fuel.",
    specs:
      'Built around a 1.4-meter (4 ft 7 in) primary mirror and 0.95-meter (3 ft) aperture photometer—the largest digital camera in deep space at launch.',
    instruments: [
      'Wide-field CCD Photometer array (stared at 150,000+ stars in Cygnus and 500,000+ stars in K2)',
    ],
    scientificDiscoveries:
      'Discovered more than 2,600 confirmed exoplanets (including Earth-sized planets in habitable zones and multi-planet systems like Kepler-9 and Kepler-11), proving that planets outnumber stars in our Milky Way galaxy.',
    storytellingHook:
      "When two of its four pointing wheels failed in 2013, NASA engineers refused to quit—balancing Kepler against the gentle pressure of sunlight itself (like a kayak steering into a current) to launch its 'K2' second act and discover hundreds more worlds before its fuel tank ran dry.",
    firstPersonMonologue:
      "When two of my four pointing wheels broke in 2013, NASA engineers refused to give up on me—balancing me against the gentle push of sunlight itself, just like a kayak steering into a river current! That clever trick started my 'K2' second act, letting me discover hundreds more planets on top of the thousands I had already found before my fuel tank finally ran dry. My planet-hunting journey began when I launched from Earth on March 6, 2009, discovering more than 2,600 alien worlds across 9.5 years before NASA peacefully retired me in a safe orbit on October 30, 2018.",
    youtubeUrl: 'https://www.youtube.com/watch?v=_V7J05fK5e0',
    officialSource: 'https://science.nasa.gov/mission/kepler/',
    nssdcaId: '2009-011A',
    catalogRef: 'NSSDCA ID 2009-011A',
    trajectoryOrRegion: 'Earth-Trailing Heliocentric Orbit (~1.013 AU)',
    targetBodyName: 'Exoplanets & Stars',
    distanceAu: '~1.01 AU (Earth-Trailing Solar Orbit)',
    massKg: 1052,
    story: {
      headline: 'The Exoplanet Hunter That Proved Planets Outnumber Stars',
      introduction:
        "When two of its four pointing wheels failed in 2013, NASA engineers refused to quit—balancing Kepler against the gentle pressure of sunlight itself (like a kayak steering into a current) to launch its 'K2' second act and discover hundreds more worlds before its fuel tank ran dry.",
      theScience:
        'Discovered more than 2,600 confirmed exoplanets (including Earth-sized planets in habitable zones and multi-planet systems like Kepler-9 and Kepler-11), proving that planets outnumber stars in our Milky Way galaxy.',
      whyLeftBehind:
        'After 9.5 years and exhausting its hydrazine fuel in October 2018, Kepler was placed into a safe Earth-trailing heliocentric orbit and powered down.',
      forSchoolKids:
        'Kepler stared at hundreds of thousands of stars and discovered over 2,600 alien planets—and when two pointing wheels broke, engineers balanced it using sunlight itself!',
    },
    famousQuote:
      'Balancing against the gentle pressure of sunlight to discover over 2,600 alien worlds.',
    funFacts: [
      'Discovered more than 2,600 confirmed exoplanets across 9.5 years.',
      'Used solar radiation pressure like a kayak paddle during its K2 second act.',
      'Carried a 1.4-meter primary mirror and 0.95-meter wide-field photometer.',
    ],
    keyComponents: [
      'Wide-field CCD Photometer array (stared at 150,000+ stars in Cygnus and 500,000+ stars in K2)',
    ],
    model3dUrl:
      'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Kepler%20(A)/Kepler%20(A).glb',
    nasa3dResourceUrl: 'https://github.com/nasa/NASA-3D-Resources',
  },
];

// ============================================================================
// 4. PLANETARY LANDMARKS (Craters, Volcanoes, Maria & Canyons)
// ============================================================================
export const LUNAR_LANDMARKS: PlanetaryLandmark[] = [
  {
    id: 'tycho',
    name: 'Tycho Crater',
    body: 'moon',
    type: 'crater',
    coordinates: { lat: -43.3, lon: -11.2 },
    diameterKm: 85,
    description:
      'Prominent 85-km impact crater with a massive 1,500-km bright ray system spreading across the lunar south.',
    significance:
      'Formed ~108 million years ago by an asteroid impact in the southern lunar highlands.',
  },
  {
    id: 'copernicus',
    name: 'Copernicus Crater',
    body: 'moon',
    type: 'crater',
    coordinates: { lat: 9.6, lon: -20.1 },
    diameterKm: 93,
    description:
      'Majestic 93-km complex crater with terraced walls and triple central peaks rising 1.2 km above the floor.',
    significance:
      'The defining benchmark for the Copernican lunar geological period (~800 million years ago).',
    associatedArtifactId: 'apollo-12-intrepid-alsep',
  },
  {
    id: 'tranquillitatis',
    name: 'Mare Tranquillitatis (Sea of Tranquility)',
    body: 'moon',
    type: 'mare',
    coordinates: { lat: 0.67, lon: 23.47 },
    diameterKm: 873,
    description: 'Vast titanium-rich dark basaltic volcanic plain formed 3.5 to 3.8 billion years ago.',
    significance:
      'Landing site of Apollo 11 ("Tranquility Base") and the first human landing on another world.',
    associatedArtifactId: 'apollo-11-eagle-easep',
  },
  {
    id: 'imbrium',
    name: 'Mare Imbrium (Sea of Rains)',
    body: 'moon',
    type: 'mare',
    coordinates: { lat: 33.0, lon: -16.0 },
    diameterKm: 1145,
    description:
      'One of the largest impact basins in the Solar System, ringed by towering mountain ridges.',
    significance: 'Site of Apollo 15 exploration along the Hadley-Apennine rim.',
    associatedArtifactId: 'apollo-15-falcon-lrv-alsep',
  },
  {
    id: 'procellarum',
    name: 'Oceanus Procellarum (Ocean of Storms)',
    body: 'moon',
    type: 'mare',
    coordinates: { lat: -3.01, lon: -23.42 },
    diameterKm: 2500,
    description:
      'The largest lunar mare, covering over 4 million square kilometers across the western near side.',
    significance: 'Landing ground of Surveyor 3 and Apollo 12.',
    associatedArtifactId: 'apollo-12-intrepid-alsep',
  },
  {
    id: 'apenninus',
    name: 'Montes Apenninus & Hadley Rille',
    body: 'moon',
    type: 'mountain',
    coordinates: { lat: 26.13, lon: 3.63 },
    diameterKm: 600,
    description:
      'Dramatic mountain arc rising up to 5,000 meters above Mare Imbrium, bordered by the 1,000-ft deep sinuous lava tube Hadley Rille.',
    significance:
      'Site where Apollo 15 astronauts found the 4.1-billion-year-old anorthosite "Genesis Rock".',
    associatedArtifactId: 'apollo-15-falcon-lrv-alsep',
  },
];

export const MARS_LANDMARKS: PlanetaryLandmark[] = [
  {
    id: 'olympus-mons',
    name: 'Olympus Mons',
    body: 'mars',
    type: 'volcano',
    coordinates: { lat: 18.65, lon: -133.8 },
    diameterKm: 624,
    description:
      'The largest volcano in the Solar System, towering 21.9 km (72,000 ft) high—nearly three times the height of Mount Everest.',
    significance:
      'A gigantic shield volcano with an 80-km caldera, demonstrating that Mars had no moving tectonic plates to drift volcanoes over mantle plumes.',
  },
  {
    id: 'valles-marineris',
    name: 'Valles Marineris (Grand Canyon of Mars)',
    body: 'mars',
    type: 'canyon',
    coordinates: { lat: -14.0, lon: -59.2 },
    diameterKm: 4000,
    description:
      'A colossal tectonic canyon system stretching over 4,000 km (2,500 miles) long, up to 200 km wide, and 7 km (23,000 ft) deep.',
    significance:
      'Spans nearly a quarter of the Martian equator; would stretch from New York to Los Angeles on Earth.',
  },
  {
    id: 'jezero-crater',
    name: 'Jezero Crater & River Delta',
    body: 'mars',
    type: 'crater',
    coordinates: { lat: 18.44, lon: 77.45 },
    diameterKm: 45,
    description:
      'Ancient crater that held a 250-meter deep lake fed by an inflow river that deposited a fan-shaped delta of mud and clays.',
    significance:
      'Site of Ingenuity Mars Helicopter’s 72 historic aerial flights ending at Valinor Hills.',
    associatedArtifactId: 'ingenuity-mars-helicopter',
  },
  {
    id: 'gusev-crater',
    name: 'Gusev Crater (Columbia Hills)',
    body: 'mars',
    type: 'crater',
    coordinates: { lat: -14.57, lon: 175.47 },
    diameterKm: 166,
    description:
      'Vast 166-km crater carved by the ancient Ma’adim Vallis river outflow channel, home to the Columbia Hills.',
    significance:
      'Explored by the Spirit rover for 6 years, which discovered pure silica deposits from ancient volcanic hydrothermal vents.',
    associatedArtifactId: 'spirit-and-opportunity',
  },
  {
    id: 'chryse-planitia',
    name: 'Chryse Planitia (Plains of Gold)',
    body: 'mars',
    type: 'plain',
    coordinates: { lat: 22.48, lon: -47.97 },
    diameterKm: 1600,
    description:
      'Smooth low-elevation volcanic and flood plain at the terminus of massive ancient outflow channels.',
    significance:
      'Landing site of Viking 1 Lander in 1976, which returned the first color photos from Mars.',
    associatedArtifactId: 'viking-1-lander',
  },
  {
    id: 'ares-vallis',
    name: 'Ares Vallis (Catastrophic Flood Outflow)',
    body: 'mars',
    type: 'canyon',
    coordinates: { lat: 19.3, lon: -33.52 },
    diameterKm: 1700,
    description:
      'A massive ancient outflow channel carved by cataclysmic torrents of raging water flowing into Chryse Planitia.',
    significance: 'Landing site of the Mars Pathfinder lander and the Sojourner rover in 1997.',
    associatedArtifactId: 'mars-pathfinder-sojourner',
  },
  {
    id: 'elysium-planitia',
    name: 'Elysium Planitia',
    body: 'mars',
    type: 'plain',
    coordinates: { lat: 4.5, lon: 135.62 },
    diameterKm: 3000,
    description:
      'A vast, ultra-flat smooth volcanic plain along the equator of Mars near Elysium Mons.',
    significance:
      'Landing sanctuary of NASA’s InSight lander, which recorded 1,300+ marsquakes and mapped Mars’ liquid core.',
    associatedArtifactId: 'insight-lander',
  },
];

// ============================================================================
// 5. DATA RETRIEVAL & FILTER HELPERS
// ============================================================================
export function getArtifacts(body: CelestialBody): Artifact[] {
  if (body === 'moon') return MOON_ARTIFACTS;
  if (body === 'mars') return MARS_ARTIFACTS;
  if (body === 'deep_space') return DEEP_SPACE_ARTIFACTS;
  return [];
}

export function getAllArtifacts(): Artifact[] {
  return [...MOON_ARTIFACTS, ...MARS_ARTIFACTS, ...DEEP_SPACE_ARTIFACTS];
}

export function getArtifactById(id: string): Artifact | undefined {
  return getAllArtifacts().find((a) => a.id === id);
}

export function getPlanetaryLandmarks(body: CelestialBody): PlanetaryLandmark[] {
  if (body === 'moon') return LUNAR_LANDMARKS;
  if (body === 'mars') return MARS_LANDMARKS;
  return [];
}

export function getLunarLandmarks(): PlanetaryLandmark[] {
  return LUNAR_LANDMARKS;
}
