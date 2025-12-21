/**
 * Human Design Calculations - COMPLETE VERSION
 * Based on hdkit reference implementation
 *
 * Key fixes:
 * 1. Design = 88 DEGREES before Personality Sun (not 88 days fixed offset)
 * 2. All planets: Sun, Earth, Rahu, Ketu, Moon, Mercury, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto
 * 3. Earth = Sun + 180°
 * 4. Ketu (South Node) = Rahu (North Node) + 180°
 * 5. Correct profile = Personality Sun Line / Design Sun Line
 */

const swisseph = require('swisseph');
const path = require('path');

// Set ephemeris path for asteroid files (seas_18.se1 contains Chiron, Ceres, Pallas, Juno, Vesta)
const ephePath = path.join(__dirname, '..', 'ephe');
swisseph.swe_set_ephe_path(ephePath);
console.log('[SwissEph] Ephemeris path set to:', ephePath);

let ephemerisLib = null;
try {
  ephemerisLib = require('ephemeris-astronomy');
} catch (e) {
  // Optional - not needed if using Swiss Ephemeris files
}

const { getLocationInfo, getUTCOffset, convertToUTC } = require('./location-service.cjs');
const { longitudeToGate } = require('./gate-mapping.cjs');
const { HARMONIC_GATES, CENTERS_BY_CHANNEL } = require('./channel-data.cjs');
const { CHANNEL_NAMES, CHANNEL_CIRCUIT_SIMPLE } = require('./channel-names-data.cjs');
const { calculateIncarnationCross } = require('./incarnation-crosses-data.cjs');
const { enrichActivation, detectJuxtapositions } = require('./genetic-data.cjs');
const { TOOLTIPS } = require('./tooltips-data.cjs');

// Swiss Ephemeris planet constants
const PLANETS = {
  SUN: 0,        // swisseph.SE_SUN
  MOON: 1,       // swisseph.SE_MOON
  MERCURY: 2,    // swisseph.SE_MERCURY
  VENUS: 3,      // swisseph.SE_VENUS
  MARS: 4,       // swisseph.SE_MARS
  JUPITER: 5,    // swisseph.SE_JUPITER
  SATURN: 6,     // swisseph.SE_SATURN
  URANUS: 7,     // swisseph.SE_URANUS
  NEPTUNE: 8,    // swisseph.SE_NEPTUNE
  PLUTO: 9,      // swisseph.SE_PLUTO
  TRUE_NODE: 11, // swisseph.SE_TRUE_NODE (Rahu/North Node)
  MEAN_APOG: 12, // swisseph.SE_MEAN_APOG (Mean Black Moon Lilith)
  CHIRON: 15,    // swisseph.SE_CHIRON
  // Main asteroids (from seas_18.se1)
  CERES: 17,     // swisseph.SE_CERES
  PALLAS: 18,    // swisseph.SE_PALLAS
  JUNO: 19,      // swisseph.SE_JUNO
  VESTA: 20      // swisseph.SE_VESTA
};

/**
 * PHS and Rave Psychology mappings based on Color
 */
const PHS_MAPPINGS = {
  digestion: {
    1: 'Appetite',
    2: 'Taste',
    3: 'Thirst',
    4: 'Touch',
    5: 'Sound',
    6: 'Light'
  },
  digestionType: {
    left: { 1: 'Consecutive', 2: 'Open', 3: 'Hot', 4: 'Calm', 5: 'High', 6: 'Direct' },
    right: { 1: 'Alternating', 2: 'Closed', 3: 'Cold', 4: 'Nervous', 5: 'Low', 6: 'Indirect' }
  },
  environment: {
    1: 'Caves',
    2: 'Markets',
    3: 'Kitchens',
    4: 'Mountains',
    5: 'Valleys',
    6: 'Shores'
  },
  environmentType: {
    left: { 1: 'Selective', 2: 'Internal', 3: 'Wet', 4: 'Active', 5: 'Narrow', 6: 'Natural' },
    right: { 1: 'Blending', 2: 'External', 3: 'Dry', 4: 'Passive', 5: 'Wide', 6: 'Artificial' }
  },
  motivation: {
    1: 'Fear',
    2: 'Hope',
    3: 'Desire',
    4: 'Need',
    5: 'Probability',
    6: 'Innocence'
  },
  perspective: {
    1: 'Survival',
    2: 'Possibility',
    3: 'Power',
    4: 'Want',
    5: 'Probability',
    6: 'Personal'
  }
};

/**
 * Cognition Tone mappings (for Digestion and Perspective)
 * Used for environmentalTone and perspectiveTone
 */
const COGNITION_TONES = {
  1: 'Smell',         // Left - Splenic, primitive awareness
  2: 'Taste',         // Left - Splenic, discernment
  3: 'Outer Vision',  // Left - Ajna, external awareness
  4: 'Inner Vision',  // Right - Ajna, internal sight
  5: 'Feeling',       // Right - Solar Plexus, vibrational
  6: 'Touch'          // Right - Solar Plexus, physical connection
};

/**
 * Motivation Tone mappings
 * Tones 1-3: Left (Strategic) | Tones 4-6: Right (Receptive)
 */
const MOTIVATION_TONES = {
  1: 'Security',   // Left - Fear-based awareness, vigilance
  2: 'Uncertainty',  // Left - Exploring potential, curiosity
  3: 'Action',       // Left - Wanting, seeking, motivation
  4: 'Meditation',         // Right - Essential requirements, necessities
  5: 'Judgment',  // Right - Likelihood assessment, evaluation
  6: 'Acceptance'     // Right - Pure, untainted perspective
};

/**
 * Calculate planetary position using Swiss Ephemeris
 */
function calculatePlanetPosition(julianDay, planet) {
  return new Promise((resolve, reject) => {
    swisseph.swe_calc_ut(julianDay, planet, swisseph.SEFLG_MOSEPH, (result) => {
      if (result.error) {
        reject(new Error(result.error));
      } else {
        resolve(result.longitude);
      }
    });
  });
}

/**
 * Calculate planetary position with retrograde status
 * Returns object: { longitude, isRetrograde, speed }
 */
