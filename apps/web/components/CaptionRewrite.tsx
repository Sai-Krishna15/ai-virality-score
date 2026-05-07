'use client';

import { useState } from 'react';

interface Props {
  original: string;
  rewrite: string;
  hashtags: string[];
}

export default function CaptionRewrite({ original, rewrite, hashtags }: Props) {
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const copy = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Original */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
            <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider">Original</span>
          </div>
        </div>
        <p className="px-4 py-3.5 text-sm text-white/35 leading-relaxed">{original}</p>
      </div>

      {/* AI rewrite */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-emerald-500/10">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-medium text-emerald-400/80 uppercase tracking-wider">AI Optimised</span>
          </div>
          <button
            onClick={() => copy(rewrite, setCopiedCaption)}
            className="text-[11px] text-emerald-400/60 hover:text-emerald-400 transition-colors"
          >
            {copiedCaption ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <p className="px-4 py-3.5 text-sm text-white/75 leading-relaxed">{rewrite}</p>
      </div>

      {/* Hashtags */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider">Recommended Hashtags</span>
          <button
            onClick={() => copy(`${rewrite}\n\n${hashtags.join(' ')}`, setCopiedAll)}
            className="text-[11px] text-violet-400/60 hover:text-violet-400 transition-colors"
          >
            {copiedAll ? '✓ Copied all' : 'Copy caption + tags'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag) => (
            <span
              key={tag}
              onClick={() => navigator.clipboard.writeText(tag)}
              className="px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-300/80 text-xs border border-violet-500/15 cursor-pointer hover:bg-violet-500/20 transition-colors"
              title="Click to copy"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
