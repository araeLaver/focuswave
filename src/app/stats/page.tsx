'use client';
import { useEffect, useState } from 'react';
import { Session } from '@/lib/types';
import { getSessions, getTodaySessions, getWeeklySessions } from '@/lib/storage';
import Link from 'next/link';

function formatMinutes(seconds: number) {
  return Math.round(seconds / 60);
}

export default function StatsPage() {
  const [today, setToday] = useState<Session[]>([]);
  const [weekly, setWeekly] = useState<Session[]>([]);
  const [total, setTotal] = useState<Session[]>([]);

  useEffect(() => {
    setToday(getTodaySessions());
    setWeekly(getWeeklySessions());
    setTotal(getSessions());
  }, []);

  const todayFocus = today.filter(s => s.type === 'focus');
  const todayMinutes = todayFocus.reduce((acc, s) => acc + s.duration, 0);
  const totalFocusSessions = total.filter(s => s.type === 'focus').length;
  const totalMinutes = total.filter(s => s.type === 'focus').reduce((acc, s) => acc + s.duration, 0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const weeklyData = days.map(day => {
    const dayStr = day.toDateString();
    const sessions = weekly.filter(
      s => new Date(s.completedAt).toDateString() === dayStr && s.type === 'focus'
    );
    return {
      label: day.toLocaleDateString('ko-KR', { weekday: 'short' }),
      count: sessions.length,
    };
  });

  const maxCount = Math.max(...weeklyData.map(d => d.count), 1);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-indigo-400">통계 📊</h1>
        <Link href="/" className="text-gray-400 hover:text-white text-sm">
          ← 타이머
        </Link>
      </div>

      {/* Today stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">오늘 집중 세션</p>
          <p className="text-3xl font-bold">{todayFocus.length}</p>
          <p className="text-gray-500 text-xs mt-1">세션</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">오늘 집중 시간</p>
          <p className="text-3xl font-bold">{formatMinutes(todayMinutes)}</p>
          <p className="text-gray-500 text-xs mt-1">분</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">총 세션</p>
          <p className="text-3xl font-bold">{totalFocusSessions}</p>
          <p className="text-gray-500 text-xs mt-1">누적</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">총 집중 시간</p>
          <p className="text-3xl font-bold">{formatMinutes(totalMinutes)}</p>
          <p className="text-gray-500 text-xs mt-1">분</p>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="bg-gray-900 rounded-xl p-4 mb-8">
        <p className="text-gray-400 text-sm mb-4">이번 주 집중 세션</p>
        <div className="flex items-end gap-2 h-28">
          {weeklyData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-gray-500 text-xs">{d.count > 0 ? d.count : ''}</span>
              <div
                className="w-full bg-indigo-600 rounded-t transition-all"
                style={{
                  height: `${(d.count / maxCount) * 72}px`,
                  minHeight: d.count > 0 ? '6px' : '2px',
                  opacity: d.count > 0 ? 1 : 0.2,
                }}
              />
              <span className="text-gray-500 text-xs">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent sessions */}
      <div>
        <p className="text-gray-400 text-sm mb-3">오늘 세션</p>
        {today.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-8">
            오늘 완료된 세션이 없습니다.<br />
            <span className="text-indigo-400">첫 집중 세션을 시작해보세요! 🎯</span>
          </p>
        ) : (
          <div className="space-y-2">
            {[...today].reverse().slice(0, 10).map(s => (
              <div
                key={s.id}
                className="bg-gray-900 rounded-lg px-4 py-3 flex justify-between items-center"
              >
                <span className="text-sm">
                  {s.type === 'focus'
                    ? '🎯 집중'
                    : s.type === 'short_break'
                    ? '☕ 짧은 휴식'
                    : '🌿 긴 휴식'}
                </span>
                <span className="text-gray-400 text-xs">
                  {new Date(s.completedAt).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
