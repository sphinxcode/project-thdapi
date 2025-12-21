/**
 * Response Transformers for V1/V2 API endpoints
 * V1 = Lean enterprise API (customers provide their own descriptions)
 * V2 = Full featured API (includes all enrichment data)
 */

/**
 * Create enterprise-ready property object with id, value, description, link pattern
 * @param {string} id - Kebab-case identifier
 * @param {string} value - Display value
 * @param {string} description - Empty string for V1, populated for V2
 * @param {string} link - URL to documentation (empty for V1)
 */
function createProperty(id, value, description = '', link = '') {
    return { id, value, description, link };
}

/**
 * Convert string to kebab-case id
 */
function toKebabCase(str) {
    if (!str) return 'unknown';
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/**
 * Transform planet activation for V1 (lean)
 * Structured format with activation object
 * Excludes: house, iChingGlyph, codon data
 */
function transformPlanetV1(planet) {
    if (!planet) return null;
    return {
        activation: {
            gate: planet.gate,
            line: planet.line,
            color: planet.color,
            tone: planet.tone,
            base: planet.base,
            fixingState: planet.fixingState || null,
            isRetrograde: planet.isRetrograde || false
        },
        sign: planet.sign || ''
    };
}

/**
 * Transform planet activation for V2 (full)
 * Organized into logical groups: activation, astrology, genetics
 */
function transformPlanetV2(planet) {
    if (!planet) return null;
    return {
        // Human Design activation data
        activation: {
            gate: planet.gate,
            line: planet.line,
            color: planet.color,
            tone: planet.tone,
            base: planet.base,
            fixingState: planet.fixingState || null,
            isRetrograde: planet.isRetrograde || false
        },

        // Astrological positioning
        astrology: {
            sign: planet.sign || '',
            house: planet.house
        },

        // I Ching & Genetic data
        genetics: {
            iChingGlyph: planet.iChingGlyph || '',
            aminoAcid: planet.aminoAcid || '',
            codonRing: planet.codonRing || '',
            codon: planet.codon || ''
        }
    };
}

/**
 * Transform channel for V1 (lean - empty descriptions)
 */
function transformChannelV1(channel) {
    return {
        id: channel.gates,
        gates: channel.gates,
        name: '',
        circuitry: '',
        centers: [],
        description: '',
        link: ''
    };
}

/**
 * Transform channel for V2 (full)
 */
function transformChannelV2(channel) {
    return {
        id: channel.gates,
        gates: channel.gates,
        name: channel.name || '',
        circuitry: channel.circuitry || '',
        centers: channel.centers || [],
        description: '',
        link: ''
    };
}

/**
 * Get incarnation cross display value
 */
function getIncarnationCrossValue(ic) {
    if (typeof ic === 'string') return ic;
    if (ic && ic.fullName) return ic.fullName;
    if (ic && ic.name) return ic.name;
    return 'Unknown';
}

/**
 * Get incarnation cross id
 */
function getIncarnationCrossId(ic) {
    if (typeof ic === 'string') return toKebabCase(ic);
    if (ic && ic.name) return toKebabCase(ic.name);
    return 'unknown';
}

/**
 * Create empty tooltips structure (for non-tooltip endpoints)
 * Structure mirrors the original but with all descriptions empty
 */
function createEmptyTooltips(originalTooltips) {
    if (!originalTooltips) return {};

    const emptyTooltips = {};

    // Recursively empty descriptions while preserving structure
    function emptyDescriptions(obj) {
        if (typeof obj !== 'object' || obj === null) return obj;
        if (Array.isArray(obj)) return obj.map(emptyDescriptions);

        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            if (key === 'description' || key === 'Description') {
                result[key] = '';
            } else if (typeof value === 'object') {
                result[key] = emptyDescriptions(value);
            } else {
                result[key] = value;
            }
        }
        return result;
    }

    return emptyDescriptions(originalTooltips);
}

/**
 * Transform to V1 format (lean enterprise)
 * All descriptions are empty strings for enterprise customers to fill in
 * @param {Object} result - Full calculation result
 * @param {boolean} includeTooltips - Whether to include full tooltips (false = empty)
 */
