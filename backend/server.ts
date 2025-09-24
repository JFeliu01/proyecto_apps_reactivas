import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3001;

app.use(cors());

app.use('/images', express.static(path.join(__dirname, 'champion-icons')));

app.get('/api/champions', (req: Request, res: Response) => {
  fs.readFile(path.join(__dirname, 'champion.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading champion.json:', err);
      res.status(500).send('Error reading champion data');
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
