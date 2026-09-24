import React, { useState } from 'react';
import { Idea, IdeaVotes, PrerequisiteLink, DiscussionItem } from '../types';
import { VoteControls } from './VoteControls';
import { generateIdeaMarkdown } from '../utils/exportMarkdown';
import {
  X,
  Copy,
  Check,
  Link2,
  Users,
  Compass,
  Zap,
  ShieldAlert,
  ArrowUpRight,
  MessageSquare,
  Send,
  Plus
} from 'lucide-react';

interface IdeaDetailModalProps {
  idea: Idea | null;
  onClose: () => void;
  allIdeas: Idea[];
  onSelectOtherIdea: (idea: Idea) => void;
  onVote: (ideaId: string, voteKey: keyof IdeaVotes) => void;
  onOpenJoinTeam: (idea: Idea) => void;
  onOpenLinkPrerequisite: (idea: Idea) => void;
  onAddDiscussion: (ideaId: string, item: DiscussionItem) => void;
}

export const IdeaDetailModal: React.FC<IdeaDetailModalProps> = ({
  idea,
  onClose,
  allIdeas,
  onSelectOtherIdea,
  onVote,
  onOpenJoinTeam,
  onOpenLinkPrerequisite,
  onAddDiscussion,
}) => {
  const [activeTab, setActiveTab] = useState<'spec' | 'team' | 'discussion'>('spec');
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentSection, setCommentSection] = useState<DiscussionItem['sectionRef']>('general');

  if (!idea) return null;

  const handleCopyRFC = async () => {
    const md = generateIdeaMarkdown(idea);
    try {
      await navigator.clipboard.writeText(md);
      setCopiedMarkdown(true);
      setTimeout(() => setCopiedMarkdown(false), 2500);
    } catch {
      // Fallback
      console.log(md);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: DiscussionItem = {
      id: `disc-${Date.now()}`,
      author: commentAuthor.trim() || 'Anonymous Contributor',
      handle: commentAuthor.trim() ? `@${commentAuthor.trim().toLowerCase().replace(/\s+/g, '')}` : '@contributor',
      content: commentText.trim(),
      sectionRef: commentSection,
      createdAt: 'Just now',
      likes: 1,
    };

    onAddDiscussion(idea.id, newComment);
    setCommentText('');
  };

  const isProblem = idea.type === 'problem';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex h-full max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-neutral-800/90 px-6 py-4 bg-neutral-950/60">
          <div>
            {/* Unboxed metadata line */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 mb-1.5">
              <span className={isProblem ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                {isProblem ? 'Real-World Problem' : 'Solvable Idea'}
              </span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>{idea.category}</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="font-mono text-neutral-300">{idea.complexity}</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>Proposed by {idea.author.name} ({idea.author.handle})</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
              {idea.title}
            </h1>
            <p className="mt-1 text-sm text-neutral-300">{idea.tagline}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-4">
            <button
              onClick={handleCopyRFC}
              title="Copy structured Markdown RFC for GitHub or Hackathons"
              className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
            >
              {copiedMarkdown ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-300">RFC Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="hidden sm:inline">Export Markdown RFC</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Multi-Vector Voting Strip */}
        <div className="border-b border-neutral-800/80 bg-neutral-950/40 px-6 py-3.5">
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Multi-Dimensional Validation & Feasibility Voting
          </div>
          <VoteControls
            votes={idea.votes}
            userVotes={idea.userVotes}
            onVote={(key) => onVote(idea.id, key)}
          />
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-neutral-800/80 bg-neutral-900/90 text-xs font-medium">
          <button
            onClick={() => setActiveTab('spec')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'spec'
                ? 'border-amber-400 text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Full Specification & Feasibility</span>
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'team'
                ? 'border-amber-400 text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Team & Roles ({idea.team.members.length} Joined)</span>
          </button>
          <button
            onClick={() => setActiveTab('discussion')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'discussion'
                ? 'border-amber-400 text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Brainstorming & Feedback ({idea.discussions.length})</span>
          </button>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {activeTab === 'spec' && (
            <>
              {/* SECTION 1: MOTIVATION */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-400 font-display">
                  <Compass className="h-4 w-4" />
                  <span>1. Motivation & The Real-World Gap</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
                    <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      The Real-World Friction
                    </h4>
                    <p className="text-sm text-neutral-200 leading-relaxed">
                      {idea.motivation.problemStatement}
                    </p>
                  </div>

                  <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
                    <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      The Gap (Idea vs Reality vs Skills)
                    </h4>
                    <p className="text-sm text-neutral-200 leading-relaxed">
                      {idea.motivation.theGap}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-300">
                  <div className="rounded-lg bg-neutral-950/40 p-3 border border-neutral-800/80">
                    <span className="font-semibold text-neutral-400">Who Suffers Most: </span>
                    <span>{idea.motivation.whoItAffects}</span>
                  </div>
                  <div className="rounded-lg bg-neutral-950/40 p-3 border border-neutral-800/80">
                    <span className="font-semibold text-neutral-400">Impact If Solved: </span>
                    <span>{idea.motivation.impactIfSolved}</span>
                  </div>
                </div>
              </section>

              {/* SECTION 2: FEASIBILITY & EXECUTION */}
              <section className="space-y-4 pt-4 border-t border-neutral-800/80">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 font-display">
                  <Zap className="h-4 w-4" />
                  <span>2. Feasibility & Architecture Blueprint</span>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                      Why This Is Doable
                    </h4>
                    <p className="text-sm text-neutral-200 leading-relaxed">
                      {idea.feasibility.assessment}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-neutral-400 mb-1.5">Suggested Tech Stack</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {idea.feasibility.suggestedStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-neutral-800 px-2 py-0.5 font-mono text-xs text-neutral-200 border border-neutral-700/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-semibold text-emerald-400">Immediate First Step: </span>
                      <span className="text-neutral-300">{idea.feasibility.firstStep}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-amber-400">Anticipated Bottlenecks: </span>
                      <span className="text-neutral-300">{idea.feasibility.pitfallsAndChallenges}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 3: EXISTING SOLUTIONS & WHY THEY FALL SHORT */}
              <section className="space-y-4 pt-4 border-t border-neutral-800/80">
                <div className="flex items-center gap-2 text-sm font-bold text-sky-400 font-display">
                  <ShieldAlert className="h-4 w-4" />
                  <span>3. Existing Solutions & Why They Aren't Good Enough</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {idea.existingSolutions.alternatives.map((alt, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-3 text-xs"
                    >
                      <div className="flex items-center justify-between font-semibold text-white mb-1">
                        <span>{alt.name}</span>
                        {alt.url && (
                          <a
                            href={alt.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-amber-400"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-neutral-400">{alt.description}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border border-neutral-800/80 bg-neutral-950/80 p-3.5">
                  <h5 className="text-xs font-semibold text-amber-300 mb-1">
                    The Fundamental Failure Mode of Existing Alternatives:
                  </h5>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {idea.existingSolutions.whyTheyFallShort}
                  </p>
                </div>
              </section>

              {/* SECTION 4: PREREQUISITES & DEPENDENCY GRAPH */}
              <section className="space-y-4 pt-4 border-t border-neutral-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-violet-400 font-display">
                    <Link2 className="h-4 w-4" />
                    <span>4. Linked Ideas & Prerequisite Dependencies</span>
                  </div>
                  <button
                    onClick={() => onOpenLinkPrerequisite(idea)}
                    className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Connect Prerequisite</span>
                  </button>
                </div>

                {idea.prerequisites.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-neutral-800 p-4 text-center text-xs text-neutral-500">
                    <p>No prerequisites or child modules connected yet.</p>
                    <button
                      onClick={() => onOpenLinkPrerequisite(idea)}
                      className="mt-1 text-amber-400 hover:underline"
                    >
                      Connect this to an existing problem or solution in the Commons
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {idea.prerequisites.map((prereq, idx) => {
                      const linked = allIdeas.find((i) => i.id === prereq.targetId);
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950/60 p-3 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-[10px] text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20 uppercase">
                              {prereq.relationship.replace(/_/g, ' ')}
                            </span>
                            <div>
                              <div className="font-semibold text-white">
                                {linked ? linked.title : prereq.targetId}
                              </div>
                              {prereq.note && (
                                <p className="text-[11px] text-neutral-400 mt-0.5">{prereq.note}</p>
                              )}
                            </div>
                          </div>

                          {linked && (
                            <button
                              onClick={() => onSelectOtherIdea(linked)}
                              className="flex items-center gap-1 rounded bg-neutral-800 px-2.5 py-1 font-medium text-neutral-200 hover:bg-neutral-700 transition-colors"
                            >
                              <span>View Linked Idea</span>
                              <ArrowUpRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}

          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-display">Builder Roster & Open Vacancies</h3>
                  <p className="text-xs text-neutral-400">
                    People with skills who want to transform this proposal into a functional public good
                  </p>
                </div>
                <button
                  onClick={() => onOpenJoinTeam(idea)}
                  className="rounded-lg bg-amber-400 px-3.5 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-amber-300"
                >
                  Join This Team
                </button>
              </div>

              {/* Roles required checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Roles & Domain Skills Needed
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {idea.skillsNeeded.map((sn, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-3 text-xs"
                    >
                      <div className="flex items-center justify-between font-semibold text-white">
                        <span>{sn.skill}</span>
                        <span className="font-mono text-neutral-400 tabular-nums">
                          {sn.filledCount}/{sn.targetCount} Filled
                        </span>
                      </div>
                      <p className="mt-1 text-neutral-400 text-[11px]">{sn.roleDescription}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assembled members list */}
              <div className="space-y-2 pt-4 border-t border-neutral-800">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Current Builder Team ({idea.team.members.length})
                </h4>

                {idea.team.members.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-neutral-800 p-6 text-center text-xs text-neutral-500">
                    No builders have officially joined yet. Be the first to claim a role!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {idea.team.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-start justify-between rounded-lg border border-neutral-800 bg-neutral-950/40 p-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{member.name}</span>
                            <span className="text-neutral-500">{member.handle}</span>
                            <span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-medium text-violet-300 border border-violet-500/30">
                              {member.role}
                            </span>
                          </div>
                          {member.message && (
                            <p className="mt-1 text-neutral-300 text-[11px] italic">
                              "{member.message}"
                            </p>
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          Joined {member.joinedAt}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'discussion' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white font-display">Constructive Brainstorming & Feedback</h3>
                <p className="text-xs text-neutral-400">
                  Refine the feasibility, suggest alternative tooling, or share real-world edge cases
                </p>
              </div>

              {/* Add feedback box */}
              <form onSubmit={handlePostComment} className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    placeholder="Your name or handle (e.g. Alex @alex_eng)"
                    className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                  <select
                    value={commentSection}
                    onChange={(e) => setCommentSection(e.target.value as DiscussionItem['sectionRef'])}
                    className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-300 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="general">General Feedback</option>
                    <option value="feasibility">Feasibility & Tech Critique</option>
                    <option value="motivation">Problem Validation / Edge Cases</option>
                    <option value="existing_solutions">Alternative Existing Tools</option>
                    <option value="team">Builder / Contributor Proposal</option>
                  </select>
                </div>

                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share a constructive suggestion, technical nuance, or problem validation insight..."
                  className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="flex items-center gap-1.5 rounded-md bg-amber-400 px-4 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-amber-300 disabled:opacity-40"
                  >
                    <Send className="h-3 w-3" />
                    <span>Post Contribution</span>
                  </button>
                </div>
              </form>

              {/* Feed of comments */}
              <div className="space-y-3">
                {idea.discussions.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-neutral-800 p-6 text-center text-xs text-neutral-500">
                    No community notes yet. Share the first feedback note!
                  </div>
                ) : (
                  idea.discussions.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-3.5 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{item.author}</span>
                          <span className="text-neutral-500">{item.handle}</span>
                          {item.sectionRef && (
                            <span className="text-[10px] text-amber-400/80 bg-amber-400/10 px-1.5 py-0.2 rounded font-mono uppercase">
                              {item.sectionRef.replace(/_/g, ' ')}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-500">{item.createdAt}</span>
                      </div>
                      <p className="text-neutral-200 leading-relaxed text-xs">{item.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-950/80 px-6 py-3 text-xs">
          <div className="text-neutral-400">
            Open for collaborative realization. All specifications are public domain.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenJoinTeam(idea)}
              className="flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-1.5 font-semibold text-neutral-950 hover:bg-amber-300 transition-colors"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Join Builder Team</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
