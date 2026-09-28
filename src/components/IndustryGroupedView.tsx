import React, { useState, useMemo } from 'react';
import { Idea, IdeaVotes } from '../types';
import { IdeaCard } from './IdeaCard';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  Users,
  Compass
} from 'lucide-react';

interface IndustryGroupedViewProps {
  ideas: Idea[];
  userSkills: string[];
  onSelectIdea: (idea: Idea) => void;
  onVote: (ideaId: string, voteKey: keyof IdeaVotes) => void;
  onOpenSubmitForIndustry?: (category: string) => void;
  onViewInGraph?: (idea: Idea) => void;
}

interface IndustryMeta {
  id: string;
  name: string;
  shortName: string;
  aliases: string[];
  icon: string;
  tag: string;
  description: string;
  borderClass: string;
  bgGradient: string;
  textAccent: string;
  heroAccent: string;
}

const INDUSTRY_CONFIGS: IndustryMeta[] = [
  {
    id: 'health',
    name: 'Health & Public Safety',
    shortName: 'Health & Safety',
    aliases: ['Health & Public Safety', 'Public Safety & Infrastructure'],
    icon: '🚨',
    tag: 'Disaster Triage & Mesh Protocols',
    description: 'Offline emergency triage cards, LoRa radio beacons, and regional hospital live blood & bed reserve telemetry.',
    borderClass: 'border-rose-500/40 hover:border-rose-500/60',
    bgGradient: 'from-rose-950/30 via-neutral-900/70 to-neutral-950',
    textAccent: 'text-rose-400',
    heroAccent: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  },
  {
    id: 'sustainability',
    name: 'Sustainability & Community',
    shortName: 'Sustainability & Food',
    aliases: ['Sustainability & Community'],
    icon: '🌱',
    tag: 'Hyperlocal Redistribution & Circular Logistics',
    description: 'Nightly surplus food dispatchers, cargo bike haul routing algorithms, and solar porch cold-chain drop lockers.',
    borderClass: 'border-emerald-500/40 hover:border-emerald-500/60',
    bgGradient: 'from-emerald-950/30 via-neutral-900/70 to-neutral-950',
    textAccent: 'text-emerald-400',
    heroAccent: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 'hardware',
    name: 'Hardware & Right-to-Repair',
    shortName: 'Right-to-Repair',
    aliases: ['Hardware & Right-to-Repair'],
    icon: '🔧',
    tag: 'Open Disassembly & Replacement CAD',
    description: 'Exploded-view screw length maps, discontinued appliance gear CAD repos, and automated 3D repair kiosks.',
    borderClass: 'border-amber-500/40 hover:border-amber-500/60',
    bgGradient: 'from-amber-950/30 via-neutral-900/70 to-neutral-950',
    textAccent: 'text-amber-400',
    heroAccent: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  },
  {
    id: 'civic',
    name: 'Civic Infrastructure',
    shortName: 'Civic Infrastructure',
    aliases: ['Civic Infrastructure'],
    icon: '🏛️',
    tag: 'Urban Sensing & Acoustic Environmental Health',
    description: 'Calibrated window noise heatmaps, automated 311 evidentiary citation dossiers, and urban bat & bird corridor monitors.',
    borderClass: 'border-sky-500/40 hover:border-sky-500/60',
    bgGradient: 'from-sky-950/30 via-neutral-900/70 to-neutral-950',
    textAccent: 'text-sky-400',
    heroAccent: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
  },
  {
    id: 'productivity',
    name: 'Productivity & Public Tech',
    shortName: 'Open Tech & Tooling',
    aliases: ['Productivity & Public Tech'],
    icon: '💻',
    tag: 'Public Domain Repositories & Open Standards',
    description: 'Open protocols, builder coordination tooling, and public repositories for unbuilt systems.',
    borderClass: 'border-indigo-500/40 hover:border-indigo-500/60',
    bgGradient: 'from-indigo-950/30 via-neutral-900/70 to-neutral-950',
    textAccent: 'text-indigo-400',
    heroAccent: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
  },
  {
    id: 'privacy',
    name: 'Privacy & Elder Care',
    shortName: 'Privacy & Care',
    aliases: ['Privacy & Elder Care'],
    icon: '🛡️',
    tag: 'Local-First Intelligence & Human Dignity',
    description: 'Zero-cloud sensor monitoring, dignity-preserving elder assistance, and private community response nodes.',
    borderClass: 'border-violet-500/40 hover:border-violet-500/60',
    bgGradient: 'from-violet-950/30 via-neutral-900/70 to-neutral-950',
    textAccent: 'text-violet-400',
    heroAccent: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
  },
];

