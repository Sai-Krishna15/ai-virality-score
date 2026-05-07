'use client';

import { useState } from 'react';
import UploadForm from '@/components/UploadForm';
import ScoreGauge from '@/components/ScoreGauge';
import ScoreBreakdownCard from '@/components/ScoreBreakdown';
import CaptionRewrite from '@/components/CaptionRewrite';
import { AnalyzeResponse } from '@/types';

/* ── tiny nav shared between both views ── */
function Nav({ onReset }: { onReset?: () => void }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-14 flex items-center px-6 border-b border-white/[0.06] bg-[#080b12]/80 backdrop-blur-md">
      <div className="flex items-center gap-2.5 mr-auto">
        <span className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">V</span>
        <span className="text-white/80 text-sm font-semibold tracking-tight">Virality Score</span>
      </div>
      {onReset && (
        <button
          onClick={onReset}
          className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5"
        >
          <span>←</span> New analysis
        </button>
      )}
    </header>
  );
}

/* ── stat badge used in results header ── */
function StatBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.07]">
      <span className={`text-xl font-bold tabular-nums ${color}`}>{value}</span>
      <span className="text-[11px] text-white/35 tracking-wide uppercase">{label}</span>
    </div>
  );
}

export default function Home() {
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [originalCaption, setOriginalCaption] = useState('');



  /* ── Results dashboard ── */
  if (result) {

    type MetricKey = keyof typeof result.breakdown;

    const entries = Object.entries(result.breakdown) as [
      MetricKey,
      { score: number }
    ][];


    const topMetric = entries.reduce(
      (best, [k, v]) =>
        v.score > best.score ? { key: k, score: v.score } : best,
      { key: entries[0][0], score: 0 }
    );

    const bottomMetric = entries.reduce(
      (worst, [k, v]) =>
        v.score < worst.score ? { key: k, score: v.score } : worst,
      { key: entries[0][0], score: 100 }
    );

    return (
      <>
        <Nav onReset={() => { setResult(null); setOriginalCaption(''); }} />
        <main className="relative z-10 min-h-screen pt-20 pb-16 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto space-y-8">

            {/* ── Page title ── */}
            <div className="animate-fade-up space-y-1 pt-4">
              <p className="text-[11px] uppercase tracking-widest text-white/30 font-medium">Analysis Report</p>
              <h1 className="text-2xl font-bold text-white/90">Your Virality Score</h1>
            </div>

            {/* ── Hero stats row ── */}
            <div className="animate-fade-up animate-fade-up-1 grid grid-cols-3 gap-3">
              <div className="col-span-1 flex flex-col items-center justify-center gap-1 rounded-2xl border border-white/[0.07] bg-white/[0.03] py-6">
                <ScoreGauge score={result.score} />
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-3 content-center">
                <StatBadge
                  label="Best metric"
                  value={`${topMetric.score}`}
                  color="text-emerald-400"
                />
                <StatBadge
                  label="Needs work"
                  value={`${bottomMetric.score}`}
                  color="text-amber-400"
                />
                <StatBadge
                  label="Hashtags"
                  value={`${result.hashtags.length}`}
                  color="text-violet-300"
                />
                <StatBadge
                  label="Sub-scores"
                  value="4"
                  color="text-sky-300"
                />
              </div>
            </div>

            {/* ── Section label ── */}
            <div className="animate-fade-up animate-fade-up-2">
              <div className="flex items-center gap-3 mb-4">
                <p className="text-[11px] uppercase tracking-widest text-white/30 font-medium">Score Breakdown</p>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>
              <ScoreBreakdownCard breakdown={result.breakdown} />
            </div>

            {/* ── Caption section ── */}
            <div className="animate-fade-up animate-fade-up-3">
              <div className="flex items-center gap-3 mb-4">
                <p className="text-[11px] uppercase tracking-widest text-white/30 font-medium">Caption Analysis</p>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>
              <CaptionRewrite
                original={originalCaption}
                rewrite={result.captionRewrite}
                hashtags={result.hashtags}
              />
            </div>

          </div>
        </main>
      </>
    );
  }

  /* ── Upload / Landing ── */
  return (
    <>
      <Nav />
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-24">
        <div className="w-full max-w-lg space-y-10">

          {/* ── Hero copy ── */}
          <div className="text-center space-y-4 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/25 bg-violet-500/8 text-violet-300 text-[11px] font-medium tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Powered by Gemini AI
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight text-white/90">
              Find out why your content<br />
              <span className="gradient-text">isn&apos;t going viral</span>
            </h1>
            <p className="text-white/40 text-base max-w-sm mx-auto leading-relaxed">
              Upload your post. Get a score, a rewritten caption, and exact fixes — in seconds.
            </p>
          </div>

          {/* ── Stats strip ── */}
          <div className="animate-fade-up animate-fade-up-1 grid grid-cols-3 divide-x divide-white/[0.06] rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
            {[
              { value: '4 metrics', label: 'Analysed' },
              { value: '< 5s', label: 'Results' },
              { value: 'Free', label: 'No signup' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center py-3 gap-0.5">
                <span className="text-sm font-semibold text-white/70">{value}</span>
                <span className="text-[10px] text-white/25 uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>

          {/* ── Form ── */}
          <div className="animate-fade-up animate-fade-up-2">
            <UploadForm
              onResult={(res, caption) => {
                setResult(res);
                setOriginalCaption(caption);
              }}
            />
          </div>

        </div>
      </main>
    </>
  );
}
