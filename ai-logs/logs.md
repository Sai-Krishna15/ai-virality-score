# AI Logs

### Prompt
You are a senior product engineer.

I have this idea:

idea.md

Task:
Break this into a simple MVP plan for a hackathon.

Constraints:
- Must be built in 2–3 days
- No paid APIs
- Focus on UX + actionable feedback

Output:
- Final MVP feature list
- User flow (step-by-step)

Viewed idea.md:1-14

Here's the hackathon MVP plan based on your idea:

Here's the full breakdown:

---


### Response
## 🚀 AI Virality Score — Hackathon MVP

### Key Scoping Decision: **Drop video, keep image + caption**
Video processing is a week-long problem. Images + captions deliver 80% of the demo value with a fraction of the complexity.

---

### ✅ Final MVP Feature List

| Feature | In/Out | Reason |
|---|---|---|
| Image upload | ✅ In | Core input |
| Caption input | ✅ In | Core input |
| Virality Score (0–100) | ✅ In | The hero moment |
| Hook strength analysis | ✅ In | Top UX differentiator |
| Caption rewrite | ✅ In | Tangible, "wow" output |
| Hashtag recommendations | ✅ In | Easy win, high perceived value |
| Score breakdown UI (animated) | ✅ In | Memorable demo |
| Video upload | ❌ Cut | Too slow to process in demo |
| Competitor comparison | ❌ Cut | Needs data pipeline |
| Trending audio | ❌ Cut | Platform API complexity |

**Stack:** Next.js + Gemini `gemini-1.5-flash` (free tier, handles vision + text) + Vercel

---

### 🪜 User Flow

```
1. LAND      → Hero: "Find out why your content isn't going viral" → "Analyze My Post"
2. UPLOAD    → Drag-drop image + paste caption + pick platform (IG/TT/LinkedIn)
3. LOADING   → Animated steps: "Scanning hook strength... Checking visuals..."
4. RESULTS   → Big animated score reveal → 4 sub-score cards
5. DEEP DIVE → Expand any card: rewritten caption, specific fix bullets, hashtag list
6. ITERATE   → "Copy Report" + "Try Another Post" CTA
```

**Score breakdown (weighted):**
- Hook Strength 30% — first-line punch, curiosity gap
- Visual Appeal 25% — composition, contrast (Gemini Vision)
- Caption Quality 25% — CTA, readability, emotion
- Hashtag Relevance 20% — niche match

---

### 📅 3-Day Timeline

| Day | Focus |
|-----|-------|
| 1 | Setup + Gemini API integration + score logic |
| 2 | Results UI with animated score reveal + caption rewrite display |
| 3 | Polish, mobile, deploy to Vercel, demo prep |

The full plan with feature detail, prompting strategy, and judging-optimized decisions is above.



### Prompt
Based on the MVP, plan generate a clean project structure for:

- Next.js frontend
- Node.js backend
- Single repo

Keep it simple and production-like.

Output folder structure and explanation.



### Response
Here's a clean, production-like monorepo structure for the MVP:

```
ai-virality-score/
├── apps/
│   ├── web/                        # Next.js frontend
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── app/                # App Router (Next.js 14+)
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx        # Landing page
│   │   │   │   └── analyze/
│   │   │   │       └── page.tsx    # Results page
│   │   │   ├── components/
│   │   │   │   ├── ui/             # Primitives (Button, Card, Badge)
│   │   │   │   ├── UploadForm.tsx
│   │   │   │   ├── ScoreGauge.tsx
│   │   │   │   ├── ScoreBreakdown.tsx
│   │   │   │   └── CaptionRewrite.tsx
│   │   │   ├── lib/
│   │   │   │   ├── api.ts          # Typed fetch wrappers → backend
│   │   │   │   └── utils.ts
│   │   │   └── types/
│   │   │       └── index.ts        # Shared response types
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── api/                        # Node.js / Express backend
│       ├── src/
│       │   ├── index.ts            # Server entry, routes mount
│       │   ├── routes/
│       │   │   └── analyze.ts      # POST /analyze
│       │   ├── services/
│       │   │   ├── gemini.ts       # Gemini API calls
│       │   │   ├── scorer.ts       # Weighted score calculation
│       │   │   └── hashtags.ts     # Hashtag recommendation logic
│       │   ├── prompts/
│       │   │   ├── hook.ts         # Hook strength prompt
│       │   │   ├── caption.ts      # Caption rewrite prompt
│       │   │   └── visual.ts       # Visual analysis prompt
│       │   └── types/
│       │       └── index.ts        # Request/response interfaces
│       ├── .env.example
│       └── package.json
│
├── packages/
│   └── shared/                     # Types shared between web + api
│       ├── src/
│       │   └── types.ts            # AnalyzeRequest, AnalyzeResponse, ScoreBreakdown
│       └── package.json
│
├── .env.example                    # Root env (GEMINI_API_KEY, etc.)
├── .gitignore
├── package.json                    # Root — workspaces config
└── README.md
```

