import { Router, Request, Response } from 'express';
import { AnalyzeRequest, AnalyzeResponse } from '@ai-virality/shared';
import { analyzeWithGemini } from '../services/gemini';
import { calculateScore } from '../services/scorer';
import { getHashtags } from '../services/hashtags';

export const analyzeRouter = Router();

analyzeRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { image, caption, platform } = req.body as AnalyzeRequest;

    if (!image || !caption || !platform) {
      return res.status(400).json({ error: 'image, caption, and platform are required' });
    }

    const geminiResult = await analyzeWithGemini({ image, caption, platform });
    const score = calculateScore(geminiResult.breakdown);
    const hashtags = getHashtags(caption, platform);

    const response: AnalyzeResponse = {
      score,
      breakdown: geminiResult.breakdown,
      captionRewrite: geminiResult.captionRewrite,
      hashtags,
    };

    return res.json(response);
  } catch (err) {
    console.error('[/analyze]', err);
    return res.status(500).json({ error: 'Analysis failed', details: String(err) });
  }
});
