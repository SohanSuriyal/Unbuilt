import React from 'react';
import { Idea, IdeaVotes } from '../types';
import { VoteControls } from './VoteControls';
import { Users, Link2, ArrowRight } from 'lucide-react';

interface IdeaCardProps {
  idea: Idea;
  userSkills: string[];
  onSelect: (idea: Idea) => void;
  onVote: (ideaId: string, voteKey: keyof IdeaVotes) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  userSkills,
  onSelect,
  onVote,
}) => {
  // Check how many required skills match the current user's profile
  const matchingSkills = idea.skillsNeeded.filter((sn) =>
    userSkills.some(
      (us) =>
        us.toLowerCase() === sn.skill.toLowerCase() ||
        sn.skill.toLowerCase().includes(us.toLowerCase()) ||
        us.toLowerCase().includes(sn.skill.toLowerCase())
    )
  );

  const totalRolesNeeded = idea.skillsNeeded.reduce((acc, s) => acc + s.targetCount, 0);
  const totalRolesFilled = idea.skillsNeeded.reduce((acc, s) => acc + s.filledCount, 0);
  const openRolesCount = Math.max(0, totalRolesNeeded - totalRolesFilled);

  const isProblem = idea.type === 'problem';

  return (
    <article
      onClick={() => onSelect(idea)}
      className="group relative flex flex-col justify-between rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-5 transition-all duration-150 hover:border-neutral-700 hover:bg-neutral-900/80 cursor-pointer"
    >
      <div>
        {/* Unboxed metadata line with typographic separators (anti-slop rule) */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 mb-2">
          <span className={isProblem ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
            {isProblem ? 'Real-World Problem' : 'Solvable Idea'}
          </span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>{idea.category}</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span className="font-mono text-[11px] text-neutral-400">{idea.complexity}</span>
          {idea.prerequisites.length > 0 && (
            <>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="inline-flex items-center gap-1 text-sky-400 font-medium">
                <Link2 className="h-3 w-3" />
                <span>{idea.prerequisites.length} prerequisite{idea.prerequisites.length > 1 ? 's' : ''}</span>
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-amber-300 transition-colors line-clamp-2">
          {idea.title}
        </h3>

        {/* Tagline / elevator summary */}
        <p className="mt-1.5 text-xs text-neutral-300 leading-relaxed line-clamp-2">
          {idea.tagline}
        </p>

        {/* Motivation snippet quote */}
        <div className="mt-3 rounded-md bg-neutral-950/60 p-2.5 border-l-2 border-neutral-700">
          <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-0.5">
            Core Friction
          </div>
          <p className="text-xs text-neutral-400 italic line-clamp-2 leading-relaxed">
            "{idea.motivation.problemStatement}"
          </p>
        </div>

        {/* Skills needed list with user skill match indicator */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1.5">
            <span className="font-medium">Roles & Skills Needed</span>
            {matchingSkills.length > 0 && (
              <span className="text-amber-400 font-medium">
                ★ {matchingSkills.length} match{matchingSkills.length > 1 ? 'es' : ''} your skills
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {idea.skillsNeeded.map((sn, idx) => {
              const isMatch = userSkills.some(
                (us) =>
                  us.toLowerCase() === sn.skill.toLowerCase() ||
                  sn.skill.toLowerCase().includes(us.toLowerCase()) ||
                  us.toLowerCase().includes(sn.skill.toLowerCase())
              );
              const isFull = sn.filledCount >= sn.targetCount;

              return (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                    isMatch
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : isFull
                      ? 'bg-neutral-800/40 text-neutral-500 border border-neutral-800'
                      : 'bg-neutral-950/80 text-neutral-300 border border-neutral-800'
                  }`}
                >
                  <span>{sn.skill}</span>
                  <span className="font-mono text-[10px] text-neutral-400 tabular-nums">
                    ({sn.filledCount}/{sn.targetCount})
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Card Footer: Team Status & Multi-Vector Vote Controls */}
      <div className="mt-4 pt-3 border-t border-neutral-800/60">
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-2.5">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-neutral-500" />
            <span className="capitalize">{idea.team.status.replace(/_/g, ' ')}</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="font-mono tabular-nums text-neutral-300">
              {openRolesCount > 0 ? `${openRolesCount} role${openRolesCount > 1 ? 's' : ''} open` : 'Team complete'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-neutral-500 group-hover:text-amber-400 transition-colors">
            <span>Read full spec</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>

        {/* Multi-vote bar */}
        <VoteControls
          votes={idea.votes}
          userVotes={idea.userVotes}
          onVote={(voteKey) => onVote(idea.id, voteKey)}
          compact={true}
        />
      </div>
    </article>
  );
};
