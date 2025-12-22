/**
 * Composite Chart Transformers for Human Design Relationship Analysis
 * Creates merged composite charts from two individual charts
 * Calculates relationship channel dynamics (Electromagnetic, Compromise, Dominance, Companionship)
 */

const { HARMONIC_GATES, CENTERS_BY_CHANNEL } = require('./channel-data.cjs');
const { CHANNEL_NAMES, CHANNEL_CIRCUITRY } = require('./channel-names-data.cjs');

/**
 * Get all gates from a chart (both personality and design)
 * @param {Object} result - Full calculation result
 * @returns {Set<number>} Set of all gate numbers
 */
function getAllGates(result) {
    const gates = new Set();
    
    // Add defined gates
    if (result.gatesByCategory?.definedGates) {
        result.gatesByCategory.definedGates.forEach(g => gates.add(g));
    }
    
    // Add hanging gates (both open and closed hanging)
    if (result.gatesByCategory?.hangingOpen) {
        result.gatesByCategory.hangingOpen.forEach(g => gates.add(g));
    }
    if (result.gatesByCategory?.hangingClosed) {
        result.gatesByCategory.hangingClosed.forEach(g => gates.add(g));
    }
    
    return gates;
}

/**
 * Get channels from a chart
 * @param {Object} result - Full calculation result
 * @returns {Set<string>} Set of channel ids (e.g., "1-8")
 */
function getChannels(result) {
    const channels = new Set();
    if (result.channels) {
        result.channels.forEach(ch => {
            // Normalize channel format (ensure smaller number first)
            const normalized = normalizeChannelId(ch.gates);
            channels.add(normalized);
        });
    }
    return channels;
}

/**
 * Normalize channel ID to ensure consistent format (smaller gate first)
 * @param {string} channelId - Channel ID like "1-8" or "8-1"
 * @returns {string} Normalized channel ID
 */
function normalizeChannelId(channelId) {
    const [a, b] = channelId.split('-').map(Number);
    return a < b ? `${a}-${b}` : `${b}-${a}`;
}

/**
 * Calculate relationship channels between two charts
 * Returns categorized channels: Electromagnetic, Compromise, Dominance, Companionship
 * 
 * @param {Object} chartA - Person A's full result
 * @param {Object} chartB - Person B's full result
 * @returns {Object} Relationship channel categories
 */
function calculateRelationshipChannels(chartA, chartB) {
    const gatesA = getAllGates(chartA);
    const gatesB = getAllGates(chartB);
    const channelsA = getChannels(chartA);
    const channelsB = getChannels(chartB);
    
    const electromagnetic = []; // Each person has one gate of the channel
    const compromise = [];      // Both have the same gate(s), creating the channel together
    const dominance = [];       // One person has the complete channel, bringing it to the relationship
    const companionship = [];   // Both share the exact same complete channel
    
    // All 36 possible channels
    const allChannels = Object.keys(CENTERS_BY_CHANNEL);
    
    for (const channelId of allChannels) {
        const [gate1, gate2] = channelId.split('-').map(Number);
        
        const aHasGate1 = gatesA.has(gate1);
        const aHasGate2 = gatesA.has(gate2);
        const bHasGate1 = gatesB.has(gate1);
        const bHasGate2 = gatesB.has(gate2);
        
        const aHasChannel = channelsA.has(channelId);
        const bHasChannel = channelsB.has(channelId);
        
        // Channel data for response
        const channelData = createChannelData(channelId, gate1, gate2);
        
        // Both have the complete channel (Companionship)
        if (aHasChannel && bHasChannel) {
            companionship.push(channelData);
            continue;
        }
        
        // One person has the complete channel (Dominance)
        // The person with the channel "dominates" this energy
        if (aHasChannel && !bHasChannel) {
            dominance.push({ ...channelData, source: 'personA' });
            continue;
        }
        if (bHasChannel && !aHasChannel) {
            dominance.push({ ...channelData, source: 'personB' });
            continue;
        }
        
        // Neither has the complete channel, check if they create one together
        const canFormChannel = (aHasGate1 || bHasGate1) && (aHasGate2 || bHasGate2);
        
        if (!canFormChannel) continue;
        
        // Electromagnetic: A has one gate, B has the other (classic attraction)
        if ((aHasGate1 && !aHasGate2 && bHasGate2 && !bHasGate1) ||
            (aHasGate2 && !aHasGate1 && bHasGate1 && !bHasGate2)) {
            electromagnetic.push(channelData);
            continue;
        }
        
        // Compromise: Both have at least one of the same gates, creating tension
        // E.g., Both have gate 1, and together they also have gate 8
        if ((aHasGate1 && bHasGate1) || (aHasGate2 && bHasGate2)) {
            if (canFormChannel) {
                compromise.push(channelData);
                continue;
            }
        }
    }
    
    return {
        Companionship: {
            Name: 'Companionship Channels',
            Id: 'Companionship Channels',
            List: companionship
        },
        Dominance: {
            Name: 'Dominance Channels',
            Id: 'Dominance Channels',
            List: dominance
        },
        Compromise: {
            Name: 'Compromise Channels',
            Id: 'Compromise Channels',
            List: compromise
        },
        Electromagnetic: {
            Name: 'Electromagnetic Channels',
            Id: 'Electromagnetic Channels',
            List: electromagnetic
        }
    };
}

