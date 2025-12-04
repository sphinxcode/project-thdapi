export interface PlanetPosition {
  planet: string;
  gate: number;
  line: number;
  color: number;
  tone: number;
  base: number;
}

export interface ChartActivations {
  sun: PlanetPosition;
  earth: PlanetPosition;
  northNode: PlanetPosition;
  southNode: PlanetPosition;
  moon: PlanetPosition;
  mercury: PlanetPosition;
  venus: PlanetPosition;
  mars: PlanetPosition;
  jupiter: PlanetPosition;
  saturn: PlanetPosition;
  uranus: PlanetPosition;
  neptune: PlanetPosition;
  pluto: PlanetPosition;
}

export interface HumanDesignChart {
  id: string;
  name: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;

  // Core attributes
  type: 'Generator' | 'Manifesting Generator' | 'Projector' | 'Manifestor' | 'Reflector';
  strategy: string;
  authority: string;
  profile: string;
  definition: 'Single' | 'Split' | 'Triple Split' | 'Quad Split' | 'None';
  incarnationCross: string;

  // Activations
  personality: ChartActivations;
  design: ChartActivations;

  // Derived data
  definedCenters: string[];
  undefinedCenters: string[];
  activeChannels: Channel[];
  activeGates: GateActivation[];
}

export interface Center {
  id: string;
  name: string;
  defined: boolean;
  gates: number[];
  theme: string;
  notSelfTheme: string;
}

export interface Channel {
  id: string;
  gates: [number, number];
  centers: [string, string];
  name: string;
  type: 'Individual' | 'Collective' | 'Tribal';
  circuit: string;
  description: string;
}

export interface GateActivation {
  gate: number;
  line: number;
  planet: string;
  type: 'personality' | 'design' | 'both';
  name: string;
  iChingName: string;
  description: string;
  color?: number;
  tone?: number;
  base?: number;
}

export interface BirthData {
  name: string;
  email: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

// Type strategies and themes
export const TYPE_INFO: Record<string, { strategy: string; notSelfTheme: string; signature: string; aura: string }> = {
  'Generator': {
    strategy: 'To Respond',
    notSelfTheme: 'Frustration',
    signature: 'Satisfaction',
    aura: 'Open and enveloping'
  },
  'Manifesting Generator': {
    strategy: 'To Respond, then Inform',
    notSelfTheme: 'Frustration and Anger',
    signature: 'Satisfaction',
    aura: 'Open and enveloping'
  },
  'Projector': {
    strategy: 'Wait for the Invitation',
    notSelfTheme: 'Bitterness',
    signature: 'Success',
    aura: 'Focused and absorbing'
  },
  'Manifestor': {
    strategy: 'To Inform',
    notSelfTheme: 'Anger',
    signature: 'Peace',
    aura: 'Closed and repelling'
  },
  'Reflector': {
    strategy: 'Wait a Lunar Cycle',
    notSelfTheme: 'Disappointment',
    signature: 'Surprise',
    aura: 'Resistant and sampling'
  }
};

// Center names and positions
export const CENTERS = [
  { id: 'head', name: 'Head', position: { x: 200, y: 30 } },
  { id: 'ajna', name: 'Ajna', position: { x: 200, y: 90 } },
  { id: 'throat', name: 'Throat', position: { x: 200, y: 165 } },
  { id: 'g', name: 'G Center', position: { x: 200, y: 260 } },
  { id: 'heart', name: 'Heart', position: { x: 135, y: 235 } },
  { id: 'spleen', name: 'Spleen', position: { x: 100, y: 340 } },
  { id: 'solar', name: 'Solar Plexus', position: { x: 300, y: 340 } },
  { id: 'sacral', name: 'Sacral', position: { x: 200, y: 380 } },
  { id: 'root', name: 'Root', position: { x: 200, y: 480 } }
];

// Gates by center
export const GATES_BY_CENTER: Record<string, number[]> = {
  head: [64, 61, 63],
  ajna: [47, 24, 4, 17, 43, 11],
  throat: [62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16],
  g: [7, 1, 13, 25, 46, 2, 15, 10],
  heart: [21, 40, 26, 51],
  spleen: [48, 57, 44, 50, 32, 28, 18],
  solar: [36, 22, 37, 6, 49, 55, 30],
  sacral: [5, 14, 29, 59, 9, 3, 42, 27, 34],
  root: [53, 60, 52, 19, 39, 41, 58, 38, 54]
};
