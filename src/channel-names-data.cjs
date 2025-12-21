/**
 * Human Design Channel Names and Circuitry
 * All 36 channels with their names, circuitry classification, and centers
 * Extracted from Human Design literature and database
 */

// Channel names
const CHANNEL_NAMES = {
    "1-8": "Channel of Inspiration",
    "2-14": "Channel of the Beat",
    "3-60": "Channel of Mutation",
    "4-63": "Channel of Logic",
    "5-15": "Channel of Rhythm",
    "6-59": "Channel of Mating",
    "7-31": "Channel of the Alpha",
    "9-52": "Channel of Concentration",
    "10-20": "Channel of Awakening",
    "10-34": "Channel of Exploration",
    "10-57": "Channel of Perfected Form",
    "11-56": "Channel of Curiosity",
    "12-22": "Channel of Openness",
    "13-33": "Channel of the Prodigal",
    "16-48": "Channel of Wavelength",
    "17-62": "Channel of Acceptance",
    "18-58": "Channel of Judgment",
    "19-49": "Channel of Synthesis",
    "20-34": "Channel of Charisma",
    "20-57": "Channel of the Brainwave",
    "21-45": "Channel of Money",
    "23-43": "Channel of Structuring",
    "24-61": "Channel of Awareness",
    "25-51": "Channel of Initiation",
    "26-44": "Channel of Surrender",
    "27-50": "Channel of Preservation",
    "28-38": "Channel of Struggle",
    "29-46": "Channel of Discovery",
    "30-41": "Channel of Recognition",
    "32-54": "Channel of Transformation",
    "34-57": "Channel of Power",
    "35-36": "Channel of Transitoriness",
    "37-40": "Channel of Community",
    "39-55": "Channel of Emoting",
    "42-53": "Channel of Maturation",
    "47-64": "Channel of Abstraction"
};

// Circuitry classification
// Three main circuits: Individual, Tribal, Collective
// Each with sub-circuits
const CHANNEL_CIRCUITRY = {
    // INDIVIDUAL CIRCUIT GROUP
    // Knowing Circuit (Centering sub-circuit)
    "1-8": "Individual/Knowing",
    "7-31": "Individual/Knowing",
    "10-20": "Individual/Knowing",
    "10-34": "Individual/Knowing",
    "13-33": "Individual/Knowing",
    "25-51": "Individual/Knowing",
    "29-46": "Individual/Knowing/Integration",

    // Integration Circuit
    "10-57": "Individual/Integration",
    "20-34": "Individual/Integration",
    "20-57": "Individual/Integration",
    "34-57": "Individual/Integration",

    // Sensing Circuit
    "3-60": "Individual/Sensing",
    "28-38": "Individual/Sensing",
    "39-55": "Individual/Sensing",

    // TRIBAL CIRCUIT GROUP
    // Ego Circuit
    "21-45": "Tribal/Ego",
    "25-51": "Tribal/Ego",  // also Individual/Knowing
    "26-44": "Tribal/Ego",
    "40-37": "Tribal/Ego",

    // Defense Circuit
    "6-59": "Tribal/Defense",
    "27-50": "Tribal/Defense",

    // COLLECTIVE CIRCUIT GROUP
    // Logic Circuit (Understanding sub-circuit)
    "4-63": "Collective/Logic",
    "11-56": "Collective/Logic",
    "16-48": "Collective/Logic",
    "17-62": "Collective/Logic",
    "18-58": "Collective/Logic",
    "24-61": "Collective/Logic",
    "43-23": "Collective/Logic",
    "47-64": "Collective/Logic",

    // Sensing Circuit (Abstract sub-circuit)
    "2-14": "Collective/Abstract",
    "5-15": "Collective/Abstract",
    "12-22": "Collective/Abstract",
    "19-49": "Collective/Abstract",
    "30-41": "Collective/Abstract",
    "35-36": "Collective/Abstract",
    "42-53": "Collective/Abstract",

    // Root Circuit
    "9-52": "Collective/Logic",
    "32-54": "Tribal/Ego",
    "37-40": "Tribal/Ego"
};

// Simplified circuitry (main circuit only)
const CHANNEL_CIRCUIT_SIMPLE = {
    // Individual
    "1-8": "Individual",
    "3-60": "Individual",
    "7-31": "Individual",
    "10-20": "Individual",
    "10-34": "Individual",
    "10-57": "Individual",
    "13-33": "Individual",
    "20-34": "Individual",
    "20-57": "Individual",
    "25-51": "Individual",
    "28-38": "Individual",
    "29-46": "Individual",
    "34-57": "Individual",
    "39-55": "Individual",

    // Tribal
    "6-59": "Tribal",
    "19-49": "Tribal",
    "21-45": "Tribal",
    "26-44": "Tribal",
    "27-50": "Tribal",
    "32-54": "Tribal",
    "37-40": "Tribal",

    // Collective
    "2-14": "Collective",
    "4-63": "Collective",
    "5-15": "Collective",
    "9-52": "Collective",
    "11-56": "Collective",
    "12-22": "Collective",
    "16-48": "Collective",
    "17-62": "Collective",
    "18-58": "Collective",
    "23-43": "Collective",
    "24-61": "Collective",
    "30-41": "Collective",
    "35-36": "Collective",
    "42-53": "Collective",
    "47-64": "Collective"
};

module.exports = {
    CHANNEL_NAMES,
    CHANNEL_CIRCUITRY,
    CHANNEL_CIRCUIT_SIMPLE
};
