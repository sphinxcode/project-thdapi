/**
 * Gate to Center Mapping
 * Each gate belongs to a specific center in the Human Design BodyGraph
 * Gates are assigned to the center where they originate (not where they connect to)
 */

const GATE_TO_CENTER = {
    // Head Center
    61: 'Head',
    63: 'Head',
    64: 'Head',

    // Ajna Center  
    4: 'Ajna',
    11: 'Ajna',
    17: 'Ajna',
    24: 'Ajna',
    43: 'Ajna',
    47: 'Ajna',

    // Throat Center
    8: 'Throat',
    12: 'Throat',
    16: 'Throat',
    20: 'Throat',
    23: 'Throat',
    31: 'Throat',
    33: 'Throat',
    35: 'Throat',
    45: 'Throat',
    56: 'Throat',
    62: 'Throat',

    // G Center (Identity)
    1: 'G',
    2: 'G',
    7: 'G',
    10: 'G',
    13: 'G',
    15: 'G',
    25: 'G',
    46: 'G',

    // Spleen Center
    18: 'Spleen',
    28: 'Spleen',
    32: 'Spleen',
    44: 'Spleen',
    48: 'Spleen',
    50: 'Spleen',
    57: 'Spleen',

    // Sacral Center
    3: 'Sacral',
    5: 'Sacral',
    9: 'Sacral',
    14: 'Sacral',
    27: 'Sacral',
    29: 'Sacral',
    34: 'Sacral',
    42: 'Sacral',
    59: 'Sacral',

    // Solar Plexus Center
    6: 'SolarPlexus',
    22: 'SolarPlexus',
    30: 'SolarPlexus',
    36: 'SolarPlexus',
    37: 'SolarPlexus',
    40: 'SolarPlexus',
    41: 'SolarPlexus',
    49: 'SolarPlexus',
    55: 'SolarPlexus',

    // Ego/Heart Center
    21: 'Ego',
    26: 'Ego',
    51: 'Ego',

    // Root Center
    19: 'Root',
    38: 'Root',
    39: 'Root',
    52: 'Root',
    53: 'Root',
    54: 'Root',
    58: 'Root',
    60: 'Root'
};

module.exports = {
    GATE_TO_CENTER
};
