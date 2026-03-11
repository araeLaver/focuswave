'use client';
import { useTimer } from '@/lib/timer';
import { MODE_LABELS, TimerMode } from '@/lib/types';
import Link from 'next/link';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const MODES: TimerMode[] = ['focus', 'short_break', 'long_break'];

const MOTIVATIONS = [
  '잘했어요! 🎉 짧은 휴식을 취하세요.',
  '훌륭해요! 🌊 한 세션 완료!',
  '집중력 최고! ⚡ 계속 파이팅!',
];

export default function Timer() {
  const { mode, timeLeft, isRunning, progress, completedSessions, changeMode, setIsRunning, reset } = useTimer();

  const circumference = 2 * Math.PI * 120;
  const offset = circumference * (1 - progress);

  const isComplete = timeLeft === 0;
  const motivation = MOTIVATIONS[completedSessions % MOTIVATIONS.length];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold text-indigo-400 mb-1">FocusWave 🌊</h1>
      <p className="text-gray-500 text-sm mb-8">오늘 완료: {completedSessions}세션</p>

      {/* Mode selector */}
      <div className="flex gap-2 mb-10">
        {MODES.map(m => (
          <button
            key={m}
            onClick={() => changeMode(m)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              mode === m
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Circular timer */}
      <div className="relative mb-6">
        <svg width="280" height="280" className="-rotate-90">
          <circle cx="140" cy="140" r="120" fill="none" stroke="#1f2937" strokeWidth="12" />
          <circle
            cx="140" cy="140" r="120" fill="none"
            stroke={isComplete ? '#10b981' : '#6366f1'}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-mono font-bold tracking-tight">{formatTime(timeLeft)}</span>
          <span className="text-gray-400 text-sm mt-1">{MODE_LABELS[mode]}</span>
        </div>
      </div>

      {/* Motivation message */}
      {isComplete && (
        <p className="text-green-400 text-sm mb-4 animate-pulse">{motivation}</p>
      )}

      {/* Controls */}
      <div className="flex gap-4 mb-12">
        <button
          onClick={() => setIsRunning(!isRunning)}
          disabled={isComplete}
          className="w-24 h-12 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl font-semibold transition-all active:scale-95"
        >
          {isRunning ? '일시정지' : '시작'}
        </button>
        <button
          onClick={reset}
          className="w-24 h-12 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold transition-all active:scale-95"
        >
          초기화
        </button>
      </div>

      {/* Ad placeholder */}
      <div className="w-full max-w-sm h-16 bg-gray-900 border border-dashed border-gray-700 rounded-lg flex items-center justify-center text-gray-600 text-xs mb-6">
        광고 영역 (Google AdSense)
      </div>

      <Link href="/stats" className="text-indigo-400 hover:text-indigo-300 text-sm underline">
        통계 보기 →
      </Link>
    </div>
  );
}
