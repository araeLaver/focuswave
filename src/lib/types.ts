export interface Session {
  id: string;
  type: 'focus' | 'short_break' | 'long_break';
  duration: number;
  completedAt: string;
}

export type TimerMode = 'focus' | 'short_break' | 'long_break';

export const TIMER_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
};

export const MODE_LABELS: Record<TimerMode, string> = {
  focus: '집중',
  short_break: '짧은 휴식',
  long_break: '긴 휴식',
};
