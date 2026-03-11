import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FocusWave — 집중 타이머',
  description: '25분 집중, 5분 휴식. 당신의 생산성 파트너.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-950">{children}</body>
    </html>
  );
}