/**
 * Create channel data object for response
 */
function createChannelData(channelId, gate1, gate2) {
    const name = CHANNEL_NAMES[channelId] || `Channel ${channelId}`;
    return {
        Option: `${name} (${channelId})`,
        Description: '',
        Description2: null,
        Link: '',
        Gates: [gate1, gate2]
    };
}

/**
 * Calculate combined centers from two charts
 * @param {Object} chartA - Person A's full result
 * @param {Object} chartB - Person B's full result
 * @returns {Object} Combined centers (defined and open)
 */
function calculateCombinedCenters(chartA, chartB) {
    const allCenters = ['Head', 'Ajna', 'Throat', 'G', 'Ego', 'Sacral', 'SolarPlexus', 'Spleen', 'Root'];
    
    // Convert to sets for easy lookup
    const definedA = new Set(chartA.centers?.defined || []);
    const definedB = new Set(chartB.centers?.defined || []);
    
    const combinedDefined = [];
    const combinedOpen = [];
    
    for (const center of allCenters) {
        // Normalize center names for comparison
        if (definedA.has(center) || definedB.has(center)) {
            combinedDefined.push(`${center.toLowerCase()} center`);
        } else {
            combinedOpen.push(`${center.toLowerCase()} center`);
        }
    }
    
    return {
        DefinedCenters: combinedDefined,
        OpenCenters: combinedOpen
    };
}

/**
 * Determine combined definition type
 * @param {Array} definedCenters - List of defined centers
 * @returns {Object} Definition type object
 */
function calculateCombinedDefinition(definedCenters, chartA, chartB) {
    const definedCount = definedCenters.length;
    
    // Simple heuristic based on number of defined centers
    // Real calculation would check connectivity between centers
    let definitionType = 'Single Definition';
    
    if (definedCount <= 2) {
        definitionType = 'No Definition';
    } else if (definedCount >= 7) {
        definitionType = 'Single Definition';
    } else if (definedCount >= 5) {
        definitionType = 'Split Definition';
    } else {
        definitionType = 'Triple Split';
    }
    
    return {
        Name: 'Definition',
        Id: definitionType,
        Option: definitionType,
        Description: '',
        Link: ''
    };
}

/**
 * Generate connection theme based on center coverage
 * @param {number} definedCount - Number of defined centers
 * @param {number} openCount - Number of open centers
 * @returns {Object} Connection theme object
 */
function generateConnectionTheme(definedCount, openCount) {
    let themeDescription = '';
    
    if (definedCount === 9) {
        themeDescription = 'With all 9 centers defined, you have a complete energetic union. This is a rare and powerful connection where all aspects of the Human Design bodygraph are activated between you.';
    } else if (definedCount >= 7) {
        themeDescription = `With ${definedCount} defined centers and ${openCount} open centers, you have a strong foundation with specific areas for mutual exploration. The ${openCount === 1 ? 'one open center provides' : `${openCount} open centers provide`} space for growth while maintaining overall stability.`;
    } else if (definedCount >= 5) {
        themeDescription = `With ${definedCount} defined centers and ${openCount} open centers, you have a balanced relationship with room for both grounding and expansion. Pay attention to your open centers as areas for learning together.`;
    } else {
        themeDescription = `With ${definedCount} defined centers and ${openCount} open centers, you have significant space for mutual exploration and growth. The open centers represent opportunities to learn and develop together.`;
    }
    
    return {
        ThemeDescription: themeDescription,
        Name: 'Connection Theme',
        Id: `${definedCount} - ${openCount}, ${definedCount >= 7 ? 'Balanced' : 'Growth-Oriented'} Definition`,
        Option: `${definedCount} - ${openCount}, ${definedCount >= 7 ? 'Balanced' : 'Growth-Oriented'} Definition`,
        Description: themeDescription,
        Link: ''
    };
}

/**
 * Transform two charts into a composite response
 * @param {Object} chartA - Person A's full calculation result
 * @param {Object} chartB - Person B's full calculation result
 * @param {Object} v1TransformA - V1 transformed result for Person A
 * @param {Object} v1TransformB - V1 transformed result for Person B
 * @returns {Object} Composite chart response
 */
function createCompositeChart(chartA, chartB, v1TransformA, v1TransformB) {
    // Calculate combined analysis
    const combinedCenters = calculateCombinedCenters(chartA, chartB);
    const relationshipChannels = calculateRelationshipChannels(chartA, chartB);
    const combinedDefinition = calculateCombinedDefinition(combinedCenters.DefinedCenters, chartA, chartB);
    const connectionTheme = generateConnectionTheme(
        combinedCenters.DefinedCenters.length,
        combinedCenters.OpenCenters.length
    );
    
    return {
        personA: v1TransformA,
        personB: v1TransformB,
        Combined: {
            UnconsciousCenters: [],
            ConsciousCenters: [],
            DefinedCenters: combinedCenters.DefinedCenters,
            OpenCenters: combinedCenters.OpenCenters,
            Properties: {
                Definition: combinedDefinition,
                ConnectionTheme: connectionTheme,
                RelationshipChannels: relationshipChannels
            },
            ChartUrl: null
        }
    };
}

module.exports = {
    createCompositeChart,
    calculateRelationshipChannels,
    calculateCombinedCenters,
    getAllGates,
    getChannels,
    normalizeChannelId
};
