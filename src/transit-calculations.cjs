/**
 * Transit Calculations for Human Design
 *
 * Calculates planetary positions for transit tracking.
 * Transit positions are universal - same for everyone globally.
 */

const swisseph = require('swisseph');
const path = require('path');
const { longitudeToGate } = require('./gate-mapping.cjs');

// Set ephemeris path
const ephePath = path.join(__dirname, '..', 'ephe');
swisseph.swe_set_ephe_path(ephePath);

// Swiss Ephemeris planet constants
const PLANETS = {
  SUN: 0,
  MOON: 1,
  MERCURY: 2,
  VENUS: 3,
  MARS: 4,
  JUPITER: 5,
  SATURN: 6,
  URANUS: 7,
  NEPTUNE: 8,
  PLUTO: 9,
  TRUE_NODE: 11 // Rahu/North Node
};

// The 13 Human Design planets in order
const HD_PLANET_ORDER = [
  'Sun', 'Earth', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Rahu', 'Ketu'
];

/**
 * Moon Phase definitions based on Sun-Moon elongation
 * Elongation = Moon longitude - Sun longitude (normalized 0-360°)
 */
const MOON_PHASES = [
  { name: 'New Moon', emoji: '🌑', start: 0, end: 11.25 },
  { name: 'Waxing Crescent', emoji: '🌒', start: 11.25, end: 78.75 },
  { name: 'First Quarter', emoji: '🌓', start: 78.75, end: 101.25 },
  { name: 'Waxing Gibbous', emoji: '🌔', start: 101.25, end: 168.75 },
  { name: 'Full Moon', emoji: '🌕', start: 168.75, end: 191.25 },
  { name: 'Waning Gibbous', emoji: '🌖', start: 191.25, end: 258.75 },
  { name: 'Last Quarter', emoji: '🌗', start: 258.75, end: 281.25 },
  { name: 'Waning Crescent', emoji: '🌘', start: 281.25, end: 348.75 },
  { name: 'New Moon', emoji: '🌑', start: 348.75, end: 360 }
];

/**
 * Calculate moon phase from Sun and Moon longitudes
 * @param {number} sunLongitude - Sun's ecliptic longitude (0-360°)
 * @param {number} moonLongitude - Moon's ecliptic longitude (0-360°)
 * @returns {Object} Phase info with name, emoji, elongation, and illumination percentage
 */
function calculateMoonPhase(sunLongitude, moonLongitude) {
  // Calculate elongation (angular distance from Sun to Moon)
  let elongation = moonLongitude - sunLongitude;
  if (elongation < 0) elongation += 360;

  // Find the phase
  let phase = MOON_PHASES.find(p => elongation >= p.start && elongation < p.end);
  if (!phase) phase = MOON_PHASES[0]; // Fallback to New Moon

  // Calculate illumination percentage (0% at New Moon, 100% at Full Moon)
  // Using cosine function: illumination peaks at 180° elongation
  const illumination = Math.round((1 - Math.cos(elongation * Math.PI / 180)) / 2 * 100);

  // Calculate days into lunar cycle (approx 29.53 days)
  const lunarCycleProgress = elongation / 360;
  const daysIntoLunarCycle = Math.round(lunarCycleProgress * 29.53 * 10) / 10;

  return {
    phase: phase.name,
    emoji: phase.emoji,
    elongation: Math.round(elongation * 100) / 100,
    illumination,
    lunarDay: daysIntoLunarCycle
  };
}

/**
 * Convert ISO date string to Julian Day
 * @param {string} dateStr - ISO date string (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)
 * @param {number} hour - Optional hour (0-23), defaults to 12 (noon UTC)
 * @returns {Promise<number>} Julian Day
 */
