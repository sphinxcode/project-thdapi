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
const { getLocationInfo, getUTCOffset, convertToUTC } = require('./timezone-utils.cjs');
const { longitudeToGate } = require('./gate-mapping.cjs');
const { HARMONIC_GATES, CENTERS_BY_CHANNEL } = require('./channel-data.cjs');

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
  TRUE_NODE: 11  // swisseph.SE_TRUE_NODE (Rahu/North Node)
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
 * Calculate all planetary activations for Personality or Design
 */
async function calculateAllPlanets(julianDay) {
  const activations = {};

  try {
    // Calculate Sun
    const sunLong = await calculatePlanetPosition(julianDay, PLANETS.SUN);
    const sunActivation = safeGetGate(sunLong, 'Sun');
    activations.Sun = {
      longitude: sunLong,
      gate: sunActivation.gate,
      line: sunActivation.line,
      sign: sunActivation.sign
    };

    // Calculate Earth (180° from Sun)
    let earthLong = sunLong + 180;
    if (earthLong >= 360) earthLong -= 360;
    const earthActivation = safeGetGate(earthLong, 'Earth');
    activations.Earth = {
      longitude: earthLong,
      gate: earthActivation.gate,
      line: earthActivation.line,
      sign: earthActivation.sign
    };

    // Calculate North Node (Rahu)
    const rahuLong = await calculatePlanetPosition(julianDay, PLANETS.TRUE_NODE);
    const rahuActivation = safeGetGate(rahuLong, 'Rahu');
    activations.Rahu = {
      longitude: rahuLong,
      gate: rahuActivation.gate,
      line: rahuActivation.line,
      sign: rahuActivation.sign
    };

    // Calculate South Node (Ketu - 180° from Rahu)
    let ketuLong = rahuLong + 180;
    if (ketuLong >= 360) ketuLong -= 360;
    const ketuActivation = safeGetGate(ketuLong, 'Ketu');
    activations.Ketu = {
      longitude: ketuLong,
      gate: ketuActivation.gate,
      line: ketuActivation.line,
      sign: ketuActivation.sign
    };

    // Calculate Moon
    const moonLong = await calculatePlanetPosition(julianDay, PLANETS.MOON);
    const moonActivation = safeGetGate(moonLong, 'Moon');
    activations.Moon = {
      longitude: moonLong,
      gate: moonActivation.gate,
      line: moonActivation.line,
      sign: moonActivation.sign
    };

    // Calculate Mercury
    const mercuryLong = await calculatePlanetPosition(julianDay, PLANETS.MERCURY);
    const mercuryActivation = safeGetGate(mercuryLong, 'Mercury');
    activations.Mercury = {
      longitude: mercuryLong,
      gate: mercuryActivation.gate,
      line: mercuryActivation.line,
      sign: mercuryActivation.sign
    };

    // Calculate Venus (Note: Mars comes before Venus in HD)
    const venusLong = await calculatePlanetPosition(julianDay, PLANETS.VENUS);
    const venusActivation = safeGetGate(venusLong, 'Venus');
    activations.Venus = {
      longitude: venusLong,
      gate: venusActivation.gate,
      line: venusActivation.line,
      sign: venusActivation.sign
    };

    // Calculate Mars
    const marsLong = await calculatePlanetPosition(julianDay, PLANETS.MARS);
    const marsActivation = safeGetGate(marsLong, 'Mars');
    activations.Mars = {
      longitude: marsLong,
      gate: marsActivation.gate,
      line: marsActivation.line,
      sign: marsActivation.sign
    };

    // Calculate Jupiter
    const jupiterLong = await calculatePlanetPosition(julianDay, PLANETS.JUPITER);
    const jupiterActivation = safeGetGate(jupiterLong, 'Jupiter');
    activations.Jupiter = {
      longitude: jupiterLong,
      gate: jupiterActivation.gate,
      line: jupiterActivation.line,
      sign: jupiterActivation.sign
    };

    // Calculate Saturn
    const saturnLong = await calculatePlanetPosition(julianDay, PLANETS.SATURN);
    const saturnActivation = safeGetGate(saturnLong, 'Saturn');
    activations.Saturn = {
      longitude: saturnLong,
      gate: saturnActivation.gate,
      line: saturnActivation.line,
      sign: saturnActivation.sign
    };

    // Calculate Uranus
    const uranusLong = await calculatePlanetPosition(julianDay, PLANETS.URANUS);
    const uranusActivation = safeGetGate(uranusLong, 'Uranus');
    activations.Uranus = {
      longitude: uranusLong,
      gate: uranusActivation.gate,
      line: uranusActivation.line,
      sign: uranusActivation.sign
    };

    // Calculate Neptune
    const neptuneLong = await calculatePlanetPosition(julianDay, PLANETS.NEPTUNE);
    const neptuneActivation = safeGetGate(neptuneLong, 'Neptune');
    activations.Neptune = {
      longitude: neptuneLong,
      gate: neptuneActivation.gate,
      line: neptuneActivation.line,
      sign: neptuneActivation.sign
    };

    // Calculate Pluto
    const plutoLong = await calculatePlanetPosition(julianDay, PLANETS.PLUTO);
    const plutoActivation = safeGetGate(plutoLong, 'Pluto');
    activations.Pluto = {
      longitude: plutoLong,
      gate: plutoActivation.gate,
      line: plutoActivation.line,
      sign: plutoActivation.sign
    };

    return activations;
  } catch (error) {
    throw new Error(`Planet calculation failed: ${error.message}`);
  }
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

    // Get location info
    const locationInfo = getLocationInfo(birthLocation);
    if (!locationInfo) {
      throw new Error(`Location not found: ${birthLocation}`);
    }

    // Convert to UTC (pass birthLocation string, not locationInfo object)
    const utcData = convertToUTC(birthDate, birthTime, birthLocation);

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

    // Calculate Personality (at birth)
    const personality = await calculateAllPlanets(julianDay);

    // Find Design date (88 degrees before Personality Sun)
    const designJulianDay = await findDesignDate(personality.Sun.longitude, julianDay);

    // Calculate Design
    const design = await calculateAllPlanets(designJulianDay);

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

    // Determine Type
    let type = 'Reflector';
    const hasSacral = definedCenters.has('Sacral');
    const hasMotor = definedCenters.has('Root') || definedCenters.has('SolarPlexus') || definedCenters.has('Ego');
    const hasThroat = definedCenters.has('Throat');

    if (hasSacral && hasThroat) {
      type = 'Manifesting Generator';
    } else if (hasSacral) {
      type = 'Generator';
    } else if (hasMotor && hasThroat) {
      type = 'Manifestor';
    } else if (definedCenters.size > 0 && !hasSacral) {
      type = 'Projector';
    }

    // Determine Authority
    let authority = 'Lunar (wait 28 days)';
    if (definedCenters.has('SolarPlexus')) {
      authority = 'Emotional';
    } else if (hasSacral) {
      authority = 'Sacral';
    } else if (definedCenters.has('Spleen')) {
      authority = 'Splenic';
    } else if (definedCenters.has('Ego')) {
      authority = 'Ego';
    } else if (definedCenters.has('G')) {
      authority = 'Self-Projected';
    }

    return {
      birthInfo: {
        date: birthDate,
        time: birthTime,
        location: birthLocation,
        coordinates: `${locationInfo.lat}°N, ${locationInfo.lon}°E`,
        timezone: locationInfo.tz
      },
      type,
      authority,
      profile,
      personality,
      design,
      channels: channels.sort(),
      definedCenters: Array.from(definedCenters).sort(),
      version: '2.0.0-complete'
    };

  } catch (error) {
    throw new Error(`Calculation failed: ${error.message}`);
  }
}

module.exports = { calculateHumanDesign };
