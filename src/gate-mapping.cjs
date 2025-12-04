/**
 * Correct Human Design Gate to Zodiac Degree Mapping
 * Each gate maps to specific degree ranges within zodiac signs
 */

const GATE_MAPPING = [
  // Aries (0-30°) = Absolute 0-30°
  { gate: 25, sign: 'Aries', signNum: 1, start: 0.0, end: 3.875 },
  { gate: 17, sign: 'Aries', signNum: 1, start: 3.875, end: 9.5 },
  { gate: 21, sign: 'Aries', signNum: 1, start: 9.5, end: 15.125 },
  { gate: 51, sign: 'Aries', signNum: 1, start: 15.125, end: 20.75 },
  { gate: 42, sign: 'Aries', signNum: 1, start: 20.75, end: 26.375 },
  { gate: 3, sign: 'Aries', signNum: 1, start: 26.375, end: 30.0 },

  // Taurus (0-30°) = Absolute 30-60°
  { gate: 3, sign: 'Taurus', signNum: 2, start: 0.0, end: 2.0 },
  { gate: 27, sign: 'Taurus', signNum: 2, start: 2.0, end: 7.625 },
  { gate: 24, sign: 'Taurus', signNum: 2, start: 7.625, end: 13.25 },
  { gate: 2, sign: 'Taurus', signNum: 2, start: 13.25, end: 18.875 },
  { gate: 23, sign: 'Taurus', signNum: 2, start: 18.875, end: 24.5 },
  { gate: 8, sign: 'Taurus', signNum: 2, start: 24.5, end: 30.0 },

  // Gemini (0-30°) = Absolute 60-90°
  { gate: 8, sign: 'Gemini', signNum: 3, start: 0.0, end: 0.125 },
  { gate: 20, sign: 'Gemini', signNum: 3, start: 0.125, end: 5.75 },
  { gate: 16, sign: 'Gemini', signNum: 3, start: 5.75, end: 11.375 },
  { gate: 35, sign: 'Gemini', signNum: 3, start: 11.375, end: 17.0 },
  { gate: 45, sign: 'Gemini', signNum: 3, start: 17.0, end: 22.625 },
  { gate: 12, sign: 'Gemini', signNum: 3, start: 22.625, end: 28.25 },
  { gate: 15, sign: 'Gemini', signNum: 3, start: 28.25, end: 30.0 },

  // Cancer (0-30°) = Absolute 90-120°
  { gate: 15, sign: 'Cancer', signNum: 4, start: 0.0, end: 3.875 },
  { gate: 52, sign: 'Cancer', signNum: 4, start: 3.875, end: 9.5 },
  { gate: 39, sign: 'Cancer', signNum: 4, start: 9.5, end: 15.125 },
  { gate: 53, sign: 'Cancer', signNum: 4, start: 15.125, end: 20.75 },
  { gate: 62, sign: 'Cancer', signNum: 4, start: 20.75, end: 26.375 },
  { gate: 56, sign: 'Cancer', signNum: 4, start: 26.375, end: 30.0 },

  // Leo (0-30°) = Absolute 120-150°
  { gate: 56, sign: 'Leo', signNum: 5, start: 0.0, end: 2.0 },
  { gate: 31, sign: 'Leo', signNum: 5, start: 2.0, end: 7.625 },
  { gate: 33, sign: 'Leo', signNum: 5, start: 7.625, end: 13.25 },
  { gate: 7, sign: 'Leo', signNum: 5, start: 13.25, end: 18.875 },
  { gate: 4, sign: 'Leo', signNum: 5, start: 18.875, end: 24.5 },
  { gate: 29, sign: 'Leo', signNum: 5, start: 24.5, end: 30.0 },

  // Virgo (0-30°) = Absolute 150-180°
  { gate: 29, sign: 'Virgo', signNum: 6, start: 0.0, end: 0.125 },
  { gate: 59, sign: 'Virgo', signNum: 6, start: 0.125, end: 5.75 },
  { gate: 40, sign: 'Virgo', signNum: 6, start: 5.75, end: 11.375 },
  { gate: 64, sign: 'Virgo', signNum: 6, start: 11.375, end: 17.0 },
  { gate: 47, sign: 'Virgo', signNum: 6, start: 17.0, end: 22.625 },
  { gate: 6, sign: 'Virgo', signNum: 6, start: 22.625, end: 28.25 },
  { gate: 46, sign: 'Virgo', signNum: 6, start: 28.25, end: 30.0 },

  // Libra (0-30°) = Absolute 180-210°
  { gate: 46, sign: 'Libra', signNum: 7, start: 0.0, end: 3.875 },
  { gate: 18, sign: 'Libra', signNum: 7, start: 3.875, end: 9.5 },
  { gate: 48, sign: 'Libra', signNum: 7, start: 9.5, end: 15.125 },
  { gate: 57, sign: 'Libra', signNum: 7, start: 15.125, end: 20.75 },
  { gate: 32, sign: 'Libra', signNum: 7, start: 20.75, end: 26.375 },
  { gate: 50, sign: 'Libra', signNum: 7, start: 26.375, end: 30.0 },

  // Scorpio (0-30°) = Absolute 210-240°
  { gate: 50, sign: 'Scorpio', signNum: 8, start: 0.0, end: 2.0 },
  { gate: 28, sign: 'Scorpio', signNum: 8, start: 2.0, end: 7.625 },
  { gate: 44, sign: 'Scorpio', signNum: 8, start: 7.625, end: 13.25 },
  { gate: 1, sign: 'Scorpio', signNum: 8, start: 13.25, end: 18.875 },
  { gate: 43, sign: 'Scorpio', signNum: 8, start: 18.875, end: 24.5 },
  { gate: 14, sign: 'Scorpio', signNum: 8, start: 24.5, end: 30.0 },

  // Sagittarius (0-30°) = Absolute 240-270°
  { gate: 14, sign: 'Sagittarius', signNum: 9, start: 0.0, end: 0.125 },
  { gate: 34, sign: 'Sagittarius', signNum: 9, start: 0.125, end: 5.75 },
  { gate: 9, sign: 'Sagittarius', signNum: 9, start: 5.75, end: 11.375 },
  { gate: 5, sign: 'Sagittarius', signNum: 9, start: 11.375, end: 17.0 },
  { gate: 26, sign: 'Sagittarius', signNum: 9, start: 17.0, end: 22.625 },
  { gate: 11, sign: 'Sagittarius', signNum: 9, start: 22.625, end: 28.25 },
  { gate: 10, sign: 'Sagittarius', signNum: 9, start: 28.25, end: 30.0 },

  // Capricorn (0-30°) = Absolute 270-300°
  { gate: 10, sign: 'Capricorn', signNum: 10, start: 0.0, end: 3.875 },
  { gate: 58, sign: 'Capricorn', signNum: 10, start: 3.875, end: 9.5 },
  { gate: 38, sign: 'Capricorn', signNum: 10, start: 9.5, end: 15.125 },
  { gate: 54, sign: 'Capricorn', signNum: 10, start: 15.125, end: 20.75 },
  { gate: 61, sign: 'Capricorn', signNum: 10, start: 20.75, end: 26.375 },
  { gate: 60, sign: 'Capricorn', signNum: 10, start: 26.375, end: 30.0 },

  // Aquarius (0-30°) = Absolute 300-330°
  { gate: 60, sign: 'Aquarius', signNum: 11, start: 0.0, end: 2.0 },
  { gate: 41, sign: 'Aquarius', signNum: 11, start: 2.0, end: 7.625 },
  { gate: 19, sign: 'Aquarius', signNum: 11, start: 7.625, end: 13.25 },
  { gate: 13, sign: 'Aquarius', signNum: 11, start: 13.25, end: 18.875 },
  { gate: 49, sign: 'Aquarius', signNum: 11, start: 18.875, end: 24.5 },
  { gate: 30, sign: 'Aquarius', signNum: 11, start: 24.5, end: 30.0 },

  // Pisces (0-30°) = Absolute 330-360°
  { gate: 30, sign: 'Pisces', signNum: 12, start: 0.0, end: 0.125 },
  { gate: 55, sign: 'Pisces', signNum: 12, start: 0.125, end: 5.75 },
  { gate: 37, sign: 'Pisces', signNum: 12, start: 5.75, end: 11.375 },
  { gate: 63, sign: 'Pisces', signNum: 12, start: 11.375, end: 17.0 },
  { gate: 22, sign: 'Pisces', signNum: 12, start: 17.0, end: 22.625 },
  { gate: 36, sign: 'Pisces', signNum: 12, start: 22.625, end: 28.25 },
  { gate: 25, sign: 'Pisces', signNum: 12, start: 28.25, end: 30.0 },
];

