export type IdeaType = 'problem' | 'idea';

export type IdeaComplexity = 'Weekend Prototype' | '1-Month MVP' | 'Multi-Month Project';

export type TeamStatus = 'open_for_builders' | 'team_forming' | 'in_development' | 'shipped';

export interface Author {
  name: string;
  handle: string;
  role?: string;
  avatarSeed?: string;
}

export interface SkillRequirement {
  skill: string;
  roleDescription: string;
  filledCount: number;
  targetCount: number;
}

export interface PrerequisiteLink {
  targetId: string;
  relationship: 'prerequisite_for' | 'blocked_by' | 'child_of' | 'alternative_to' | 'related';
  note?: string;
}

export interface ExistingSolution {
  name: string;
  url?: string;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  handle: string;
  role: string;
  skill: string;
  joinedAt: string;
  message?: string;
}

export interface DiscussionItem {
  id: string;
  author: string;
  handle: string;
  role?: string;
  sectionRef?: 'general' | 'motivation' | 'feasibility' | 'existing_solutions' | 'team';
  content: string;
  createdAt: string;
  likes: number;
}

export interface IdeaVotes {
  goodIdea: number;
  feasible: number;
  haveThisProblem: number;
  wantToBuild: number;
}

export interface UserVotes {
  goodIdea?: boolean;
  feasible?: boolean;
  haveThisProblem?: boolean;
  wantToBuild?: boolean;
}

export interface Idea {
  id: string;
  title: string;
  type: IdeaType;
  tagline: string;
  category: string;
  complexity: IdeaComplexity;
  author: Author;
  createdAt: string;
  motivation: {
    problemStatement: string;
    theGap: string;
    whoItAffects: string;
    impactIfSolved: string;
  };
  feasibility: {
    assessment: string;
    suggestedStack: string[];
    firstStep: string;
    pitfallsAndChallenges: string;
  };
  existingSolutions: {
    alternatives: ExistingSolution[];
    whyTheyFallShort: string;
  };
  skillsNeeded: SkillRequirement[];
  prerequisites: PrerequisiteLink[];
  votes: IdeaVotes;
  userVotes?: UserVotes;
  team: {
    status: TeamStatus;
    members: TeamMember[];
  };
  discussions: DiscussionItem[];
  saved?: boolean;
}

export type SortOption =
  | 'most_validated'
  | 'highest_feasible'
  | 'most_upvoted'
  | 'builders_wanted'
  | 'newest';
