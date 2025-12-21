/**
 * Incarnation Crosses Database
 * Complete mapping of all 192 Human Design Incarnation Crosses
 *
 * Format: { personalitySun, personalityEarth, designSun, designEarth }
 * Extracted from INCARNATION_CROSSES_KNOWLEDGE_BASE.md
 */

// RIGHT ANGLE CROSSES (88 variations - 22 names × 4 quarters)
const rightAngleCrosses = [
  // The Sphinx (4 variations)
  { gates: [1, 2, 7, 13], name: "Right Angle Cross of The Sphinx" },
  { gates: [2, 1, 13, 7], name: "Right Angle Cross of The Sphinx" },
  { gates: [7, 13, 2, 1], name: "Right Angle Cross of The Sphinx" },
  { gates: [13, 7, 1, 2], name: "Right Angle Cross of The Sphinx" },

  // Laws (4 variations)
  { gates: [3, 50, 60, 56], name: "Right Angle Cross of Laws" },
  { gates: [56, 60, 3, 50], name: "Right Angle Cross of Laws" },
  { gates: [50, 3, 56, 60], name: "Right Angle Cross of Laws" },
  { gates: [60, 56, 50, 3], name: "Right Angle Cross of Laws" },

  // Explanation (4 variations)
  { gates: [4, 49, 23, 43], name: "Right Angle Cross of Explanation" },
  { gates: [23, 43, 49, 4], name: "Right Angle Cross of Explanation" },
  { gates: [43, 23, 4, 49], name: "Right Angle Cross of Explanation" },
  { gates: [49, 4, 43, 23], name: "Right Angle Cross of Explanation" },

  // Consciousness (4 variations)
  { gates: [5, 35, 64, 63], name: "Right Angle Cross of Consciousness" },
  { gates: [35, 5, 63, 64], name: "Right Angle Cross of Consciousness" },
  { gates: [63, 64, 5, 35], name: "Right Angle Cross of Consciousness" },
  { gates: [64, 63, 35, 5], name: "Right Angle Cross of Consciousness" },

  // Eden (4 variations)
  { gates: [6, 36, 12, 11], name: "Right Angle Cross of Eden" },
  { gates: [11, 12, 6, 36], name: "Right Angle Cross of Eden" },
  { gates: [12, 11, 36, 6], name: "Right Angle Cross of Eden" },
  { gates: [36, 6, 11, 12], name: "Right Angle Cross of Eden" },

  // Contagion (4 variations)
  { gates: [8, 14, 30, 29], name: "Right Angle Cross of Contagion" },
  { gates: [14, 8, 29, 30], name: "Right Angle Cross of Contagion" },
  { gates: [29, 30, 8, 14], name: "Right Angle Cross of Contagion" },
  { gates: [30, 29, 14, 8], name: "Right Angle Cross of Contagion" },

  // Planning (4 variations)
  { gates: [9, 16, 40, 37], name: "Right Angle Cross of Planning" },
  { gates: [16, 9, 37, 40], name: "Right Angle Cross of Planning" },
  { gates: [37, 40, 9, 16], name: "Right Angle Cross of Planning" },
  { gates: [40, 37, 16, 9], name: "Right Angle Cross of Planning" },

  // The Vessel of Love (4 variations)
  { gates: [10, 15, 46, 25], name: "Right Angle Cross of The Vessel of Love" },
  { gates: [15, 10, 25, 46], name: "Right Angle Cross of The Vessel of Love" },
  { gates: [25, 46, 10, 15], name: "Right Angle Cross of The Vessel of Love" },
  { gates: [46, 25, 15, 10], name: "Right Angle Cross of The Vessel of Love" },

  // Rulership (4 variations)
  { gates: [22, 47, 26, 45], name: "Right Angle Cross of Rulership" },
  { gates: [26, 45, 47, 22], name: "Right Angle Cross of Rulership" },
  { gates: [45, 26, 22, 47], name: "Right Angle Cross of Rulership" },
  { gates: [47, 22, 45, 26], name: "Right Angle Cross of Rulership" },

  // Service (4 variations)
  { gates: [17, 18, 58, 52], name: "Right Angle Cross of Service" },
  { gates: [18, 17, 52, 58], name: "Right Angle Cross of Service" },
  { gates: [52, 58, 17, 18], name: "Right Angle Cross of Service" },
  { gates: [58, 52, 18, 17], name: "Right Angle Cross of Service" },

  // The Four Ways (4 variations)
  { gates: [19, 33, 44, 24], name: "Right Angle Cross of The Four Ways" },
  { gates: [24, 44, 19, 33], name: "Right Angle Cross of The Four Ways" },
  { gates: [33, 19, 24, 44], name: "Right Angle Cross of The Four Ways" },
  { gates: [44, 24, 33, 19], name: "Right Angle Cross of The Four Ways" },

  // The Sleeping Phoenix (4 variations)
  { gates: [20, 34, 55, 59], name: "Right Angle Cross of The Sleeping Phoenix" },
  { gates: [34, 20, 59, 55], name: "Right Angle Cross of The Sleeping Phoenix" },
  { gates: [55, 59, 34, 20], name: "Right Angle Cross of The Sleeping Phoenix" },
  { gates: [59, 55, 20, 34], name: "Right Angle Cross of The Sleeping Phoenix" },

  // Tension (4 variations)
  { gates: [21, 48, 38, 39], name: "Right Angle Cross of Tension" },
  { gates: [38, 39, 48, 21], name: "Right Angle Cross of Tension" },
  { gates: [39, 38, 21, 48], name: "Right Angle Cross of Tension" },
  { gates: [48, 21, 39, 38], name: "Right Angle Cross of Tension" },

  // Maya (4 variations)
  { gates: [32, 42, 62, 61], name: "Right Angle Cross of Maya" },
  { gates: [42, 32, 61, 62], name: "Right Angle Cross of Maya" },
  { gates: [61, 62, 32, 42], name: "Right Angle Cross of Maya" },
  { gates: [62, 61, 42, 32], name: "Right Angle Cross of Maya" },

  // Penetration (4 variations)
  { gates: [51, 57, 54, 53], name: "Right Angle Cross of Penetration" },
  { gates: [53, 54, 51, 57], name: "Right Angle Cross of Penetration" },
  { gates: [54, 53, 57, 51], name: "Right Angle Cross of Penetration" },
  { gates: [57, 51, 53, 54], name: "Right Angle Cross of Penetration" },

  // The Unexpected (4 variations)
  { gates: [27, 28, 41, 31], name: "Right Angle Cross of The Unexpected" },
  { gates: [28, 27, 31, 41], name: "Right Angle Cross of The Unexpected" },
  { gates: [31, 41, 27, 28], name: "Right Angle Cross of The Unexpected" },
  { gates: [41, 31, 28, 27], name: "Right Angle Cross of The Unexpected" },
];