export const IndustryGroupedView: React.FC<IndustryGroupedViewProps> = ({
  ideas,
  userSkills,
  onSelectIdea,
  onVote,
  onOpenSubmitForIndustry,
  onViewInGraph,
}) => {
  // Group ideas into industries
  const industryBuckets = useMemo(() => {
    const map: Record<string, { meta: IndustryMeta; ideas: Idea[] }> = {};

    INDUSTRY_CONFIGS.forEach((cfg) => {
      map[cfg.id] = { meta: cfg, ideas: [] };
    });

    ideas.forEach((idea) => {
      const found = INDUSTRY_CONFIGS.find((cfg) =>
        cfg.aliases.some((alias) => alias.toLowerCase() === idea.category.toLowerCase())
      );

      if (found) {
        map[found.id].ideas.push(idea);
      } else {
        const customId = `custom-${idea.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        if (!map[customId]) {
          map[customId] = {
            meta: {
              id: customId,
              name: idea.category,
              shortName: idea.category,
              aliases: [idea.category],
              icon: '💡',
              tag: 'Emerging Domain',
              description: `Community-submitted ideas and challenges in ${idea.category}.`,
              borderClass: 'border-neutral-700 hover:border-neutral-500',
              bgGradient: 'from-neutral-900 via-neutral-900/60 to-neutral-950',
              textAccent: 'text-neutral-300',
              heroAccent: 'bg-neutral-800 text-neutral-300 border-neutral-700',
            },
            ideas: [],
          };
        }
        map[customId].ideas.push(idea);
      }
    });

    // Only return industries that have ideas
    return Object.values(map).filter((item) => item.ideas.length > 0);
  }, [ideas]);

  // Selected single industry ID - default to first available industry
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>(() => {
    return industryBuckets[0]?.meta.id || 'health';
  });

  // Ensure selectedIndustryId points to an existing bucket
  const activeBucket = useMemo(() => {
    const found = industryBuckets.find((b) => b.meta.id === selectedIndustryId);
    return found || industryBuckets[0];
  }, [industryBuckets, selectedIndustryId]);

  // Next / Previous navigation index
  const currentIndex = useMemo(() => {
    return industryBuckets.findIndex((b) => b.meta.id === activeBucket?.meta.id);
  }, [industryBuckets, activeBucket]);

  const handlePrevIndustry = () => {
    if (industryBuckets.length === 0) return;
    const prevIdx = (currentIndex - 1 + industryBuckets.length) % industryBuckets.length;
    setSelectedIndustryId(industryBuckets[prevIdx].meta.id);
  };

  const handleNextIndustry = () => {
    if (industryBuckets.length === 0) return;
    const nextIdx = (currentIndex + 1) % industryBuckets.length;
    setSelectedIndustryId(industryBuckets[nextIdx].meta.id);
  };

  if (!activeBucket) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-800 p-8 text-center text-neutral-400">
        No industry submissions available matching current criteria.
      </div>
    );
  }

  const { meta, ideas: activeIdeas } = activeBucket;
  const problemsCount = activeIdeas.filter((i) => i.type === 'problem').length;
  const solutionsCount = activeIdeas.filter((i) => i.type === 'idea').length;
  const openRolesCount = activeIdeas.reduce(
    (acc, i) =>
      acc +
      i.skillsNeeded.reduce((sAcc, s) => sAcc + Math.max(0, s.targetCount - s.filledCount), 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* 1. INDUSTRY SELECTOR HUB: Click an industry and ONLY it opens */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Compass className="h-4 w-4" />
            <span>Select an Industry to Explore (Only Selected Industry Opens):</span>
          </div>
          <span className="text-[11px] text-neutral-500 font-mono hidden sm:inline">
            {industryBuckets.length} Active Industries
          </span>
        </div>

        {/* Industry Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {industryBuckets.map(({ meta: itemMeta, ideas: itemIdeas }) => {
            const isSelected = itemMeta.id === activeBucket.meta.id;
            return (
              <button
                key={itemMeta.id}
                type="button"
                onClick={() => setSelectedIndustryId(itemMeta.id)}
                className={`group flex flex-col justify-between rounded-xl p-3 text-left transition-all relative ${
                  isSelected
                    ? `border-2 border-amber-400 bg-neutral-950 shadow-xl ring-2 ring-amber-400/30 scale-[1.02]`
                    : `border border-neutral-800/90 bg-neutral-950/60 hover:border-neutral-700 hover:bg-neutral-900/80`
                }`}
              >
                <div>
                  <div className="text-xl mb-1.5">{itemMeta.icon}</div>
                  <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-amber-300' : 'text-white group-hover:text-neutral-200'}`}>
                    {itemMeta.shortName}
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono border-t border-neutral-800/60 pt-1.5">
                  <span className={isSelected ? 'text-amber-400 font-bold' : 'text-neutral-400'}>
                    {itemIdeas.length} idea{itemIdeas.length !== 1 ? 's' : ''}
                  </span>
                  {isSelected && (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. ONLY THE CHOSEN INDUSTRY OPENS */}
      <div
        className={`overflow-hidden rounded-2xl border transition-all ${meta.borderClass} bg-gradient-to-b ${meta.bgGradient} shadow-2xl`}
      >
        {/* Industry Hero Header */}
        <div className="p-5 sm:p-7 border-b border-neutral-800/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <div className="text-4xl p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl flex items-center justify-center shrink-0">
                {meta.icon}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${meta.heroAccent}`}>
                    {meta.tag}
                  </span>
                  <span className="text-xs text-neutral-500 font-mono">
                    Showing ONLY this industry
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                  {meta.name}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
                  {meta.description}
                </p>
              </div>
            </div>

            {/* Quick Actions & Prev/Next Industry Switcher */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
              {/* Prev / Next buttons */}
              <div className="flex items-center gap-1 rounded-xl border border-neutral-800 bg-neutral-950 p-1">
                <button
                  type="button"
                  onClick={handlePrevIndustry}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  title="Previous Industry"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-[11px] font-mono text-neutral-400 px-2 select-none">
                  {currentIndex + 1} / {industryBuckets.length}
                </span>
                <button
                  type="button"
                  onClick={handleNextIndustry}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  title="Next Industry"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Donate Button for this industry */}
              {onOpenSubmitForIndustry && (
                <button
                  type="button"
                  onClick={() => onOpenSubmitForIndustry(meta.name)}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-300 transition-colors shadow-lg"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Donate to {meta.shortName}</span>
                </button>
              )}
            </div>
          </div>

          {/* Industry Stats Metric Bar */}
          <div className="mt-5 pt-4 border-t border-neutral-800/80 flex flex-wrap items-center gap-4 sm:gap-8 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-white tabular-nums">
                {activeIdeas.length}
              </span>
              <span>Total Submissions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-amber-400 tabular-nums">
                {problemsCount}
              </span>
              <span>Friction / Problems</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">
                {solutionsCount}
              </span>
              <span>Feasible Solutions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-sky-400 tabular-nums">
                {openRolesCount}
              </span>
              <span>Open Roles Needing Builders</span>
            </div>
          </div>
        </div>

        {/* Ideas Grid ONLY for this Industry */}
        <div className="p-5 sm:p-6 bg-neutral-950/60">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                userSkills={userSkills}
                onSelect={(selected) => onSelectIdea(selected)}
                onVote={onVote}
                onViewInGraph={onViewInGraph}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
