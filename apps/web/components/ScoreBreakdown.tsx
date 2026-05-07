'use client';

import { useState } from 'react';
import { ScoreBreakdown } from '@/types';
import { scoreColor, scoreBg } from '@/lib/utils';

interface Props { breakdown: ScoreBreakdown }

const METRICS: { key: keyof ScoreBreakdown; icon: string; title: string; desc: string }[] = [
  { key: 'hook',     icon: '🎣', title: 'Hook Strength',     desc: 'First-line impact & curiosity' },
  { key: 'visual',   icon: '🖼️', title: 'Visual Appeal',     desc: 'Composition, contrast & clarity' },
  { key: 'caption',  icon: '✍️', title: 'Caption Quality',   desc: 'CTA, readability & emotion' },
  { key: 'hashtags', icon: '#️⃣', title: 'Hashtag Relevance', desc: 'Niche match & discoverability' },
];

export default function ScoreBreakdownCard({ breakdown }: Props) {
  const [expanded, setExpanded] = useState<keyof ScoreBreakdown | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {METRICS.map(({ key, icon, title, desc }) => {
        const sub = breakdown[key];
        const isOpen = expanded === key;
        const color = scoreColor(sub.score);
        const bar = scoreBg(sub.score);

        return (
          <button
            key={key}
            type="button"
            onClick={() => setExpanded(isOpen ? null : key)}
            className={`
              group text-left rounded-2xl border p-4 transition-all duration-200 w-full
              ${isOpen
                ? 'border-white/15 bg-white/[0.06]'
                : 'border-white/[0.07] bg-white/[0.03] hover:border-white/12 hover:bg-white/[0.05]'}
            `}
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-base leading-none">{icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white/80 leading-tight">{title}</p>
                  <p className="text-[11px] text-white/30 mt-0.5">{desc}</p>
                </div>
              </div>
              <span className={`text-xl font-extrabold tabular-nums leading-none flex-shrink-0 ${color}`}>
                {sub.score}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className={`h-full rounded-full ${bar} transition-all duration-700 ease-out`}
                style={{ width: `${sub.score}%` }}
              />
            </div>

            {/* Expand label */}
            <div className="flex items-center justify-between mt-2.5">
              <span className="text-[11px] text-white/30">{sub.label}</span>
              <span className="text-[10px] text-white/20 group-hover:text-white/40 transition-colors">
                {isOpen ? 'Hide tips ↑' : 'Show tips ↓'}
              </span>
            </div>

            {/* Tips */}
            {isOpen && sub.tips.length > 0 && (
              <ul className="mt-3 pt-3 border-t border-white/[0.07] space-y-2">
                {sub.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-xs text-white/55 leading-relaxed">
                    <span className="text-violet-400 flex-shrink-0 mt-px">→</span>
                    {tip}
                  </li>
                ))}
              </ul>
            )}
          </button>
        );
      })}
    </div>
  );
}
