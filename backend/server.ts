import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import './src/database';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import type { ChampionData } from './src/models/champion';
import { User } from './src/models/user';

const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

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
function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
}

function getTokenFromReq(req: Request): string | null {
  const cookieToken = (req as any).cookies?.token as string | undefined;
  if (cookieToken) return cookieToken;
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice('Bearer '.length);
  return null;
}

async function requireUser(req: Request) {
  const token = getTokenFromReq(req);
  if (!token) throw new HttpError(401, 'Unauthorized');
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = await User.findById(payload.sub).exec();
    if (!user) throw new HttpError(401, 'Unauthorized');
    return user;
  } catch (_e) {
    throw new HttpError(401, 'Unauthorized');
  }
}

function cookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  const sameSite: 'lax' | 'strict' = isProd ? 'strict' : 'lax';
  return {
    httpOnly: true,
    sameSite,
    secure: isProd,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
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
    res.status(200).json({ message: 'User deleted', user: deleted });
  } catch (err: any) {
    if (err && err.name === 'CastError') {
      return next(new HttpError(400, 'Invalid id'));
    }
    return next(err);
  }
});





// Obtener los campeones favoritos del usuario
app.get('/api/users/:id/favorites', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await requireUser(req);
    if (user.id !== req.params.id) {
      return next(new HttpError(403, 'Forbidden: cannot access other user data'));
    }

    res.json({ favoriteChampions: user.favoriteChampions });
  } catch (err) {
    return next(err);
  }
});

// Actualizar los campeones favoritos del usuario
app.post('/api/users/:id/favorites', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await requireUser(req);
    if (user.id !== req.params.id) {
      return next(new HttpError(403, 'Forbidden: cannot update other user data'));
    }

    const { favoriteChampions } = req.body || {};

    if (!Array.isArray(favoriteChampions)) {
      return next(new HttpError(400, 'favoriteChampions must be an array of strings'));
    }

    if (favoriteChampions.length > 3) {
      return next(new HttpError(400, 'You can only select up to 3 favorite champions'));
    }

    user.favoriteChampions = favoriteChampions;
    await user.save();

    res.json({ message: 'Favorite champions updated successfully', favoriteChampions: user.favoriteChampions });
  } catch (err) {
    return next(err);
  }
});

// Auth routes
app.post('/auth/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return next(new HttpError(400, 'name, email and password are required'));
    }
    const user = await User.create({ name, email, password });
    const token = signToken(user.id);
    res.cookie('token', token, cookieOptions());
    res.status(201).json({ user, token });
  } catch (err: any) {
    if (err && err.code === 11000) {
      return next(new HttpError(409, 'Email already exists'));
    }
    return next(err);
  }
});

app.post('/auth/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return next(new HttpError(400, 'email and password are required'));
    }
    const user = await User.findOne({ email }).exec();
    if (!user) return next(new HttpError(401, 'Invalid credentials'));
    const ok = await (user as any).comparePassword(password);
    if (!ok) return next(new HttpError(401, 'Invalid credentials'));
    const token = signToken(user.id);
    res.cookie('token', token, cookieOptions());
    res.json({ user, token });
  } catch (err) {
    return next(err);
  }
});

app.post('/auth/logout', (req: Request, res: Response) => {
  res.clearCookie('token', { ...cookieOptions(), maxAge: undefined });
  res.status(200).json({ message: 'Logged out' });
});

app.get('/auth/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await requireUser(req);
    res.json({ user });
  } catch (err) {
    return next(err);
  }
});

//ruta para el perfil
app.get('/api/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await requireUser(req);
    res.json({ 
      id: user.id,
      name: user.name,
      email: user.email,
      favoriteChampions: user.favoriteChampions,
      createdAt: user.createdAt,
    });
  } catch (err) {
    return next(err);
  }
});

// 404 handler for unknown routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Not found' });
});

// Centralized error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err && err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate key' });
  }
  if (err && err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id' });
  }
  if (err && err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  if (err instanceof SyntaxError) {
    return res.status(400).json({ message: 'Invalid JSON' });
  }
  console.error('Unhandled error:', err);
  return res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
