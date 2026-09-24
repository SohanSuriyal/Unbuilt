import React, { useState } from 'react';
import { Idea } from '../types';
import { Users, Hammer, SlidersHorizontal, ArrowRight, CheckCircle2 } from 'lucide-react';

interface TeamsDashboardViewProps {
  ideas: Idea[];
  userSkills: string[];
  onOpenSkillConfig: () => void;
  onSelectIdea: (idea: Idea) => void;
  onOpenJoinTeam: (idea: Idea) => void;
}

export const TeamsDashboardView: React.FC<TeamsDashboardViewProps> = ({
  ideas,
  userSkills,
  onOpenSkillConfig,
  onSelectIdea,
  onOpenJoinTeam,
}) => {
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');

  // Collect all unique skills requested across all ideas
  const allNeededSkills = Array.from(
    new Set(
      ideas.flatMap((i) => i.skillsNeeded.map((s) => s.skill))
    )
  );

  // Filter ideas by selected discipline if any
  const filteredIdeas =
    selectedSkillFilter === 'all'
      ? ideas
      : ideas.filter((i) =>
          i.skillsNeeded.some((s) => s.skill === selectedSkillFilter)
        );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">
              <Users className="h-4 w-4" />
              <span>Builder Assembly & Team Formation</span>
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              Match Your Skills to Solvable Real-World Projects
            </h2>
            <p className="mt-1 text-xs text-neutral-300 max-w-2xl leading-relaxed">
              Don't build another throwaway SaaS clone. Join an unbuilt public good where your specific
              engineering, design, or domain expertise is the missing catalyst.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSkillConfig}
              className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-3.5 py-2 text-xs font-semibold text-white hover:border-amber-400 transition-colors"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-amber-400" />
              <span>Edit My Skills ({userSkills.length})</span>
            </button>
          </div>
        </div>

        {/* User skills chips */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-neutral-500 font-medium">Your Active Profile:</span>
          {userSkills.map((s) => (
            <span
              key={s}
              className="rounded bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 text-[11px] font-medium text-amber-300"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Discipline Filter Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-neutral-500 shrink-0 uppercase tracking-wider text-[11px] font-medium mr-1">
          Filter Vacancies:
        </span>
        <button
          onClick={() => setSelectedSkillFilter('all')}
          className={`whitespace-nowrap shrink-0 rounded-md px-3 py-1 font-medium transition-colors ${
            selectedSkillFilter === 'all'
              ? 'bg-neutral-200 text-neutral-950 font-semibold'
              : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
          }`}
        >
          All Disciplines
        </button>
        {allNeededSkills.map((sk) => {
          const isUserSkill = userSkills.includes(sk);
          const isSelected = selectedSkillFilter === sk;
          return (
            <button
              key={sk}
              onClick={() => setSelectedSkillFilter(sk)}
              className={`whitespace-nowrap shrink-0 rounded-md px-3 py-1 font-medium transition-colors ${
                isSelected
                  ? 'bg-violet-500 text-white font-semibold'
                  : isUserSkill
                  ? 'bg-neutral-900 border border-amber-400/50 text-amber-300 hover:text-white'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {isUserSkill && '★ '}
              {sk}
            </button>
          );
        })}
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIdeas.map((idea) => {
          const hasMatchingSkill = idea.skillsNeeded.some((sn) =>
            userSkills.includes(sn.skill)
          );
          const openRoles = idea.skillsNeeded.filter((sn) => sn.filledCount < sn.targetCount);

          return (
            <div
              key={idea.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 flex flex-col justify-between hover:border-neutral-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                  <span className="text-violet-400 font-semibold capitalize">
                    {idea.team.status.replace(/_/g, ' ')}
                  </span>
                  <span className="font-mono text-neutral-500">{idea.complexity}</span>
                </div>

                <h3
                  onClick={() => onSelectIdea(idea)}
                  className="text-base font-semibold text-white hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {idea.title}
                </h3>
                <p className="mt-1 text-xs text-neutral-300 line-clamp-2">{idea.tagline}</p>

                {/* Team roster preview */}
                <div className="mt-3.5 rounded-lg bg-neutral-950/70 p-3 border border-neutral-800/80">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 mb-2">
                    <span>Current Builders ({idea.team.members.length})</span>
                    <span className="font-mono text-neutral-500">
                      {openRoles.length} vacancies open
                    </span>
                  </div>

                  {idea.team.members.length === 0 ? (
                    <div className="text-[11px] text-neutral-500 italic">
                      No contributors assembled yet. Be the founding builder!
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {idea.team.members.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between text-xs text-neutral-300"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="font-medium text-white">{m.name}</span>
                            <span className="text-neutral-500 text-[11px]">{m.handle}</span>
                          </div>
                          <span className="font-mono text-[10px] text-violet-300 shrink-0">
                            {m.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Open roles needed */}
                <div className="mt-3">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Roles Still Needed:
                  </div>
                  <div className="space-y-1">
                    {openRoles.map((sn, idx) => {
                      const matchesYou = userSkills.includes(sn.skill);
                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between rounded px-2.5 py-1 text-xs ${
                            matchesYou
                              ? 'bg-amber-400/10 border border-amber-400/30 text-amber-200'
                              : 'bg-neutral-950/40 text-neutral-300 border border-neutral-800/60'
                          }`}
                        >
                          <span className="font-medium">
                            {matchesYou && '★ '}
                            {sn.skill}
                          </span>
                          <span className="text-[11px] text-neutral-400 truncate ml-2">
                            {sn.roleDescription}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                <button
                  onClick={() => onSelectIdea(idea)}
                  className="text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  View Details & Spec →
                </button>
                <button
                  onClick={() => onOpenJoinTeam(idea)}
                  className="flex items-center gap-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors"
                >
                  <Hammer className="h-3.5 w-3.5" />
                  <span>Join Team</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
