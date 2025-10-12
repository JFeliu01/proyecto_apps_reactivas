import express, { Request, Response } from 'express';
import './src/database';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import type { ChampionData } from './src/models/champion';
import { User } from './src/models/user';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'champion-icons')));

app.get('/api/champions', (req: Request, res: Response) => {
  fs.readFile(path.join(__dirname, 'champion.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading champion.json:', err);
      res.status(500).send('Error reading champion data');
      return;
    }
    const json: ChampionData = JSON.parse(data);
    res.json(json);
  });
});

// Users CRUD
app.post('/api/users', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      res.status(400).json({ message: 'name, email and password are required' });
      return;
    }
    const created = await User.create({ name, email, password });
    res.status(201).json(created);
  } catch (err: any) {
    if (err && err.code === 11000) {
      res.status(409).json({ message: 'Email already exists' });
      return;
    }
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).exec();
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err: any) {
    if (err && err.name === 'CastError') {
      res.status(400).json({ message: 'Invalid id' });
      return;
    }
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const updates: Partial<{ name: string; email: string; password: string }> = {};
    const { name, email, password } = req.body || {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (password !== undefined) updates.password = password;

    const updated = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).exec();

    if (!updated) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    if (err && err.name === 'CastError') {
      res.status(400).json({ message: 'Invalid id' });
      return;
    }
    if (err && err.code === 11000) {
      res.status(409).json({ message: 'Email already exists' });
      return;
    }
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id).exec();
    if (!deleted) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(204).send();
  } catch (err: any) {
    if (err && err.name === 'CastError') {
      res.status(400).json({ message: 'Invalid id' });
      return;
    }
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
