import React, { useState, useEffect, useMemo } from 'react';
import { Idea, IdeaVotes, PrerequisiteLink, SkillRequirement, SortOption, TeamMember, DiscussionItem } from './types';
import {
  loadIdeasFromStorage,
  saveIdeasToStorage,
  loadUserSkills,
  saveUserSkills,
} from './utils/storage';
import { TopNav } from './components/TopNav';
import { SkillFilterBar } from './components/SkillFilterBar';
import { IdeaCard } from './components/IdeaCard';
import { IdeaDetailModal } from './components/IdeaDetailModal';
import { SubmitIdeaModal } from './components/SubmitIdeaModal';
import { SkillConfigModal } from './components/SkillConfigModal';
import { TeamJoinModal } from './components/TeamJoinModal';
import { PrerequisiteLinkModal } from './components/PrerequisiteLinkModal';
import { IdeaNetworkView } from './components/IdeaNetworkView';
import { TeamsDashboardView } from './components/TeamsDashboardView';
import { ManifestoModal } from './components/ManifestoModal';
import { Lightbulb, Plus, Sparkles, Filter, Link2 } from 'lucide-react';

export default function App() {
  // Core state
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Active Main View
  const [activeView, setActiveView] = useState<'commons' | 'graph' | 'teams' | 'manifesto'>('commons');

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [typeFilter, setTypeFilter] = useState<'all' | 'problem' | 'idea' | 'team_forming'>('all');
  const [filterByMySkills, setFilterByMySkills] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('most_validated');

  // Modals state
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isJoinTeamModalOpen, setIsJoinTeamModalOpen] = useState(false);
  const [ideaForTeamJoin, setIdeaForTeamJoin] = useState<Idea | null>(null);
  const [isLinkPrereqModalOpen, setIsLinkPrereqModalOpen] = useState(false);
  const [ideaForLinkPrereq, setIdeaForLinkPrereq] = useState<Idea | null>(null);
  const [isManifestoModalOpen, setIsManifestoModalOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const loadedIdeas = loadIdeasFromStorage();
    const loadedSkills = loadUserSkills();
    setIdeas(loadedIdeas);
    setUserSkills(loadedSkills);
    setIsInitialized(true);
  }, []);

  // Update storage on ideas mutation
  const updateIdeasAndPersist = (updated: Idea[]) => {
    setIdeas(updated);
    saveIdeasToStorage(updated);
    // If an idea is currently selected in detail view, keep it synced
    if (selectedIdea) {
      const refreshed = updated.find((i) => i.id === selectedIdea.id);
      if (refreshed) {
        setSelectedIdea(refreshed);
      }
    }
  };

  // Skill save
  const handleSaveUserSkills = (newSkills: string[]) => {
    setUserSkills(newSkills);
    saveUserSkills(newSkills);
  };

  // Multi-vector voting
  const handleVote = (ideaId: string, voteKey: keyof IdeaVotes) => {
    const updated = ideas.map((idea) => {
      if (idea.id !== ideaId) return idea;

      const currentVotes = { ...idea.votes };
      const currentUserVotes = { ...(idea.userVotes || {}) };
      const isAlreadyVoted = !!currentUserVotes[voteKey];

      if (isAlreadyVoted) {
        currentVotes[voteKey] = Math.max(0, (currentVotes[voteKey] || 1) - 1);
        currentUserVotes[voteKey] = false;
      } else {
        currentVotes[voteKey] = (currentVotes[voteKey] || 0) + 1;
        currentUserVotes[voteKey] = true;
      }

      return {
        ...idea,
        votes: currentVotes,
        userVotes: currentUserVotes,
      };
    });

    updateIdeasAndPersist(updated);
  };

  // Add new idea
  const handleCreateIdea = (newIdea: Idea) => {
    const updated = [newIdea, ...ideas];
    updateIdeasAndPersist(updated);
    setSelectedIdea(newIdea);
  };

  // Join Team
  const handleJoinTeam = (ideaId: string, member: TeamMember) => {
    const updated = ideas.map((idea) => {
      if (idea.id !== ideaId) return idea;

      // Update skills filled count if matching
      const updatedSkillsNeeded = idea.skillsNeeded.map((sn) => {
        if (sn.skill.toLowerCase() === member.skill.toLowerCase()) {
          return {
            ...sn,
            filledCount: Math.min(sn.targetCount, sn.filledCount + 1),
          };
        }
        return sn;
      });

      const updatedMembers = [...idea.team.members, member];
      const newStatus =
        idea.team.status === 'open_for_builders' ? 'team_forming' : idea.team.status;

      return {
        ...idea,
        team: {
          ...idea.team,
          status: newStatus,
          members: updatedMembers,
        },
        skillsNeeded: updatedSkillsNeeded,
        votes: {
          ...idea.votes,
          wantToBuild: (idea.votes.wantToBuild || 0) + 1,
        },
        userVotes: {
          ...idea.userVotes,
          wantToBuild: true,
        },
      };
    });

    updateIdeasAndPersist(updated);
  };

  // Add Prerequisite Link
  const handleAddPrerequisiteLink = (ideaId: string, link: PrerequisiteLink) => {
    const updated = ideas.map((idea) => {
      if (idea.id !== ideaId) return idea;
      return {
        ...idea,
        prerequisites: [...idea.prerequisites, link],
      };
    });

    updateIdeasAndPersist(updated);
  };

  // Add Discussion note
  const handleAddDiscussion = (ideaId: string, item: DiscussionItem) => {
    const updated = ideas.map((idea) => {
      if (idea.id !== ideaId) return idea;
      return {
        ...idea,
        discussions: [item, ...idea.discussions],
      };
    });

    updateIdeasAndPersist(updated);
  };

  // All categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    ideas.forEach((i) => set.add(i.category));
    return ['All Categories', ...Array.from(set)];
  }, [ideas]);

  // Filtered & Sorted Ideas
  const filteredIdeas = useMemo(() => {
    let result = [...ideas];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.tagline.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.motivation.problemStatement.toLowerCase().includes(q) ||
          i.feasibility.suggestedStack.some((s) => s.toLowerCase().includes(q)) ||
          i.skillsNeeded.some((s) => s.skill.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'All Categories') {
      result = result.filter((i) => i.category === selectedCategory);
    }

    // Type / Status filter
    if (typeFilter === 'problem') {
      result = result.filter((i) => i.type === 'problem');
    } else if (typeFilter === 'idea') {
      result = result.filter((i) => i.type === 'idea');
    } else if (typeFilter === 'team_forming') {
      result = result.filter((i) => i.team.status === 'team_forming' || i.team.members.length > 0);
    }

    // Filter by User's Skills
    if (filterByMySkills) {
      result = result.filter((idea) =>
        idea.skillsNeeded.some((sn) =>
          userSkills.some(
            (us) =>
              us.toLowerCase() === sn.skill.toLowerCase() ||
              sn.skill.toLowerCase().includes(us.toLowerCase()) ||
              us.toLowerCase().includes(sn.skill.toLowerCase())
          )
        )
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'most_validated') {
        return (b.votes.haveThisProblem || 0) - (a.votes.haveThisProblem || 0);
      }
      if (sortBy === 'highest_feasible') {
        return (b.votes.feasible || 0) - (a.votes.feasible || 0);
      }
      if (sortBy === 'most_upvoted') {
        return (b.votes.goodIdea || 0) - (a.votes.goodIdea || 0);
      }
      if (sortBy === 'builders_wanted') {
        return (b.votes.wantToBuild || 0) - (a.votes.wantToBuild || 0);
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return result;
  }, [ideas, searchQuery, selectedCategory, typeFilter, filterByMySkills, userSkills, sortBy]);

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-950 text-neutral-400">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          <span className="text-xs font-mono">Loading Unbuilt Commons...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Nav adhering to Top Bar Contract */}
      <TopNav
        activeView={activeView}
        onSelectView={(view) => {
          if (view === 'manifesto') {
            setIsManifestoModalOpen(true);
          } else {
            setActiveView(view);
          }
        }}
        onOpenSubmit={() => setIsSubmitModalOpen(true)}
        onOpenSkills={() => setIsSkillModalOpen(true)}
        userSkillsCount={userSkills.length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'commons' && (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8">
              <div className="max-w-3xl">
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                  Public Domain Repository & Team Assembly
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-display">
                  Where unbuilt ideas find builders, and real-world friction finds solutions.
                </h1>
                <p className="mt-3 text-sm text-neutral-300 leading-relaxed max-w-2xl">
                  Have an acute problem or a feasible system design you won't have time to build alone?
                  Donate it here. Vote on feasibility, link prerequisites, and match with skilled builders to form teams.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-300 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Donate Idea or Problem</span>
                  </button>
                  <button
                    onClick={() => setActiveView('teams')}
                    className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800/80 px-4 py-2 text-xs font-semibold text-neutral-200 hover:text-white hover:border-neutral-600 transition-colors"
                  >
                    <span>Browse Open Roles by Skill</span>
                  </button>
                  <button
                    onClick={() => setIsManifestoModalOpen(true)}
                    className="text-xs text-neutral-400 hover:text-amber-300 underline underline-offset-4 ml-1 transition-colors"
                  >
                    Why this exists
                  </button>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <SkillFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categories={categories}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              filterByMySkills={filterByMySkills}
              onToggleMySkills={() => setFilterByMySkills(!filterByMySkills)}
              userSkills={userSkills}
              onOpenSkillConfig={() => setIsSkillModalOpen(true)}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Results count & active filters display */}
            <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
              <div>
                Showing <span className="font-mono text-white font-semibold tabular-nums">{filteredIdeas.length}</span>{' '}
                {filteredIdeas.length === 1 ? 'submission' : 'submissions'}
                {filterByMySkills && (
                  <span className="text-amber-400 ml-1.5 font-medium">
                    (Filtered to your {userSkills.length} skills)
                  </span>
                )}
              </div>
              {(searchQuery || selectedCategory !== 'All Categories' || typeFilter !== 'all' || filterByMySkills) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All Categories');
                    setTypeFilter('all');
                    setFilterByMySkills(false);
                  }}
                  className="text-amber-400 hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Ideas Grid */}
            {filteredIdeas.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-800 p-12 text-center">
                <Lightbulb className="mx-auto h-8 w-8 text-neutral-600 mb-3" />
                <h3 className="text-base font-semibold text-white font-display">No submissions match this criteria</h3>
                <p className="mt-1 text-xs text-neutral-400 max-w-sm mx-auto">
                  Try adjusting your search terms, changing the category, or clearing the skill matching filter.
                </p>
                <button
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-amber-300"
                >
                  <Plus className="h-4 w-4" />
                  <span>Donate an Idea for this topic</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredIdeas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    userSkills={userSkills}
                    onSelect={(selected) => setSelectedIdea(selected)}
                    onVote={handleVote}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeView === 'graph' && (
          <IdeaNetworkView
            ideas={ideas}
            onSelectIdea={(selected) => setSelectedIdea(selected)}
            onOpenLinkPrereq={(idea) => {
              setIdeaForLinkPrereq(idea);
              setIsLinkPrereqModalOpen(true);
            }}
          />
        )}

        {activeView === 'teams' && (
          <TeamsDashboardView
            ideas={ideas}
            userSkills={userSkills}
            onOpenSkillConfig={() => setIsSkillModalOpen(true)}
            onSelectIdea={(selected) => setSelectedIdea(selected)}
            onOpenJoinTeam={(idea) => {
              setIdeaForTeamJoin(idea);
              setIsJoinTeamModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-800/80 bg-neutral-950 py-8 text-xs text-neutral-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-400 font-display">Unbuilt</span>
            <span>·</span>
            <span>All shared ideas are released to the public domain (CC0).</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsManifestoModalOpen(true)}
              className="hover:text-neutral-300 transition-colors"
            >
              The Manifesto
            </button>
            <button
              onClick={() => setActiveView('graph')}
              className="hover:text-neutral-300 transition-colors"
            >
              Dependency Graph
            </button>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="text-amber-400 hover:text-amber-300 transition-colors font-semibold"
            >
              + Donate Idea
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {selectedIdea && (
        <IdeaDetailModal
          idea={selectedIdea}
          onClose={() => setSelectedIdea(null)}
          allIdeas={ideas}
          onSelectOtherIdea={(other) => setSelectedIdea(other)}
          onVote={handleVote}
          onOpenJoinTeam={(idea) => {
            setIdeaForTeamJoin(idea);
            setIsJoinTeamModalOpen(true);
          }}
          onOpenLinkPrerequisite={(idea) => {
            setIdeaForLinkPrereq(idea);
            setIsLinkPrereqModalOpen(true);
          }}
          onAddDiscussion={handleAddDiscussion}
        />
      )}

      {isSubmitModalOpen && (
        <SubmitIdeaModal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          existingIdeas={ideas}
          onSubmitIdea={handleCreateIdea}
        />
      )}

      {isSkillModalOpen && (
        <SkillConfigModal
          isOpen={isSkillModalOpen}
          onClose={() => setIsSkillModalOpen(false)}
          userSkills={userSkills}
          onSaveSkills={handleSaveUserSkills}
        />
      )}

      {isJoinTeamModalOpen && ideaForTeamJoin && (
        <TeamJoinModal
          isOpen={isJoinTeamModalOpen}
          onClose={() => {
            setIsJoinTeamModalOpen(false);
            setIdeaForTeamJoin(null);
          }}
          idea={ideaForTeamJoin}
          userSkills={userSkills}
          onJoinTeam={handleJoinTeam}
        />
      )}

      {isLinkPrereqModalOpen && ideaForLinkPrereq && (
        <PrerequisiteLinkModal
          isOpen={isLinkPrereqModalOpen}
          onClose={() => {
            setIsLinkPrereqModalOpen(false);
            setIdeaForLinkPrereq(null);
          }}
          currentIdea={ideaForLinkPrereq}
          allIdeas={ideas}
          onAddLink={handleAddPrerequisiteLink}
        />
      )}

      <ManifestoModal
        isOpen={isManifestoModalOpen}
        onClose={() => setIsManifestoModalOpen(false)}
        onOpenSubmit={() => setIsSubmitModalOpen(true)}
      />
    </div>
  );
}