function calculatePlanetWithRetrograde(julianDay, planet) {
  return new Promise((resolve, reject) => {
    // Request speed info flag: SEFLG_SPEED
    const flags = swisseph.SEFLG_MOSEPH | swisseph.SEFLG_SPEED;
    swisseph.swe_calc_ut(julianDay, planet, flags, (result) => {
      if (result.error) {
        reject(new Error(result.error));
      } else {
        resolve({
          longitude: result.longitude,
          speed: result.longitudeSpeed,
          isRetrograde: result.longitudeSpeed < 0
        });
      }
    });
  });
}

/**
 * Find Design date (when Sun was 88 degrees before current position)
 * Uses binary search algorithm from hdkit Ruby implementation
 */
async function findDesignDate(personalitySunLongitude, birthJulianDay) {
  // Binary search between 96 and 84 days before birth
  let startJD = birthJulianDay - 96;
  let endJD = birthJulianDay - 84;
  let maxIterations = 100;
  let designJD = null;

  while (designJD === null && maxIterations > 0) {
    const midJD = (startJD + endJD) / 2;
    const midSunLong = await calculatePlanetPosition(midJD, PLANETS.SUN);

    // Calculate the retrograde offset (Personality - Design)
    // Design Sun should be BEHIND Personality Sun by 88 degrees
    let offset = personalitySunLongitude - midSunLong;

    // Handle wrap-around: if offset is negative, add 360
    if (offset < 0) offset += 360;

    // We want offset to be exactly 88 degrees
    // offset > 88 means Design Sun is too far back, need to search later (closer to birth)
    // offset < 88 means Design Sun is too close, need to search earlier (further from birth)

    // Check if we found it (within tolerance - relaxed to 0.001 degrees)
    if (Math.abs(offset - 88) < 0.001) {
      designJD = midJD;
    } else if (endJD - startJD < 0.0001) {
      // Search range too small, accept current best
      designJD = midJD;
    } else if (offset > 88) {
      // Design Sun is too far back, search later dates (move start forward)
      startJD = midJD;
    } else {
      // Design Sun is too close, search earlier dates (move end backward)
      endJD = midJD;
    }

    maxIterations--;
  }

  if (designJD === null) {
    throw new Error('Could not find Design date within 100 iterations');
  }

  return designJD;
}

/**
 * Helper function to safely get gate activation with error handling
 */
function safeGetGate(longitude, planetName) {
  const activation = longitudeToGate(longitude);
  if (!activation || activation.gate === null || activation.gate === undefined) {
    throw new Error(`Failed to find gate for ${planetName} at ${longitude}°`);
  }
  return activation;
}

/**
 * Helper to add house information to activation data
 */
function addHouseInfo(activationData, houseCusps) {
  if (houseCusps && activationData.longitude !== undefined) {
    const houseNum = getHouseNumber(activationData.longitude, houseCusps);
    activationData.house = houseNum;
    activationData.houseDescription = HOUSE_DESCRIPTIONS[houseNum];
  }
  return activationData;
}

/**
 * Calculate all planetary activations for Personality or Design
 * @param {number} julianDay - Julian day for calculations
 * @param {Array} houseCusps - Optional house cusps for adding house information
 */
/**
 * Calculate all planetary activations for Personality or Design
 * @param {number} julianDay - Julian day for calculations
 * @param {Array} houseCusps - Optional house cusps for adding house information
 */
async function calculateAllPlanets(julianDay, houseCusps = null) {
  const activations = {};

  try {
    // Helper to process planet
    const processPlanet = async (planetId, planetName) => {
      const data = await calculatePlanetWithRetrograde(julianDay, planetId);
      const activation = safeGetGate(data.longitude, planetName);

      const enriched = enrichActivation(addHouseInfo({
        longitude: data.longitude,
        gate: activation.gate,
        line: activation.line,
        color: activation.color,
        tone: activation.tone,
        base: activation.base,
        sign: activation.sign,
        isRetrograde: data.isRetrograde // Add Retrograde status
      }, houseCusps), planetName);

      return enriched;
    };

    // Calculate Sun (Retrograde not applicable for Sun usually, but good for consistency)
    activations.Sun = await processPlanet(PLANETS.SUN, 'Sun');

    // Calculate Earth (180° from Sun)
    // Earth takes retrograde status from Sun (which is never retrograde relative to Earth, but technically Earth 
    // physics in HD: Earth is opposite Sun. If Sun has speed, Earth has implied motion.
    // However, in geocentric astrology, Sun never retrograde. 
    // We will calculate Earth longitude manually but set retrograde false)
    let earthLong = activations.Sun.longitude + 180;
    if (earthLong >= 360) earthLong -= 360;
    const earthActivation = safeGetGate(earthLong, 'Earth');
    activations.Earth = enrichActivation(addHouseInfo({
      longitude: earthLong,
      gate: earthActivation.gate,
      line: earthActivation.line,
      color: earthActivation.color,
      tone: earthActivation.tone,
      base: earthActivation.base,
      sign: earthActivation.sign,
      isRetrograde: false // Earth/Sun never retrograde
    }, houseCusps), 'Earth');

    // Calculate Nodes
    activations.Rahu = await processPlanet(PLANETS.TRUE_NODE, 'Rahu');

    // South Node (Ketu - 180° from Rahu)
    let ketuLong = activations.Rahu.longitude + 180;
    if (ketuLong >= 360) ketuLong -= 360;
    const ketuActivation = safeGetGate(ketuLong, 'Ketu');
    activations.Ketu = enrichActivation(addHouseInfo({
      longitude: ketuLong,
      gate: ketuActivation.gate,
      line: ketuActivation.line,
      color: ketuActivation.color,
      tone: ketuActivation.tone,
      base: ketuActivation.base,
      sign: ketuActivation.sign,
      isRetrograde: activations.Rahu.isRetrograde // Nodes usually retrograde
    }, houseCusps), 'Ketu');

    // Calculate other planets
    activations.Moon = await processPlanet(PLANETS.MOON, 'Moon');
    activations.Mercury = await processPlanet(PLANETS.MERCURY, 'Mercury');
    activations.Venus = await processPlanet(PLANETS.VENUS, 'Venus');
    activations.Mars = await processPlanet(PLANETS.MARS, 'Mars');
    activations.Jupiter = await processPlanet(PLANETS.JUPITER, 'Jupiter');
    activations.Saturn = await processPlanet(PLANETS.SATURN, 'Saturn');
    activations.Uranus = await processPlanet(PLANETS.URANUS, 'Uranus');
    activations.Neptune = await processPlanet(PLANETS.NEPTUNE, 'Neptune');
    activations.Pluto = await processPlanet(PLANETS.PLUTO, 'Pluto');

    return activations;
  } catch (error) {
    throw new Error(`Planet calculation failed: ${error.message}`);
  }
}

