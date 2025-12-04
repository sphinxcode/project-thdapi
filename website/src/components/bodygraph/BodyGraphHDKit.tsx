'use client';

import { useEffect, useRef, useState } from 'react';

interface GateActivation {
  g: number; // gate number
  l: number; // line number
  planet: string;
  personalityOrDesign?: 'personality' | 'design';
}

interface BodyGraphHDKitProps {
  personalityActivations: Record<string, { g: number; l: number; planet: string }>;
  designActivations: Record<string, { g: number; l: number; planet: string }>;
  activationsToShow?: 'all' | 'personality' | 'design';
  className?: string;
}

export default function BodyGraphHDKit({
  personalityActivations,
  designActivations,
  activationsToShow = 'all',
  className = ''
}: BodyGraphHDKitProps) {
  const objectRef = useRef<HTMLObjectElement>(null);
  const [hoveredGate, setHoveredGate] = useState<number | null>(null);

  useEffect(() => {
    const handleLoad = () => {
      const objectEl = objectRef.current;
      if (!objectEl) return;

      const svgDoc = objectEl.contentDocument;
      if (!svgDoc) return;

      const SVG_NS = 'http://www.w3.org/2000/svg';

      // Prepare activations data
      const allActivations: GateActivation[] = [];
      Object.values(personalityActivations).forEach((act: any) => {
        allActivations.push({ ...act, personalityOrDesign: 'personality' });
      });
      Object.values(designActivations).forEach((act: any) => {
        allActivations.push({ ...act, personalityOrDesign: 'design' });
      });

      const personalityGates: Record<number, boolean> = {};
      Object.values(personalityActivations).forEach((act: any) => {
        personalityGates[act.g] = true;
      });

      const designGates: Record<number, boolean> = {};
      Object.values(designActivations).forEach((act: any) => {
        designGates[act.g] = true;
      });

      const activatedGates: Record<number, boolean> = { ...personalityGates, ...designGates };

      // Create defs if it doesn't exist
      let defs = svgDoc.querySelector('defs');
      if (!defs) {
        defs = svgDoc.createElementNS(SVG_NS, 'defs');
        svgDoc.documentElement.appendChild(defs);
      }

      // Create gradients for centers
      const centers = ['Head', 'Ajna', 'Throat', 'Spleen', 'Ego', 'G', 'SolarPlexus', 'Sacral', 'Root'];
      const colors = ['#F9F6C4', '#48BB78', '#655144', '#655144', '#F56565', '#F9F6C4', '#655144', '#F56565', '#655144'];

      centers.forEach((center, index) => {
        const gradient = svgDoc.createElementNS(SVG_NS, 'linearGradient');
        gradient.setAttribute('id', `${center.toLowerCase()}Gradient`);
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '0%');
        gradient.setAttribute('y2', '140%');

        const darkenColor = (color: string, factor: number) => {
          const hex = color.replace(/^#/, '');
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);

          const newR = Math.round(r * (1 - factor));
          const newG = Math.round(g * (1 - factor));
          const newB = Math.round(b * (1 - factor));

          return `#${(newR < 16 ? '0' : '') + newR.toString(16)}${(newG < 16 ? '0' : '') + newG.toString(16)}${(newB < 16 ? '0' : '') + newB.toString(16)}`;
        };

        const stop1 = svgDoc.createElementNS(SVG_NS, 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', colors[index]);
        gradient.appendChild(stop1);

        const slightlyDarkerColor = darkenColor(colors[index], 0.4);
        const stop2 = svgDoc.createElementNS(SVG_NS, 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', slightlyDarkerColor);
        gradient.appendChild(stop2);

        defs.appendChild(gradient);
      });

      // Create gradients for split gates
      const createGradient = (id: string, x1: string, y1: string, x2: string, y2: string) => {
        const gradient = svgDoc.createElementNS(SVG_NS, 'linearGradient');
        gradient.setAttribute('id', id);
        gradient.setAttribute('x1', x1);
        gradient.setAttribute('y1', y1);
        gradient.setAttribute('x2', x2);
        gradient.setAttribute('y2', y2);

        const stop1 = svgDoc.createElementNS(SVG_NS, 'stop');
        stop1.setAttribute('offset', '50%');
        stop1.setAttribute('style', 'stop-color: #A44344; stop-opacity: 1');

        const stop2 = svgDoc.createElementNS(SVG_NS, 'stop');
        stop2.setAttribute('offset', '50%');
        stop2.setAttribute('style', 'stop-color: black; stop-opacity: 1');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
      };

      // Create channel gradients
      createGradient('gradientForVerticalChannels', '0%', '0%', '100%', '0%');
      createGradient('gradientForHorizontalChannels', '0%', '0%', '0%', '100%');
      createGradient('gradientForDiagonalChannels', '0%', '0%', '100%', '100%');
      createGradient('gradientForSpleenRootChannels', '100%', '0%', '4%', '100%');
      createGradient('gradientForSolarPlexusRootChannels', '4%', '0%', '100%', '100%');
      createGradient('gradientFor59_6', '9%', '25%', '50%', '100%');
      createGradient('gradientFor50_27', '50%', '0%', '9%', '75%');
      createGradient('gradientFor25_51', '100%', '0%', '4%', '100%');
      createGradient('gradientForGate34', '100%', '0%', '4%', '100%');
      createGradient('gradientForGate10Connect', '100%', '90%', '0%', '0%');

      // Filter activations based on what to show
      let activations: GateActivation[];
      let activatedGatesToShow: Record<number, boolean>;

      if (activationsToShow === 'personality') {
        activations = allActivations.filter(a => a.personalityOrDesign === 'personality');
        activatedGatesToShow = personalityGates;
      } else if (activationsToShow === 'design') {
        activations = allActivations.filter(a => a.personalityOrDesign === 'design');
        activatedGatesToShow = designGates;
      } else {
        activations = allActivations;
        activatedGatesToShow = activatedGates;
      }

      // Color the gates
      activations.forEach((activation) => {
        const gate = activation.g;
        const hangingGate = svgDoc.getElementById(`Gate${gate}`);
        const gateText = svgDoc.getElementById(`GateText${gate}`);
        const gateBackground = svgDoc.getElementById(`GateTextBg${gate}`);

        if (hangingGate && gateText && gateBackground) {
          let color = '';

          if (activationsToShow === 'all' && personalityGates[gate] && designGates[gate]) {
            // Both personality and design - use gradient based on gate position
            if (gate === 10) {
              color = 'url(#gradientForHorizontalChannels)';
            } else if ([50, 27].includes(gate)) {
              color = 'url(#gradientFor50_27)';
            } else if ([6, 59].includes(gate)) {
              color = 'url(#gradientFor59_6)';
            } else if ([16, 48, 57, 20].includes(gate)) {
              color = 'url(#gradientForGate10Connect)';
            } else if ([32, 54, 28, 38, 58, 18].includes(gate)) {
              color = 'url(#gradientForSpleenRootChannels)';
            } else if ([34].includes(gate)) {
              color = 'url(#gradientForGate34)';
            } else if ([25, 51].includes(gate)) {
              color = 'url(#gradientFor25_51)';
            } else if ([44, 26, 45, 21, 12, 22, 35, 36, 37, 40].includes(gate)) {
              color = 'url(#gradientForDiagonalChannels)';
            } else if ([19, 49, 39, 55, 41, 30].includes(gate)) {
              color = 'url(#gradientForSolarPlexusRootChannels)';
            } else {
              color = 'url(#gradientForVerticalChannels)';
            }
          } else if (personalityGates[gate] && (activationsToShow === 'all' || activationsToShow === 'personality')) {
            color = 'black';
          } else {
            color = '#A44344'; // Design color (red/gold)
          }

          hangingGate.style.fill = color;
          gateText.style.fill = '#343434';

          const gateBackgroundPath = gateBackground.querySelector('path');
          const gateBackgroundCircle = gateBackground.querySelector('circle');
          if (gateBackgroundPath) gateBackgroundPath.style.fill = '#EFEFEF';
          if (gateBackgroundCircle) gateBackgroundCircle.style.fill = '#EFEFEF';
        }
      });

      // Color the centers based on channel connections
      const headCenter = svgDoc.getElementById('Head');
      const ajnaCenter = svgDoc.getElementById('Ajna');
      const throatCenter = svgDoc.getElementById('Throat');
      const egoCenter = svgDoc.getElementById('Ego');
      const gCenter = svgDoc.getElementById('G');
      const solarPlexusCenter = svgDoc.getElementById('SolarPlexus');
      const spleenCenter = svgDoc.getElementById('Spleen');
      const sacralCenter = svgDoc.getElementById('Sacral');
      const rootCenter = svgDoc.getElementById('Root');

      // Sacral-Root channels
      if (
        (activatedGatesToShow[3] && activatedGatesToShow[60]) ||
        (activatedGatesToShow[42] && activatedGatesToShow[53]) ||
        (activatedGatesToShow[9] && activatedGatesToShow[52])
      ) {
        sacralCenter?.querySelector('path')?.setAttribute('fill', 'url(#sacralGradient)');
        rootCenter?.querySelector('path')?.setAttribute('fill', 'url(#rootGradient)');
      }

      // Root-Solar Plexus channels
      if (
        (activatedGatesToShow[19] && activatedGatesToShow[49]) ||
        (activatedGatesToShow[39] && activatedGatesToShow[55]) ||
        (activatedGatesToShow[41] && activatedGatesToShow[30])
      ) {
        rootCenter?.querySelector('path')?.setAttribute('fill', 'url(#rootGradient)');
        solarPlexusCenter?.querySelector('path')?.setAttribute('fill', 'url(#solarplexusGradient)');
      }

      // Spleen-Root channels
      if (
        (activatedGatesToShow[54] && activatedGatesToShow[32]) ||
        (activatedGatesToShow[28] && activatedGatesToShow[38]) ||
        (activatedGatesToShow[18] && activatedGatesToShow[58])
      ) {
        spleenCenter?.querySelector('path')?.setAttribute('fill', 'url(#spleenGradient)');
        rootCenter?.querySelector('path')?.setAttribute('fill', 'url(#rootGradient)');
      }

      // Spleen-Throat channels
      if (
        (activatedGatesToShow[48] && activatedGatesToShow[16]) ||
        (activatedGatesToShow[57] && activatedGatesToShow[20])
      ) {
        spleenCenter?.querySelector('path')?.setAttribute('fill', 'url(#spleenGradient)');
        throatCenter?.querySelector('path')?.setAttribute('fill', 'url(#throatGradient)');
      }

      // Spleen-G channels
      if (activatedGatesToShow[57] && activatedGatesToShow[10]) {
        spleenCenter?.querySelector('path')?.setAttribute('fill', 'url(#spleenGradient)');
        gCenter?.querySelector('path')?.setAttribute('fill', 'url(#gGradient)');
      }

      // Sacral-Throat channels
      if (activatedGatesToShow[34] && activatedGatesToShow[20]) {
        sacralCenter?.querySelector('path')?.setAttribute('fill', 'url(#sacralGradient)');
        throatCenter?.querySelector('path')?.setAttribute('fill', 'url(#throatGradient)');
      }

      // Sacral-Spleen channels
      if (
        (activatedGatesToShow[57] && activatedGatesToShow[34]) ||
        (activatedGatesToShow[50] && activatedGatesToShow[27])
      ) {
        sacralCenter?.querySelector('path')?.setAttribute('fill', 'url(#sacralGradient)');
        spleenCenter?.querySelector('path')?.setAttribute('fill', 'url(#spleenGradient)');
      }

      // Solar Plexus-Ego channels
      if (activatedGatesToShow[37] && activatedGatesToShow[40]) {
        solarPlexusCenter?.querySelector('path')?.setAttribute('fill', 'url(#solarplexusGradient)');
        egoCenter?.querySelector('path')?.setAttribute('fill', 'url(#egoGradient)');
      }

      // Solar Plexus-Throat channels
      if (
        (activatedGatesToShow[22] && activatedGatesToShow[12]) ||
        (activatedGatesToShow[35] && activatedGatesToShow[36])
      ) {
        solarPlexusCenter?.querySelector('path')?.setAttribute('fill', 'url(#solarplexusGradient)');
        throatCenter?.querySelector('path')?.setAttribute('fill', 'url(#throatGradient)');
      }

      // Ego-G channels
      if (activatedGatesToShow[51] && activatedGatesToShow[25]) {
        egoCenter?.querySelector('path')?.setAttribute('fill', 'url(#egoGradient)');
        gCenter?.querySelector('path')?.setAttribute('fill', 'url(#gGradient)');
      }

      // Ego-Throat channels
      if (activatedGatesToShow[21] && activatedGatesToShow[45]) {
        egoCenter?.querySelector('path')?.setAttribute('fill', 'url(#egoGradient)');
        throatCenter?.querySelector('path')?.setAttribute('fill', 'url(#throatGradient)');
      }

      // Ego-Spleen channels
      if (activatedGatesToShow[44] && activatedGatesToShow[26]) {
        egoCenter?.querySelector('path')?.setAttribute('fill', 'url(#egoGradient)');
        spleenCenter?.querySelector('path')?.setAttribute('fill', 'url(#spleenGradient)');
      }

      // Sacral-Solar Plexus channels
      if (activatedGatesToShow[59] && activatedGatesToShow[6]) {
        sacralCenter?.querySelector('path')?.setAttribute('fill', 'url(#sacralGradient)');
        solarPlexusCenter?.querySelector('path')?.setAttribute('fill', 'url(#solarplexusGradient)');
      }

      // Sacral-G channels
      if (
        (activatedGatesToShow[34] && activatedGatesToShow[10]) ||
        (activatedGatesToShow[29] && activatedGatesToShow[46]) ||
        (activatedGatesToShow[14] && activatedGatesToShow[2]) ||
        (activatedGatesToShow[5] && activatedGatesToShow[15])
      ) {
        sacralCenter?.querySelector('path')?.setAttribute('fill', 'url(#sacralGradient)');
        gCenter?.querySelector('path')?.setAttribute('fill', 'url(#gGradient)');
      }

      // G-Throat channels
      if (
        (activatedGatesToShow[7] && activatedGatesToShow[31]) ||
        (activatedGatesToShow[1] && activatedGatesToShow[8]) ||
        (activatedGatesToShow[13] && activatedGatesToShow[33])
      ) {
        gCenter?.querySelector('path')?.setAttribute('fill', 'url(#gGradient)');
        throatCenter?.querySelector('path')?.setAttribute('fill', 'url(#throatGradient)');
      }

      // Throat-Ajna channels
      if (
        (activatedGatesToShow[17] && activatedGatesToShow[62]) ||
        (activatedGatesToShow[43] && activatedGatesToShow[23]) ||
        (activatedGatesToShow[56] && activatedGatesToShow[11])
      ) {
        throatCenter?.querySelector('path')?.setAttribute('fill', 'url(#throatGradient)');
        ajnaCenter?.querySelector('path')?.setAttribute('fill', 'url(#ajnaGradient)');
      }

      // Ajna-Head channels
      if (
        (activatedGatesToShow[47] && activatedGatesToShow[64]) ||
        (activatedGatesToShow[24] && activatedGatesToShow[61]) ||
        (activatedGatesToShow[4] && activatedGatesToShow[63])
      ) {
        ajnaCenter?.querySelector('path')?.setAttribute('fill', 'url(#ajnaGradient)');
        headCenter?.querySelector('path')?.setAttribute('fill', 'url(#headGradient)');
      }

      // Handle special gate span connections (integration circuit)
      if (
        activationsToShow !== 'design' &&
        ((personalityGates[34] && personalityGates[20]) ||
          (personalityGates[34] && personalityGates[10]) ||
          (personalityGates[57] && personalityGates[20]))
      ) {
        svgDoc.getElementById('GateSpan')!.style.fill = 'black';
        svgDoc.getElementById('GateConnect10')!.style.fill = 'black';
        svgDoc.getElementById('GateConnect34')!.style.fill = 'black';
      }

      if (
        activationsToShow !== 'personality' &&
        ((designGates[34] && designGates[20]) ||
          (designGates[34] && designGates[10]) ||
          (designGates[57] && designGates[20]))
      ) {
        svgDoc.getElementById('GateSpan')!.style.fill = '#A44344';
        svgDoc.getElementById('GateConnect10')!.style.fill = '#A44344';
        svgDoc.getElementById('GateConnect34')!.style.fill = '#A44344';
      }
    };

    const objectEl = objectRef.current;
    if (objectEl) {
      objectEl.addEventListener('load', handleLoad);
      // If already loaded, call handler
      if (objectEl.contentDocument) {
        handleLoad();
      }
    }

    return () => {
      objectEl?.removeEventListener('load', handleLoad);
    };
  }, [personalityActivations, designActivations, activationsToShow]);

  return (
    <div className={`relative ${className}`}>
      <object
        ref={objectRef}
        type="image/svg+xml"
        data="/bodygraph-blank.svg"
        className="w-full h-auto"
        style={{ maxWidth: '600px', margin: '0 auto' }}
      >
        Your browser does not support SVG
      </object>
    </div>
  );
}
