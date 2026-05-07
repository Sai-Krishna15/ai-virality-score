import { GoogleGenerativeAI } from '@google/generative-ai';
import { hookPrompt } from '../prompts/hook';
import { captionPrompt } from '../prompts/caption';
import { visualPrompt } from '../prompts/visual';
import { Platform, ScoreBreakdown } from '@ai-virality/shared';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

interface GeminiAnalysis {
  breakdown: ScoreBreakdown;
  captionRewrite: string;
}

interface AnalyzeInput {
  image: string;
  caption: string;
  platform: Platform;
}

export async function analyzeWithGemini({ image, caption, platform }: AnalyzeInput): Promise<GeminiAnalysis> {
  const imagePart = {
    inlineData: {
      data: image.replace(/^data:image\/\w+;base64,/, ''),
      mimeType: 'image/jpeg' as const,
    },
  };

  const fullPrompt = `
You are a social media virality expert. Analyze this ${platform} post.

Caption: "${caption}"

${hookPrompt(caption)}
${visualPrompt()}
${captionPrompt(caption, platform)}

Return ONLY valid JSON in this exact format:
{
  "hook": { "score": <0-100>, "label": "<short label>", "tips": ["<tip1>", "<tip2>"] },
  "visual": { "score": <0-100>, "label": "<short label>", "tips": ["<tip1>", "<tip2>"] },
  "caption": { "score": <0-100>, "label": "<short label>", "tips": ["<tip1>", "<tip2>"] },
  "hashtags": { "score": <0-100>, "label": "<short label>", "tips": ["<tip1>", "<tip2>"] },
  "captionRewrite": "<full rewritten caption optimized for ${platform}>"
}
`;

  const result = await model.generateContent([fullPrompt, imagePart]);
  const text = result.response.text().replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(text);

  return {
    breakdown: {
      hook: parsed.hook,
      visual: parsed.visual,
      caption: parsed.caption,
      hashtags: parsed.hashtags,
    },
    captionRewrite: parsed.captionRewrite,
  };
}
