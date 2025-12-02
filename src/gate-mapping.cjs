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
function longitudeToGate(longitude) {
  // Normalize to 0-360
  let normalizedLon = longitude % 360;
  if (normalizedLon < 0) normalizedLon += 360;

  // Determine zodiac sign (0-11 for Aries-Pisces)
  const signNum = Math.floor(normalizedLon / 30) + 1;

  // Get degree within sign (0-30)
  const degreeInSign = normalizedLon % 30;

  // Find matching gate (use <= for end boundary to catch edge cases)
  const gateData = GATE_MAPPING.find(g =>
    g.signNum === signNum &&
    degreeInSign >= g.start &&
    degreeInSign <= g.end
  );

  if (!gateData) {
    console.error(`No gate found for ${normalizedLon}° (${degreeInSign}° in sign ${signNum})`);
    // Fallback: find closest gate in the sign
    const signGates = GATE_MAPPING.filter(g => g.signNum === signNum);

    if (signGates.length === 0) {
      console.error(`No gates found for sign ${signNum}`);
      return null;
    }

    const closestGate = signGates.reduce((closest, current) => {
      const currentDist = Math.min(
        Math.abs(degreeInSign - current.start),
        Math.abs(degreeInSign - current.end)
      );
      const closestDist = Math.min(
        Math.abs(degreeInSign - closest.start),
        Math.abs(degreeInSign - closest.end)
      );
      return currentDist < closestDist ? current : closest;
    }, signGates[0]);

    if (closestGate) {
      console.warn(`Using closest gate ${closestGate.gate} for ${normalizedLon}°`);
      const degreeInGate = degreeInSign - closestGate.start;
      const gateSpan = closestGate.end - closestGate.start;
      const line = Math.min(Math.max(Math.floor((degreeInGate / gateSpan) * 6) + 1, 1), 6);

      return {
        gate: closestGate.gate,
        line: line,
        sign: closestGate.sign,
        signNum: closestGate.signNum,
        degreeInSign: degreeInSign,
        absoluteLongitude: normalizedLon
      };
    }

    return null;
  }

  // Calculate line (1-6 within each gate)
  const degreeInGate = degreeInSign - gateData.start;
  const gateSpan = gateData.end - gateData.start;
  const line = Math.min(Math.floor((degreeInGate / gateSpan) * 6) + 1, 6);

  return {
    gate: gateData.gate,
    line: line,
    sign: gateData.sign,
    signNum: gateData.signNum,
    degreeInSign: degreeInSign,
    absoluteLongitude: normalizedLon
  };
}

module.exports = {
  GATE_MAPPING,
  longitudeToGate
};
