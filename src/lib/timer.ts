'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerMode, TIMER_DURATIONS } from './types';
import { saveSession } from './storage';

function playBeep() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
  } catch {
    // audio not supported
  }
}

export function useTimer() {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS['focus']);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(TIMER_DURATIONS['focus']);

  const reset = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const duration = TIMER_DURATIONS[mode];
    setTimeLeft(duration);
    startTimeRef.current = duration;
  }, [mode]);

  const changeMode = useCallback((newMode: TimerMode) => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setMode(newMode);
    const duration = TIMER_DURATIONS[newMode];
    setTimeLeft(duration);
    startTimeRef.current = duration;
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            playBeep();
            saveSession({
              id: Date.now().toString(),
              type: mode,
              duration: startTimeRef.current,
              completedAt: new Date().toISOString(),
            });
            if (mode === 'focus') setCompletedSessions(c => c + 1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode]);

  const total = TIMER_DURATIONS[mode];
  const progress = (total - timeLeft) / total;

  return { mode, timeLeft, isRunning, progress, completedSessions, changeMode, setIsRunning, reset };
}
