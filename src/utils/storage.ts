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
    return parsed;
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
