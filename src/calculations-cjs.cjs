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
const { getLocationInfo, getUTCOffset, convertToUTC } = require('./location-service.cjs');
const { longitudeToGate } = require('./gate-mapping.cjs');
const { HARMONIC_GATES, CENTERS_BY_CHANNEL } = require('./channel-data.cjs');
const { calculateIncarnationCross } = require('./incarnation-crosses-data.cjs');
const { enrichActivation } = require('./genetic-data.cjs');

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
  CHIRON: 15     // swisseph.SE_CHIRON
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
    1: 'Security',
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
  1: 'Insecurity',   // Left - Fear-based awareness, vigilance
  2: 'Possibility',  // Left - Exploring potential, curiosity
  3: 'Desire',       // Left - Wanting, seeking, motivation
  4: 'Need',         // Right - Essential requirements, necessities
  5: 'Probability',  // Right - Likelihood assessment, evaluation
  6: 'Innocence'     // Right - Pure, untainted perspective
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

    // Check if we found it (within tolerance)
    if (offset < 88.00001 && offset > 87.99999) {
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
async function calculateAllPlanets(julianDay, houseCusps = null) {
  const activations = {};

  try {
    // Calculate Sun
    const sunLong = await calculatePlanetPosition(julianDay, PLANETS.SUN);
    const sunActivation = safeGetGate(sunLong, 'Sun');
    activations.Sun = enrichActivation(addHouseInfo({
      longitude: sunLong,
      gate: sunActivation.gate,
      line: sunActivation.line,
      color: sunActivation.color,
      tone: sunActivation.tone,
      base: sunActivation.base,
      sign: sunActivation.sign
    }, houseCusps), 'Sun');

    // Calculate Earth (180° from Sun)
    let earthLong = sunLong + 180;
    if (earthLong >= 360) earthLong -= 360;
    const earthActivation = safeGetGate(earthLong, 'Earth');
    activations.Earth = enrichActivation(addHouseInfo({
      longitude: earthLong,
      gate: earthActivation.gate,
      line: earthActivation.line,
      color: earthActivation.color,
      tone: earthActivation.tone,
      base: earthActivation.base,
      sign: earthActivation.sign
    }, houseCusps), 'Earth');

    // Calculate North Node (Rahu)
    const rahuLong = await calculatePlanetPosition(julianDay, PLANETS.TRUE_NODE);
    const rahuActivation = safeGetGate(rahuLong, 'Rahu');
    activations.Rahu = enrichActivation(addHouseInfo({
      longitude: rahuLong,
      gate: rahuActivation.gate,
      line: rahuActivation.line,
      color: rahuActivation.color,
      tone: rahuActivation.tone,
      base: rahuActivation.base,
      sign: rahuActivation.sign
    }, houseCusps), 'Rahu');

    // Calculate South Node (Ketu - 180° from Rahu)
    let ketuLong = rahuLong + 180;
    if (ketuLong >= 360) ketuLong -= 360;
    const ketuActivation = safeGetGate(ketuLong, 'Ketu');
    activations.Ketu = enrichActivation(addHouseInfo({
      longitude: ketuLong,
      gate: ketuActivation.gate,
      line: ketuActivation.line,
      color: ketuActivation.color,
      tone: ketuActivation.tone,
      base: ketuActivation.base,
      sign: ketuActivation.sign
    }, houseCusps), 'Ketu');

    // Calculate Moon
    const moonLong = await calculatePlanetPosition(julianDay, PLANETS.MOON);
    const moonActivation = safeGetGate(moonLong, 'Moon');
    activations.Moon = enrichActivation(addHouseInfo({
      longitude: moonLong,
      gate: moonActivation.gate,
      line: moonActivation.line,
      color: moonActivation.color,
      tone: moonActivation.tone,
      base: moonActivation.base,
      sign: moonActivation.sign
    }, houseCusps), 'Moon');

    // Calculate Mercury
    const mercuryLong = await calculatePlanetPosition(julianDay, PLANETS.MERCURY);
    const mercuryActivation = safeGetGate(mercuryLong, 'Mercury');
    activations.Mercury = enrichActivation(addHouseInfo({
      longitude: mercuryLong,
      gate: mercuryActivation.gate,
      line: mercuryActivation.line,
      color: mercuryActivation.color,
      tone: mercuryActivation.tone,
      base: mercuryActivation.base,
      sign: mercuryActivation.sign
    }, houseCusps), 'Mercury');

    // Calculate Venus (Note: Mars comes before Venus in HD)
    const venusLong = await calculatePlanetPosition(julianDay, PLANETS.VENUS);
    const venusActivation = safeGetGate(venusLong, 'Venus');
    activations.Venus = enrichActivation(addHouseInfo({
      longitude: venusLong,
      gate: venusActivation.gate,
      line: venusActivation.line,
      color: venusActivation.color,
      tone: venusActivation.tone,
      base: venusActivation.base,
      sign: venusActivation.sign
    }, houseCusps), 'Venus');

    // Calculate Mars
    const marsLong = await calculatePlanetPosition(julianDay, PLANETS.MARS);
    const marsActivation = safeGetGate(marsLong, 'Mars');
    activations.Mars = enrichActivation(addHouseInfo({
      longitude: marsLong,
      gate: marsActivation.gate,
      line: marsActivation.line,
      color: marsActivation.color,
      tone: marsActivation.tone,
      base: marsActivation.base,
      sign: marsActivation.sign
    }, houseCusps), 'Mars');

    // Calculate Jupiter
    const jupiterLong = await calculatePlanetPosition(julianDay, PLANETS.JUPITER);
    const jupiterActivation = safeGetGate(jupiterLong, 'Jupiter');
    activations.Jupiter = enrichActivation(addHouseInfo({
      longitude: jupiterLong,
      gate: jupiterActivation.gate,
      line: jupiterActivation.line,
      color: jupiterActivation.color,
      tone: jupiterActivation.tone,
      base: jupiterActivation.base,
      sign: jupiterActivation.sign
    }, houseCusps), 'Jupiter');

    // Calculate Saturn
    const saturnLong = await calculatePlanetPosition(julianDay, PLANETS.SATURN);
    const saturnActivation = safeGetGate(saturnLong, 'Saturn');
    activations.Saturn = enrichActivation(addHouseInfo({
      longitude: saturnLong,
      gate: saturnActivation.gate,
      line: saturnActivation.line,
      color: saturnActivation.color,
      tone: saturnActivation.tone,
      base: saturnActivation.base,
      sign: saturnActivation.sign
    }, houseCusps), 'Saturn');

    // Calculate Uranus
    const uranusLong = await calculatePlanetPosition(julianDay, PLANETS.URANUS);
    const uranusActivation = safeGetGate(uranusLong, 'Uranus');
    activations.Uranus = enrichActivation(addHouseInfo({
      longitude: uranusLong,
      gate: uranusActivation.gate,
      line: uranusActivation.line,
      color: uranusActivation.color,
      tone: uranusActivation.tone,
      base: uranusActivation.base,
      sign: uranusActivation.sign
    }, houseCusps), 'Uranus');

    // Calculate Neptune
    const neptuneLong = await calculatePlanetPosition(julianDay, PLANETS.NEPTUNE);
    const neptuneActivation = safeGetGate(neptuneLong, 'Neptune');
    activations.Neptune = enrichActivation(addHouseInfo({
      longitude: neptuneLong,
      gate: neptuneActivation.gate,
      line: neptuneActivation.line,
      color: neptuneActivation.color,
      tone: neptuneActivation.tone,
      base: neptuneActivation.base,
      sign: neptuneActivation.sign
    }, houseCusps), 'Neptune');

    // Calculate Pluto
    const plutoLong = await calculatePlanetPosition(julianDay, PLANETS.PLUTO);
    const plutoActivation = safeGetGate(plutoLong, 'Pluto');
    activations.Pluto = enrichActivation(addHouseInfo({
      longitude: plutoLong,
      gate: plutoActivation.gate,
      line: plutoActivation.line,
      color: plutoActivation.color,
      tone: plutoActivation.tone,
      base: plutoActivation.base,
      sign: plutoActivation.sign
    }, houseCusps), 'Pluto');

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
        resolve({
          ascendant: result.ascendant,
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
      locationInfo = await getLocationInfo(birthLocation, birthDate, locationOptions);
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
    const channels = [];
    allGates.forEach(gate => {
      const harmonicGates = HARMONIC_GATES[gate];
      if (harmonicGates && Array.isArray(harmonicGates)) {
        harmonicGates.forEach(harmonicGate => {
          if (allGates.has(harmonicGate)) {
            const channel = [Math.min(gate, harmonicGate), Math.max(gate, harmonicGate)].join('-');
            if (!channels.includes(channel)) {
              channels.push(channel);
            }
          }
        });
      }
    });

    // Find defined centers
    const definedCenters = new Set();
    channels.forEach(channel => {
      if (CENTERS_BY_CHANNEL[channel]) {
        CENTERS_BY_CHANNEL[channel].forEach(center => definedCenters.add(center));
      }
    });

    // Helper function to check if there's a motor-to-throat connection
    // Based on hdkit's motorToThroat() logic
    function hasMotorToThroat(channels, centers) {
      const centersArray = Array.from(centers);

      if (!centersArray.some(c => c === 'Throat') ||
          !centersArray.some(c => c === 'SolarPlexus' || c === 'Sacral' || c === 'Root' || c === 'Ego')) {
        return false; // Throat undefined and/or no motor defined
      }

      // Solar Plexus to Throat (direct)
      if (centersArray.includes('SolarPlexus')) {
        if (channels.some(ch => ch === '12-22' || ch === '35-36')) {
          return true;
        }
      }

      // Sacral to Throat
      if (centersArray.includes('Sacral')) {
        // Direct: 20-34
        if (channels.includes('20-34')) {
          return true;
        }
        // Via G Center: Sacral→G + G→Throat
        if (channels.some(ch => ch === '2-14' || ch === '5-15' || ch === '29-46')) {
          if (channels.some(ch => ch === '1-8' || ch === '7-31' || ch === '10-20' || ch === '13-33')) {
            return true;
          }
        }
        // Via Spleen: Sacral→Spleen + Spleen→Throat
        if (channels.includes('27-50')) {
          if (channels.some(ch => ch === '16-48' || ch === '20-57')) {
            return true;
          }
          // Via G Center: Sacral→Spleen→G + G→Throat
          if (channels.includes('10-57')) {
            if (channels.some(ch => ch === '1-8' || ch === '7-31' || ch === '10-20' || ch === '13-33')) {
              return true;
            }
          }
        }
      }

      // Ego to Throat
      if (centersArray.includes('Ego')) {
        // Direct: 21-45
        if (channels.includes('21-45')) {
          return true;
        }
        // Via G Center: Ego→G + G→Throat
        if (channels.includes('25-51')) {
          if (channels.some(ch => ch === '1-8' || ch === '7-31' || ch === '10-20' || ch === '13-33')) {
            return true;
          }
          // Via Spleen: Ego→G→Spleen + Spleen→Throat
          if (channels.includes('10-57')) {
            if (channels.some(ch => ch === '16-48' || ch === '20-57')) {
              return true;
            }
          }
        }
        // Via Spleen: Ego→Spleen + Spleen→Throat
        if (channels.includes('26-44')) {
          if (channels.some(ch => ch === '16-48' || ch === '20-57')) {
            return true;
          }
        }
      }

      // Root to Throat (via Spleen)
      if (centersArray.includes('Root')) {
        // Root→Spleen + Spleen→Throat
        if (channels.some(ch => ch === '18-58' || ch === '28-38' || ch === '32-54')) {
          if (channels.some(ch => ch === '16-48' || ch === '20-57')) {
            return true;
          }
        }
        // Root→G + G→Throat (via Spleen connection)
        if (channels.includes('10-57')) {
          if (channels.some(ch => ch === '1-8' || ch === '7-31' || ch === '10-20' || ch === '13-33')) {
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
    const motorToThroat = hasMotorToThroat(channels, definedCenters);

    if (hasSacral && motorToThroat) {
      type = 'Manifesting Generator';
    } else if (hasSacral) {
      type = 'Generator';
    } else if (hasMotor && hasThroat) {
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
      const egoDirectToThroat = channels.includes('21-45');
      const egoViaGToThroat = channels.includes('25-51') &&
                             channels.some(ch => ch === '1-8' || ch === '7-31' || ch === '10-20' || ch === '13-33');

      if (egoDirectToThroat || egoViaGToThroat) {
        authority = 'Ego Manifested';
      } else {
        authority = 'Ego Projected';
      }
    }
    // 5. Self-Projected Authority (G Center defined and connected to Throat)
    else if (definedCenters.has('G')) {
      // Check if G is connected to Throat
      const gToThroat = channels.some(ch => ch === '1-8' || ch === '7-31' || ch === '10-20' || ch === '13-33');

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

      // Determine if day or night birth based on Sun's house
      const isDay = isDayBirth(personality.Sun.house);

      // Calculate Part of Fortune (both formulas)
      const pofDayNight = calculatePartOfFortune(ascendantLong, personality.Sun.longitude, personality.Moon.longitude, isDay);
      const pofAlwaysDay = calculatePartOfFortune(ascendantLong, personality.Sun.longitude, personality.Moon.longitude, true);

      const pofDayNightActivation = safeGetGate(pofDayNight, 'Part of Fortune (Day/Night)');
      extras.partOfFortune = {
        traditional: addHouseInfo({
          longitude: pofDayNight,
          gate: pofDayNightActivation.gate,
          line: pofDayNightActivation.line,
          color: pofDayNightActivation.color,
          tone: pofDayNightActivation.tone,
          base: pofDayNightActivation.base,
          sign: pofDayNightActivation.sign,
          formula: isDay ? 'Day: ASC + Moon - Sun' : 'Night: ASC + Sun - Moon',
          birthType: isDay ? 'day' : 'night'
        }, houseCusps),
        description: 'Point of worldly success, luck, and abundance'
      };

      // Only add modern formula if different from traditional
      if (Math.abs(pofDayNight - pofAlwaysDay) > 0.01) {
        const pofAlwaysDayActivation = safeGetGate(pofAlwaysDay, 'Part of Fortune (Always Day)');
        extras.partOfFortune.modern = addHouseInfo({
          longitude: pofAlwaysDay,
          gate: pofAlwaysDayActivation.gate,
          line: pofAlwaysDayActivation.line,
          color: pofAlwaysDayActivation.color,
          tone: pofAlwaysDayActivation.tone,
          base: pofAlwaysDayActivation.base,
          sign: pofAlwaysDayActivation.sign,
          formula: 'Always Day: ASC + Moon - Sun'
        }, houseCusps);
      }

      // Calculate Mean Black Moon Lilith
      const lilithLong = await calculatePlanetPosition(julianDay, PLANETS.MEAN_APOG);
      const lilithActivation = safeGetGate(lilithLong, 'Black Moon Lilith');
      extras.blackMoonLilith = addHouseInfo({
        longitude: lilithLong,
        gate: lilithActivation.gate,
        line: lilithActivation.line,
        color: lilithActivation.color,
        tone: lilithActivation.tone,
        base: lilithActivation.base,
        sign: lilithActivation.sign,
        type: 'Mean',
        description: 'Shadow self, repressed desires, the wild feminine'
      }, houseCusps);

      // Try to calculate Chiron (optional - requires additional ephemeris files)
      try {
        const chironLong = await calculatePlanetPosition(julianDay, PLANETS.CHIRON);
        const chironActivation = safeGetGate(chironLong, 'Chiron');
        extras.chiron = addHouseInfo({
          longitude: chironLong,
          gate: chironActivation.gate,
          line: chironActivation.line,
          color: chironActivation.color,
          tone: chironActivation.tone,
          base: chironActivation.base,
          sign: chironActivation.sign,
          description: 'The wounded healer - where you heal yourself and others'
        }, houseCusps);
      } catch (chironError) {
        // Chiron calculation failed (likely missing ephemeris files)
        extras.chiron = {
          error: 'Chiron calculation unavailable (requires additional ephemeris files)'
        };
      }

    } catch (extrasError) {
      // If extras calculation fails, add error info but don't fail the whole calculation
      extras.error = `Some extras could not be calculated: ${extrasError.message}`;
    }

    return {
      birthInfo: {
        date: birthDate,
        time: birthTime,
        location: birthLocation,
        coordinates: `${locationInfo.lat}°N, ${locationInfo.lon}°E`,
        timezone: locationInfo.tz,
        locationSource: locationInfo.source || 'unknown'
      },
      type,
      strategy: strategyByType[type] || 'Wait to Respond',
      authority,
      signature: signatureByType[type] || 'Satisfaction',
      notSelfTheme: notSelfThemeByType[type] || 'Frustration',
      profile,
      profileName: profileNames[profile] || profile,
      incarnationCross,
      variableType,
      phs: {
        digestion,
        digestionTone: digestionToneName,
        environment,
        environmentalTone: environmentalToneName
      },
      ravePsychology: {
        motivation,
        motivationTone: motivationToneName,
        perspective,
        perspectiveTone: perspectiveToneName
      },
      personality,
      design,
      channels: channels.sort(),
      centers: {
        Head: {
          defined: definedCenters.has('Head'),
          type: 'pressure',
          description: 'Inspiration and mental pressure'
        },
        Ajna: {
          defined: definedCenters.has('Ajna'),
          type: 'awareness',
          description: 'Mental awareness and conceptualization'
        },
        Throat: {
          defined: definedCenters.has('Throat'),
          type: 'manifestation',
          description: 'Communication and manifestation'
        },
        G: {
          defined: definedCenters.has('G'),
          type: 'identity',
          description: 'Identity, direction, and love'
        },
        SolarPlexus: {
          defined: definedCenters.has('SolarPlexus'),
          type: 'motor-awareness',
          description: 'Emotions and emotional awareness'
        },
        Sacral: {
          defined: definedCenters.has('Sacral'),
          type: 'motor',
          description: 'Life force and work energy'
        },
        Spleen: {
          defined: definedCenters.has('Spleen'),
          type: 'awareness',
          description: 'Survival instinct and body awareness'
        },
        Ego: {
          defined: definedCenters.has('Ego'),
          type: 'motor',
          description: 'Willpower and self-worth'
        },
        Root: {
          defined: definedCenters.has('Root'),
          type: 'pressure-motor',
          description: 'Pressure to act and adrenaline'
        }
      },
      definedCenters: Array.from(definedCenters).sort(),
      extras,
      version: '3.8.0-fixed-mappings'
    };

  } catch (error) {
    throw new Error(`Calculation failed: ${error.message}`);
  }
}

module.exports = { calculateHumanDesign };
