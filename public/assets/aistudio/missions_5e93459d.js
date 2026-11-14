// missions.js
// Complete NASA Space Apps Challenge Dataset: "Abandoned but Not Forgotten" (15 Artifacts)
// Converted from NASA_Discarded_Equipment_Complete_Dossier_v2.docx

export const nasaDiscardedEquipment = [
  {
    "id": "apollo-11-eagle-easep",
    "artifactNumber": "01",
    "name": "Apollo 11 Lunar Module 'Eagle' & EASEP",
    "celestialBody": "Moon",
    "category": "Crewed Lunar Module (Descent Stage) & Surface Science Package",
    "timeline": {
      "launched": "1969-07-16",
      "landed": "1969-07-20",
      "ended": "1969-08-27",
      "summary": "Launched: July 16, 1969 | Landed: July 20, 1969 | Ascent Liftoff: July 21, 1969 (21h 36m on surface) | EASEP Ended: Aug 27, 1969"
    },
    "plannedVsActual": "EASEP designed for 1 lunar day (~14 Earth days); survived into its 2nd lunar day despite temperatures 30°C above max design limit. Laser retroreflector remains active today.",
    "location": "Mare Tranquillitatis (Sea of Tranquility), Moon",
    "coordinates": {
      "lat": 0.67416,
      "lon": 23.47314,
      "display": "Descent Stage: 0.67416° N, 23.47314° E | EASEP: 0.6735° N, 23.4730° E"
    },
    "specs": "Total LM Mass: 15,103 kg (Descent dry mass: 2,034 kg; 4.2 m octagonal prism, 9.4 m across footpads). EASEP: 48 kg, powered by 2 solar panels + isotope heater.",
    "instruments": [
      "Passive Seismometer",
      "Lunar Dust Detector",
      "Laser Ranging Retroreflector (LRRR)",
      "Solar Wind Composition Foil Collector"
    ],
    "scientificDiscoveries": "Achieved humanity's first crewed landing on another celestial body and returned 21.55 kg of lunar rock and soil. EASEP recorded the first lunar seismic data, while the power-free LRRR mirror still bounces laser beams from Earth to measure the Moon's distance to millimeter precision.",
    "storytellingHook": "The lower descent stage of 'Eagle' still stands upright at Tranquility Base as a silent launch pad, bearing a stainless-steel plaque signed by the crew and President Nixon: 'Here men from the planet Earth first set foot upon the Moon July 1969, A.D. We came in peace for all mankind.'",
    "nasaImageQuery": "Apollo 11 Lunar Module Eagle Tranquility Base",
    "officialSource": "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C"
  },
  {
    "id": "apollo-15-falcon-lrv-alsep",
    "artifactNumber": "02",
    "name": "Apollo 15 Lunar Module 'Falcon', LRV-1 & ALSEP",
    "celestialBody": "Moon",
    "category": "Crewed Lunar Module, First Electric Lunar Roving Vehicle & Nuclear Science Station",
    "timeline": {
      "launched": "1971-07-26",
      "landed": "1971-07-30",
      "ended": "1977-09-30",
      "summary": "Launched: July 26, 1971 | Landed: July 30, 1971 | Ascent Liftoff: Aug 2, 1971 (66h 55m on surface) | ALSEP Shutdown: Sept 30, 1977"
    },
    "plannedVsActual": "ALSEP operated continuously for over 6 years (July 1971 – Sept 1977), transmitting lunar interior and space environment data back to Earth.",
    "location": "Mare Imbrium at the foot of the Apennine Mountains (Hadley-Apennine), Moon",
    "coordinates": {
      "lat": 26.13239,
      "lon": 3.6333,
      "display": "LM Descent Stage: 26.13239° N, 3.63330° E | ALSEP Central Station: 26.1341° N, 3.6298° E"
    },
    "specs": "Total LM Mass: 16,430 kg (Descent dry mass: 2,797 kg). ALSEP Central Station: 25 kg, powered by a 17 kg SNAP-27 Plutonium-238 RTG (~70 W DC). LRV: electric 4-wheel rover.",
    "instruments": [
      "Lunar Roving Vehicle (LRV-1)",
      "Passive Seismometer",
      "Lunar Surface Magnetometer",
      "Solar Wind Spectrometer",
      "Suprathermal Ion Detector",
      "Cold Cathode Ion Gauge",
      "Lunar Dust Detector",
      "Heat Flow Experiment"
    ],
    "scientificDiscoveries": "First mission to drive an electric 'moon buggy' (covering 27.9 km across three EVAs and venturing up to 5 km from the lander) and collected 77.31 kg of samples, including the ancient 'Genesis Rock.' ALSEP measured moonquakes and heat escaping from the Moon's core.",
    "storytellingHook": "Before blasting off, Commander David Scott dropped a geologist's hammer and a falcon feather at the same time in the airless lunar vacuum—proving Galileo right as both hit the dust simultaneously. The crew also left a small aluminum figurine ('Fallen Astronaut') honoring 14 deceased American and Soviet space explorers.",
    "nasaImageQuery": "Apollo 15 Lunar Roving Vehicle Hadley",
    "officialSource": "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C"
  },
  {
    "id": "apollo-12-intrepid-alsep",
    "artifactNumber": "03",
    "name": "Apollo 12 Lunar Module 'Intrepid' & ALSEP",
    "celestialBody": "Moon",
    "category": "Crewed Lunar Module & Full Nuclear ALSEP Station",
    "timeline": {
      "launched": "1969-11-14",
      "landed": "1969-11-19",
      "ended": "1977-09-30",
      "summary": "Launched: Nov 14, 1969 | Landed: Nov 19, 1969 | Ascent Liftoff: Nov 20, 1969 (31h 31m on surface) | ALSEP Shutdown: Sept 30, 1977"
    },
    "plannedVsActual": "ALSEP operated for nearly 8 full years (Nov 1969 – Sept 1977), making it one of the longest-running surface stations on the Moon.",
    "location": "Oceanus Procellarum (Ocean of Storms), Moon",
    "coordinates": {
      "lat": -3.0128,
      "lon": -23.4219,
      "display": "LM Descent Stage: 3.0128° S, 23.4219° W (just 180 m from Surveyor 3) | ALSEP: 3.0094° S, 23.4246° W"
    },
    "specs": "Total LM Mass: 15,235 kg (Descent dry mass: 2,118 kg). ALSEP Central Station: 25 kg + SNAP-27 Plutonium-238 RTG (17 kg, ~70 W DC).",
    "instruments": [
      "Passive Seismometer",
      "Suprathermal Ion Detector",
      "Cold Cathode Ion Gauge",
      "Lunar Dust Detector",
      "Lunar Surface Magnetometer",
      "Solar Wind Spectrometer"
    ],
    "scientificDiscoveries": "Demonstrated pinpoint landing accuracy by touching down within walking distance of Surveyor 3, returning 34.35 kg of lunar rocks plus 10 kg of Surveyor 3 hardware. When the empty ascent stage was crashed 60 km away, the ALSEP seismometer recorded the Moon vibrating like a bell for nearly an hour.",
    "storytellingHook": "Astronauts Pete Conrad and Alan Bean strolled right up to the robotic Surveyor 3 lander—which had sat silent in the lunar dust for two and a half years—snapped photos beside it, and unbolted its camera and soil scoop to bring home to Earth.",
    "nasaImageQuery": "Apollo 12 Surveyor 3 Moon",
    "officialSource": "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C"
  },
  {
    "id": "surveyor-3",
    "artifactNumber": "04",
    "name": "Surveyor 3",
    "celestialBody": "Moon",
    "category": "Robotic Lunar Soft-Lander",
    "timeline": {
      "launched": "1967-04-17",
      "landed": "1967-04-20",
      "ended": "1967-05-04",
      "summary": "Launched: April 17, 1967 | Landed: April 20, 1967 | Last Contact: May 4, 1967"
    },
    "plannedVsActual": "Operated through its primary lunar day until 2 days after lunar night fell (May 4, 1967); revisited in person by Apollo 12 in November 1969.",
    "location": "Southeastern Oceanus Procellarum, Moon",
    "coordinates": {
      "lat": -3.0,
      "lon": -23.41,
      "display": "3.00° S, 23.41° W"
    },
    "specs": "Mass: 997.9 kg (2,200 lbs) at launch. Equipped with a deployable surface-sampler arm reaching 1.5 m (5 ft) and digging 18 cm (7 in) deep.",
    "instruments": [
      "Surveillance TV Camera (25 mm and 100 mm lenses beneath a movable mirror)",
      "Robotic Surface Sampler Scoop"
    ],
    "scientificDiscoveries": "Transmitted 6,326 television images and used its robotic claw to dig four trenches and perform 13 impact tests, proving lunar soil had the firmness of wet sand (~10 psi) and could safely support the weight of an Apollo Lunar Module.",
    "storytellingHook": "During landing, bright lunar rocks confused Surveyor 3's radar, causing its engines to keep firing so it bounced twice on the Moon—once 10 meters into the air!—before settling safely, only to be visited by human astronauts 31 months later.",
    "nasaImageQuery": "Surveyor 3 lunar lander",
    "officialSource": "https://science.nasa.gov/mission/surveyor-3/"
  },
  {
    "id": "mars-pathfinder-sojourner",
    "artifactNumber": "05",
    "name": "Mars Pathfinder & Sojourner Rover",
    "celestialBody": "Mars",
    "category": "Stationary Lander (Carl Sagan Memorial Station) & First Wheeled Mars Rover",
    "timeline": {
      "launched": "1996-12-04",
      "landed": "1997-07-04",
      "ended": "1997-09-27",
      "summary": "Launched: Dec 4, 1996 | Landed: July 4, 1997 | Final Transmission: Sept 27, 1997"
    },
    "plannedVsActual": "Sojourner was built for a 7-day primary mission (lander for 30 days) and operated for 83 Martian sols—nearly 12 times longer than planned.",
    "location": "Ares Vallis (ancient flood plain in Chryse Planitia), Mars",
    "coordinates": {
      "lat": 19.3,
      "lon": -33.52,
      "display": "19.30° N, 33.52° W (19.13° N, 33.22° W aerographic)"
    },
    "specs": "Sojourner Rover Mass: 10.6 kg (23 lbs), standing 30 cm (1 ft) tall—roughly the size of a microwave oven. Powered by solar panels + batteries.",
    "instruments": [
      "Alpha Proton X-Ray Spectrometer (APXS)",
      "Imager for Mars Pathfinder (IMP) stereo camera",
      "Rover cameras",
      "Atmospheric Structure & Meteorology Package"
    ],
    "scientificDiscoveries": "Returned 2.3 billion bits of data, 16,500+ lander photos, 550+ rover photos, and 15+ chemical rock/soil analyses. Rounded pebbles and cobbles proved liquid water once rushed across a warmer, wetter Mars.",
    "storytellingHook": "Encased in a 5.8-meter cluster of giant airbags, Pathfinder slammed into Mars at 31 mph and bounced like a beach ball 15 times—up to 15 meters high—before coming to rest and letting microwave-sized Sojourner roll down its ramp onto Martian soil.",
    "nasaImageQuery": "Sojourner rover Mars Pathfinder",
    "officialSource": "https://science.nasa.gov/mission/mars-pathfinder/"
  },
  {
    "id": "spirit-and-opportunity",
    "artifactNumber": "06",
    "name": "Mars Exploration Rovers: Spirit & Opportunity",
    "celestialBody": "Mars",
    "category": "Twin Robotic Geologist Rovers",
    "timeline": {
      "launched": "2003-06-10 / 2003-07-07",
      "landed": "2004-01-03 / 2004-01-24",
      "ended": "2010-03-22 / 2018-06-10",
      "summary": "Spirit Landed: Jan 3, 2004 (Ended: 2010) | Opportunity Landed: Jan 24, 2004 (Last Contact: June 10, 2018)"
    },
    "plannedVsActual": "Designed for 90-sol (3-month) missions; Spirit explored for over 6 years (7.73 km driven) and Opportunity lasted nearly 15 years (45.16 km / 28.06 mi driven).",
    "location": "Spirit: Gusev Crater | Opportunity: Meridiani Planum (Perseverance Valley), Mars",
    "coordinates": {
      "lat": -14.57,
      "lon": 175.47,
      "secondaryLat": -2.28,
      "secondaryLon": 354.77,
      "display": "Spirit: 14.57° S, 175.47° E | Opportunity: Landed 1.95° S, 354.47° E; final resting site 2.28° S, 354.77° E"
    },
    "specs": "Golf-cart-sized six-wheeled rovers powered by solar arrays (periodically cleaned by lucky Martian wind gusts) and rechargeable lithium-ion batteries.",
    "instruments": [
      "Panoramic Camera (Pancam)",
      "Microscopic Imager",
      "Rock Abrasion Tool (RAT)",
      "Mössbauer Spectrometer",
      "Alpha Particle X-Ray Spectrometer (APXS)",
      "Mini-TES"
    ],
    "scientificDiscoveries": "Found decisive geological and chemical proof—including tiny iron-rich mineral spheres nicknamed 'blueberries'—that liquid water once flowed and pooled on ancient Mars, creating environments that could have supported microbial life.",
    "storytellingHook": "Opportunity outlived its 90-day warranty by 55 times, trekking over 28 miles until a massive, planet-wide dust storm blotted out the Sun in June 2018, leaving the marathon explorer silent on the rim of Perseverance Valley.",
    "nasaImageQuery": "Mars Exploration Rover Spirit Opportunity",
    "officialSource": "https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/"
  },
  {
    "id": "viking-1-lander",
    "artifactNumber": "07",
    "name": "Viking 1 Lander (Thomas Mutch Memorial Station)",
    "celestialBody": "Mars",
    "category": "Orbiter & Stationary Lander Pair",
    "timeline": {
      "launched": "1975-08-20",
      "landed": "1976-07-20",
      "ended": "1982-11-11",
      "summary": "Launched: Aug 20, 1975 | Entered Orbit: June 19, 1976 | Landed: July 20, 1976 | Last Contact: Nov 11, 1982"
    },
    "plannedVsActual": "Planned for a 90-day primary surface mission; operated for over 6 years on Mars (1976–1982) before an accidental command interruption.",
    "location": "Western slopes of Chryse Planitia ('Golden Plain'), Mars",
    "coordinates": {
      "lat": 22.483,
      "lon": -47.94,
      "display": "22.483° N, 47.94° W"
    },
    "specs": "Total Spacecraft: 3,527 kg (7,776 lbs); Lander: 978 kg (2,156 lbs), powered by two SNAP-19 Plutonium-238 RTG nuclear generators.",
    "instruments": [
      "2 Facsimile Color Cameras",
      "Gas Chromatograph Mass Spectrometer (GCMS)",
      "Biological Laboratory",
      "X-Ray Fluorescence Spectrometer",
      "Remote Sampler Arm",
      "Weather Package"
    ],
    "scientificDiscoveries": "First spacecraft to successfully land and operate on Mars; captured the very first high-resolution color photographs from the Martian surface; conducted the first soil biology experiments and recorded 6+ years of Martian weather (-86°C pre-dawn to -33°C afternoon).",
    "storytellingHook": "Renamed the Thomas Mutch Memorial Station in 1982, Viking 1 faithfully beamed back weekly weather reports for over six years until a routine software update sent from Earth accidentally pointed its antenna away from home.",
    "nasaImageQuery": "Viking 1 lander Mars surface",
    "officialSource": "https://science.nasa.gov/mission/viking-1/"
  },
  {
    "id": "phoenix-mars-lander",
    "artifactNumber": "08",
    "name": "Phoenix Mars Lander",
    "celestialBody": "Mars",
    "category": "Stationary Martian Arctic Lander",
    "timeline": {
      "launched": "2007-08-04",
      "landed": "2008-05-25",
      "ended": "2008-11-02",
      "summary": "Launched: Aug 4, 2007 | Landed: May 25, 2008 | Last Contact: Nov 2, 2008 (Declared Complete: May 24, 2010)"
    },
    "plannedVsActual": "Designed for a 90-sol primary mission; operated for 157 Martian sols before the dark, freezing Arctic winter cut off sunlight to its solar panels.",
    "location": "Green Valley, Vastitas Borealis (Martian Arctic), Mars",
    "coordinates": {
      "lat": 68.2188,
      "lon": -125.7492,
      "display": "68.2188° N, 125.7492° W"
    },
    "specs": "Landing Mass: 350 kg (770 lbs); powered by twin octagonal solar arrays + NiH2 battery. Equipped with a 2.35-meter (7.7 ft) titanium/aluminum robotic digging arm.",
    "instruments": [
      "Robotic Arm (RA) & Robotic Arm Camera (RAC)",
      "Surface Stereo Imager (SSI)",
      "Thermal & Evolved Gas Analyzer (TEGA)",
      "MECA Wet Chemistry & Microscopy Lab",
      "Meteorological Station (MET)"
    ],
    "scientificDiscoveries": "Directly scooped up and verified water ice just centimeters beneath the Martian Arctic soil, discovered perchlorate salts and calcium carbonate in Martian dirt, and observed snow falling from high-altitude clouds.",
    "storytellingHook": "Named after the mythical bird reborn from ashes because it was built from the hardware of a canceled 2001 lander, Phoenix dug into Martian permafrost to taste real water ice—and later passed its exact spacecraft design on to the InSight lander.",
    "nasaImageQuery": "Phoenix Mars Lander surface",
    "officialSource": "https://science.nasa.gov/mission/phoenix/"
  },
  {
    "id": "insight-lander",
    "artifactNumber": "09",
    "name": "InSight Lander",
    "celestialBody": "Mars",
    "category": "Stationary Geophysical Lander",
    "timeline": {
      "launched": "2018-05-05",
      "landed": "2018-11-26",
      "ended": "2022-12-15",
      "summary": "Launched: May 5, 2018 | Landed: Nov 26, 2018 | End of Mission: Dec 15, 2022"
    },
    "plannedVsActual": "Designed for a 1-Mars-year (~2 Earth years) primary mission; operated for over 4 Earth years until Martian dust covered its solar panels.",
    "location": "Western Elysium Planitia, Mars",
    "coordinates": {
      "lat": 4.5,
      "lon": 135.62,
      "display": "4.50° N, 135.62° E (about 600 km from Curiosity's Gale Crater)"
    },
    "specs": "Built on the Mars Phoenix lander frame with two circular solar arrays and a 1.8-meter (5 ft 9 in) robotic arm used to place instruments directly onto the ground.",
    "instruments": [
      "SEIS (ultra-sensitive dome seismometer)",
      "HP³ heat-flow probe",
      "RISE radio-science experiment",
      "Wind and air-pressure sensors",
      "Deployment cameras"
    ],
    "scientificDiscoveries": "First mission to measure Mars' 'vital signs'—detecting over 1,300 marsquakes and meteoroid impacts, mapping the thickness of Mars' crust, lumpy mantle, and liquid iron core, and recording the first audio of Martian wind.",
    "storytellingHook": "As thick red dust gradually blanketed its solar arrays over four years, InSight used its final trickle of energy in December 2022 to snap and send home one last dusty selfie before going to sleep forever.",
    "nasaImageQuery": "InSight Mars lander seismometer",
    "officialSource": "https://science.nasa.gov/mission/insight/"
  },
  {
    "id": "ingenuity-mars-helicopter",
    "artifactNumber": "10",
    "name": "Ingenuity Mars Helicopter",
    "celestialBody": "Mars",
    "category": "Autonomous Solar-Powered Rotorcraft",
    "timeline": {
      "launched": "2020-07-30",
      "landed": "2021-02-18",
      "ended": "2024-01-25",
      "summary": "Launched: July 30, 2020 | Landed: Feb 18, 2021 | First Flight: April 19, 2021 | Final Flight (#72): Jan 18, 2024 | Retired: Jan 25, 2024"
    },
    "plannedVsActual": "Built for a 30-day demo of up to 5 flights; completed 72 flights across nearly 3 years (128.8 flying minutes, 17.0 km distance, 24.0 m max altitude).",
    "location": "Valinor Hills, Jezero Crater, Mars",
    "coordinates": {
      "lat": 18.49,
      "lon": 77.42,
      "display": "Landed at 18.44° N, 77.45° E; final resting site at Valinor Hills (18.49° N, 77.42° E)"
    },
    "specs": "Mass: 1.8 kg (3.97 lbs on Earth; weighs just 0.68 kg / 1.5 lbs in Mars gravity). Counter-rotating carbon-fiber rotors spanning 1.2 m (4 ft); solar-charged Li-ion batteries.",
    "instruments": [
      "High-resolution downward navigation camera",
      "Horizon-facing color camera",
      "Laser altimeter",
      "Inclinometer",
      "Two-way radio link via Perseverance"
    ],
    "scientificDiscoveries": "Achieved humanity's 'Wright Brothers moment' on another planet, proving controlled aerodynamic flight is possible in Mars' ultra-thin atmosphere (<1% of Earth's air density), and served as an aerial scout for the Perseverance rover.",
    "storytellingHook": "Tucked inside Ingenuity was a postage-stamp-sized swatch of fabric from the original 1903 Wright Flyer; after soaring 72 times across Jezero Crater and chipping a rotor blade, the tiny 4-pound pioneer now serves as a stationary weather monument on Mars.",
    "nasaImageQuery": "Ingenuity Mars helicopter",
    "officialSource": "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/"
  },
  {
    "id": "dawn-spacecraft",
    "artifactNumber": "11",
    "name": "Dawn Spacecraft",
    "celestialBody": "Ceres (Asteroid Belt)",
    "category": "Ion-Propelled Deep-Space Orbiter",
    "timeline": {
      "launched": "2007-09-27",
      "landed": null,
      "ended": "2018-11-01",
      "summary": "Launched: Sept 27, 2007 | Orbited Vesta: 2011–2012 | Orbited Ceres: 2015–2018 | End of Mission: Oct/Nov 2018"
    },
    "plannedVsActual": "Operated for 11 years across two deep-space destinations until exhausting its hydrazine attitude-control propellant in late 2018.",
    "location": "Perpetual, silent, unpowered orbit around dwarf planet Ceres in the main asteroid belt between Mars and Jupiter.",
    "coordinates": {
      "lat": null,
      "lon": null,
      "display": "High planetary-protection orbit around Dwarf Planet Ceres"
    },
    "specs": "Solar-powered spacecraft propelled by three high-efficiency Xenon Ion Thrusters alongside hydrazine attitude-control thrusters.",
    "instruments": [
      "Framing Camera (FC)",
      "Visible and Infrared Mapping Spectrometer (VIR)",
      "Gamma Ray and Neutron Detector (GRaND)"
    ],
    "scientificDiscoveries": "First spacecraft ever to orbit two extraterrestrial bodies—giant protoplanet Vesta and dwarf planet Ceres. Revealed bright sodium carbonate salt deposits and signs of recent cryovolcanism and subsurface brines on Ceres.",
    "storytellingHook": "Before Dawn ran out of thruster fuel after 11 years, NASA carefully parked it in a high, stable 'planetary protection' orbit so it will silently circle dwarf planet Ceres for decades without risking a crash onto its potentially habitable surface.",
    "nasaImageQuery": "Dawn spacecraft Ceres Vesta",
    "officialSource": "https://science.nasa.gov/mission/dawn/"
  },
  {
    "id": "near-shoemaker",
    "artifactNumber": "12",
    "name": "NEAR Shoemaker",
    "celestialBody": "433 Eros (Asteroid)",
    "category": "Asteroid Orbiter Turned Improvised Lander",
    "timeline": {
      "launched": "1996-02-17",
      "landed": "2001-02-12",
      "ended": "2001-02-28",
      "summary": "Launched: Feb 17, 1996 | Entered Eros Orbit: Feb 14, 2000 | Landed on Eros: Feb 12, 2001 | Last Contact: Feb 28, 2001"
    },
    "plannedVsActual": "Operated for 5 years, including an unexpected 16-day bonus surface mission after touching down on an asteroid it was never built to land on.",
    "location": "Resting intact on the surface of 21-mile-long asteroid 433 Eros, just south of the saddle-shaped feature named Himeros.",
    "coordinates": {
      "lat": null,
      "lon": null,
      "display": "Surface of Asteroid 433 Eros (south of Himeros)"
    },
    "specs": "Mass: 805 kg (1,775 lbs); first spacecraft to rely on solar cells for power beyond the orbit of Mars. Had no landing gear.",
    "instruments": [
      "Multi-Spectral Imager (MSI)",
      "Near-Infrared Spectrometer (NIS)",
      "X-Ray/Gamma-Ray Spectrometer (XGRS)",
      "Magnetometer (MAG)",
      "Laser Rangefinder (NLR)"
    ],
    "scientificDiscoveries": "First human-made object to orbit and land on an asteroid; returned 10 times more data than planned (160,000 images), mapped over 70% of Eros, and showed the asteroid has no magnetic field and a density like Earth's crust.",
    "storytellingHook": "Built strictly as an orbiter with zero landing legs, NEAR Shoemaker was gently guided down onto Eros at a walking pace of 4 mph—where it survived touchdown and broadcast gamma-ray science from the asteroid's surface for two weeks until -173°C (-279°F) cold froze its systems.",
    "nasaImageQuery": "NEAR Shoemaker asteroid Eros",
    "officialSource": "https://science.nasa.gov/mission/near-shoemaker/"
  },
  {
    "id": "pioneer-10",
    "artifactNumber": "13",
    "name": "Pioneer 10",
    "celestialBody": "Interstellar Space",
    "category": "Outer-Planet Flyby & Interstellar Probe",
    "timeline": {
      "launched": "1972-03-02",
      "landed": null,
      "ended": "2003-01-23",
      "summary": "Launched: March 2, 1972 | Jupiter Flyby: Dec 4, 1973 | Crossed Neptune's Orbit: June 13, 1983 | Last Signal: Jan 23, 2003"
    },
    "plannedVsActual": "Designed for a 21-month mission to Jupiter; operated for over 30 years until its nuclear power dropped too low to transmit from 7.6 billion miles away.",
    "location": "Drifting silently through interstellar space (over 11 billion miles from Earth) toward the red giant star Aldebaran in Taurus.",
    "coordinates": {
      "lat": null,
      "lon": null,
      "display": "Interstellar trajectory toward Aldebaran (Constellation Taurus)"
    },
    "specs": "Mass: 258 kg (569 lbs); reached 51,682 km/h (32,110 mph) at launch. First all-nuclear spacecraft (two SNAP-19 Plutonium-238 RTGs).",
    "instruments": [
      "Imaging Photopolarimeter",
      "Helium Vector Magnetometer",
      "Plasma Analyzer",
      "Cosmic Ray & Geiger Tube Telescopes",
      "Meteoroid Detectors"
    ],
    "scientificDiscoveries": "First spacecraft to cross the asteroid belt, fly past Jupiter, and cross Neptune's orbit; captured the first close-up photos of Jupiter's Great Red Spot and moons (Ganymede, Europa, Callisto) and mapped Jupiter's intense radiation belts.",
    "storytellingHook": "Bolted to Pioneer 10's antenna struts is a gold-anodized aluminum plaque engraved with a man, a woman, our solar system, and a pulsar map showing Earth's cosmic address—a message in a bottle drifting toward Aldebaran for the next two million years.",
    "nasaImageQuery": "Pioneer 10 spacecraft plaque",
    "officialSource": "https://science.nasa.gov/mission/pioneer-10/"
  },
  {
    "id": "pioneer-11",
    "artifactNumber": "14",
    "name": "Pioneer 11",
    "celestialBody": "Interstellar Space",
    "category": "Outer-Planet Flyby & Interstellar Probe",
    "timeline": {
      "launched": "1973-04-06",
      "landed": null,
      "ended": "1995-11-24",
      "summary": "Launched: April 6, 1973 | Jupiter Flyby: Dec 3, 1974 | Saturn Flyby: Sept 1, 1979 | Last Signal: Nov 24, 1995"
    },
    "plannedVsActual": "Designed for a 21-month outer-planet flyby mission; operated for over 22 years until declining nuclear RTG power prevented antenna pointing.",
    "location": "Drifting silently through interstellar space (over 9.1 billion miles from Earth) toward the constellation Aquila (passing star Lambda Aquila in ~4 million years).",
    "coordinates": {
      "lat": null,
      "lon": null,
      "display": "Interstellar trajectory toward Constellation Aquila"
    },
    "specs": "Mass: 258.5 kg (570 lbs); hexagonal bus with a 2.74-meter (9 ft) high-gain dish antenna, powered by two SNAP-19 Plutonium-238 RTGs.",
    "instruments": [
      "Imaging Photopolarimeter",
      "Helium Vector & Triaxial Fluxgate Magnetometers",
      "Infrared Radiometer",
      "Plasma Analyzer",
      "Charged Particle & Cosmic Ray Telescopes"
    ],
    "scientificDiscoveries": "First spacecraft to fly past Saturn (skimming within 21,000 km of its cloud tops), discovering Saturn's narrow F ring and a new moon, and captured the first close-up images of Jupiter's polar regions.",
    "storytellingHook": "Like its twin Pioneer 10, Pioneer 11 carries Carl Sagan's golden plaque depicting humanity and Earth's location relative to 14 pulsars—now coasting silently like a cosmic ghost ship toward the heart of the Milky Way.",
    "nasaImageQuery": "Pioneer 11 Saturn spacecraft",
    "officialSource": "https://science.nasa.gov/mission/pioneer-11/"
  },
  {
    "id": "kepler-space-telescope",
    "artifactNumber": "15",
    "name": "Kepler Space Telescope (Kepler / K2)",
    "celestialBody": "Heliocentric Orbit",
    "category": "Deep-Space Planet-Hunting Observatory",
    "timeline": {
      "launched": "2009-03-06",
      "landed": null,
      "ended": "2018-10-30",
      "summary": "Launched: March 6, 2009 | K2 Extended Mission: May 2013 | Retired: Oct 30, 2018"
    },
    "plannedVsActual": "Designed for a 3.5-year primary mission; operated for 9.5 years across its primary survey and 19 'K2' sky campaigns until running out of fuel.",
    "location": "Decommissioned and drifting silently in a safe, Earth-trailing heliocentric orbit around the Sun.",
    "coordinates": {
      "lat": null,
      "lon": null,
      "display": "Earth-trailing Heliocentric Orbit around the Sun"
    },
    "specs": "Built around a 1.4-meter (4 ft 7 in) primary mirror and 0.95-meter (3 ft) aperture photometer—the largest digital camera in deep space at launch.",
    "instruments": [
      "Wide-field CCD Photometer array (stared at 150,000+ stars in Cygnus and 500,000+ stars in K2)"
    ],
    "scientificDiscoveries": "Discovered more than 2,600 confirmed exoplanets (including Earth-sized planets in habitable zones and multi-planet systems like Kepler-9 and Kepler-11), proving that planets outnumber stars in our Milky Way galaxy.",
    "storytellingHook": "When two of its four pointing wheels failed in 2013, NASA engineers refused to quit—balancing Kepler against the gentle pressure of sunlight itself (like a kayak steering into a current) to launch its 'K2' second act and discover hundreds more worlds before its fuel tank ran dry.",
    "nasaImageQuery": "Kepler Space Telescope exoplanets",
    "officialSource": "https://science.nasa.gov/mission/kepler/"
  }
];

// Helper filters for your website UI (Moon, Mars, Deep Space & Asteroids)
export const missionsByZone = {
  moon: nasaDiscardedEquipment.filter((m) => m.celestialBody === "Moon"),
  mars: nasaDiscardedEquipment.filter((m) => m.celestialBody === "Mars"),
  deepSpace: nasaDiscardedEquipment.filter(
    (m) => m.celestialBody !== "Moon" && m.celestialBody !== "Mars"
  ),
};

export default nasaDiscardedEquipment;
