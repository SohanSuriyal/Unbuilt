import React from 'react';
import { IdeaVotes, UserVotes } from '../types';
import { Lightbulb, Zap, UserCheck, Hammer } from 'lucide-react';

interface VoteControlsProps {
  votes: IdeaVotes;
  userVotes?: UserVotes;
  onVote: (voteKey: keyof IdeaVotes) => void;
  compact?: boolean;
}

export const VoteControls: React.FC<VoteControlsProps> = ({
  votes,
  userVotes = {},
  onVote,
  compact = false,
}) => {
  const voteConfigs: Array<{
    key: keyof IdeaVotes;
    userKey: keyof UserVotes;
    label: string;
    shortLabel: string;
    subtext: string;
    icon: React.ReactNode;
    activeColor: string;
  }> = [
    {
      key: 'goodIdea',
      userKey: 'goodIdea',
      label: 'Good Concept',
      shortLabel: 'Idea',
      subtext: 'High impact or novel angle',
      icon: <Lightbulb className="h-3.5 w-3.5" />,
      activeColor: 'bg-amber-400/15 border-amber-400/60 text-amber-300',
    },
    {
      key: 'feasible',
      userKey: 'feasible',
      label: 'Highly Feasible',
      shortLabel: 'Feasible',
      subtext: 'Technically realistic to execute',
      icon: <Zap className="h-3.5 w-3.5" />,
      activeColor: 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300',
    },
    {
      key: 'haveThisProblem',
      userKey: 'haveThisProblem',
      label: 'I Have This Problem',
      shortLabel: 'Validation',
      subtext: 'Experienced this real-world friction',
      icon: <UserCheck className="h-3.5 w-3.5" />,
      activeColor: 'bg-sky-500/15 border-sky-500/60 text-sky-300',
    },
    {
      key: 'wantToBuild',
      userKey: 'wantToBuild',
      label: "I'd Help Build",
      shortLabel: 'Builder',
      subtext: 'Willing to contribute skills',
      icon: <Hammer className="h-3.5 w-3.5" />,
      activeColor: 'bg-violet-500/15 border-violet-500/60 text-violet-300',
    },
  ];

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
        {voteConfigs.map((cfg) => {
          const isActive = !!userVotes[cfg.userKey];
          const count = votes[cfg.key] || 0;

          return (
            <button
              key={cfg.key}
              type="button"
              onClick={() => onVote(cfg.key)}
              title={`${cfg.label} — ${cfg.subtext}`}
              className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? cfg.activeColor
                  : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
              }`}
            >
              <span className={isActive ? 'text-inherit' : 'text-neutral-500'}>{cfg.icon}</span>
              <span className="hidden sm:inline">{cfg.shortLabel}</span>
              <span className="font-mono tabular-nums text-[11px] font-semibold">
                {count}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Full detailed voting panel for Idea Detail Modal
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {voteConfigs.map((cfg) => {
        const isActive = !!userVotes[cfg.userKey];
        const count = votes[cfg.key] || 0;

        return (
          <button
            key={cfg.key}
            type="button"
            onClick={() => onVote(cfg.key)}
            className={`group flex flex-col items-start rounded-lg border p-3 text-left transition-all ${
              isActive
                ? cfg.activeColor
                : 'border-neutral-800 bg-neutral-900/40 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900/80'
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={isActive ? 'text-inherit' : 'text-neutral-400 group-hover:text-amber-400'}>
                  {cfg.icon}
                </span>
                <span className="text-xs font-semibold">{cfg.label}</span>
              </div>
              <span className="font-mono text-sm font-bold tabular-nums">
                {count}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-neutral-400 line-clamp-1">{cfg.subtext}</p>
          </button>
        );
      })}
    </div>
  );
};