---

### Key Design Decisions

| Decision | Rationale |
|---|---|
| `apps/web` + `apps/api` split | Clean separation; can deploy independently to Vercel + Railway/Render |
| `packages/shared` | Single source of truth for `AnalyzeRequest` / `AnalyzeResponse` types across both apps |
| `prompts/` as separate files | Swap/tune prompts without touching business logic |
| `services/` layer in API | Keeps route handlers thin; Gemini, scoring, and hashtags are independently testable |
| App Router (`app/`) | Next.js 14 standard; `analyze/page.tsx` receives score as query params or via context |
| No DB for MVP | All state lives in the request/response cycle — zero infra to manage |

### Workspace Setup (root `package.json`)

```json
{
  "name": "ai-virality-score",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev:web": "npm run dev --workspace=apps/web",
    "dev:api": "npm run dev --workspace=apps/api",
    "dev": "concurrently \"npm run dev:web\" \"npm run dev:api\""
  }
}
```

### Core API Contract

```ts
// packages/shared/src/types.ts
export interface AnalyzeRequest {
  image: string;       // base64
  caption: string;
  platform: 'instagram' | 'tiktok' | 'linkedin';
}

export interface AnalyzeResponse {
  score: number;       // 0–100
  breakdown: {
    hook: SubScore;
    visual: SubScore;
    caption: SubScore;
    hashtags: SubScore;
  };
  captionRewrite: string;
  hashtags: string[];
}

export interface SubScore {
  score: number;       // 0–100
  label: string;
  tips: string[];
}
```

This structure is lean enough to start building but clean enough to keep extending post-demo. Want me to scaffold this into the actual project directory?


### Prompt
Lets start implementing the project as per the plan.


### Response
Waiting for create-next-app to finish, then will add all frontend source files.

Still installing. Let me wait for it to finish:

Next.js is ready. Now let me write all the frontend files in parallel:

Next.js app scaffolded successfully in `apps/web`. Now writing all frontend source files.

Created api.ts
Created utils.ts
Created index.ts
Created UploadForm.tsx
Created ScoreGauge.tsx
Created ScoreBreakdown.tsx
Created CaptionRewrite.tsx

Now add the `NEXT_PUBLIC_API_URL` env to the web app and run root install:

Created .env.local

Everything looks perfect. Let me update the task and notify the user:

Full monorepo scaffolded and verified. `npm install` succeeded. All source files are in place across `apps/api`, `apps/web`, and `packages/shared`.

✅ **Monorepo scaffolded and installed.** Here's what was created:

```
AI-Virtuality-Score/
├── apps/
│   ├── web/                  ← Next.js 14 (port 3000)
│   │   ├── app/page.tsx      ← Landing + Results (single-page state swap)
│   │   ├── components/       ← UploadForm, ScoreGauge, ScoreBreakdown, CaptionRewrite
│   │   ├── lib/api.ts        ← Typed fetch wrapper
│   │   └── lib/utils.ts      ← Score colours, labels, base64 helper
│   └── api/                  ← Node.js + Express (port 3001)
│       └── src/
│           ├── index.ts      ← Server entry
│           ├── routes/       ← POST /analyze
│           ├── services/     ← gemini.ts, scorer.ts, hashtags.ts
│           └── prompts/      ← hook.ts, caption.ts, visual.ts
└── packages/shared/          ← Shared TypeScript types
```

**To get started:**
1. Copy env file and add your Gemini key:
   ```bash
   cp .env.example .env
   # Set GEMINI_API_KEY=...
   cp apps/api/.env.example apps/api/.env
   ```
2. Start both apps:
   ```bash
   npm run dev
   ```

### Prompt
Create a React component for:

- image/video upload
- caption input
- platform selector (Instagram, YouTube)