function transformToV1(result, includeTooltips = false) {
    const planets = ['Sun', 'Earth', 'Rahu', 'Ketu', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

    return {
        birthInfo: result.birthInfo,

        chart: {
            type: createProperty(toKebabCase(result.chart.type), result.chart.type),
            strategy: createProperty(toKebabCase(result.chart.strategy), result.chart.strategy),
            authority: createProperty(toKebabCase(result.chart.authority), result.chart.authority),
            signature: createProperty(toKebabCase(result.chart.signature), result.chart.signature),
            notSelfTheme: createProperty(toKebabCase(result.chart.notSelfTheme), result.chart.notSelfTheme),
            profile: createProperty(result.chart.profile, result.chart.profile),
            profileName: result.chart.profileName || result.chart.profile,
            definition: createProperty(toKebabCase(result.chart.definition), result.chart.definition),
            incarnationCross: createProperty(
                getIncarnationCrossId(result.chart.incarnationCross),
                getIncarnationCrossValue(result.chart.incarnationCross)
            ),
            variable: createProperty(result.chart.variableType, result.chart.variableType)
        },

        phs: {
            digestion: createProperty(toKebabCase(result.phs.digestion), result.phs.digestion),
            digestionTone: createProperty(toKebabCase(result.phs.digestionTone), result.phs.digestionTone),
            digestionOrientation: result.phs.digestionOrientation,
            environment: createProperty(toKebabCase(result.phs.environment), result.phs.environment),
            environmentalTone: createProperty(toKebabCase(result.phs.environmentalTone), result.phs.environmentalTone),
            environmentOrientation: result.phs.environmentOrientation
        },

        ravePsychology: {
            motivation: createProperty(toKebabCase(result.ravePsychology.motivation), result.ravePsychology.motivation),
            motivationTone: createProperty(toKebabCase(result.ravePsychology.motivationTone), result.ravePsychology.motivationTone),
            motivationOrientation: result.ravePsychology.motivationOrientation,
            perspective: createProperty(toKebabCase(result.ravePsychology.perspective), result.ravePsychology.perspective),
            perspectiveTone: createProperty(toKebabCase(result.ravePsychology.perspectiveTone), result.ravePsychology.perspectiveTone),
            perspectiveOrientation: result.ravePsychology.perspectiveOrientation
        },

        centers: result.centers,

        channels: result.channels.map(transformChannelV1),

        gates: result.gatesByCategory,

        personality: Object.fromEntries(
            planets.filter(p => result.personality[p]).map(p => [p, transformPlanetV1(result.personality[p])])
        ),

        design: Object.fromEntries(
            planets.filter(p => result.design[p]).map(p => [p, transformPlanetV1(result.design[p])])
        ),

        tooltips: includeTooltips ? result.tooltips : createEmptyTooltips(result.tooltips)
    };
}

/**
 * Transform to V2 format (full featured)
 * Includes all enrichment data, tooltips, and extras
 * @param {Object} result - Full calculation result
 * @param {boolean} includeTooltips - Whether to include full tooltips (false = empty)
 */
function transformToV2(result, includeTooltips = false) {
    const planets = ['Sun', 'Earth', 'Rahu', 'Ketu', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

    return {
        birthInfo: result.birthInfo,
        chart: result.chart,
        phs: result.phs,
        ravePsychology: result.ravePsychology,
        centers: result.centers,
        channels: result.channels.map(transformChannelV2),
        gates: result.gatesByCategory,

        personality: Object.fromEntries(
            planets.filter(p => result.personality[p]).map(p => [p, transformPlanetV2(result.personality[p])])
        ),

        design: Object.fromEntries(
            planets.filter(p => result.design[p]).map(p => [p, transformPlanetV2(result.design[p])])
        ),

        extras: result.extras,
        tooltips: includeTooltips ? result.tooltips : createEmptyTooltips(result.tooltips)
    };
}

module.exports = {
    transformToV1,
    transformToV2,
    createProperty,
    toKebabCase,
    transformPlanetV1,
    transformPlanetV2,
    createEmptyTooltips
};

