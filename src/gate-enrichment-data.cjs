/**
 * Gate Enrichment Data for Human Design MCP
 * 
 * This module provides additional gate information:
 * - gateDescription: Short snippet description of each gate
 * - harmonicPartner: Opposite gate in the wheel (180° acrossmandala)
 * - electromagnetPartner: Opposite gate in channels (the gate that completes the channel)
 */

// Gate descriptions extracted from keynotes in gate markdown files
const GATE_DESCRIPTIONS = {
    1: "Self-Expression through Uniqueness",
    2: "Receptive Direction of the Self",
    3: "Ordering and Structuring Beginnings",
    4: "Mental Solutions and Formulization",
    5: "Fixed Rhythms and Patterns",
    6: "Emotional Friction and Intimacy",
    7: "The Role of Self in Interaction",
    8: "Contributing to the Whole",
    9: "Focus and Detailing Energy",
    10: "Behavior of the Self - Love of Self",
    11: "Ideas and Mental Concepts",
    12: "Caution and Articulation",
    13: "The Listener - Keeper of Secrets",
    14: "Power Skills and Stewardship",
    15: "Extremes and Modesty in Love for Humanity",
    16: "Skills and Enthusiasm",
    17: "Opinions and Following",
    18: "Correction and Perfection",
    19: "Need and Sensitivity to Resources",
    20: "The Now - Contemplation and Awareness",
    21: "The Hunter/Huntress - Control and Willpower",
    22: "Openness and Grace",
    23: "Assimilation and Individual Knowing",
    24: "Rationalization and Return to Source",
    25: "Spirit of the Self - Innocence",
    26: "The Egoist - Taming Power",
    27: "Nourishment and Caring",
    28: "The Game Player - Risk and Purpose",
    29: "Perseverance and Commitment",
    30: "Recognition of Feelings and Fate",
    31: "Influence and Democratic Leadership",
    32: "Duration and Continuity",
    33: "Privacy and Retreat",
    34: "Power and Great Strength",
    35: "Change and Progress",
    36: "Crisis and Darkening of the Light",
    37: "Friendship and Tribal Bargains",
    38: "Opposition and the Fighter",
    39: "Provocation and Spirit",
    40: "Aloneness and Delivery",
    41: "Contraction - Decrease and Fantasy",
    42: "Growth and Increase",
    43: "Breakthrough and Insight",
    44: "Alertness and Coming to Meet",
    45: "The Gatherer - Tribal King/Queen",
    46: "Determination of the Self and Luck",
    47: "Oppression and Realization",
    48: "Depth and the Well",
    49: "Principles and Revolution",
    50: "Values and the Cauldron",
    51: "Shock and Arousing",
    52: "Stillness and Keeping Still",
    53: "Beginnings and Development",
    54: "Ambition and the Marrying Maiden",
    55: "Spirit and Abundance",
    56: "Stimulation and the Wanderer",
    57: "Intuitive Insight and the Gentle",
    58: "Vitality and Joy",
    59: "Sexuality and Dispersion",
    60: "Acceptance and Limitation",
    61: "Mystery and Inner Truth",
    62: "Details and Preponderance of the Small",
    63: "Doubt and After Completion",
    64: "Confusion and Before Completion"
};