// JUXTAPOSITION CROSSES (64 unique crosses)
const juxtapositionCrosses = [
  { gates: [1, 2, 4, 49], name: "Juxtaposition Cross of Self-Expression" },
  { gates: [2, 1, 49, 4], name: "Juxtaposition Cross of The Driver" },
  { gates: [3, 50, 41, 31], name: "Juxtaposition Cross of Mutation" },
  { gates: [4, 49, 8, 14], name: "Juxtaposition Cross of Formulization" },
  { gates: [5, 35, 47, 22], name: "Juxtaposition Cross of Habits" },
  { gates: [6, 36, 15, 10], name: "Juxtaposition Cross of Conflict" },
  { gates: [7, 13, 23, 43], name: "Juxtaposition Cross of Interaction" },
  { gates: [8, 14, 55, 59], name: "Juxtaposition Cross of Contribution" },
  { gates: [9, 16, 64, 63], name: "Juxtaposition Cross of Focus" },
  { gates: [10, 15, 18, 17], name: "Juxtaposition Cross of Behavior" },
  { gates: [11, 12, 46, 25], name: "Juxtaposition Cross of Ideas" },
  { gates: [12, 11, 25, 46], name: "Juxtaposition Cross of Articulation" },
  { gates: [13, 7, 43, 23], name: "Juxtaposition Cross of Listening" },
  { gates: [14, 8, 59, 55], name: "Juxtaposition Cross of Empowering" },
  { gates: [15, 10, 17, 18], name: "Juxtaposition Cross of Extremes" },
  { gates: [16, 9, 63, 64], name: "Juxtaposition Cross of Experimentation" },
  { gates: [17, 18, 38, 39], name: "Juxtaposition Cross of Opinions" },
  { gates: [18, 17, 39, 38], name: "Juxtaposition Cross of Correction" },
  { gates: [19, 33, 1, 2], name: "Juxtaposition Cross of Need" },
  { gates: [20, 34, 37, 40], name: "Juxtaposition Cross of The Now" },
  { gates: [21, 48, 54, 53], name: "Juxtaposition Cross of Control" },
  { gates: [22, 47, 11, 12], name: "Juxtaposition Cross of Grace" },
  { gates: [23, 43, 30, 29], name: "Juxtaposition Cross of Assimilation" },
  { gates: [24, 44, 13, 7], name: "Juxtaposition Cross of Rationalization" },
  { gates: [25, 46, 58, 52], name: "Juxtaposition Cross of Innocence" },
  { gates: [26, 45, 6, 36], name: "Juxtaposition Cross of The Trickster" },
  { gates: [27, 28, 19, 33], name: "Juxtaposition Cross of Caring" },
  { gates: [28, 27, 33, 19], name: "Juxtaposition Cross of Risks" },
  { gates: [29, 30, 20, 34], name: "Juxtaposition Cross of Commitment" },
  { gates: [30, 29, 34, 20], name: "Juxtaposition Cross of Fates" },
  { gates: [31, 41, 24, 44], name: "Juxtaposition Cross of Influence" },
  { gates: [32, 42, 56, 60], name: "Juxtaposition Cross of Conservation" },
  { gates: [33, 19, 2, 1], name: "Juxtaposition Cross of Retreat" },
  { gates: [34, 20, 40, 37], name: "Juxtaposition Cross of Power" },
  { gates: [35, 5, 22, 47], name: "Juxtaposition Cross of Experience" },
  { gates: [36, 6, 10, 15], name: "Juxtaposition Cross of Crisis" },
  { gates: [37, 40, 5, 35], name: "Juxtaposition Cross of Bargains" },
  { gates: [38, 39, 57, 51], name: "Juxtaposition Cross of Opposition" },
  { gates: [39, 38, 51, 57], name: "Juxtaposition Cross of Provocation" },
  { gates: [40, 37, 35, 5], name: "Juxtaposition Cross of Denial" },
  { gates: [41, 31, 44, 24], name: "Juxtaposition Cross of Fantasy" },
  { gates: [42, 32, 60, 56], name: "Juxtaposition Cross of Completion" },
  { gates: [43, 23, 29, 30], name: "Juxtaposition Cross of Insight" },
  { gates: [44, 24, 7, 13], name: "Juxtaposition Cross of Alertness" },
  { gates: [45, 26, 36, 6], name: "Juxtaposition Cross of Possession" },
  { gates: [46, 25, 52, 58], name: "Juxtaposition Cross of Serendipity" },
  { gates: [47, 22, 12, 11], name: "Juxtaposition Cross of Oppression" },
  { gates: [48, 21, 53, 54], name: "Juxtaposition Cross of Depth" },
  { gates: [49, 4, 14, 8], name: "Juxtaposition Cross of Principles" },
  { gates: [50, 3, 31, 41], name: "Juxtaposition Cross of Values" },
  { gates: [51, 57, 61, 62], name: "Juxtaposition Cross of Shock" },
  { gates: [52, 58, 21, 48], name: "Juxtaposition Cross of Stillness" },
  { gates: [53, 54, 42, 32], name: "Juxtaposition Cross of Beginnings" },
  { gates: [54, 53, 32, 42], name: "Juxtaposition Cross of Ambition" },
  { gates: [55, 59, 9, 16], name: "Juxtaposition Cross of Moods" },
  { gates: [56, 60, 27, 28], name: "Juxtaposition Cross of Stimulation" },
  { gates: [57, 51, 62, 61], name: "Juxtaposition Cross of Intuition" },
  { gates: [58, 52, 48, 21], name: "Juxtaposition Cross of Vitality" },
  { gates: [59, 55, 16, 9], name: "Juxtaposition Cross of Strategy" },
  { gates: [60, 56, 28, 27], name: "Juxtaposition Cross of Limitation" },
  { gates: [61, 62, 50, 3], name: "Juxtaposition Cross of Thinking" },
  { gates: [62, 61, 3, 50], name: "Juxtaposition Cross of Detail" },
  { gates: [63, 64, 26, 45], name: "Juxtaposition Cross of Doubts" },
  { gates: [64, 63, 45, 26], name: "Juxtaposition Cross of Confusion" },
];

