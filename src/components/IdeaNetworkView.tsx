import React, { useState } from 'react';
import { Idea } from '../types';
import { Link2, ArrowRight, ShieldCheck, Compass, Zap, Users } from 'lucide-react';

interface IdeaNetworkViewProps {
  ideas: Idea[];
  onSelectIdea: (idea: Idea) => void;
  onOpenLinkPrereq: (idea: Idea) => void;
}

export const IdeaNetworkView: React.FC<IdeaNetworkViewProps> = ({
  ideas,
  onSelectIdea,
  onOpenLinkPrereq,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Identify ideas that have incoming or outgoing prerequisites
  const ideasWithDependencies = ideas.filter(
    (i) =>
      i.prerequisites.length > 0 ||
      ideas.some((other) => other.prerequisites.some((p) => p.targetId === i.id))
  );

  const categories = Array.from(new Set(ideas.map((i) => i.category)));

  const filteredIdeas =
    selectedFilter === 'all'
      ? ideas
      : ideas.filter((i) => i.category === selectedFilter);

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
              <Link2 className="h-4 w-4" />
              <span>Prerequisite Dependency Graph</span>
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              The Architecture Web: Foundations & Downstream Ideas
            </h2>
            <p className="mt-1 text-xs text-neutral-300 max-w-2xl leading-relaxed">
              Great products rarely exist in a vacuum. Unbuilt ideas frequently depend on open standards,
              hardware specs, or data protocols established by preceding ideas. Trace what needs to be
              built first to unlock downstream breakthroughs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Filter Domain:</span>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
            >
              <option value="all">All Domains ({ideas.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Visual Dependency Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Root / Foundational Ideas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Foundational Standards & Prereqs</span>
            </div>
            <span className="font-mono text-xs text-neutral-500">Unlocks Others</span>
          </div>

          <div className="space-y-3">
            {filteredIdeas
              .filter((idea) =>
                ideas.some((other) => other.prerequisites.some((p) => p.targetId === idea.id))
              )
              .map((idea) => {
                const dependents = ideas.filter((other) =>
                  other.prerequisites.some((p) => p.targetId === idea.id)
                );

                return (
                  <div
                    key={idea.id}
                    className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-4 transition-all hover:border-sky-400 cursor-pointer"
                    onClick={() => onSelectIdea(idea)}
                  >
                    <div className="flex items-center justify-between text-[11px] text-sky-400 mb-1">
                      <span className="font-semibold uppercase">{idea.category}</span>
                      <span className="font-mono">Unlocks {dependents.length} downstream</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white">{idea.title}</h3>
                    <p className="mt-1 text-xs text-neutral-300 line-clamp-2">{idea.tagline}</p>

                    <div className="mt-3 pt-2.5 border-t border-neutral-800/80">
                      <div className="text-[10px] font-semibold text-neutral-400 uppercase mb-1">
                        Unlocks These Projects:
                      </div>
                      <div className="space-y-1">
                        {dependents.map((dep) => (
                          <div
                            key={dep.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectIdea(dep);
                            }}
                            className="flex items-center justify-between rounded bg-neutral-900/80 px-2 py-1 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800"
                          >
                            <span className="truncate">{dep.title}</span>
                            <ArrowRight className="h-3 w-3 shrink-0 text-amber-400 ml-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Center / Right Columns: The Connected Network Grid */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-violet-400 uppercase tracking-wider">
              <Compass className="h-3.5 w-3.5" />
              <span>Idea Dependency Map & Linkages</span>
            </div>
            <span className="font-mono text-xs text-neutral-500">{filteredIdeas.length} Submissions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredIdeas.map((idea) => {
              const hasPrereqs = idea.prerequisites.length > 0;
              const isPrereqForOthers = ideas.some((other) =>
                other.prerequisites.some((p) => p.targetId === idea.id)
              );

              return (
                <div
                  key={idea.id}
                  onClick={() => onSelectIdea(idea)}
                  className={`group rounded-xl border p-4 text-left transition-all cursor-pointer ${
                    hasPrereqs || isPrereqForOthers
                      ? 'border-neutral-700/80 bg-neutral-900/80 hover:border-amber-400/80'
                      : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
                    <span className="text-[11px] text-amber-400 font-semibold">{idea.category}</span>
                    <span className="font-mono text-[10px] text-neutral-500">{idea.complexity}</span>
                  </div>

                  <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {idea.title}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                    {idea.tagline}
                  </p>

                  {/* Prerequisites indicator */}
                  <div className="mt-3 pt-2 border-t border-neutral-800/80 text-xs flex items-center justify-between">
                    {hasPrereqs ? (
                      <div className="flex items-center gap-1 text-sky-400 text-[11px]">
                        <Link2 className="h-3 w-3" />
                        <span>Requires {idea.prerequisites.length} foundation</span>
                      </div>
                    ) : (
                      <span className="text-neutral-500 text-[11px]">No dependencies</span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenLinkPrereq(idea);
                      }}
                      className="text-[11px] text-neutral-400 hover:text-amber-400 transition-colors"
                    >
                      + Connect
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