/**
 * House meanings and descriptions
 */
const HOUSE_DESCRIPTIONS = {
  1: 'Self, Identity & First Impressions - The mask you wear, physical appearance, how you approach life',
  2: 'Money, Values & Possessions - Material resources, self-worth, what you value and attract',
  3: 'Communication & Learning - Siblings, neighbors, short trips, daily communication, early education',
  4: 'Home & Family - Roots, ancestry, emotional foundation, private life, mother/nurturing parent',
  5: 'Creativity & Pleasure - Romance, children, creative expression, fun, speculation, joy',
  6: 'Health & Service - Daily routines, work, health habits, service to others, pets',
  7: 'Partnerships & Marriage - One-on-one relationships, marriage, business partners, open enemies',
  8: 'Transformation & Shared Resources - Death/rebirth, sexuality, shared money, inheritance, deep transformation',
  9: 'Philosophy & Travel - Higher learning, philosophy, long-distance travel, religion, publishing',
  10: 'Career & Public Image - Career, reputation, achievements, father/authority figures, public life',
  11: 'Friends & Community - Friendships, groups, hopes, wishes, humanitarian causes, social networks',
  12: 'Spirituality & Hidden Matters - Subconscious, secrets, isolation, spirituality, hidden enemies, karma'
};

/**
 * Calculate Ascendant and all house cusps using Swiss Ephemeris
 */
async function calculateHousesAndAscendant(julianDay, latitude, longitude) {
  return new Promise((resolve, reject) => {
    // Use Placidus house system (P)
    swisseph.swe_houses(julianDay, latitude, longitude, 'P', (result) => {
      if (result.error) {
        reject(new Error(result.error));
      } else {
        // result.house contains cusps for houses 1-12 (index 1-12, 0 is unused)
        // result.ascendant contains the Ascendant degree (same as house[1])
        // result.mc contains the Midheaven (MC) degree
        // result.armc contains the Right Ascension of MC
        resolve({
          ascendant: result.ascendant,
          mc: result.mc,           // Midheaven (Medium Coeli)
          armc: result.armc,       // Right Ascension of MC (sidereal time as degrees)
          houseCusps: result.house
        });
      }
    });
  });
}

/**
 * Determine which house a given longitude falls into
 * A planet is IN a house if it's past the cusp and before the next cusp
 */
function getHouseNumber(longitude, houseCusps) {
  // Normalize longitude to 0-360
  let lon = longitude % 360;
  if (lon < 0) lon += 360;

  // Check each house - houseCusps array is 0-indexed (house 1 = index 0)
  for (let i = 0; i < 12; i++) {
    const houseNumber = i + 1; // House 1-12
    const currentCusp = houseCusps[i];
    const nextCusp = i === 11 ? houseCusps[0] : houseCusps[i + 1];

    // Handle wrap-around at 0/360 degrees
    if (currentCusp < nextCusp) {
      // Normal case: house doesn't cross 0°
      // Planet is in house N if: cusp[N] <= longitude < cusp[N+1]
      if (lon >= currentCusp && lon < nextCusp) {
        return houseNumber;
      }
    } else {
      // Wrap-around case: house crosses 0°
      // Planet is in house N if: longitude >= cusp[N] OR longitude < cusp[N+1]
      if (lon >= currentCusp || lon < nextCusp) {
        return houseNumber;
      }
    }
  }

  // Fallback: if exactly on a cusp, assign to the house it's entering
  return 1;
}

/**
 * Calculate Part of Fortune
 * Day formula: ASC + Moon - Sun
 * Night formula: ASC + Sun - Moon
 */
function calculatePartOfFortune(ascendant, sunLong, moonLong, isDayBirth) {
  let pof;
  if (isDayBirth) {
    // Day birth: ASC + Moon - Sun
    pof = ascendant + moonLong - sunLong;
  } else {
    // Night birth: ASC + Sun - Moon
    pof = ascendant + sunLong - moonLong;
  }

  // Normalize to 0-360 range
  while (pof < 0) pof += 360;
  while (pof >= 360) pof -= 360;

  return pof;
}

/**
 * Determine if birth is during day or night
 * Day birth = Sun in houses 7-12 (above the horizon)
 * Night birth = Sun in houses 1-6 (below the horizon)
 */
function isDayBirth(sunHouse) {
  // Traditional astrology: Day = Sun in houses 7-12 (above ASC-DSC axis)
  // Night = Sun in houses 1-6 (below ASC-DSC axis)
  return sunHouse >= 7 && sunHouse <= 12;
}

/**
 * Calculate complete Human Design chart
 */
