import express, { type Request, type Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());
app.use('/images', express.static(path.join(__dirname, '..', 'champion-icons')));

app.get('/api/champions', (req: Request, res: Response) => {
  fs.readFile(path.join(__dirname, '..', 'champion.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading champion data');
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
