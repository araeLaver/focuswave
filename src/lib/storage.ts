import { Session } from './types';

const STORAGE_KEY = 'focuswave_sessions';

export function getSessions(): Session[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveSession(session: Session): void {
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function getTodaySessions(): Session[] {
  const today = new Date().toDateString();
  return getSessions().filter(s => new Date(s.completedAt).toDateString() === today);
}

export function getWeeklySessions(): Session[] {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return getSessions().filter(s => new Date(s.completedAt) > weekAgo);
}
