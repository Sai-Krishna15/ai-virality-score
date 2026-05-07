# AI Virality Score

> Upload your content. Get an AI-powered virality score with actionable feedback.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| AI | Google Gemini 1.5 Flash (free tier) |
| Monorepo | npm workspaces |

## Structure

```
.
├── apps/
│   ├── web/     # Next.js frontend (port 3000)
│   └── api/     # Express backend (port 3001)
└── packages/
    └── shared/  # Shared TypeScript types
```

## Getting Started

1. Clone the repo and install dependencies:
   ```bash
   cp .env.example .env
   # Fill in your GEMINI_API_KEY
   npm install
   ```

2. Start both apps in dev mode:
   ```bash
   npm run dev
   ```

- Web: http://localhost:3000  
- API: http://localhost:3001

## API

### `POST /analyze`

**Request body:**
```json
{
  "image": "<base64 string>",
  "caption": "Your caption here",
  "platform": "instagram" | "tiktok" | "linkedin"
}
```

**Response:**
```json
{
  "score": 74,
  "breakdown": {
    "hook": { "score": 80, "label": "Strong Hook", "tips": [] },
    "visual": { "score": 70, "label": "Good Visual", "tips": [] },
    "caption": { "score": 75, "label": "Clear CTA", "tips": [] },
    "hashtags": { "score": 65, "label": "Relevant Tags", "tips": [] }
  },
  "captionRewrite": "...",
  "hashtags": ["#ai", "#creators", "#viral"]
}
```