Requirements:
- clean modern UI
- simple state handling
- preview uploaded file
- Fully Responsive
- Premium Look

Return code.


### Response
**Key features:**

| Feature | Detail |
|---|---|
| **Platform selector** | Instagram + YouTube with brand gradients and icons — button accent color reacts to selection |
| **Drag & drop** | Full drop zone with scale animation on hover, dedicated `dragOver` state |
| **Image + Video preview** | `object-url` preview for both types — video renders with native controls |
| **File info bar** | Shows filename + size below the preview |
| **Remove / Replace** | Hover overlay appears on the preview with two quick actions |
| **Caption textarea** | 2200 char limit with live counter, transitions red when near limit |
| **Submit button** | Platform-colored gradient + shimmer hover effect + spinner loading state |
| **Responsive** | Works on all screen sizes, `aspect-video` keeps preview proportional |

**Design highlights:**
- Platform accent color (`from-pink-500` → `from-red-500`) flows through the entire form — selector, submit button, and drop zone highlight all match
- All borders use `white/10` glass treatment so it sits cleanly on any dark background
- Hover states on the submit use `scale-[1.01]` for subtle tactile feel without being flashy


### Prompt
Improve the UI to look like a modern analytics product.
Add better spacing and visual hierarchy.

### Response
I'll do a comprehensive overhaul across all 5 files simultaneously — global CSS, page layout.



### Prompt
I want to use Google Gemini API in a Node.js backend.

Task:
- Create an API endpoint POST /analyze
- It should send caption + platform to Gemini
- Gemini should return:
  - virality score (0-100)
  - hook analysis
  - caption feedback
  - suggestions

Constraints:
- Use free Gemini API
- Keep it simple
- Return structured JSON


### Response
Here is a lean, simple, and production-ready implementation for your Node.js backend. 

Since you've updated to `gemini-2.5-flash`, we can use Google's native **Structured JSON Output** feature (`responseMimeType: 'application/json'`). This guarantees the API will return perfectly formatted JSON without needing complex string parsing or regex.

Here is the clean, single-file Express basic implementation:

```typescript
import 'dotenv/config';
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(express.json());

// Initialize Gemini (Free tier handles 15 requests/minute)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

app.post('/analyze', async (req, res) => {
  try {
    const { caption, platform } = req.body;

    if (!caption || !platform) {
      return res.status(400).json({ error: 'Missing caption or platform' });
    }

    const prompt = `
      You are an expert social media strategist for ${platform}.
      Analyze the following caption and determine its virality potential.
      
      Caption to analyze: "${caption}"

      Provide your analysis strictly matching the requested JSON schema.
    `;

    // Call Gemini with strict JSON enforcement
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        // Optional: define the exact schema to guarantee the shape
        responseSchema: {
          type: "object",
          properties: {
            viralityScore: { 
              type: "number", 
              description: "Total score from 0 to 100" 
            },
            hookAnalysis: {
              type: "object",
              properties: {
                score: { type: "number", description: "Hook score from 0 to 100" },
                feedback: { type: "string" }
              }
            },
            captionFeedback: {
              type: "object",
              properties: {
                score: { type: "number", description: "Caption quality from 0 to 100" },
                feedback: { type: "string" }
              }
            },
            suggestions: {
              type: "array",
              items: { type: "string" },
              description: "List of actionable suggestions to improve"
            }
          },
          required: ["viralityScore", "hookAnalysis", "captionFeedback", "suggestions"]
        }
      }
    });

    // Gemini returns the exact JSON string thanks to responseMimeType
    const analysisJson = JSON.parse(result.response.text());

    return res.json(analysisJson);

  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to analyze post' });
  }
});

app.listen(3001, () => console.log('API running on http://localhost:3001'));
```

### Why this approach is best:
1. **JSON Mode (`responseMimeType`):** By explicitly telling Gemini you expect `application/json` along with a `responseSchema`, the model is forced to *only* return valid JSON. This stops it from wrapping the response in markdown blocks (````json ... ````) and breaking `JSON.parse()`.
2. **Simplified parsing:** You can simply do `JSON.parse(result.response.text())` with confidence.
3. **Free & Fast:** `gemini-2.5-flash` is extremely fast and entirely free for up to 15 requests per minute, making it perfect for an MVP.


### Prompt
i need to deploy it in onrender .configure all needed files for that.


### Response
created render.yaml file