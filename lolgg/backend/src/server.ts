import path from 'path';
import fs from 'fs';
import express from 'express';

type Champion = {
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  info: unknown;
  tags: string[];
  partype: string;
  stats: unknown;
  icon: string;
  image?: { full: string };
  version: string;
};

type DbShape = { champions: Champion[] };

const app = express();
app.use(express.json());

// Static icons
app.use('/icons', express.static(path.join(__dirname, '..', 'champion-icons')));

// Load DB once at startup
const dbPath = path.join(__dirname, '..', 'db.json');
const raw = fs.readFileSync(dbPath, 'utf-8');
const db = JSON.parse(raw) as DbShape;
const champions = db.champions || [];

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/champions', (req, res) => {
  const q = (req.query.q as string | undefined)?.toLowerCase();
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  let results = champions;
  if (q) {
    results = results.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  if (limit && Number.isFinite(limit)) {
    results = results.slice(0, limit);
  }
  res.json(results);
});

app.get('/api/champions/:id', (req, res) => {
  const id = req.params.id.toLowerCase();
  const found = champions.find(c => c.id.toLowerCase() === id || c.key === id);
  if (!found) {
    return res.status(404).json({ error: 'Champion not found' });
  }
  res.json(found);
});

const port = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Express server running on http://localhost:${port}`);
  // eslint-disable-next-line no-console
  console.log(`API: http://localhost:${port}/api/champions`);
  // eslint-disable-next-line no-console
  console.log(`Icons example: http://localhost:${port}/icons/Ahri.png`);
});

