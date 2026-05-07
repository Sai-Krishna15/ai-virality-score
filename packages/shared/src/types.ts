export type Platform = 'instagram' | 'tiktok' | 'linkedin';

export interface AnalyzeRequest {
  image: string; // base64 encoded
  caption: string;
  platform: Platform;
}

export interface SubScore {
  score: number; // 0–100
  label: string;
  tips: string[];
}

export interface ScoreBreakdown {
  hook: SubScore;
  visual: SubScore;
  caption: SubScore;
  hashtags: SubScore;
}

export interface AnalyzeResponse {
  score: number; // 0–100 weighted composite
  breakdown: ScoreBreakdown;
  captionRewrite: string;
  hashtags: string[];
}

export interface ApiError {
  error: string;
  details?: string;
}
