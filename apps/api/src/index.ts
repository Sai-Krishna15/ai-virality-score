import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import next from 'next';
import { analyzeRouter } from './routes/analyze';

const dev = false;

// 👇 IMPORTANT: point to your web app
const nextApp = next({ dev, dir: 'apps/web' });
const handle = nextApp.getRequestHandler();

const PORT = Number(process.env.PORT) || 3000;

nextApp.prepare().then(() => {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // ✅ API routes
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/analyze', analyzeRouter);

  // ✅ Let Next.js handle everything else (frontend)
  app.all('*', (req, res) => handle(req, res));

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});