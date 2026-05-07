import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { analyzeRouter } from './routes/analyze';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (_req, res) => {
  res.send('API is running');
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/analyze', analyzeRouter);

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});