function dateToJulianDay(dateStr, hour = 12) {
  return new Promise((resolve) => {
    const date = new Date(dateStr);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    // If time is included in the date string, use it
    let hourDecimal = hour;
    if (dateStr.includes('T')) {
      hourDecimal = date.getUTCHours() + date.getUTCMinutes() / 60;
    }

    swisseph.swe_julday(year, month, day, hourDecimal, swisseph.SE_GREG_CAL, (julday) => {
      resolve(julday);
    });
  });
}

/**
 * Calculate a single planet's position at a given Julian Day
 * @param {number} julianDay - Julian Day for calculation
 * @param {number} planetId - Swiss Ephemeris planet constant
 * @returns {Promise<{longitude: number, speed: number, isRetrograde: boolean}>}
 */
function calculatePlanetPosition(julianDay, planetId) {
  return new Promise((resolve, reject) => {
    const flags = swisseph.SEFLG_MOSEPH | swisseph.SEFLG_SPEED;
    swisseph.swe_calc_ut(julianDay, planetId, flags, (result) => {
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
 * Calculate Moon's position at a specific Julian Day (includes phase)
 * @param {number} julianDay - Julian Day for calculation
 * @returns {Promise<Object>} Moon transit data with phase info
 */
async function calculateMoonTransit(julianDay) {
  // Get both Sun and Moon positions for phase calculation
  const [sunData, moonData] = await Promise.all([
    calculatePlanetPosition(julianDay, PLANETS.SUN),
    calculatePlanetPosition(julianDay, PLANETS.MOON)
  ]);

  const gateData = longitudeToGate(moonData.longitude);
  const phaseData = calculateMoonPhase(sunData.longitude, moonData.longitude);

  return {
    longitude: Math.round(moonData.longitude * 1000) / 1000,
    gate: gateData.gate,
    line: gateData.line,
    color: gateData.color,
    tone: gateData.tone,
    sign: gateData.sign,
    isRetrograde: moonData.isRetrograde,
    moonPhase: phaseData
  };
}

/**
 * Calculate all 13 HD planets' positions at a specific Julian Day
 * @param {number} julianDay - Julian Day for calculation
 * @returns {Promise<Object>} All planet transit data with moonPhase
 */
async function calculateAllPlanetsTransit(julianDay) {
  const transits = {};

  // Sun
  const sunData = await calculatePlanetPosition(julianDay, PLANETS.SUN);
  const sunGate = longitudeToGate(sunData.longitude);
  transits.Sun = {
    longitude: Math.round(sunData.longitude * 1000) / 1000,
    gate: sunGate.gate,
    line: sunGate.line,
    color: sunGate.color,
    tone: sunGate.tone,
    sign: sunGate.sign,
    isRetrograde: false
  };

  // Earth (180° from Sun)
  let earthLong = sunData.longitude + 180;
  if (earthLong >= 360) earthLong -= 360;
  const earthGate = longitudeToGate(earthLong);
  transits.Earth = {
    longitude: Math.round(earthLong * 1000) / 1000,
    gate: earthGate.gate,
    line: earthGate.line,
    color: earthGate.color,
    tone: earthGate.tone,
    sign: earthGate.sign,
    isRetrograde: false
  };

  // Moon (with phase data)
  const moonData = await calculatePlanetPosition(julianDay, PLANETS.MOON);
  const moonGate = longitudeToGate(moonData.longitude);
  const phaseData = calculateMoonPhase(sunData.longitude, moonData.longitude);

  transits.Moon = {
    longitude: Math.round(moonData.longitude * 1000) / 1000,
    gate: moonGate.gate,
    line: moonGate.line,
    color: moonGate.color,
    tone: moonGate.tone,
    sign: moonGate.sign,
    isRetrograde: moonData.isRetrograde,
    phase: phaseData
  };

  // Mercury
  const mercuryData = await calculatePlanetPosition(julianDay, PLANETS.MERCURY);
  const mercuryGate = longitudeToGate(mercuryData.longitude);
  transits.Mercury = {
    longitude: Math.round(mercuryData.longitude * 1000) / 1000,
    gate: mercuryGate.gate,
    line: mercuryGate.line,
    color: mercuryGate.color,
    tone: mercuryGate.tone,
    sign: mercuryGate.sign,
    isRetrograde: mercuryData.isRetrograde
  };

  // Venus
  const venusData = await calculatePlanetPosition(julianDay, PLANETS.VENUS);
  const venusGate = longitudeToGate(venusData.longitude);
  transits.Venus = {
    longitude: Math.round(venusData.longitude * 1000) / 1000,
    gate: venusGate.gate,
    line: venusGate.line,
    color: venusGate.color,
    tone: venusGate.tone,
    sign: venusGate.sign,
    isRetrograde: venusData.isRetrograde
  };

  // Mars
  const marsData = await calculatePlanetPosition(julianDay, PLANETS.MARS);
  const marsGate = longitudeToGate(marsData.longitude);
  transits.Mars = {
    longitude: Math.round(marsData.longitude * 1000) / 1000,
    gate: marsGate.gate,
    line: marsGate.line,
    color: marsGate.color,
    tone: marsGate.tone,
    sign: marsGate.sign,
    isRetrograde: marsData.isRetrograde
  };

  // Jupiter
  const jupiterData = await calculatePlanetPosition(julianDay, PLANETS.JUPITER);
  const jupiterGate = longitudeToGate(jupiterData.longitude);
  transits.Jupiter = {
    longitude: Math.round(jupiterData.longitude * 1000) / 1000,
    gate: jupiterGate.gate,
    line: jupiterGate.line,
    color: jupiterGate.color,
    tone: jupiterGate.tone,
    sign: jupiterGate.sign,
    isRetrograde: jupiterData.isRetrograde
  };

  // Saturn
  const saturnData = await calculatePlanetPosition(julianDay, PLANETS.SATURN);
  const saturnGate = longitudeToGate(saturnData.longitude);
  transits.Saturn = {
    longitude: Math.round(saturnData.longitude * 1000) / 1000,
    gate: saturnGate.gate,
    line: saturnGate.line,
    color: saturnGate.color,
    tone: saturnGate.tone,
    sign: saturnGate.sign,
    isRetrograde: saturnData.isRetrograde
  };

  // Uranus
  const uranusData = await calculatePlanetPosition(julianDay, PLANETS.URANUS);
  const uranusGate = longitudeToGate(uranusData.longitude);
  transits.Uranus = {
    longitude: Math.round(uranusData.longitude * 1000) / 1000,
    gate: uranusGate.gate,
    line: uranusGate.line,
    color: uranusGate.color,
    tone: uranusGate.tone,
    sign: uranusGate.sign,
    isRetrograde: uranusData.isRetrograde
  };

  // Neptune
  const neptuneData = await calculatePlanetPosition(julianDay, PLANETS.NEPTUNE);
  const neptuneGate = longitudeToGate(neptuneData.longitude);
  transits.Neptune = {
    longitude: Math.round(neptuneData.longitude * 1000) / 1000,
    gate: neptuneGate.gate,
    line: neptuneGate.line,
    color: neptuneGate.color,
    tone: neptuneGate.tone,
    sign: neptuneGate.sign,
    isRetrograde: neptuneData.isRetrograde
  };

  // Pluto
  const plutoData = await calculatePlanetPosition(julianDay, PLANETS.PLUTO);
  const plutoGate = longitudeToGate(plutoData.longitude);
  transits.Pluto = {
    longitude: Math.round(plutoData.longitude * 1000) / 1000,
    gate: plutoGate.gate,
    line: plutoGate.line,
    color: plutoGate.color,
    tone: plutoGate.tone,
    sign: plutoGate.sign,
    isRetrograde: plutoData.isRetrograde
  };

  // Rahu (North Node)
  const rahuData = await calculatePlanetPosition(julianDay, PLANETS.TRUE_NODE);
  const rahuGate = longitudeToGate(rahuData.longitude);
  transits.Rahu = {
    longitude: Math.round(rahuData.longitude * 1000) / 1000,
    gate: rahuGate.gate,
    line: rahuGate.line,
    color: rahuGate.color,
    tone: rahuGate.tone,
    sign: rahuGate.sign,
    isRetrograde: rahuData.isRetrograde
  };

  // Ketu (South Node - 180° from Rahu)
  let ketuLong = rahuData.longitude + 180;
  if (ketuLong >= 360) ketuLong -= 360;
  const ketuGate = longitudeToGate(ketuLong);
  transits.Ketu = {
    longitude: Math.round(ketuLong * 1000) / 1000,
    gate: ketuGate.gate,
    line: ketuGate.line,
    color: ketuGate.color,
    tone: ketuGate.tone,
    sign: ketuGate.sign,
    isRetrograde: rahuData.isRetrograde // Nodes share retrograde status
  };

  return transits;
}

/**
 * Generate Moon transit positions for a date range
 * @param {string} startDate - Start date (ISO string)
 * @param {string} endDate - End date (ISO string)
 * @param {string} granularity - "daily" or "hourly"
 * @returns {Promise<Array>} Array of transit positions
 */
async function getMoonTransitRange(startDate, endDate, granularity = 'daily') {
  const results = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Validate date range (max 60 days)
  const daysDiff = (end - start) / (1000 * 60 * 60 * 24);
  if (daysDiff > 60) {
    throw new Error('Date range cannot exceed 60 days');
  }
  if (daysDiff < 0) {
    throw new Error('End date must be after start date');
  }

  // Determine step size
  const stepHours = granularity === 'hourly' ? 1 : 24;
  const stepMs = stepHours * 60 * 60 * 1000;

  let current = new Date(start);
  // For daily, start at noon UTC for more representative position
  if (granularity === 'daily') {
    current.setUTCHours(12, 0, 0, 0);
  } else {
    current.setUTCMinutes(0, 0, 0);
  }

  while (current <= end) {
    const julianDay = await dateToJulianDay(current.toISOString());
    const transit = await calculateMoonTransit(julianDay);

    results.push({
      datetime: current.toISOString(),
      ...transit
    });

    current = new Date(current.getTime() + stepMs);
  }

  return results;
}

/**
 * Generate all planets transit positions for a date range
 * @param {string} startDate - Start date (ISO string)
 * @param {string} endDate - End date (ISO string)
 * @param {string} granularity - "daily" or "hourly"
 * @returns {Promise<Array>} Array of transit positions for all planets
 */
async function getAllPlanetsTransitRange(startDate, endDate, granularity = 'daily') {
  const results = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Validate date range (max 60 days)
  const daysDiff = (end - start) / (1000 * 60 * 60 * 24);
  if (daysDiff > 60) {
    throw new Error('Date range cannot exceed 60 days');
  }
  if (daysDiff < 0) {
    throw new Error('End date must be after start date');
  }

  // Determine step size
  const stepHours = granularity === 'hourly' ? 1 : 24;
  const stepMs = stepHours * 60 * 60 * 1000;

  let current = new Date(start);
  // For daily, start at noon UTC for more representative position
  if (granularity === 'daily') {
    current.setUTCHours(12, 0, 0, 0);
  } else {
    current.setUTCMinutes(0, 0, 0);
  }

  while (current <= end) {
    const julianDay = await dateToJulianDay(current.toISOString());
    const transits = await calculateAllPlanetsTransit(julianDay);

    results.push({
      datetime: current.toISOString(),
      planets: transits
    });

    current = new Date(current.getTime() + stepMs);
  }

  return results;
}

module.exports = {
  dateToJulianDay,
  calculateMoonTransit,
  calculateAllPlanetsTransit,
  getMoonTransitRange,
  getAllPlanetsTransitRange,
  HD_PLANET_ORDER
};
