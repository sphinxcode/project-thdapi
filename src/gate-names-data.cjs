/**
 * Human Design Gate Names and I Ching Hexagram Glyphs
 * All 64 gates with their names and corresponding I Ching symbols
 * Data extracted from Human Design literature and I Ching unicode standards
 */

// Gate names for all 64 gates
const GATE_NAMES = {
    1: "Gate of Self-Expression",
    2: "Gate of the Direction of the Self",
    3: "Gate of Ordering",
    4: "Gate of Formulization",
    5: "Gate of Fixed Rhythms",
    6: "Gate of Friction",
    7: "Gate of the Role of the Self",
    8: "Gate of Contribution",
    9: "Gate of Focus",
    10: "Gate of the Behavior of the Self",
    11: "Gate of Ideas",
    12: "Gate of Caution",
    13: "Gate of the Listener",
    14: "Gate of Power Skills",
    15: "Gate of Extremes",
    16: "Gate of Skills",
    17: "Gate of Opinions",
    18: "Gate of Correction",
    19: "Gate of Wanting",
    20: "Gate of The Now",
    21: "Gate of The Hunter/Huntress",
    22: "Gate of Openness",
    23: "Gate of Assimilation",
    24: "Gate of Rationalization",
    25: "Gate of The Spirit of the Self",
    26: "Gate of The Egoist",
    27: "Gate of Caring",
    28: "Gate of The Game Player",
    29: "Gate of Perseverance",
    30: "Gate of Recognition",
    31: "Gate of Influence",
    32: "Gate of Duration",
    33: "Gate of Privacy",
    34: "Gate of Power",
    35: "Gate of Change",
    36: "Gate of Crisis",
    37: "Gate of Friendship",
    38: "Gate of Opposition",
    39: "Gate of Provocation",
    40: "Gate of Solitude",
    41: "Gate of Contraction",
    42: "Gate of Growth",
    43: "Gate of Breakthrough",
    44: "Gate of Alertness",
    45: "Gate of The Gatherer",
    46: "Gate of Determination",
    47: "Gate of Oppression",
    48: "Gate of Depth",
    49: "Gate of Principles",
    50: "Gate of Values",
    51: "Gate of Shock",
    52: "Gate of Stillness",
    53: "Gate of Beginnings",
    54: "Gate of Ambition",
    55: "Gate of Spirit",
    56: "Gate of Stimulation",
    57: "Gate of Intuitive Clarity",
    58: "Gate of Vitality",
    59: "Gate of Sexuality",
    60: "Gate of Limitation",
    61: "Gate of Mystery",
    62: "Gate of Detail",
    63: "Gate of Doubt",
    64: "Gate of Confusion"
};

// I Ching hexagram glyphs (Unicode symbols U+4DC0 to U+4DFF)
const I_CHING_GLYPHS = {
    1: "䷀",   // U+4DC0 - The Creative Heaven
    2: "䷁",   // U+4DC1 - The Receptive Earth
    3: "䷂",   // U+4DC2 - Difficulty at the Beginning
    4: "䷃",   // U+4DC3 - Youthful Folly
    5: "䷄",   // U+4DC4 - Waiting
    6: "䷅",   // U+4DC5 - Conflict
    7: "䷆",   // U+4DC6 - The Army
    8: "䷇",   // U+4DC7 - Holding Together
    9: "䷈",   // U+4DC8 - Small Taming
    10: "䷉",  // U+4DC9 - Treading
    11: "䷊",  // U+4DCA - Peace
    12: "䷋",  // U+4DCB - Standstill
    13: "䷌",  // U+4DCC - Fellowship
    14: "䷍",  // U+4DCD - Great Possession
    15: "䷎",  // U+4DCE - Modesty
    16: "䷏",  // U+4DCF - Enthusiasm
    17: "䷐",  // U+4DD0 - Following
    18: "䷑",  // U+4DD1 - Work on the Decayed
    19: "䷒",  // U+4DD2 - Approach
    20: "䷓",  // U+4DD3 - Contemplation
    21: "䷔",  // U+4DD4 - Biting Through
    22: "䷕",  // U+4DD5 - Grace
    23: "䷖",  // U+4DD6 - Stripping
    24: "䷗",  // U+4DD7 - Return
    25: "䷘",  // U+4DD8 - Innocence
    26: "䷙",  // U+4DD9 - Great Taming
    27: "䷚",  // U+4DDA - The Corners of the Mouth
    28: "䷛",  // U+4DDB - Overcoming
    29: "䷜",  // U+4DDC - The Abysmal Water
    30: "䷝",  // U+4DDD - The Clinging Fire
    31: "䷞",  // U+4DDE - Influence
    32: "䷟",  // U+4DDF - Duration
    33: "䷠",  // U+4DE0 - Retreat
    34: "䷡",  // U+4DE1 - Great Vigour
    35: "䷢",  // U+4DE2 - Progress
    36: "䷣",  // U+4DE3 - Darkening of the Light
    37: "䷤",  // U+4DE4 - The Family
    38: "䷥",  // U+4DE5 - Opposition
    39: "䷦",  // U+4DE6 - Obstruction
    40: "䷧",  // U+4DE7 - Deliverance
    41: "䷨",  // U+4DE8 - Decrease
    42: "䷩",  // U+4DE9 - Increase
    43: "䷪",  // U+4DEA - Breakthrough
    44: "䷫",  // U+4DEB - Coming to Meet
    45: "䷬",  // U+4DEC - Gathering Together
    46: "䷭",  // U+4DED - Ascending
    47: "䷮",  // U+4DEE - Oppression
    48: "䷯",  // U+4DEF - The Well
    49: "䷰",  // U+4DF0 - Revolution
    50: "䷱",  // U+4DF1 - The Cauldron
    51: "䷲",  // U+4DF2 - The Arousing Thunder
    52: "䷳",  // U+4DF3 - The Keeping Still Mountain
    53: "䷴",  // U+4DF4 - Development
    54: "䷵",  // U+4DF5 - The Marrying Maiden
    55: "䷶",  // U+4DF6 - Abundance
    56: "䷷",  // U+4DF7 - The Wanderer
    57: "䷸",  // U+4DF8 - The Gentle Wind
    58: "䷹",  // U+4DF9 - The Joyous Lake
    59: "䷺",  // U+4DFA - Dispersion
    60: "䷻",  // U+4DFB - Limitation
    61: "䷼",  // U+4DFC - Inner Truth
    62: "䷽",  // U+4DFD - Minor Plenty
    63: "䷾",  // U+4DFE - Before Completion
    64: "䷿"   // U+4DFF - After Completion
};

module.exports = {
    GATE_NAMES,
    I_CHING_GLYPHS
};
