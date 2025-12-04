'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, Share2, Copy, Check, X, Zap, Compass, Heart, User, Calendar, MapPin, Clock } from 'lucide-react';
import { useChartStore } from '@/stores/chartStore';
import { HumanDesignChart, TYPE_INFO, ChartActivations } from '@/types/humandesign';
import BodyGraphHDKit from '@/components/bodygraph/BodyGraphHDKit';
import { GATE_NAMES, GATE_KEYWORDS, CENTER_CONFIG, PLANET_GLYPHS } from '@/lib/bodygraph/data';

// Transform ChartActivations to hdkit format
function transformActivations(activations: ChartActivations) {
  const result: Record<string, { g: number; l: number; planet: string }> = {};
  Object.entries(activations).forEach(([planet, position]) => {
    result[planet] = {
      g: position.gate,
      l: position.line,
      planet: planet
    };
  });
  return result;
}

export default function ChartPage() {
  const params = useParams();
  const chartId = params.id as string;
  const { currentChart, getChart, savedCharts } = useChartStore();

  const [chart, setChart] = useState<HumanDesignChart | null>(null);
  const [selectedGate, setSelectedGate] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Try to get chart from current or saved
    const foundChart = currentChart?.id === chartId ? currentChart : getChart(chartId);
    if (foundChart) {
      setChart(foundChart);
    }
  }, [chartId, currentChart, getChart, savedCharts]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGateClick = (gate: number) => {
    setSelectedGate(gate);
  };

  if (!chart) {
    return (
      <main className="min-h-screen bg-[#FFF8F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6B4423]">Loading your chart...</p>
        </div>
      </main>
    );
  }

  const typeInfo = TYPE_INFO[chart.type] || TYPE_INFO['Generator'];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF8F5] to-[#F5EDE4]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#E8DDD4] py-4 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#8B4557] hover:text-[#C9A227] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium hidden sm:inline">Back Home</span>
          </Link>

          <p className="font-accent text-xl text-[#C9A227]">Project Ajna</p>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 text-[#8B4557] hover:text-[#C9A227] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-green-600" />
                <span className="hidden sm:inline text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Chart Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="font-accent text-2xl text-[#C9A227] mb-2">Your Human Design Chart</p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#8B4557] mb-4">
            {chart.name}
          </h1>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-[#6B4423]">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(chart.birthDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {chart.birthTime}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {chart.birthCity}
            </span>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Bodygraph Column */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <BodyGraphHDKit
              personalityActivations={transformActivations(chart.personality)}
              designActivations={transformActivations(chart.design)}
              activationsToShow="all"
              className="mx-auto"
            />
          </motion.div>

          {/* Summary Column */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Type Card */}
            <div className="card bg-gradient-to-br from-white to-[#FFF8F5]">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C9A227] to-[#D4A574] flex items-center justify-center">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#C9A227] font-medium">Energy Type</p>
                  <h2 className="text-2xl font-bold text-[#8B4557]">{chart.type}</h2>
                  <p className="text-[#6B4423] mt-2">{typeInfo.aura}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E8DDD4] grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[#C9A227] font-medium">Strategy</p>
                  <p className="text-[#6B4423]">{typeInfo.strategy}</p>
                </div>
                <div>
                  <p className="text-[#C9A227] font-medium">Signature</p>
                  <p className="text-[#6B4423]">{typeInfo.signature}</p>
                </div>
                <div>
                  <p className="text-[#C9A227] font-medium">Not-Self Theme</p>
                  <p className="text-[#6B4423]">{typeInfo.notSelfTheme}</p>
                </div>
              </div>
            </div>

            {/* Authority Card */}
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FFE4E1] flex items-center justify-center">
                  <Compass className="w-6 h-6 text-[#8B4557]" />
                </div>
                <div>
                  <p className="text-sm text-[#C9A227] font-medium">Authority</p>
                  <h3 className="text-xl font-semibold text-[#8B4557]">{chart.authority}</h3>
                  <p className="text-sm text-[#6B4423] mt-1">Your decision-making guide</p>
                </div>
              </div>
            </div>

            {/* Profile Card */}
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FFE4E1] flex items-center justify-center">
                  <User className="w-6 h-6 text-[#8B4557]" />
                </div>
                <div>
                  <p className="text-sm text-[#C9A227] font-medium">Profile</p>
                  <h3 className="text-xl font-semibold text-[#8B4557]">{chart.profile}</h3>
                  <p className="text-sm text-[#6B4423] mt-1">Your personality archetype</p>
                </div>
              </div>
            </div>

            {/* Definition Card */}
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FFE4E1] flex items-center justify-center">
                  <Heart className="w-6 h-6 text-[#8B4557]" />
                </div>
                <div>
                  <p className="text-sm text-[#C9A227] font-medium">Definition</p>
                  <h3 className="text-xl font-semibold text-[#8B4557]">{chart.definition}</h3>
                  <p className="text-sm text-[#6B4423] mt-1">How your centers connect</p>
                </div>
              </div>
            </div>

            {/* Incarnation Cross Card */}
            <div className="card bg-gradient-to-br from-[#8B4557]/5 to-[#C9A227]/5">
              <p className="text-sm text-[#C9A227] font-medium">Incarnation Cross</p>
              <h3 className="text-lg font-semibold text-[#8B4557] mt-1">{chart.incarnationCross}</h3>
              <p className="text-sm text-[#6B4423] mt-2">Your life purpose and theme</p>
            </div>
          </motion.div>
        </div>

        {/* Detailed Tabs Section */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Tabs.Root defaultValue="centers" className="card">
            <Tabs.List className="flex border-b border-[#E8DDD4] mb-6">
              {['Centers', 'Channels', 'Gates'].map((tab) => (
                <Tabs.Trigger
                  key={tab}
                  value={tab.toLowerCase()}
                  className="px-6 py-3 text-[#6B4423] font-medium border-b-2 border-transparent data-[state=active]:border-[#C9A227] data-[state=active]:text-[#C9A227] transition-colors"
                >
                  {tab}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <Tabs.Content value="centers" className="focus:outline-none">
              <CentersTab definedCenters={chart.definedCenters} undefinedCenters={chart.undefinedCenters} />
            </Tabs.Content>

            <Tabs.Content value="channels" className="focus:outline-none">
              <ChannelsTab channels={chart.activeChannels} />
            </Tabs.Content>

            <Tabs.Content value="gates" className="focus:outline-none">
              <GatesTab gates={chart.activeGates} />
            </Tabs.Content>
          </Tabs.Root>
        </motion.div>
      </div>

      {/* Gate Detail Modal */}
      <Dialog.Root open={selectedGate !== null} onOpenChange={() => setSelectedGate(null)}>
        <AnimatePresence>
          {selectedGate && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 bg-black/50 z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl p-6 z-50 shadow-xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Dialog.Close asChild>
                    <button className="absolute top-4 right-4 text-[#6B4423] hover:text-[#8B4557]">
                      <X className="w-5 h-5" />
                    </button>
                  </Dialog.Close>

                  <GateDetail gate={selectedGate} activation={chart.activeGates.find(g => g.gate === selectedGate)} />
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      {/* Footer */}
      <footer className="py-8 mt-12 border-t border-[#E8DDD4]">
        <div className="container mx-auto px-4 text-center">
          <Link href="/calculate" className="btn-primary inline-flex items-center gap-2">
            Calculate Another Chart
          </Link>
        </div>
      </footer>
    </main>
  );
}

function CentersTab({ definedCenters, undefinedCenters }: { definedCenters: string[]; undefinedCenters: string[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-semibold text-[#8B4557] mb-4">Defined Centers ({definedCenters.length})</h4>
        <div className="space-y-3">
          {definedCenters.map(centerId => {
            const center = CENTER_CONFIG.find(c => c.id === centerId);
            if (!center) return null;
            return (
              <div key={centerId} className="p-4 bg-gradient-to-r from-[#C9A227]/10 to-[#D4A574]/10 rounded-lg border border-[#C9A227]/20">
                <p className="font-medium text-[#8B4557]">{center.name}</p>
                <p className="text-sm text-[#6B4423] mt-1">{center.theme}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-[#8B4557] mb-4">Open Centers ({undefinedCenters.length})</h4>
        <div className="space-y-3">
          {undefinedCenters.map(centerId => {
            const center = CENTER_CONFIG.find(c => c.id === centerId);
            if (!center) return null;
            return (
              <div key={centerId} className="p-4 bg-[#F5EDE4]/50 rounded-lg border border-[#E8DDD4]">
                <p className="font-medium text-[#6B4423]">{center.name}</p>
                <p className="text-sm text-[#6B4423]/70 mt-1">{center.theme}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ChannelsTab({ channels }: { channels: Array<{ gates: [number, number]; name: string }> }) {
  if (channels.length === 0) {
    return (
      <p className="text-[#6B4423] text-center py-8">No complete channels defined.</p>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {channels.map((channel) => (
        <div key={`${channel.gates[0]}-${channel.gates[1]}`} className="p-4 bg-gradient-to-r from-[#FFE4E1]/50 to-[#FFF8F5] rounded-lg border border-[#E8DDD4]">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-[#C9A227]/10 text-[#C9A227] rounded text-sm font-medium">
              {channel.gates[0]}-{channel.gates[1]}
            </span>
          </div>
          <p className="font-medium text-[#8B4557]">The Channel of {channel.name}</p>
          <p className="text-sm text-[#6B4423] mt-1">
            {GATE_NAMES[channel.gates[0]]} — {GATE_NAMES[channel.gates[1]]}
          </p>
        </div>
      ))}
    </div>
  );
}

function GatesTab({ gates }: { gates: Array<{ gate: number; line: number; planet: string; type: 'personality' | 'design' | 'both'; color?: number; tone?: number; base?: number }> }) {
  const personalityGates = gates.filter(g => g.type === 'personality' || g.type === 'both');
  const designGates = gates.filter(g => g.type === 'design' || g.type === 'both');

  // Deduplicate gates by planet within each section (keep first occurrence)
  const deduplicateByPlanet = (gatesList: typeof gates) => {
    const seenPlanets = new Set<string>();
    return gatesList.filter(g => {
      if (seenPlanets.has(g.planet)) {
        return false;
      }
      seenPlanets.add(g.planet);
      return true;
    });
  };

  const uniquePersonalityGates = deduplicateByPlanet(personalityGates);
  const uniqueDesignGates = deduplicateByPlanet(designGates);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-semibold text-[#8B4557] mb-4 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#1A1A1A]" />
          Personality (Conscious)
        </h4>
        <div className="space-y-2">
          {uniquePersonalityGates.map(g => (
            <div key={`p-${g.gate}`} className="p-3 bg-white rounded-lg border border-[#E8DDD4]">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium text-[#8B4557]">Gate {g.gate}.{g.line}</span>
                  <p className="text-sm text-[#6B4423]">{GATE_KEYWORDS[g.gate]}</p>
                </div>
                <span className="text-lg" title={g.planet}>{PLANET_GLYPHS[g.planet]}</span>
              </div>
              {(g.color !== undefined || g.tone !== undefined || g.base !== undefined) && (
                <div className="flex gap-3 text-xs text-[#8B4557]/70 pt-2 border-t border-[#E8DDD4]">
                  {g.color !== undefined && <span>Color: {g.color}</span>}
                  {g.tone !== undefined && <span>Tone: {g.tone}</span>}
                  {g.base !== undefined && <span>Base: {g.base}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-[#8B4557] mb-4 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#C9A227]" />
          Design (Unconscious)
        </h4>
        <div className="space-y-2">
          {uniqueDesignGates.map(g => (
            <div key={`d-${g.gate}`} className="p-3 bg-white rounded-lg border border-[#E8DDD4]">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium text-[#8B4557]">Gate {g.gate}.{g.line}</span>
                  <p className="text-sm text-[#6B4423]">{GATE_KEYWORDS[g.gate]}</p>
                </div>
                <span className="text-lg" title={g.planet}>{PLANET_GLYPHS[g.planet]}</span>
              </div>
              {(g.color !== undefined || g.tone !== undefined || g.base !== undefined) && (
                <div className="flex gap-3 text-xs text-[#8B4557]/70 pt-2 border-t border-[#E8DDD4]">
                  {g.color !== undefined && <span>Color: {g.color}</span>}
                  {g.tone !== undefined && <span>Tone: {g.tone}</span>}
                  {g.base !== undefined && <span>Base: {g.base}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GateDetail({ gate, activation }: { gate: number; activation?: { gate: number; line: number; planet: string; type: string } }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          activation?.type === 'personality' ? 'bg-[#1A1A1A] text-white' :
          activation?.type === 'design' ? 'bg-[#C9A227] text-white' :
          'bg-gradient-to-r from-[#1A1A1A] to-[#C9A227] text-white'
        }`}>
          {gate}
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#8B4557]">Gate {gate}</h3>
          <p className="text-[#C9A227]">{GATE_NAMES[gate]}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-[#C9A227] font-medium">Theme</p>
          <p className="text-[#6B4423]">{GATE_KEYWORDS[gate]}</p>
        </div>

        {activation && (
          <>
            <div>
              <p className="text-sm text-[#C9A227] font-medium">Line</p>
              <p className="text-[#6B4423]">Line {activation.line}</p>
            </div>
            <div>
              <p className="text-sm text-[#C9A227] font-medium">Planet</p>
              <p className="text-[#6B4423]">{PLANET_GLYPHS[activation.planet]} {activation.planet}</p>
            </div>
            <div>
              <p className="text-sm text-[#C9A227] font-medium">Activation Type</p>
              <p className="text-[#6B4423] capitalize">{activation.type}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
