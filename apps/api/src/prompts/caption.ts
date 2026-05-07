import { Platform } from '@ai-virality/shared';

export const captionPrompt = (caption: string, platform: Platform) => `
CAPTION ANALYSIS for ${platform.toUpperCase()}:
Analyze this caption: "${caption}"
Rate it 0-100 on:
- Readability and flow
- Has a clear call to action (CTA)
- Appropriate length for ${platform}
- Emotional resonance or relatability
- Emoji usage (appropriate, not excessive)

Then rewrite it to score 90+ on all above criteria.
`;
