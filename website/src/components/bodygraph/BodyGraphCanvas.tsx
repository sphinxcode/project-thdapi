'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  GATE_NAMES,
  GATE_KEYWORDS,
  CHANNELS,
  PLANET_GLYPHS,
  GATE_CONNECTIONS
} from '@/lib/bodygraph/data';
import {
  getScaledGatePositions,
  scaleRadius,
  CANVA_VIEWBOX
} from '@/lib/bodygraph/coordinates';

interface GateActivation {
  gate: number;
  line: number;
  planet: string;
  type: 'personality' | 'design' | 'both';
}

interface BodygraphCanvasProps {
  definedCenters: string[];
  activeGates: GateActivation[];
  activeChannels: Array<{ gates: [number, number]; name: string }>;
  onGateClick?: (gate: number) => void;
  onGateHover?: (gate: number | null) => void;
}

export default function BodygraphCanvas({
  definedCenters,
  activeGates,
  activeChannels,
  onGateClick,
  onGateHover
}: BodygraphCanvasProps) {
  const [hoveredGate, setHoveredGate] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const gateRadius = 24; // Base radius for gates
  const scaledRadius = scaleRadius(gateRadius);

  const activeGateNumbers = new Set(activeGates.map(g => g.gate));

  // Get scaled gate positions
  const gatePositions = useMemo(() => getScaledGatePositions(gateRadius), [gateRadius]);

  const handleGateHover = (gate: number | null, event?: React.MouseEvent) => {
    setHoveredGate(gate);
    if (event && gate) {
      const rect = (event.target as SVGElement).getBoundingClientRect();
      setTooltipPosition({ x: rect.x + rect.width / 2, y: rect.y - 10 });
    }
    onGateHover?.(gate);
  };

  const getGateActivation = (gate: number): GateActivation | undefined => {
    return activeGates.find(g => g.gate === gate);
  };

  const isChannelActive = (gate1: number, gate2: number): boolean => {
    return activeChannels.some(
      c => (c.gates[0] === gate1 && c.gates[1] === gate2) ||
           (c.gates[0] === gate2 && c.gates[1] === gate1)
    );
  };

  // Generate channel path between two gates
  const getChannelPath = (gate1: number, gate2: number): string => {
    const pos1 = gatePositions[gate1];
    const pos2 = gatePositions[gate2];
    if (!pos1 || !pos2) return '';
    return `M${pos1.x},${pos1.y} L${pos2.x},${pos2.y}`;
  };

  // Update center fills based on definition
  const getCenterFill = (centerId: string): string => {
    const isDefined = definedCenters.includes(centerId);
    if (!isDefined) return '#fff8f5';

    // Color mapping for defined centers
    const centerColors: Record<string, string> = {
      'head': '#FCD34D',
      'ajna': '#D8C4A0',
      'throat': '#8F4A56',
      'g': '#FCD34D',
      'heart': '#FFD57D',
      'spleen': '#6D5000',
      'solar': '#6D5000',
      'sacral': '#8F4A56',
      'root': '#DC2626'
    };

    return centerColors[centerId] || '#FCD34D';
  };

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${CANVA_VIEWBOX.width} ${CANVA_VIEWBOX.height}`}
        className="w-full max-w-2xl mx-auto"
        style={{ filter: 'drop-shadow(0 4px 20px rgba(139, 69, 87, 0.1))' }}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="channelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A227" />
            <stop offset="100%" stopColor="#D4A574" />
          </linearGradient>
          <linearGradient id="gateSplitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1A1A1A" />
            <stop offset="50%" stopColor="#1A1A1A" />
            <stop offset="50%" stopColor="#C9A227" />
            <stop offset="100%" stopColor="#C9A227" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Shadow filter */}
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#8B4557" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Base Canva SVG - Centers with dynamic colors */}
        <g className="centers-base">
          <path id="center-head" fill={getCenterFill('head')} opacity="0.8" d="M 614.601562 82.632812 L 679.019531 194.210938 C 689.625 212.570312 676.375 235.53125 655.167969 235.53125 L 526.328125 235.53125 C 505.117188 235.53125 491.871094 212.570312 502.476562 194.210938 L 566.894531 82.632812 C 577.5 64.273438 603.996094 64.273438 614.601562 82.632812 Z" stroke="#8B4557" strokeWidth="3"/>

          <path id="center-ajna" fill={getCenterFill('ajna')} opacity="0.8" d="M 566.894531 449.519531 L 501.925781 336.980469 C 491.320312 318.621094 504.570312 295.660156 525.777344 295.660156 L 655.714844 295.660156 C 676.925781 295.660156 690.171875 318.621094 679.566406 336.980469 L 614.601562 449.519531 C 603.996094 467.878906 577.5 467.878906 566.894531 449.519531 Z" stroke="#8B4557" strokeWidth="3"/>

          <path id="center-throat" fill={getCenterFill('throat')} opacity="0.8" d="M 664.261719 728.851562 L 517.234375 728.851562 C 502.820312 728.851562 491.117188 717.148438 491.117188 702.734375 L 491.117188 555.707031 C 491.117188 541.289062 502.820312 529.585938 517.234375 529.585938 L 664.261719 529.585938 C 678.675781 529.585938 690.378906 541.289062 690.378906 555.707031 L 690.378906 702.734375 C 690.378906 717.148438 678.675781 728.851562 664.261719 728.851562 Z" stroke="#8B4557" strokeWidth="3"/>

          <path id="center-g" fill={getCenterFill('g')} opacity="0.8" d="M 468.257812 881.300781 L 572.316406 777.242188 C 582.476562 767.082031 598.984375 767.082031 609.175781 777.242188 L 713.238281 881.300781 C 723.394531 891.460938 723.394531 907.96875 713.238281 918.160156 L 609.175781 1022.21875 C 599.019531 1032.378906 582.511719 1032.378906 572.316406 1022.21875 L 468.257812 918.160156 C 458.066406 907.96875 458.066406 891.496094 468.257812 881.300781 Z" stroke="#8B4557" strokeWidth="3"/>

          <path id="center-sacral" fill={getCenterFill('sacral')} opacity="0.8" d="M 664.46875 1350.460938 L 517.027344 1350.460938 C 502.714844 1350.460938 491.117188 1338.859375 491.117188 1324.546875 L 491.117188 1177.109375 C 491.117188 1162.796875 502.714844 1151.195312 517.027344 1151.195312 L 664.46875 1151.195312 C 678.777344 1151.195312 690.378906 1162.796875 690.378906 1177.109375 L 690.378906 1324.546875 C 690.378906 1338.859375 678.777344 1350.460938 664.46875 1350.460938 Z" stroke="#8B4557" strokeWidth="3"/>

          <path id="center-root" fill={getCenterFill('root')} opacity="0.8" d="M 664.46875 1619.015625 L 517.027344 1619.015625 C 502.714844 1619.015625 491.117188 1607.414062 491.117188 1593.105469 L 491.117188 1445.664062 C 491.117188 1431.351562 502.714844 1419.753906 517.027344 1419.753906 L 664.46875 1419.753906 C 678.777344 1419.753906 690.378906 1431.351562 690.378906 1445.664062 L 690.378906 1593.105469 C 690.378906 1607.382812 678.777344 1619.015625 664.46875 1619.015625 Z" stroke="#8B4557" strokeWidth="3"/>

          <path id="center-spleen" fill={getCenterFill('spleen')} opacity="0.8" d="M 283.03125 1274.714844 L 171.457031 1339.132812 C 153.0625 1349.738281 130.066406 1336.492188 130.066406 1315.246094 L 130.066406 1186.410156 C 130.066406 1165.164062 153.0625 1151.882812 171.457031 1162.523438 L 283.03125 1226.941406 C 301.425781 1237.546875 301.425781 1264.109375 283.03125 1274.714844 Z" stroke="#8B4557" strokeWidth="3"/>

          <path id="center-solar" fill={getCenterFill('solar')} opacity="0.8" d="M 909.445312 1227.007812 L 1022.117188 1161.972656 C 1040.480469 1151.367188 1063.40625 1164.613281 1063.40625 1185.789062 L 1063.40625 1315.898438 C 1063.40625 1337.074219 1040.480469 1350.320312 1022.117188 1339.71875 L 909.445312 1274.679688 C 891.085938 1264.074219 891.085938 1237.582031 909.445312 1227.007812 Z" stroke="#8B4557" strokeWidth="3"/>

          <path id="center-heart" fill={getCenterFill('heart')} opacity="0.8" d="M 736.058594 1039.242188 L 810.261719 967.375 C 821.722656 956.292969 840.804688 960.753906 846.160156 975.785156 L 874.851562 1056.574219 C 880.203125 1071.605469 868.191406 1087.121094 852.300781 1085.746094 L 749.410156 1076.789062 C 730.671875 1075.210938 722.539062 1052.320312 736.058594 1039.242188 Z" stroke="#8B4557" strokeWidth="3"/>
        </g>

        {/* Channels - Draw behind gates */}
        <g className="channels">
          {CHANNELS.map(({ gates }) => {
            const active = isChannelActive(gates[0], gates[1]);
            const hasOneGate = activeGateNumbers.has(gates[0]) !== activeGateNumbers.has(gates[1]);
            const path = getChannelPath(gates[0], gates[1]);

            if (!path) return null;

            return (
              <motion.path
                key={`${gates[0]}-${gates[1]}`}
                d={path}
                fill="none"
                stroke={active ? 'url(#channelGradient)' : '#8B7D7D'}
                strokeWidth={active ? 12 : 6}
                strokeLinecap="round"
                strokeDasharray={hasOneGate && !active ? '18 12' : 'none'}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                filter={active ? 'url(#glow)' : undefined}
                opacity={active ? 1 : 0.6}
              />
            );
          })}
        </g>

        {/* Gates */}
        <g className="gates">
          {Object.entries(gatePositions).map(([gateStr, pos]) => {
            const gate = parseInt(gateStr);
            const activation = getGateActivation(gate);
            const isActive = !!activation;

            return (
              <motion.g
                key={gate}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + gate * 0.005 }}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isActive ? scaledRadius : scaledRadius * 0.7}
                  fill={
                    activation?.type === 'both'
                      ? 'url(#gateSplitGradient)'
                      : activation?.type === 'personality'
                        ? '#1A1A1A'
                        : activation?.type === 'design'
                          ? '#C9A227'
                          : '#D4C4B4'
                  }
                  stroke={isActive ? '#FFF8F5' : '#6B5D5D'}
                  strokeWidth={isActive ? 4 : 2}
                  className="cursor-pointer transition-transform hover:scale-110"
                  onMouseEnter={(e) => handleGateHover(gate, e)}
                  onMouseLeave={() => handleGateHover(null)}
                  onClick={() => onGateClick?.(gate)}
                  filter={isActive ? 'url(#shadow)' : undefined}
                  opacity={isActive ? 1 : 0.8}
                />
                {/* Gate number label */}
                <text
                  x={pos.x}
                  y={pos.y + scaledRadius * 0.25}
                  textAnchor="middle"
                  fontSize={scaledRadius * 0.75}
                  fill={isActive ? '#FFF' : '#4A3A3A'}
                  fontWeight="700"
                  pointerEvents="none"
                >
                  {gate}
                </text>
              </motion.g>
            );
          })}
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredGate && (
        <motion.div
          className="fixed z-50 bg-white border border-[#D4A574] rounded-xl px-4 py-3 shadow-lg pointer-events-none max-w-xs"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="text-sm">
            <div className="font-semibold text-[#8B4557]">
              Gate {hoveredGate}: {GATE_NAMES[hoveredGate]}
            </div>
            <div className="text-[#6B4423] mt-1">
              {GATE_KEYWORDS[hoveredGate]}
            </div>
            {getGateActivation(hoveredGate) && (
              <div className="text-xs text-[#C9A227] mt-1">
                {PLANET_GLYPHS[getGateActivation(hoveredGate)!.planet]} {getGateActivation(hoveredGate)!.planet} - Line {getGateActivation(hoveredGate)!.line}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              Connects to: {GATE_CONNECTIONS[hoveredGate]?.join(', ') || 'None'}
            </div>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6 text-sm text-[#6B4423]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#1A1A1A]" />
          <span>Personality (Conscious)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#C9A227]" />
          <span>Design (Unconscious)</span>
        </div>
      </div>
    </div>
  );
}
