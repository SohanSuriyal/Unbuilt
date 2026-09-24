import React from 'react';
import { Plus, SlidersHorizontal, Sparkles } from 'lucide-react';

interface TopNavProps {
  activeView: 'commons' | 'graph' | 'teams' | 'manifesto';
  onSelectView: (view: 'commons' | 'graph' | 'teams' | 'manifesto') => void;
  onOpenSubmit: () => void;
  onOpenSkills: () => void;
  userSkillsCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeView,
  onSelectView,
  onOpenSubmit,
  onOpenSkills,
  userSkillsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectView('commons')}
            className="group text-left focus:outline-none"
          >
            <span className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-amber-400 font-display">
              Unbuilt
            </span>
            <span className="sr-only">Go to Unbuilt Commons Home</span>
          </button>
        </div>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => onSelectView('commons')}
            className={`transition-colors focus:outline-none ${
              activeView === 'commons'
                ? 'text-white font-semibold border-b-2 border-amber-400 pb-0.5'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Idea Commons
          </button>
          <button
            onClick={() => onSelectView('graph')}
            className={`transition-colors focus:outline-none ${
              activeView === 'graph'
                ? 'text-white font-semibold border-b-2 border-amber-400 pb-0.5'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Dependency Graph
          </button>
          <button
            onClick={() => onSelectView('teams')}
            className={`transition-colors focus:outline-none ${
              activeView === 'teams'
                ? 'text-white font-semibold border-b-2 border-amber-400 pb-0.5'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Active Teams & Skills
          </button>
          <button
            onClick={() => onSelectView('manifesto')}
            className={`transition-colors focus:outline-none ${
              activeView === 'manifesto'
                ? 'text-white font-semibold border-b-2 border-amber-400 pb-0.5'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Why Unbuilt
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSkills}
            className="flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900/80 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:border-neutral-700 hover:text-white focus:outline-none"
            title="Configure your skills to find matching projects"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">My Skills</span>
            <span className="font-mono text-neutral-400 tabular-nums">({userSkillsCount})</span>
          </button>

          <button
            onClick={onOpenSubmit}
            className="flex items-center gap-1.5 rounded-md bg-amber-400 px-3.5 py-1.5 text-xs font-semibold text-neutral-950 transition-colors hover:bg-amber-300 focus:outline-none active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Donate Idea / Problem</span>
          </button>
        </div>
      </div>
    </header>
  );
};