// LEFT ANGLE CROSSES (40 variations - 20 names × 2)
const leftAngleCrosses = [
  // Defiance (2 variations)
  { gates: [1, 2, 4, 49], name: "Left Angle Cross of Defiance" },
  { gates: [2, 1, 49, 4], name: "Left Angle Cross of Defiance" },

  // Wishes (2 variations)
  { gates: [3, 50, 41, 31], name: "Left Angle Cross of Wishes" },
  { gates: [50, 3, 31, 41], name: "Left Angle Cross of Wishes" },

  // Revolution (2 variations)
  { gates: [4, 49, 8, 14], name: "Left Angle Cross of Revolution" },
  { gates: [49, 4, 14, 8], name: "Left Angle Cross of Revolution" },

  // Separation (2 variations)
  { gates: [5, 35, 47, 22], name: "Left Angle Cross of Separation" },
  { gates: [35, 5, 22, 47], name: "Left Angle Cross of Separation" },

  // The Plane (2 variations)
  { gates: [6, 36, 15, 10], name: "Left Angle Cross of The Plane" },
  { gates: [36, 6, 10, 15], name: "Left Angle Cross of The Plane" },

  // Masks (2 variations)
  { gates: [7, 13, 23, 43], name: "Left Angle Cross of Masks" },
  { gates: [13, 7, 43, 23], name: "Left Angle Cross of Masks" },

  // Uncertainty (2 variations)
  { gates: [8, 14, 55, 59], name: "Left Angle Cross of Uncertainty" },
  { gates: [14, 8, 59, 55], name: "Left Angle Cross of Uncertainty" },

  // Identification (2 variations)
  { gates: [9, 16, 64, 63], name: "Left Angle Cross of Identification" },
  { gates: [16, 9, 63, 64], name: "Left Angle Cross of Identification" },

  // Prevention (2 variations)
  { gates: [10, 15, 18, 17], name: "Left Angle Cross of Prevention" },
  { gates: [15, 10, 17, 18], name: "Left Angle Cross of Prevention" },

  // Education (2 variations)
  { gates: [11, 12, 46, 25], name: "Left Angle Cross of Education" },
  { gates: [12, 11, 25, 46], name: "Left Angle Cross of Education" },

  // Refinement (2 variations)
  { gates: [19, 33, 1, 2], name: "Left Angle Cross of Refinement" },
  { gates: [33, 19, 2, 1], name: "Left Angle Cross of Refinement" },

  // Duality (2 variations)
  { gates: [20, 34, 37, 40], name: "Left Angle Cross of Duality" },
  { gates: [34, 20, 40, 37], name: "Left Angle Cross of Duality" },

  // Endeavour (2 variations)
  { gates: [21, 48, 54, 53], name: "Left Angle Cross of Endeavour" },
  { gates: [48, 21, 53, 54], name: "Left Angle Cross of Endeavour" },

  // Informing (2 variations)
  { gates: [22, 47, 11, 12], name: "Left Angle Cross of Informing" },
  { gates: [47, 22, 12, 11], name: "Left Angle Cross of Informing" },

  // Dedication (2 variations)
  { gates: [23, 43, 30, 29], name: "Left Angle Cross of Dedication" },
  { gates: [43, 23, 29, 30], name: "Left Angle Cross of Dedication" },

  // Incarnation (2 variations)
  { gates: [24, 44, 13, 7], name: "Left Angle Cross of Incarnation" },
  { gates: [44, 24, 7, 13], name: "Left Angle Cross of Incarnation" },

  // Healing (2 variations)
  { gates: [25, 46, 58, 52], name: "Left Angle Cross of Healing" },
  { gates: [46, 25, 52, 58], name: "Left Angle Cross of Healing" },

  // Confrontation (2 variations)
  { gates: [26, 45, 6, 36], name: "Left Angle Cross of Confrontation" },
  { gates: [45, 26, 36, 6], name: "Left Angle Cross of Confrontation" },

  // Alignment (2 variations)
  { gates: [27, 28, 19, 33], name: "Left Angle Cross of Alignment" },
  { gates: [28, 27, 33, 19], name: "Left Angle Cross of Alignment" },

  // Industry (2 variations)
  { gates: [29, 30, 20, 34], name: "Left Angle Cross of Industry" },
  { gates: [30, 29, 34, 20], name: "Left Angle Cross of Industry" },

  // The Alpha (2 variations)
  { gates: [31, 41, 24, 44], name: "Left Angle Cross of The Alpha" },
  { gates: [41, 31, 44, 24], name: "Left Angle Cross of The Alpha" },

  // Limitation (2 variations)
  { gates: [32, 42, 56, 60], name: "Left Angle Cross of Limitation" },
  { gates: [42, 32, 60, 56], name: "Left Angle Cross of Limitation" },

  // Migration (2 variations)
  { gates: [37, 40, 5, 35], name: "Left Angle Cross of Migration" },
  { gates: [40, 37, 35, 5], name: "Left Angle Cross of Migration" },

  // Individualism (2 variations)
  { gates: [38, 39, 57, 51], name: "Left Angle Cross of Individualism" },
  { gates: [39, 38, 51, 57], name: "Left Angle Cross of Individualism" },

  // Upheaval (2 variations)
  { gates: [17, 18, 38, 39], name: "Left Angle Cross of Upheaval" },
  { gates: [18, 17, 39, 38], name: "Left Angle Cross of Upheaval" },

  // The Clarion (2 variations)
  { gates: [51, 57, 61, 62], name: "Left Angle Cross of The Clarion" },
  { gates: [57, 51, 62, 61], name: "Left Angle Cross of The Clarion" },

  // Cycles (2 variations)
  { gates: [53, 54, 42, 32], name: "Left Angle Cross of Cycles" },
  { gates: [54, 53, 32, 42], name: "Left Angle Cross of Cycles" },

  // Spirit (2 variations)
  { gates: [55, 59, 9, 16], name: "Left Angle Cross of Spirit" },
  { gates: [59, 55, 16, 9], name: "Left Angle Cross of Spirit" },

  // Distraction (2 variations)
  { gates: [56, 60, 27, 28], name: "Left Angle Cross of Distraction" },
  { gates: [60, 56, 28, 27], name: "Left Angle Cross of Distraction" },

  // Demands (2 variations)
  { gates: [52, 58, 21, 48], name: "Left Angle Cross of Demands" },
  { gates: [58, 52, 48, 21], name: "Left Angle Cross of Demands" },

  // Obscuration (2 variations)
  { gates: [61, 62, 50, 3], name: "Left Angle Cross of Obscuration" },
  { gates: [62, 61, 3, 50], name: "Left Angle Cross of Obscuration" },

  // Dominion (2 variations)
  { gates: [63, 64, 26, 45], name: "Left Angle Cross of Dominion" },
  { gates: [64, 63, 45, 26], name: "Left Angle Cross of Dominion" },
];

