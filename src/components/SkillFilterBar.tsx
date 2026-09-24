import React from 'react';
import { Search, SlidersHorizontal, Check, X, ArrowUpDown } from 'lucide-react';
import { SortOption } from '../types';

interface SkillFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
  typeFilter: 'all' | 'problem' | 'idea' | 'team_forming';
  onTypeFilterChange: (type: 'all' | 'problem' | 'idea' | 'team_forming') => void;
  filterByMySkills: boolean;
  onToggleMySkills: () => void;
  userSkills: string[];
  onOpenSkillConfig: () => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SkillFilterBar: React.FC<SkillFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
  typeFilter,
  onTypeFilterChange,
  filterByMySkills,
  onToggleMySkills,
  userSkills,
  onOpenSkillConfig,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="space-y-3.5 border-b border-neutral-800/80 pb-5">
      {/* Search and primary controls row */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search problems, tech stacks, or keywords (e.g. NFC, bakery, noise, canvas)..."
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900/80 py-2 pl-9 pr-8 text-sm text-neutral-100 placeholder-neutral-500 transition-colors focus:border-amber-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-xs text-neutral-300">
            <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400" />
            <span className="text-neutral-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent font-medium text-neutral-200 focus:outline-none cursor-pointer"
            >
              <option value="most_validated" className="bg-neutral-900 text-neutral-200">
                Most Validated ("I Have This Problem")
              </option>
              <option value="highest_feasible" className="bg-neutral-900 text-neutral-200">
                Highest Feasibility ("Most Doable")
              </option>
              <option value="most_upvoted" className="bg-neutral-900 text-neutral-200">
                Top Voted ("Good Concept")
              </option>
              <option value="builders_wanted" className="bg-neutral-900 text-neutral-200">
                Builder Interest ("Want to Build")
              </option>
              <option value="newest" className="bg-neutral-900 text-neutral-200">
                Recently Added
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Segmented Type filter + Skill Match toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1 p-1 bg-neutral-900/80 border border-neutral-800/80 rounded-lg">
          <button
            onClick={() => onTypeFilterChange('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              typeFilter === 'all'
                ? 'bg-neutral-800 text-white font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All Submissions
          </button>
          <button
            onClick={() => onTypeFilterChange('problem')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              typeFilter === 'problem'
                ? 'bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/40'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Real-World Problems
          </button>
          <button
            onClick={() => onTypeFilterChange('idea')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              typeFilter === 'idea'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Solvable Ideas
          </button>
          <button
            onClick={() => onTypeFilterChange('team_forming')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              typeFilter === 'team_forming'
                ? 'bg-violet-500/20 text-violet-300 font-semibold border border-violet-500/40'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Teams Forming
          </button>
        </div>

        {/* Skill matching filter button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMySkills}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              filterByMySkills
                ? 'border-amber-400 bg-amber-400/15 text-amber-300 font-semibold'
                : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
            }`}
          >
            <div
              className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border ${
                filterByMySkills ? 'border-amber-400 bg-amber-400 text-neutral-950' : 'border-neutral-600'
              }`}
            >
              {filterByMySkills && <Check className="h-2.5 w-2.5 stroke-[3]" />}
            </div>
            <span>Needs My Skills ({userSkills.length})</span>
          </button>

          <button
            onClick={onOpenSkillConfig}
            className="text-xs text-neutral-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
          >
            Edit Skills
          </button>
        </div>
      </div>

      {/* Categories scroller */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 text-xs">
        <span className="text-neutral-500 shrink-0 text-[11px] font-medium uppercase tracking-wider mr-1">
          Category:
        </span>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`whitespace-nowrap shrink-0 rounded-md px-2.5 py-1 font-medium transition-colors ${
                isSelected
                  ? 'bg-neutral-200 text-neutral-950 font-semibold'
                  : 'bg-neutral-900/60 text-neutral-400 border border-neutral-800/80 hover:border-neutral-700 hover:text-neutral-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
