import { Platform } from '@ai-virality/shared';

const HASHTAG_MAP: Record<Platform, string[]> = {
  instagram: ['#reels', '#explore', '#viral', '#contentcreator', '#instagood', '#trending', '#fyp', '#aesthetic'],
  tiktok: ['#fyp', '#foryou', '#viral', '#tiktok', '#trending', '#creator', '#foryoupage', '#viralvideo'],
  linkedin: ['#linkedin', '#professionals', '#growth', '#career', '#innovation', '#business', '#networking', '#leadership'],
};

const NICHE_HASHTAGS: Record<string, string[]> = {
  ai: ['#AI', '#artificialintelligence', '#machinelearning', '#aitools'],
  fitness: ['#fitness', '#workout', '#gym', '#health', '#motivation'],
  food: ['#foodie', '#recipe', '#delicious', '#foodphotography'],
  travel: ['#travel', '#wanderlust', '#adventure', '#explore'],
  fashion: ['#fashion', '#style', '#ootd', '#outfit'],
  tech: ['#tech', '#technology', '#software', '#coding', '#developer'],
};

function detectNiche(caption: string): string[] {
  const lower = caption.toLowerCase();
  const tags: string[] = [];
  for (const [niche, hashtagList] of Object.entries(NICHE_HASHTAGS)) {
    if (lower.includes(niche)) {
      tags.push(...hashtagList.slice(0, 3));
    }
  }
  return tags;
}

export function getHashtags(caption: string, platform: Platform): string[] {
  const platform_tags = HASHTAG_MAP[platform].slice(0, 5);
  const niche_tags = detectNiche(caption);
  const combined = [...new Set([...niche_tags, ...platform_tags])];
  return combined.slice(0, 10);
}
