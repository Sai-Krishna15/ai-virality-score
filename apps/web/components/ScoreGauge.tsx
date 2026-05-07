'use client';

import { useEffect, useState } from 'react';
import { scoreColor, scoreLabel } from '@/lib/utils';

interface Props { score: number }

export default function ScoreGauge({ score }: Props) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let raf: number;
    const duration = 1000;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * score));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - displayed / 100);

  const [ringColor, glowColor] =
    score >= 70
      ? ['#34d399', 'rgba(52,211,153,0.3)']
      : score >= 40
      ? ['#fbbf24', 'rgba(251,191,36,0.3)']
      : ['#f87171', 'rgba(248,113,113,0.3)'];

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div className="relative w-36 h-36">
        {/* Glow ring behind */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke={glowColor} strokeWidth="14" />
        </svg>
        {/* Track */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        </svg>
        {/* Progress */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60" cy="60" r={r}
            fill="none"
            stroke={ringColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 16ms linear' }}
          />
        </svg>
        {/* Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className={`text-3xl font-extrabold tabular-nums leading-none ${scoreColor(displayed)}`}>
            {displayed}
          </span>
          <span className="text-[10px] text-white/30 font-medium tracking-wider uppercase">/ 100</span>
        </div>
      </div>
      <span className={`text-xs font-semibold tracking-wide ${scoreColor(score)}`}>
        {scoreLabel(score)}
      </span>
    </div>
  );
}