// Harmonic partners: I Ching genetic opposites (amino acid ring pairs)
// These are NOT channel partners - they are opposite gates in the genetic wheel
// Source: hdkit aminoAcidByGate oppositeGate mappings
const HARMONIC_GATES = {
    1: 2,    // Ring of Fire (Lysine)
    2: 1,    // Ring of Fire (Lysine)
    3: 50,   // Ring of Life & Death vs Ring of Illuminati
    4: 49,   // Ring of Union (Valine) vs Ring of Whirlwind (Histidine)
    5: 35,   // Ring of Light (Threonine) vs Ring of Miracles (Tryptophan)
    6: 36,   // Ring of Alchemy (Glycine) vs Ring of Divinity (Proline)
    7: 13,   // Ring of Union (Valine) vs Ring of Purification (Glutamine)
    8: 14,   // Ring of Water (Phenylalanine) vs Ring of Fire (Lysine)
    9: 16,   // Ring of Light (Threonine) vs Ring of Prosperity (Cysteine)
    10: 15,  // Ring of Humanity (Arginine) vs Ring of Seeking (Serine)
    11: 12,  // Ring of Light (Threonine) vs Ring of Trials (Terminator)
    12: 11,  // Ring of Trials (Terminator) vs Ring of Light (Threonine)
    13: 7,   // Ring of Purification (Glutamine) vs Ring of Union (Valine)
    14: 8,   // Ring of Fire (Lysine) vs Ring of Water (Phenylalanine)
    15: 10,  // Ring of Seeking (Serine) vs Ring of Humanity (Arginine)
    16: 9,   // Ring of Prosperity (Cysteine) vs Ring of Light (Threonine)
    17: 18,  // Ring of Humanity (Arginine) vs Ring of Matter (Alanine)
    18: 17,  // Ring of Matter (Alanine) vs Ring of Humanity (Arginine)
    19: 33,  // Ring of Gaia (Isoleucine) vs Ring of Trials (Terminator)
    20: 34,  // Ring of Life & Death (Leucine) vs Ring of Destiny (Asparagine)
    21: 48,  // Ring of Humanity (Arginine) vs Ring of Matter (Alanine)
    22: 47,  // Ring of Divinity (Proline) vs Ring of Alchemy (Glycine)
    23: 43,  // Ring of Life & Death (Leucine) vs Ring of Destiny (Asparagine)
    24: 44,  // Ring of Life & Death (Leucine) vs Ring of Illuminati (Glutamic Acid)
    25: 46,  // Ring of Humanity (Arginine) vs Ring of Matter (Alanine)
    26: 45,  // Ring of Light (Threonine) vs Ring of Prosperity (Cysteine)
    27: 28,  // Ring of Life & Death (Leucine) vs Ring of Illusion (Asparaginic Acid)
    28: 27,  // Ring of Illusion (Asparaginic Acid) vs Ring of Life & Death (Leucine)
    29: 30,  // Ring of Union (Valine) vs Ring of Purification (Glutamine)
    30: 29,  // Ring of Purification (Glutamine) vs Ring of Union (Valine)
    31: 41,  // Ring of No Return (Tyrosine) vs Ring of Origin (Methionine)
    32: 42,  // Ring of Illusion (Asparaginic Acid) vs Ring of Life & Death (Leucine)
    33: 19,  // Ring of Trials (Terminator) vs Ring of Gaia (Isoleucine)
    34: 20,  // Ring of Destiny (Asparagine) vs Ring of Life & Death (Leucine)
    35: 5,   // Ring of Miracles (Tryptophan) vs Ring of Light (Threonine)
    36: 6,   // Ring of Divinity (Proline) vs Ring of Alchemy (Glycine)
    37: 40,  // Ring of Divinity (Proline) vs Ring of Alchemy (Glycine)
    38: 39,  // Ring of Humanity (Arginine) vs Ring of Seeking (Serine)
    39: 38,  // Ring of Seeking (Serine) vs Ring of Humanity (Arginine)
    40: 37,  // Ring of Alchemy (Glycine) vs Ring of Divinity (Proline)
    41: 31,  // Ring of Origin (Methionine) vs Ring of No Return (Tyrosine)
    42: 32,  // Ring of Life & Death (Leucine) vs Ring of Illusion (Asparaginic Acid)
    43: 23,  // Ring of Destiny (Asparagine) vs Ring of Life & Death (Leucine)
    44: 24,  // Ring of Illuminati (Glutamic Acid) vs Ring of Life & Death (Leucine)
    45: 26,  // Ring of Prosperity (Cysteine) vs Ring of Light (Threonine)
    46: 25,  // Ring of Matter (Alanine) vs Ring of Humanity (Arginine)
    47: 22,  // Ring of Alchemy (Glycine) vs Ring of Divinity (Proline)
    48: 21,  // Ring of Matter (Alanine) vs Ring of Humanity (Arginine)
    49: 4,   // Ring of Whirlwind (Histidine) vs Ring of Union (Valine)
    50: 3,   // Ring of Illuminati (Glutamic Acid) vs Ring of Life & Death (Leucine)
    51: 57,  // Ring of Humanity (Arginine) vs Ring of Matter (Alanine)
    52: 58,  // Ring of Seeking (Serine) - both in same ring
    53: 54,  // Ring of Seeking (Serine) - both in same ring
    54: 53,  // Ring of Seeking (Serine) - both in same ring
    55: 59,  // Ring of Whirlwind (Histidine) vs Ring of Union (Valine)
    56: 60,  // Ring of Trials (Terminator) vs Ring of Gaia (Isoleucine)
    57: 51,  // Ring of Matter (Alanine) vs Ring of Humanity (Arginine)
    58: 52,  // Ring of Seeking (Serine) - both in same ring
    59: 55,  // Ring of Union (Valine) vs Ring of Whirlwind (Histidine)
    60: 56,  // Ring of Gaia (Isoleucine) vs Ring of Trials (Terminator)
    61: 62,  // Ring of Gaia (Isoleucine) vs Ring of No Return (Tyrosine)
    62: 61,  // Ring of No Return (Tyrosine) vs Ring of Gaia (Isoleucine)
    63: 64,  // Ring of Divinity (Proline) vs Ring of Alchemy (Glycine)
    64: 63   // Ring of Alchemy (Glycine) vs Ring of Divinity (Proline)
};