async function calculateHumanDesign(params) {
  try {
    // Extract parameters (support both object and individual params for backwards compatibility)
    const birthDate = params.birthDate || params;
    const birthTime = params.birthTime || arguments[1];
    const birthLocation = params.birthLocation || arguments[2];
    const latitude = params.latitude;
    const longitude = params.longitude;
    const googleMapsApiKey = params.googleMapsApiKey || process.env.GOOGLE_MAPS_API_KEY;

    // Location options for hybrid service
    const locationOptions = {
      googleMapsApiKey,
      useGoogleMaps: !!googleMapsApiKey
    };

    let locationInfo;

    // If latitude/longitude provided, use them directly
    if (latitude !== undefined && longitude !== undefined) {
      locationInfo = {
        city: birthLocation,
        lat: parseFloat(latitude),
        lon: parseFloat(longitude),
        tz: 'UTC', // Will be determined by timezone lookup if needed
        source: 'manual-coordinates'
      };
    } else {
      // Get location info using hybrid service (static DB + Google Maps fallback)
      locationInfo = await getLocationInfo(birthLocation, birthDate, birthTime, locationOptions);
      if (!locationInfo) {
        throw new Error(`Location not found: ${birthLocation}`);
      }
    }

    // Convert to UTC (pass birthLocation string, not locationInfo object)
    const utcData = await convertToUTC(birthDate, birthTime, birthLocation, locationOptions);

    // Calculate Julian Day
    const julianDay = await new Promise((resolve, reject) => {
      swisseph.swe_julday(
        utcData.utcYear,
        utcData.utcMonth,
        utcData.utcDay,
        utcData.utcHour + (utcData.utcMinute / 60),
        swisseph.SE_GREG_CAL,
        (julday_ut) => {
          // The callback receives the Julian Day directly, not as an object
          resolve(julday_ut);
        }
      );
    });

    // Calculate houses for Personality (at birth time)
    const housesData = await calculateHousesAndAscendant(julianDay, locationInfo.lat, locationInfo.lon);
    const houseCusps = housesData.houseCusps;

    // Calculate Personality (at birth) with house information
    const personality = await calculateAllPlanets(julianDay, houseCusps);

    // Find Design date (88 degrees before Personality Sun)
    const designJulianDay = await findDesignDate(personality.Sun.longitude, julianDay);

    // Calculate Design with birth-time houses (shows where Design energies express in life)
    const design = await calculateAllPlanets(designJulianDay, houseCusps);

    // Detect juxtapositions (extremely rare - when both exalting AND detrimenting planets
    // for a gate.line are present, one in personality and one in design)
    detectJuxtapositions(personality, design);

    // Calculate Profile (Personality Sun Line / Design Sun Line)
    const profile = `${personality.Sun.line}/${design.Sun.line}`;

    // Collect all gates from both Personality and Design
    const allGates = new Set();
    const planetOrder = ['Sun', 'Earth', 'Rahu', 'Ketu', 'Moon', 'Mercury', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

    planetOrder.forEach(planet => {
      if (personality[planet]) allGates.add(personality[planet].gate);
      if (design[planet]) allGates.add(design[planet].gate);
    });

    // Find channels (harmonic gate pairs)
    const channelKeys = [];
    allGates.forEach(gate => {
      const harmonicGates = HARMONIC_GATES[gate];
      if (harmonicGates && Array.isArray(harmonicGates)) {
        harmonicGates.forEach(harmonicGate => {
          if (allGates.has(harmonicGate)) {
            const channelKey = [Math.min(gate, harmonicGate), Math.max(gate, harmonicGate)].join('-');
            if (!channelKeys.includes(channelKey)) {
              channelKeys.push(channelKey);
            }
          }
        });
      }
    });

    // Transform channels into enriched objects with names and circuitry
    const channels = channelKeys.map(channelKey => {
      return {
        gates: channelKey,
        name: CHANNEL_NAMES[channelKey] || `Channel ${channelKey}`,
        circuitry: CHANNEL_CIRCUIT_SIMPLE[channelKey] || 'Unknown',
        centers: CENTERS_BY_CHANNEL[channelKey] || []
      };
    });

    // Find defined centers (using channelKeys for lookups)
    const definedCenters = new Set();
    channelKeys.forEach(channelKey => {
      if (CENTERS_BY_CHANNEL[channelKey]) {
        CENTERS_BY_CHANNEL[channelKey].forEach(center => definedCenters.add(center));
      }
    });

    // Helper function to check if there's a motor-to-throat connection
    // Based on hdkit's motorToThroat() logic
    function hasMotorToThroat(channelKeys, centers) {
      const centersArray = Array.from(centers);

      if (!centersArray.some(c => c === 'Throat') ||
        !centersArray.some(c => c === 'SolarPlexus' || c === 'Sacral' || c === 'Root' || c === 'Ego')) {
        return false; // Throat undefined and/or no motor defined
      }

      // Solar Plexus to Throat (direct)
      if (centersArray.includes('SolarPlexus')) {
        if (channelKeys.some(ch => ch === '12-22' || ch === '35-36')) {
          return true;
        }
      }

      // Sacral to Throat
      if (centersArray.includes('Sacral')) {
        // Direct: 20-34
        if (channelKeys.includes('20-34')) {
          return true;
        }
        // Via G Center: Sacral→G + G→Throat
        if (channelKeys.some(ch => ch === '2-14' || ch === '5-15' || ch === '29-46')) {
          if (channelKeys.some(ch => ch === '1-8' || ch === '7-31' || ch === '10-20' || ch === '13-33')) {
            return true;
          }
        }
        // Via Spleen: Sacral→Spleen + Spleen→Throat
        if (channelKeys.includes('27-50')) {
          if (channelKeys.some(ch => ch === '16-48' || ch === '20-57')) {
            return true;
          }
          // Via G Center: Sacral→Spleen→G + G→Throat
          if (channelKeys.includes('10-57')) {
            if (channelKeys.some(ch => ch === '1-8' || ch === '7-31' || ch === '10-20' || ch === '13-33')) {
              return true;
            }
          }
        }
      }

      // Ego to Throat
      if (centersArray.includes('Ego')) {
        // Direct: 21-45
        if (channelKeys.includes('21-45')) {
          return true;
        }
        // Via G Center: Ego→G + G→Throat
        if (channelKeys.includes('25-51')) {
          if (channelKeys.some(ch => ch === '1-8' || ch === '7-31' || ch === '10-20' || ch === '13-33')) {
            return true;
          }
          // Via Spleen: Ego→G→Spleen + Spleen→Throat
          if (channelKeys.includes('10-57')) {
            if (channelKeys.some(ch => ch === '16-48' || ch === '20-57')) {
              return true;
            }
          }
        }
        // Via Spleen: Ego→Spleen + Spleen→Throat
        if (channelKeys.includes('26-44')) {
          if (channelKeys.some(ch => ch === '16-48' || ch === '20-57')) {
            return true;
          }
        }
      }

      // Root to Throat (via Spleen)
      if (centersArray.includes('Root')) {
        // Root→Spleen + Spleen→Throat
        if (channelKeys.some(ch => ch === '18-58' || ch === '28-38' || ch === '32-54')) {
          if (channelKeys.some(ch => ch === '16-48' || ch === '20-57')) {
            return true;
          }
        }
        // Root→G + G→Throat (via Spleen connection)
        if (channelKeys.includes('10-57')) {
          if (channelKeys.some(ch => ch === '1-8' || ch === '7-31' || ch === '10-20' || ch === '13-33')) {
            return true;
          }
        }
      }

      return false;
    }

    // Determine Type
    let type = 'Reflector';
    const hasSacral = definedCenters.has('Sacral');
    const hasMotor = definedCenters.has('Root') || definedCenters.has('SolarPlexus') || definedCenters.has('Ego');
    const hasThroat = definedCenters.has('Throat');
    const motorToThroat = hasMotorToThroat(channelKeys, definedCenters);

    if (hasSacral && motorToThroat) {
      type = 'Manifesting Generator';
    } else if (hasSacral) {
      type = 'Generator';
    } else if (motorToThroat) {
      type = 'Manifestor';
    } else if (definedCenters.size > 0 && !hasSacral) {
      type = 'Projector';
    }

    // Determine Authority with proper hierarchy and distinctions
    let authority = 'Lunar (wait 28 days)';

    // 1. Emotional Authority (Solar Plexus defined) - Highest priority
    if (definedCenters.has('SolarPlexus')) {
      authority = 'Emotional';
    }
    // 2. Sacral Authority (Sacral defined, Solar Plexus undefined)
    else if (hasSacral) {
      authority = 'Sacral';
    }
    // 3. Splenic Authority (Spleen defined, Solar Plexus and Sacral undefined)
    else if (definedCenters.has('Spleen')) {
      authority = 'Splenic';
    }
    // 4. Ego Authority (Ego defined, Solar Plexus, Sacral, and Spleen undefined)
    else if (definedCenters.has('Ego')) {
      // Check if Ego is connected to Throat (determines Manifested vs Projected)
      const egoDirectToThroat = channelKeys.includes('21-45');
      const egoViaGToThroat = channelKeys.includes('25-51') &&
        channelKeys.some(ch => ch === '1-8' || ch === '7-31' || ch === '10-20' || ch === '13-33');

      if (egoDirectToThroat || egoViaGToThroat) {
        authority = 'Ego Manifested';
      } else {
        authority = 'Ego Projected';
      }
    }
    // 5. Self-Projected Authority (G Center defined and connected to Throat)
    else if (definedCenters.has('G')) {
      // Check if G is connected to Throat
      const gToThroat = channelKeys.some(ch => ch === '1-8' || ch === '7-31' || ch === '10-20' || ch === '13-33');

      if (gToThroat && definedCenters.has('Throat')) {
        authority = 'Self-Projected';
      } else {
        // G defined but not connected to Throat = Outer Authority
        authority = 'No Inner Authority (Environment)';
      }
    }
    // 6. Mental/Environmental Authority (Ajna or Head defined, no motor or G)
    else if (definedCenters.has('Ajna') || definedCenters.has('Head')) {
      authority = 'Mental/Environmental (Outer Authority)';
    }
    // 7. Lunar Authority (Reflector - no centers defined)
    // Already set as default at the top

    // Calculate Incarnation Cross
    const incarnationCross = calculateIncarnationCross(
      personality.Sun.gate,
      personality.Earth.gate,
      design.Sun.gate,
      design.Earth.gate,
      personality.Sun.line,
      design.Sun.line
    );

    // Strategy mapping
    const strategyByType = {
      'Generator': 'Wait to Respond',
      'Manifesting Generator': 'Wait to Respond',
      'Projector': 'Wait for the Invitation',
      'Manifestor': 'Inform',
      'Reflector': 'Wait a Lunar Cycle'
    };

    // Signature (feeling when living correctly)
    const signatureByType = {
      'Generator': 'Satisfaction',
      'Manifesting Generator': 'Satisfaction and Peace',
      'Projector': 'Success',
      'Manifestor': 'Peace',
      'Reflector': 'Surprise'
    };

    // Not-Self Theme (feeling when not living correctly)
    const notSelfThemeByType = {
      'Generator': 'Frustration',
      'Manifesting Generator': 'Frustration and Anger',
      'Projector': 'Bitterness',
      'Manifestor': 'Anger',
      'Reflector': 'Disappointment'
    };

    // Profile names
    const profileNames = {
      '1/3': 'Investigator Martyr',
      '1/4': 'Investigator Opportunist',
      '2/4': 'Hermit Opportunist',
      '2/5': 'Hermit Heretic',
      '3/5': 'Martyr Heretic',
      '3/6': 'Martyr Role Model',
      '4/6': 'Opportunist Role Model',
      '4/1': 'Opportunist Investigator',
      '5/1': 'Heretic Investigator',
      '5/2': 'Heretic Hermit',
      '6/2': 'Role Model Hermit',
      '6/3': 'Role Model Martyr'
    };

    // Calculate Variable Type (16 types: PLR DLR, PLL DLL, etc.)
    // Based on tones of Personality Sun, Personality Rahu, Design Sun, Design Ketu
    const variableType = `P${personality.Sun.tone < 4 ? 'L' : 'R'}${personality.Rahu.tone < 4 ? 'L' : 'R'} D${design.Sun.tone < 4 ? 'L' : 'R'}${design.Ketu.tone < 4 ? 'L' : 'R'}`;

    // Calculate PHS (Primary Health System)
    // Digestion is based on Design Sun Color
    const designSunColorSide = design.Sun.tone < 4 ? 'left' : 'right';
    const digestionBase = PHS_MAPPINGS.digestion[design.Sun.color];
    const digestionType = PHS_MAPPINGS.digestionType[designSunColorSide][design.Sun.color];
    const digestion = `${digestionType} ${digestionBase}`;

    // Environment is based on Design Ketu (South Node) Color
    const designKetuColorSide = design.Ketu.tone < 4 ? 'left' : 'right';
    const environmentBase = PHS_MAPPINGS.environment[design.Ketu.color];
    const environmentType = PHS_MAPPINGS.environmentType[designKetuColorSide][design.Ketu.color];
    const environment = `${environmentType} ${environmentBase}`;

    // Tone names (cognition and motivation types)
    const digestionToneName = COGNITION_TONES[design.Sun.tone];
    const environmentalToneName = COGNITION_TONES[design.Ketu.tone];
    const motivationToneName = MOTIVATION_TONES[personality.Sun.tone];
    const perspectiveToneName = COGNITION_TONES[personality.Rahu.tone];

    // Helper function to determine orientation from tone (1-3 = Left, 4-6 = Right)
    const getOrientation = (tone) => tone <= 3 ? 'Left' : 'Right';

    // Calculate orientations based on tones
    const digestionOrientation = getOrientation(design.Sun.tone);
    const environmentOrientation = getOrientation(design.Ketu.tone);
    const motivationOrientation = getOrientation(personality.Sun.tone);
    const perspectiveOrientation = getOrientation(personality.Rahu.tone);

    // Calculate Rave Psychology
    // Motivation is based on Personality Sun Color
    const motivation = PHS_MAPPINGS.motivation[personality.Sun.color];

    // Perspective is based on Personality Rahu (North Node) Color
    const perspective = PHS_MAPPINGS.perspective[personality.Rahu.color];

    // Calculate astrological extras
    const extras = {};

    try {
      // Use already-calculated Ascendant from houses
      const ascendantLong = housesData.ascendant;
      const ascendantActivation = safeGetGate(ascendantLong, 'Ascendant');
      extras.ascendant = addHouseInfo({
        longitude: ascendantLong,
        gate: ascendantActivation.gate,
        line: ascendantActivation.line,
        color: ascendantActivation.color,
        tone: ascendantActivation.tone,
        base: ascendantActivation.base,
        sign: ascendantActivation.sign,
        description: 'Rising sign - the mask you wear, how others see you'
      }, houseCusps);

      // MC (Midheaven) - Career, public image, life direction
      // Already calculated by swe_houses - no additional computation needed!
      const mcLong = housesData.mc;
      const mcActivation = safeGetGate(mcLong, 'Midheaven');
      extras.midheaven = addHouseInfo({
        longitude: mcLong,
        gate: mcActivation.gate,
        line: mcActivation.line,
        color: mcActivation.color,
        tone: mcActivation.tone,
        base: mcActivation.base,
        sign: mcActivation.sign,
        description: 'Midheaven (MC) - Career path, public reputation, life goals'
      }, houseCusps);

      // IC (Imum Coeli) - Roots, home, private self
      // IC is always exactly opposite MC (MC + 180°)
      let icLong = mcLong + 180;
      if (icLong >= 360) icLong -= 360;
      const icActivation = safeGetGate(icLong, 'IC');
      extras.ic = addHouseInfo({
        longitude: icLong,
        gate: icActivation.gate,
        line: icActivation.line,
        color: icActivation.color,
        tone: icActivation.tone,
        base: icActivation.base,
        sign: icActivation.sign,
        description: 'Imum Coeli (IC) - Home, roots, private foundations, ancestry'
      }, houseCusps);

      // DC (Descendant) - Partnerships, relationships
      // DC is always exactly opposite Ascendant (ASC + 180°)
      let dcLong = ascendantLong + 180;
      if (dcLong >= 360) dcLong -= 360;
      const dcActivation = safeGetGate(dcLong, 'Descendant');
      extras.descendant = addHouseInfo({
        longitude: dcLong,
        gate: dcActivation.gate,
        line: dcActivation.line,
        color: dcActivation.color,
        tone: dcActivation.tone,
        base: dcActivation.base,
        sign: dcActivation.sign,
        description: 'Descendant (DC) - Partnerships, marriage, what you seek in others'
      }, houseCusps);

      // Determine if day or night birth based on Sun's house
      const isDay = isDayBirth(personality.Sun.house);

      // Calculate Part of Fortune (traditional formula only)
      const pofDayNight = calculatePartOfFortune(ascendantLong, personality.Sun.longitude, personality.Moon.longitude, isDay);

      const pofActivation = safeGetGate(pofDayNight, 'Part of Fortune');
      extras.partOfFortune = addHouseInfo({
        longitude: pofDayNight,
        gate: pofActivation.gate,
        line: pofActivation.line,
        color: pofActivation.color,
        tone: pofActivation.tone,
        base: pofActivation.base,
        sign: pofActivation.sign,
        formula: isDay ? 'Day: ASC + Moon - Sun' : 'Night: ASC + Sun - Moon',
        birthType: isDay ? 'day' : 'night',
        description: 'Point of worldly success, luck, and abundance'
      }, houseCusps);

      // Calculate Mean Black Moon Lilith
      const lilithData = await calculatePlanetWithRetrograde(julianDay, PLANETS.MEAN_APOG);
      const lilithActivation = safeGetGate(lilithData.longitude, 'Black Moon Lilith');
      extras.blackMoonLilith = addHouseInfo({
        longitude: lilithData.longitude,
        gate: lilithActivation.gate,
        line: lilithActivation.line,
        color: lilithActivation.color,
        tone: lilithActivation.tone,
        base: lilithActivation.base,
        sign: lilithActivation.sign,
        type: 'Mean',
        isRetrograde: lilithData.isRetrograde,
        description: 'Shadow self, repressed desires, the wild feminine'
      }, houseCusps);

      // Try to calculate Chiron (requires seas_18.se1 ephemeris file)
      try {
        const chironData = await calculatePlanetWithRetrograde(julianDay, PLANETS.CHIRON);
        if (chironData.longitude === undefined || isNaN(chironData.longitude)) {
          throw new Error('Invalid Chiron longitude returned');
        }
        const chironActivation = safeGetGate(chironData.longitude, 'Chiron');
        extras.chiron = addHouseInfo({
          longitude: chironData.longitude,
          gate: chironActivation.gate,
          line: chironActivation.line,
          color: chironActivation.color,
          tone: chironActivation.tone,
          base: chironActivation.base,
          sign: chironActivation.sign,
          isRetrograde: chironData.isRetrograde,
          description: 'The wounded healer - where you heal yourself and others'
        }, houseCusps);
      } catch (chironError) {
        console.error('[Chiron] Calculation failed:', chironError.message);
        extras.chiron = { available: false, error: chironError.message };
      }

      // Calculate Ceres (requires seas_18.se1 ephemeris file)
      try {
        const ceresData = await calculatePlanetWithRetrograde(julianDay, PLANETS.CERES);
        if (ceresData.longitude !== undefined && !isNaN(ceresData.longitude)) {
          const ceresActivation = safeGetGate(ceresData.longitude, 'Ceres');
          extras.ceres = addHouseInfo({
            longitude: ceresData.longitude,
            gate: ceresActivation.gate,
            line: ceresActivation.line,
            color: ceresActivation.color,
            tone: ceresActivation.tone,
            base: ceresActivation.base,
            sign: ceresActivation.sign,
            isRetrograde: ceresData.isRetrograde,
            description: 'Mothering, nurturing, grief, and sense of lack'
          }, houseCusps);
        }
      } catch (ceresError) {
        console.error('[Ceres] Calculation failed:', ceresError.message);
        extras.ceres = { available: false, error: ceresError.message };
      }

      // Calculate Pallas Athena (requires seas_18.se1 ephemeris file)
      try {
        const pallasData = await calculatePlanetWithRetrograde(julianDay, PLANETS.PALLAS);
        if (pallasData.longitude !== undefined && !isNaN(pallasData.longitude)) {
          const pallasActivation = safeGetGate(pallasData.longitude, 'Pallas');
          extras.pallas = addHouseInfo({
            longitude: pallasData.longitude,
            gate: pallasActivation.gate,
            line: pallasActivation.line,
            color: pallasActivation.color,
            tone: pallasActivation.tone,
            base: pallasActivation.base,
            sign: pallasActivation.sign,
            isRetrograde: pallasData.isRetrograde,
            description: 'Strategic intelligence, creative problem-solving, warrior spirit'
          }, houseCusps);
        }
      } catch (pallasError) {
        console.error('[Pallas] Calculation failed:', pallasError.message);
        extras.pallas = { available: false, error: pallasError.message };
      }

      // Calculate Juno (requires seas_18.se1 ephemeris file)
      try {
        const junoData = await calculatePlanetWithRetrograde(julianDay, PLANETS.JUNO);
        if (junoData.longitude !== undefined && !isNaN(junoData.longitude)) {
          const junoActivation = safeGetGate(junoData.longitude, 'Juno');
          extras.juno = addHouseInfo({
            longitude: junoData.longitude,
            gate: junoActivation.gate,
            line: junoActivation.line,
            color: junoActivation.color,
            tone: junoActivation.tone,
            base: junoActivation.base,
            sign: junoActivation.sign,
            isRetrograde: junoData.isRetrograde,
            description: 'Marriage, deep partnership, commitment'
          }, houseCusps);
        }
      } catch (junoError) {
        console.error('[Juno] Calculation failed:', junoError.message);
        extras.juno = { available: false, error: junoError.message };
      }

      // Calculate Vesta (requires seas_18.se1 ephemeris file)
      try {
        const vestaData = await calculatePlanetWithRetrograde(julianDay, PLANETS.VESTA);
        if (vestaData.longitude !== undefined && !isNaN(vestaData.longitude)) {
          const vestaActivation = safeGetGate(vestaData.longitude, 'Vesta');
          extras.vesta = addHouseInfo({
            longitude: vestaData.longitude,
            gate: vestaActivation.gate,
            line: vestaActivation.line,
            color: vestaActivation.color,
            tone: vestaActivation.tone,
            base: vestaActivation.base,
            sign: vestaActivation.sign,
            isRetrograde: vestaData.isRetrograde,
            description: 'Sacred inner fire, dedication, focus, purity'
          }, houseCusps);
        }
      } catch (vestaError) {
        console.error('[Vesta] Calculation failed:', vestaError.message);
        extras.vesta = { available: false, error: vestaError.message };
      }

    } catch (extrasError) {
      // If extras calculation fails, add error info but don't fail the whole calculation
      extras.error = `Some extras could not be calculated: ${extrasError.message}`;
    }

    // =========================================================================
    // Gate Categorization (Requirement #7)
    // =========================================================================
    // Import gate-to-center mapping
    const { GATE_TO_CENTER } = require('./gate-to-center-mapping.cjs');

    // Defined Gates = Gates that form a CHANNEL (both ends of channel are activated)
    // Hanging Gates need to be categorized by center status:
    //   - hangingOpen: Hanging gate in an OPEN center (more susceptible to conditioning) 
    //   - hangingClosed: Hanging gate in a DEFINED center (still has definition influence)
    // Open Gates = Gates that are NOT activated at all

    // Collect all activated gates from both Personality and Design
    const allActivatedGates = new Set();
    planetOrder.forEach(planet => {
      if (personality[planet]) allActivatedGates.add(personality[planet].gate);
      if (design[planet]) allActivatedGates.add(design[planet].gate);
    });

    // Defined gates: Gates that are part of a channel (have their harmonic pair activated)
    const definedGatesSet = new Set();
    channelKeys.forEach(channelKey => {
      const [gate1, gate2] = channelKey.split('-').map(Number);
      definedGatesSet.add(gate1);
      definedGatesSet.add(gate2);
    });
    const definedGates = Array.from(definedGatesSet).sort((a, b) => a - b);

    // Hanging gates: Activated gates that are NOT part of a channel
    const allHangingGates = Array.from(allActivatedGates)
      .filter(gate => !definedGatesSet.has(gate));

    // Split hanging gates by center status
    const hangingOpen = [];
    const hangingClosed = [];

    allHangingGates.forEach(gate => {
      const gateCenter = GATE_TO_CENTER[gate];
      if (definedCenters.has(gateCenter)) {
        // Gate is in a DEFINED center
        hangingClosed.push(gate);
      } else {
        // Gate is in an OPEN center
        hangingOpen.push(gate);
      }
    });

    // Sort both arrays
    hangingOpen.sort((a, b) => a - b);
    hangingClosed.sort((a, b) => a - b);

    // Open gates: Gates that are NOT activated at all
    const allGatesSet = new Set(Array.from({ length: 64 }, (_, i) => i + 1));
    const openGates = Array.from(allGatesSet)
      .filter(gate => !allActivatedGates.has(gate))
      .sort((a, b) => a - b);

    // =========================================================================
    // Definition Type Calculation (Requirement #8)
    // =========================================================================
    // Based on hdkit's definition() algorithm
    // Definition types: None, Single, Split, Triple Split, Quadruple Split

    let definition = 'None';

    // Only calculate if there are defined centers
    if (definedCenters.size > 0) {
      // Initialize up to 4 areas of definition (connected groups of centers)
      const areasOfDefinition = {
        1: [],
        2: [],
        3: [],
        4: []
      };

      // Process each channel to build connected groups
      channelKeys.forEach(channelKey => {
        // Get the centers this channel connects
        const centers = CENTERS_BY_CHANNEL[channelKey] || [];

        // Try to place centers in existing areas or create new ones
        // This is a union-find algorithm to group connected centers

        if (areasOfDefinition[1].length === 0 || centers.some(center => areasOfDefinition[1].includes(center))) {
          // Add to area 1 (either it's empty or this channel connects to it)
          areasOfDefinition[1] = [...new Set([...areasOfDefinition[1], ...centers])];
        } else if (centers.some(center => areasOfDefinition[1].includes(center)) && centers.some(center => areasOfDefinition[2].includes(center))) {
          // This channel bridges area 1 and area 2 - merge them
          areasOfDefinition[1] = [...new Set([...areasOfDefinition[1], ...areasOfDefinition[2], ...centers])];
          areasOfDefinition[2] = [];
        } else if (areasOfDefinition[2].length === 0 || centers.some(center => areasOfDefinition[2].includes(center))) {
          // Add to area 2
          areasOfDefinition[2] = [...new Set([...areasOfDefinition[2], ...centers])];
        } else if (centers.some(center => areasOfDefinition[1].includes(center)) && centers.some(center => areasOfDefinition[3].includes(center))) {
          // Bridge area 1 and 3
          areasOfDefinition[1] = [...new Set([...areasOfDefinition[1], ...areasOfDefinition[3], ...centers])];
          areasOfDefinition[3] = [];
        } else if (centers.some(center => areasOfDefinition[2].includes(center)) && centers.some(center => areasOfDefinition[3].includes(center))) {
          // Bridge area 2 and 3
          areasOfDefinition[2] = [...new Set([...areasOfDefinition[2], ...areasOfDefinition[3], ...centers])];
          areasOfDefinition[3] = [];
        } else if (areasOfDefinition[3].length === 0 || centers.some(center => areasOfDefinition[3].includes(center))) {
          // Add to area 3
          areasOfDefinition[3] = [...new Set([...areasOfDefinition[3], ...centers])];
        } else if (centers.some(center => areasOfDefinition[1].includes(center)) && centers.some(center => areasOfDefinition[4].includes(center))) {
          // Bridge area 1 and 4
          areasOfDefinition[1] = [...new Set([...areasOfDefinition[1], ...areasOfDefinition[4], ...centers])];
          areasOfDefinition[4] = [];
        } else if (centers.some(center => areasOfDefinition[2].includes(center)) && centers.some(center => areasOfDefinition[4].includes(center))) {
          // Bridge area 2 and 4
          areasOfDefinition[2] = [...new Set([...areasOfDefinition[2], ...areasOfDefinition[4], ...centers])];
          areasOfDefinition[4] = [];
        } else if (centers.some(center => areasOfDefinition[3].includes(center)) && centers.some(center => areasOfDefinition[4].includes(center))) {
          // Bridge area 3 and 4
          areasOfDefinition[3] = [...new Set([...areasOfDefinition[3], ...areasOfDefinition[4], ...centers])];
          areasOfDefinition[4] = [];
        } else if (areasOfDefinition[4].length === 0 || centers.some(center => areasOfDefinition[4].includes(center))) {
          // Add to area 4
          areasOfDefinition[4] = [...new Set([...areasOfDefinition[4], ...centers])];
        }
      });

      // Count non-empty areas to determine definition type
      if (areasOfDefinition[4].length !== 0) {
        definition = 'Quadruple Split';
      } else if (areasOfDefinition[3].length !== 0) {
        definition = 'Triple Split';
      } else if (areasOfDefinition[2].length !== 0) {
        definition = 'Split';
      } else if (areasOfDefinition[1].length !== 0) {
        definition = 'Single';
      }
    }

    return {
      // Birth Information
      birthInfo: {
        date: birthDate,
        time: birthTime,
        location: birthLocation,
        coordinates: `${locationInfo.lat}°N, ${locationInfo.lon}°E`,
        timezone: locationInfo.tz,
        locationSource: locationInfo.source || 'unknown'
      },

      // Essential Human Design Chart Information
      chart: {
        type,
        strategy: strategyByType[type] || 'Wait to Respond',
        authority,
        signature: signatureByType[type] || 'Satisfaction',
        notSelfTheme: notSelfThemeByType[type] || 'Frustration',
        profile,
        profileName: profileNames[profile] || profile,
        incarnationCross,
        definition,
        variableType
      },

      // PHS (Primary Health System)
      phs: {
        digestion,
        digestionTone: digestionToneName,
        digestionOrientation,
        environment,
        environmentalTone: environmentalToneName,
        environmentOrientation
      },

      // Rave Psychology
      ravePsychology: {
        motivation,
        motivationTone: motivationToneName,
        motivationOrientation,
        perspective,
        perspectiveTone: perspectiveToneName,
        perspectiveOrientation
      },

      // Centers
      centers: {
        defined: Array.from(definedCenters).sort(),
        open: (() => {
          const allCenters = ['Head', 'Ajna', 'Throat', 'G', 'SolarPlexus', 'Sacral', 'Spleen', 'Ego', 'Root'];
          return allCenters.filter(center => !definedCenters.has(center)).sort();
        })()
      },

      // Channels
      channels: channels.sort((a, b) => a.gates.localeCompare(b.gates)),

      // Planetary Activations
      personality,
      design,

      // Gate Categorization
      gatesByCategory: {
        definedGates,
        hangingOpen,
        hangingClosed,
        openGates
      },

      // Tooltips for UI hover states
      tooltips: TOOLTIPS,

      // Additional Astrological Points
      extras,

      // Version
      version: '3.8.0-fixed-mappings'
    };

  } catch (error) {
    throw new Error(`Calculation failed: ${error.message}`);
  }
}

module.exports = { calculateHumanDesign };