/**
 * Calculate Incarnation Cross based on 4 gates
 * @param {number} personalitySun - Personality Sun gate
 * @param {number} personalityEarth - Personality Earth gate
 * @param {number} designSun - Design Sun gate
 * @param {number} designEarth - Design Earth gate
 * @param {number} personalitySunLine - Personality Sun line (1-6)
 * @param {number} designSunLine - Design Sun line (1-6)
 * @returns {string} - Incarnation cross name with gate notation
 */
function calculateIncarnationCross(personalitySun, personalityEarth, designSun, designEarth, personalitySunLine, designSunLine) {
  // Determine cross type based on line numbers
  let crossType;
  let searchList;

  if (personalitySunLine >= 1 && personalitySunLine <= 3) {
    // Right Angle (Profiles 1/3, 1/4, 2/4, 2/5, 3/5, 3/6)
    crossType = 'Right Angle';
    searchList = rightAngleCrosses;
  } else if (personalitySunLine === 4) {
    // Line 4: 4/6 is Right Angle, 4/1 is Juxtaposition
    if (designSunLine === 1) {
      crossType = 'Juxtaposition';
      searchList = juxtapositionCrosses;
    } else {
      // Default to Right Angle (handles 4/6)
      crossType = 'Right Angle';
      searchList = rightAngleCrosses;
    }
  } else if (personalitySunLine >= 5 && personalitySunLine <= 6) {
    // Left Angle (Profiles 5/1, 5/2, 6/2, 6/3)
    crossType = 'Left Angle';
    searchList = leftAngleCrosses;
  } else {
    return 'Unknown Cross';
  }

  // Search for matching cross
  const cross = searchList.find(c =>
    c.gates[0] === personalitySun &&
    c.gates[1] === personalityEarth &&
    c.gates[2] === designSun &&
    c.gates[3] === designEarth
  );

  if (cross) {
    return `${cross.name} (${personalitySun}/${personalityEarth} | ${designSun}/${designEarth})`;
  }

  // Fallback if exact match not found
  return `${crossType} Cross (${personalitySun}/${personalityEarth} | ${designSun}/${designEarth})`;
}

module.exports = { calculateIncarnationCross, rightAngleCrosses, juxtapositionCrosses, leftAngleCrosses };