// Electromagnetic partners: Gates that form channels together
// When both gates are activated, they create electromagnetic connections
// This is derived from the 36 channels in Human Design
const ELECTROMAGNETIC_GATES = {
    1: 8,    // Channel 1-8: Inspiration
    2: 14,   // Channel 2-14: The Beat
    3: 60,   // Channel 3-60: Mutation
    4: 63,   // Channel 4-63: Logic
    5: 15,   // Channel 5-15: Rhythm
    6: 59,   // Channel 6-59: Mating
    7: 31,   // Channel 7-31: The Alpha
    8: 1,    // Channel 1-8: Inspiration
    9: 52,   // Channel 9-52: Concentration
    10: [20, 34, 57],  // Gate 10 forms 3 channels
    11: 56,  // Channel 11-56: Curiosity
    12: 22,  // Channel 12-22: Openness
    13: 33,  // Channel 13-33: The Prodigal
    14: 2,   // Channel 2-14: The Beat
    15: 5,   // Channel 5-15: Rhythm
    16: 48,  // Channel 16-48: Wavelength
    17: 62,  // Channel 17-62: Acceptance
    18: 58,  // Channel 18-58: Judgment
    19: 49,  // Channel 19-49: Synthesis
    20: [10, 34, 57],  // Gate 20 forms 3 channels
    21: 45,  // Channel 21-45: Money
    22: 12,  // Channel 12-22: Openness
    23: 43,  // Channel 23-43: Structuring
    24: 61,  // Channel 24-61: Awareness
    25: 51,  // Channel 25-51: Initiation
    26: 44,  // Channel 26-44: Surrender
    27: 50,  // Channel 27-50: Preservation
    28: 38,  // Channel 28-38: Struggle
    29: 46,  // Channel 29-46: Discovery
    30: 41,  // Channel 30-41: Recognition
    31: 7,   // Channel 7-31: The Alpha
    32: 54,  // Channel 32-54: Transformation
    33: 13,  // Channel 13-33: The Prodigal
    34: [10, 20, 57],  // Gate 34 forms 3 channels
    35: 36,  // Channel 35-36: Transitoriness
    36: 35,  // Channel 35-36: Transitoriness
    37: 40,  // Channel 37-40: Community
    38: 28,  // Channel 28-38: Struggle
    39: 55,  // Channel 39-55: Emoting
    40: 37,  // Channel 37-40: Community
    41: 30,  // Channel 30-41: Recognition
    42: 53,  // Channel 42-53: Maturation
    43: 23,  // Channel 23-43: Structuring
    44: 26,  // Channel 26-44: Surrender
    45: 21,  // Channel 21-45: Money
    46: 29,  // Channel 29-46: Discovery
    47: 64,  // Channel 47-64: Abstraction
    48: 16,  // Channel 16-48: Wavelength
    49: 19,  // Channel 19-49: Synthesis
    50: 27,  // Channel 27-50: Preservation
    51: 25,  // Channel 25-51: Initiation
    52: 9,   // Channel 9-52: Concentration
    53: 42,  // Channel 42-53: Maturation
    54: 32,  // Channel 32-54: Transformation
    55: 39,  // Channel 39-55: Emoting
    56: 11,  // Channel 11-56: Curiosity
    57: [10, 20, 34],  // Gate 57 forms 3 channels
    58: 18,  // Channel 18-58: Judgment
    59: 6,   // Channel 6-59: Mating
    60: 3,   // Channel 3-60: Mutation
    61: 24,  // Channel 24-61: Awareness
    62: 17,  // Channel 17-62: Acceptance
    63: 4,   // Channel 4-63: Logic
    64: 47   // Channel 47-64: Abstraction
};

module.exports = {
    GATE_DESCRIPTIONS,
    HARMONIC_GATES,
    ELECTROMAGNETIC_GATES
};