/**
 * Convert absolute longitude (0-360°) to gate number
 */
// Gate order starting from 0° Aries (Gate 41)
// This matches hdkit's Gates.order array
const GATE_ORDER = [
  41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
  27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
  31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
  28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60
];

// Zodiac sign names for reference
const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

/**
 * Convert longitude to gate/line using hdkit's 384-line formula
 * Based on hdkit's getActivationFromDegrees function
 *
 * Formula:
 * - 360° wheel divided into 384 lines (64 gates × 6 lines)
 * - Each line = 0.9375° (360 / 384)
 * - Each gate = 5.625° (6 lines × 0.9375)
 * - percentageThrough = degrees / 360
 * - gateIndex = floor(percentageThrough * 64)
 * - line = (floor(percentageThrough * 384) % 6) + 1
 */
function longitudeToGate(longitude) {
  // Normalize to 0-360
  let normalizedLon = longitude % 360;
  if (normalizedLon < 0) normalizedLon += 360;

  // Human Design gates start at Gate 41 at 2° Aquarius
  // Distance from 0° Aries to Gate 41 start = 302°
  // Adjustment: add 58° (360° - 302°) to convert tropical to HD degrees
  let hdDegrees = normalizedLon + 58;
  if (hdDegrees >= 360) hdDegrees -= 360;

  // Calculate percentage through the wheel
  const percentageThrough = hdDegrees / 360;

  // Get gate index (0-63) and line (1-6)
  const gateIndex = Math.floor(percentageThrough * 64);
  const gate = GATE_ORDER[gateIndex];
  const line = (Math.floor(percentageThrough * 384) % 6) + 1;

  // Determine zodiac sign
  const signNum = Math.floor(normalizedLon / 30);
  const sign = SIGN_NAMES[signNum];
  const degreeInSign = normalizedLon % 30;

  return {
    gate: gate,
    line: line,
    sign: sign,
    signNum: signNum + 1, // 1-based for compatibility
    degreeInSign: degreeInSign,
    absoluteLongitude: normalizedLon
  };
}

module.exports = {
  GATE_MAPPING,
  longitudeToGate
};
