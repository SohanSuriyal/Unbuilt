import React from 'react';
import { Idea, IdeaVotes } from '../types';
import {
  Lightbulb,
  AlertCircle,
  ThumbsUp,
  Hammer,
  HelpCircle,
  Layers,
  ChevronRight,
  ShieldCheck,
  CircleDot
} from 'lucide-react';

interface CompactIdeaListViewProps {
  ideas: Idea[];
  userSkills: string[];
  onSelectIdea: (idea: Idea) => void;
  onVote: (ideaId: string, voteKey: keyof IdeaVotes) => void;
}

export const CompactIdeaListView: React.FC<CompactIdeaListViewProps> = ({
  ideas,
  userSkills,
  onSelectIdea,
  onVote,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-xl backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-neutral-300">
          <thead className="border-b border-neutral-800 bg-neutral-950/80 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            <tr>
              <th scope="col" className="px-4 py-3.5">
                Type & Submission
              </th>
              <th scope="col" className="px-4 py-3.5">
                Industry / Category
              </th>
              <th scope="col" className="px-4 py-3.5">
                Scope & Prerequisites
              </th>
              <th scope="col" className="px-4 py-3.5">
                Team & Open Roles
              </th>
              <th scope="col" className="px-4 py-3.5 text-center">
                Feasibility / Votes
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 bg-neutral-950/40">
            {ideas.map((idea) => {
              const isProblem = idea.type === 'problem';
              const hasMatchingSkill = idea.skillsNeeded.some((sn) =>
                userSkills.some(
                  (us) =>
                    us.toLowerCase() === sn.skill.toLowerCase() ||
                    sn.skill.toLowerCase().includes(us.toLowerCase()) ||
                    us.toLowerCase().includes(sn.skill.toLowerCase())
                )
              );

              const openRoles = idea.skillsNeeded.filter(
                (sn) => sn.filledCount < sn.targetCount
              );

              return (
                <tr
                  key={idea.id}
                  onClick={() => onSelectIdea(idea)}
                  className="group hover:bg-neutral-900/90 cursor-pointer transition-colors"
                >
                  {/* Type & Title */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`mt-0.5 inline-flex items-center justify-center h-5 w-5 rounded-md text-[10px] font-bold shrink-0 ${
                          isProblem
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                        }`}
                        title={isProblem ? 'Real-World Friction / Problem' : 'Proposed System / Solution'}
                      >
                        {isProblem ? '🚨' : '💡'}
                      </span>
                      <div className="max-w-md">
                        <div className="font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                          {idea.title}
                        </div>
                        <div className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                          {idea.tagline}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Industry */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="rounded-lg bg-neutral-900 px-2.5 py-1 text-[11px] font-medium text-neutral-300 border border-neutral-800">
                      {idea.category}
                    </span>
                  </td>

                  {/* Scope & Prereqs */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="space-y-0.5 text-[11px]">
                      <div className="font-mono text-neutral-400">{idea.complexity}</div>
                      {idea.prerequisites.length > 0 ? (
                        <div className="text-sky-400 font-medium flex items-center gap-1">
                          <Layers className="h-3 w-3" />
                          <span>{idea.prerequisites.length} prerequisite{idea.prerequisites.length > 1 ? 's' : ''}</span>
                        </div>
                      ) : (
                        <div className="text-neutral-500 text-[10px]">Independent node</div>
                      )}
                    </div>
                  </td>

                  {/* Team & Open Roles */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {openRoles.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-semibold border ${
                              hasMatchingSkill
                                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 ring-1 ring-amber-400/30'
                                : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                            }`}
                          >
                            {openRoles.length} role{openRoles.length > 1 ? 's' : ''} open
                          </span>
                          {hasMatchingSkill && (
                            <span className="text-[10px] font-semibold text-amber-400">
                              Matches you!
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate max-w-[150px]">
                          {openRoles.map((r) => r.skill).join(', ')}
                        </div>
                      </div>
                    ) : (
                      <span className="text-neutral-500 text-[11px]">Team formed</span>
                    )}
                  </td>

                  {/* Feasibility / Votes */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-center">
                    <div className="inline-flex items-center gap-2 bg-neutral-900/80 px-2.5 py-1 rounded-lg border border-neutral-800 text-[11px]">
                      <span
                        className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
                        title="Feasible assessment count"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span className="font-mono tabular-nums">{idea.votes.feasible || 0}</span>
                      </span>
                      <span className="text-neutral-600">·</span>
                      <span
                        className="flex items-center gap-1 text-amber-400 hover:text-amber-300"
                        title="Have this problem count"
                      >
                        <HelpCircle className="h-3 w-3" />
                        <span className="font-mono tabular-nums">{idea.votes.haveThisProblem || 0}</span>
                      </span>
                      <span className="text-neutral-600">·</span>
                      <span
                        className="flex items-center gap-1 text-sky-400 hover:text-sky-300"
                        title="Builders interested"
                      >
                        <Hammer className="h-3 w-3" />
                        <span className="font-mono tabular-nums">{idea.votes.wantToBuild || 0}</span>
                      </span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectIdea(idea);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-200 group-hover:bg-amber-400 group-hover:text-neutral-950 transition-colors"
                    >
                      <span>Inspect</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
