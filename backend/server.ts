import express, { Request, Response, NextFunction } from 'express';
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

class HttpError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

app.get('/api/champions', (req: Request, res: Response, next: NextFunction) => {
  fs.readFile(path.join(__dirname, 'champion.json'), 'utf8', (err, data) => {
    if (err) {
      return next(new HttpError(500, 'Error reading champion data'));
    }
    const json: ChampionData = JSON.parse(data);
    res.json(json);
  });
});

// Users CRUD
app.post('/api/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return next(new HttpError(400, 'name, email and password are required'));
    }
    const created = await User.create({ name, email, password });
    res.status(201).json(created);
  } catch (err: any) {
    if (err && err.code === 11000) {
      return next(new HttpError(409, 'Email already exists'));
    }
    return next(err);
  }
});

app.get('/api/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id).exec();
    if (!user) {
      return next(new HttpError(404, 'User not found'));
    }
    res.json(user);
  } catch (err: any) {
    if (err && err.name === 'CastError') {
      return next(new HttpError(400, 'Invalid id'));
    }
    return next(err);
  }
});

app.put('/api/users/:id', async (req: Request, res: Response, next: NextFunction) => {
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
      return next(new HttpError(404, 'User not found'));
    }
    res.json(updated);
  } catch (err: any) {
    if (err && err.name === 'CastError') {
      return next(new HttpError(400, 'Invalid id'));
    }
    if (err && err.code === 11000) {
      return next(new HttpError(409, 'Email already exists'));
    }
    return next(err);
  }
});

app.delete('/api/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id).exec();
    if (!deleted) {
      return next(new HttpError(404, 'User not found'));
    }
    res.status(204).send();
  } catch (err: any) {
    if (err && err.name === 'CastError') {
      return next(new HttpError(400, 'Invalid id'));
    }
    return next(err);
  }
});

// 404 handler for unknown routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Not found' });
});

// Centralized error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // If headers already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  // Known HttpError
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  // Mongoose duplicate key
  if (err && err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate key' });
  }

  // Mongoose invalid ObjectId
  if (err && err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id' });
  }

  // Mongoose validation
  if (err && err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  // JSON parse error from express.json()
  if (err instanceof SyntaxError) {
    return res.status(400).json({ message: 'Invalid JSON' });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
