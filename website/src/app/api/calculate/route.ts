import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.HD_API_URL || 'https://humandesignmcp-production.up.railway.app';
const API_TOKEN = process.env.HD_API_TOKEN || '';

interface BirthData {
  name: string;
  email: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
}

function generateChartId(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

export async function POST(request: NextRequest) {
  try {
    const body: BirthData = await request.json();

    // Validate required fields
    if (!body.birthDate || !body.birthCity) {
      return NextResponse.json(
        { message: 'Birth date and city are required' },
        { status: 400 }
      );
    }

    // Call the Railway API with the correct field names
    const apiResponse = await fetch(`${API_URL}/api/human-design`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify({
        birthDate: body.birthDate,
        birthTime: body.birthTime || '12:00',
        birthLocation: body.birthCity,
      }),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      console.error('API Error:', errorData);
      return NextResponse.json(
        { message: errorData.error || 'Failed to calculate chart. Please try again.' },
        { status: apiResponse.status }
      );
    }

    const apiResult = await apiResponse.json();

    if (!apiResult.success) {
      return NextResponse.json(
        { message: apiResult.error || 'Failed to calculate chart' },
        { status: 400 }
      );
    }

    // Transform the API response to our frontend format
    const chart = transformChartData(apiResult.data, body);

    return NextResponse.json(chart);
  } catch (error) {
    console.error('Calculate error:', error);
    return NextResponse.json(
      { message: 'An error occurred while calculating your chart' },
      { status: 500 }
    );
  }
}

function transformChartData(apiData: any, birthData: BirthData) {
  const chartId = generateChartId();

  // Map center names from API to our format
  const centerMapping: Record<string, string> = {
    'Head': 'head',
    'Ajna': 'ajna',
    'Throat': 'throat',
    'G': 'g',
    'Heart': 'heart',
    'Ego': 'heart',
    'Spleen': 'spleen',
    'SolarPlexus': 'solar',
    'Solar Plexus': 'solar',
    'Sacral': 'sacral',
    'Root': 'root',
  };

  // Extract defined centers from the API response
  const rawDefinedCenters = apiData.definedCenters || [];
  const definedCenters = rawDefinedCenters.map((c: string) => centerMapping[c] || c.toLowerCase());
  const allCenters = ['head', 'ajna', 'throat', 'g', 'heart', 'spleen', 'solar', 'sacral', 'root'];
  const undefinedCenters = allCenters.filter(c => !definedCenters.includes(c));

  // Extract active gates from personality and design
  const personalityGates = extractGates(apiData.personality || {});
  const designGates = extractGates(apiData.design || {});

  // Use channels from API if available
  const apiChannels = apiData.channels || [];
  const activeChannels = apiChannels.map((ch: string) => {
    const [g1, g2] = ch.split('-').map(Number);
    return {
      gates: [g1, g2] as [number, number],
      name: getChannelName(g1, g2),
    };
  });

  // Get strategy based on type
  const strategyByType: Record<string, string> = {
    'Generator': 'To Respond',
    'Manifesting Generator': 'To Respond, then Inform',
    'Projector': 'Wait for the Invitation',
    'Manifestor': 'To Inform',
    'Reflector': 'Wait a Lunar Cycle',
  };

  return {
    id: chartId,
    name: birthData.name,
    birthDate: birthData.birthDate,
    birthTime: birthData.birthTime || '12:00',
    birthCity: birthData.birthCity,

    // Core attributes from API
    type: apiData.type || 'Generator',
    strategy: strategyByType[apiData.type] || 'To Respond',
    authority: apiData.authority || 'Sacral',
    profile: apiData.profile || '1/3',
    definition: determineDefinition(activeChannels),
    incarnationCross: generateIncarnationCross(apiData.personality),

    // Activations
    personality: apiData.personality || {},
    design: apiData.design || {},

    // Derived data
    definedCenters,
    undefinedCenters,
    activeChannels,
    activeGates: combineGateActivations(personalityGates, designGates),

    // Additional data from API
    variableType: apiData.variableType,
    phs: apiData.phs,
    ravePsychology: apiData.ravePsychology,
  };
}

function extractGates(activations: any): Array<{ gate: number; line: number; planet: string; color?: number; tone?: number; base?: number }> {
  const gates: Array<{ gate: number; line: number; planet: string; color?: number; tone?: number; base?: number }> = [];
  const planets = ['Sun', 'Earth', 'Rahu', 'Ketu', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

  for (const planet of planets) {
    if (activations[planet]) {
      // Map Rahu/Ketu to North/South Node for display
      const displayPlanet = planet === 'Rahu' ? 'NorthNode' : planet === 'Ketu' ? 'SouthNode' : planet;
      gates.push({
        gate: activations[planet].gate,
        line: activations[planet].line,
        planet: displayPlanet,
        color: activations[planet].color,
        tone: activations[planet].tone,
        base: activations[planet].base,
      });
    }
  }

  return gates;
}

function combineGateActivations(personality: any[], design: any[]) {
  const gateMap = new Map<number, { gate: number; line: number; planet: string; type: 'personality' | 'design' | 'both'; color?: number; tone?: number; base?: number }>();

  for (const p of personality) {
    gateMap.set(p.gate, { ...p, type: 'personality' });
  }

  for (const d of design) {
    if (gateMap.has(d.gate)) {
      const existing = gateMap.get(d.gate)!;
      gateMap.set(d.gate, { ...existing, type: 'both' });
    } else {
      gateMap.set(d.gate, { ...d, type: 'design' });
    }
  }

  return Array.from(gateMap.values());
}

function determineDefinition(channels: Array<{ gates: [number, number]; name: string }>): string {
  if (channels.length === 0) return 'None';

  // Map of which centers each channel connects (based on hdkit's CENTERS_BY_CHANNEL)
  const centersByChannel: Record<string, [string, string]> = {
    '1-8': ['g', 'throat'],
    '2-14': ['sacral', 'g'],
    '3-60': ['root', 'sacral'],
    '4-63': ['head', 'ajna'],
    '5-15': ['sacral', 'g'],
    '6-59': ['sacral', 'solar'],
    '7-31': ['g', 'throat'],
    '9-52': ['root', 'sacral'],
    '10-20': ['g', 'throat'],
    '10-34': ['g', 'sacral'],
    '10-57': ['g', 'spleen'],
    '11-56': ['ajna', 'throat'],
    '12-22': ['throat', 'solar'],
    '13-33': ['g', 'throat'],
    '16-48': ['spleen', 'throat'],
    '17-62': ['ajna', 'throat'],
    '18-58': ['root', 'spleen'],
    '19-49': ['root', 'solar'],
    '20-34': ['throat', 'sacral'],
    '20-57': ['throat', 'spleen'],
    '21-45': ['heart', 'throat'],
    '23-43': ['ajna', 'throat'],
    '24-61': ['head', 'ajna'],
    '25-51': ['heart', 'g'],
    '26-44': ['spleen', 'heart'],
    '27-50': ['sacral', 'spleen'],
    '28-38': ['spleen', 'root'],
    '29-46': ['sacral', 'g'],
    '30-41': ['root', 'solar'],
    '32-54': ['root', 'spleen'],
    '34-57': ['sacral', 'spleen'],
    '35-36': ['solar', 'throat'],
    '37-40': ['heart', 'solar'],
    '39-55': ['root', 'solar'],
    '42-53': ['root', 'sacral'],
    '47-64': ['head', 'ajna'],
  };

  // Build areas of definition using union-find algorithm (based on hdkit)
  const areasOfDefinition: string[][] = [[], [], [], []];

  channels.forEach((channel) => {
    const [gate1, gate2] = channel.gates;
    const channelKey = `${Math.min(gate1, gate2)}-${Math.max(gate1, gate2)}`;
    const centers = centersByChannel[channelKey];

    if (!centers) return; // Skip unknown channels

    // Check which areas this channel connects to
    const connectedAreas: number[] = [];
    for (let i = 0; i < 4; i++) {
      if (centers.some((c) => areasOfDefinition[i].includes(c))) {
        connectedAreas.push(i);
      }
    }

    // If no connections, add to first empty area
    if (connectedAreas.length === 0) {
      for (let i = 0; i < 4; i++) {
        if (areasOfDefinition[i].length === 0) {
          areasOfDefinition[i] = [...centers];
          break;
        }
      }
    }
    // If connects to 1 area, add centers to that area
    else if (connectedAreas.length === 1) {
      const areaIndex = connectedAreas[0];
      areasOfDefinition[areaIndex] = [...new Set([...areasOfDefinition[areaIndex], ...centers])];
    }
    // If connects to 2+ areas, merge them into the first one
    else {
      const primaryArea = connectedAreas[0];
      for (let i = 1; i < connectedAreas.length; i++) {
        const areaToMerge = connectedAreas[i];
        areasOfDefinition[primaryArea] = [
          ...new Set([...areasOfDefinition[primaryArea], ...areasOfDefinition[areaToMerge], ...centers])
        ];
        areasOfDefinition[areaToMerge] = [];
      }
      // Also add the new centers
      areasOfDefinition[primaryArea] = [...new Set([...areasOfDefinition[primaryArea], ...centers])];
    }
  });

  // Count non-empty areas
  const nonEmptyCount = areasOfDefinition.filter(area => area.length > 0).length;

  if (nonEmptyCount === 0) {
    return 'None';
  } else if (nonEmptyCount === 1) {
    return 'Single';
  } else if (nonEmptyCount === 2) {
    return 'Split';
  } else if (nonEmptyCount === 3) {
    return 'Triple Split';
  } else {
    return 'Quadruple Split';
  }
}

function generateIncarnationCross(personality: any): string {
  if (!personality?.Sun?.gate) return 'Right Angle Cross';

  const sunGate = personality.Sun.gate;
  const earthGate = personality.Earth?.gate;

  // Simplified cross names - would need full lookup table
  const crossNames: Record<number, string> = {
    1: 'The Sphinx', 2: 'The Sphinx', 7: 'The Sphinx', 13: 'The Sphinx',
    3: 'Laws', 60: 'Laws', 50: 'Laws', 56: 'Laws',
    4: 'Explanation', 49: 'Explanation', 43: 'Explanation', 23: 'Explanation',
    // Add more as needed
  };

  return `Right Angle Cross of ${crossNames[sunGate] || 'the Vessel of Love'}`;
}

function getChannelName(gate1: number, gate2: number): string {
  const channelNames: Record<string, string> = {
    '64-47': 'Abstraction', '47-64': 'Abstraction',
    '61-24': 'Awareness', '24-61': 'Awareness',
    '63-4': 'Logic', '4-63': 'Logic',
    '17-62': 'Acceptance', '62-17': 'Acceptance',
    '43-23': 'Structuring', '23-43': 'Structuring',
    '11-56': 'Curiosity', '56-11': 'Curiosity',
    '7-31': 'The Alpha', '31-7': 'The Alpha',
    '1-8': 'Inspiration', '8-1': 'Inspiration',
    '13-33': 'The Prodigal', '33-13': 'The Prodigal',
    '10-20': 'Awakening', '20-10': 'Awakening',
    '25-51': 'Initiation', '51-25': 'Initiation',
    '21-45': 'Money', '45-21': 'Money',
    '26-44': 'Surrender', '44-26': 'Surrender',
    '40-37': 'Community', '37-40': 'Community',
    '46-29': 'Discovery', '29-46': 'Discovery',
    '2-14': 'The Beat', '14-2': 'The Beat',
    '15-5': 'Rhythm', '5-15': 'Rhythm',
    '16-48': 'The Wavelength', '48-16': 'The Wavelength',
    '20-57': 'The Brainwave', '57-20': 'The Brainwave',
    '12-22': 'Openness', '22-12': 'Openness',
    '35-36': 'Transitoriness', '36-35': 'Transitoriness',
    '50-27': 'Preservation', '27-50': 'Preservation',
    '57-34': 'Power', '34-57': 'Power',
    '18-58': 'Judgment', '58-18': 'Judgment',
    '28-38': 'Struggle', '38-28': 'Struggle',
    '32-54': 'Transformation', '54-32': 'Transformation',
    '6-59': 'Intimacy', '59-6': 'Intimacy',
    '30-41': 'Recognition', '41-30': 'Recognition',
    '49-19': 'Synthesis', '19-49': 'Synthesis',
    '55-39': 'Emoting', '39-55': 'Emoting',
    '3-60': 'Mutation', '60-3': 'Mutation',
    '9-52': 'Concentration', '52-9': 'Concentration',
    '42-53': 'Maturation', '53-42': 'Maturation',
    '34-20': 'Charisma', '20-34': 'Charisma',
  };

  return channelNames[`${gate1}-${gate2}`] || 'Unknown';
}
