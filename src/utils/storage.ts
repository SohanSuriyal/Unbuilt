import { Idea } from '../types';
import { INITIAL_IDEAS } from '../data/initialIdeas';

const STORAGE_KEY_IDEAS = 'unbuilt_ideas_v1';
const STORAGE_KEY_USER_SKILLS = 'unbuilt_user_skills_v1';
const STORAGE_KEY_SAVED_IDEAS = 'unbuilt_saved_ids_v1';

export function loadIdeasFromStorage(): Idea[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_IDEAS);
    if (!raw) {
      saveIdeasToStorage(INITIAL_IDEAS);
      return INITIAL_IDEAS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return INITIAL_IDEAS;
    }
    // Merge new initial ideas that aren't yet in localStorage
    const parsedIds = new Set(parsed.map((i: Idea) => i.id));
    const missingInitials = INITIAL_IDEAS.filter((init) => !parsedIds.has(init.id));

    // Also update prerequisites for existing initial ideas if initial has more defined connections
    const merged = [...parsed, ...missingInitials].map((idea: Idea) => {
      const initial = INITIAL_IDEAS.find((i) => i.id === idea.id);
      if (initial && initial.prerequisites.length > (idea.prerequisites?.length || 0)) {
        return {
          ...idea,
          prerequisites: initial.prerequisites,
        };
      }
      return idea;
    });
    return merged;
  } catch (err) {
    console.error('Failed to load ideas from localStorage', err);
    return INITIAL_IDEAS;
  }
}

export function saveIdeasToStorage(ideas: Idea[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_IDEAS, JSON.stringify(ideas));
  } catch (err) {
    console.error('Failed to save ideas to localStorage', err);
  }
}

export function loadUserSkills(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER_SKILLS);
    if (!raw) return ['Frontend Architecture', 'UI/UX Design'];
    return JSON.parse(raw);
  } catch {
    return ['Frontend Architecture', 'UI/UX Design'];
  }
}

export function saveUserSkills(skills: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_USER_SKILLS, JSON.stringify(skills));
  } catch (err) {
    console.error('Failed to save user skills', err);
  }
}

export function loadSavedIdeaIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_IDEAS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveSavedIdeaIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SAVED_IDEAS, JSON.stringify(ids));
  } catch (err) {
    console.error('Failed to save saved ideas', err);
  }
}

// Canvas-specific persistence types
export interface CanvasPositionMap {
  [ideaId: string]: { x: number; y: number };
}

export interface CanvasGroup {
  id: string;
  title: string;
  color: string; // e.g. 'amber' | 'sky' | 'emerald' | 'purple' | 'neutral'
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasViewport {
  x: number;
  y: number;
  scale: number;
}

const STORAGE_KEY_CANVAS_POSITIONS = 'unbuilt_canvas_positions_v1';
const STORAGE_KEY_CANVAS_HIDDEN = 'unbuilt_canvas_hidden_ids_v1';
const STORAGE_KEY_CANVAS_GROUPS = 'unbuilt_canvas_groups_v1';
const STORAGE_KEY_CANVAS_VIEWPORT = 'unbuilt_canvas_viewport_v1';

export function loadCanvasPositions(): CanvasPositionMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CANVAS_POSITIONS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveCanvasPositions(positions: CanvasPositionMap): void {
  try {
    localStorage.setItem(STORAGE_KEY_CANVAS_POSITIONS, JSON.stringify(positions));
  } catch (err) {
    console.error('Failed to save canvas positions', err);
  }
}

export function loadCanvasHiddenIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CANVAS_HIDDEN);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCanvasHiddenIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CANVAS_HIDDEN, JSON.stringify(ids));
  } catch (err) {
    console.error('Failed to save canvas hidden ids', err);
  }
}

export function loadCanvasGroups(): CanvasGroup[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CANVAS_GROUPS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCanvasGroups(groups: CanvasGroup[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CANVAS_GROUPS, JSON.stringify(groups));
  } catch (err) {
    console.error('Failed to save canvas groups', err);
  }
}

export function loadCanvasViewport(): CanvasViewport | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CANVAS_VIEWPORT);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveCanvasViewport(vp: CanvasViewport): void {
  try {
    localStorage.setItem(STORAGE_KEY_CANVAS_VIEWPORT, JSON.stringify(vp));
  } catch (err) {
    console.error('Failed to save canvas viewport', err);
  }
}
