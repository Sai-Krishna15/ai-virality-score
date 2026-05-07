import { ScoreBreakdown } from '@ai-virality/shared';

const WEIGHTS = {
  hook: 0.30,
  visual: 0.25,
  caption: 0.25,
  hashtags: 0.20,
};

export function calculateScore(breakdown: ScoreBreakdown): number {
  const weighted =
    breakdown.hook.score * WEIGHTS.hook +
    breakdown.visual.score * WEIGHTS.visual +
    breakdown.caption.score * WEIGHTS.caption +
    breakdown.hashtags.score * WEIGHTS.hashtags;

  return Math.round(weighted);
}
