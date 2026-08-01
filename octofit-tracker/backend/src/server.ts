import express, { Request, Response } from 'express';
import cors from 'cors';
import db from './config/database.js';
import { User, Team, Activity, LeaderboardEntry, Workout } from './models/index.js';
import { requireAuth } from './middleware/auth.js';
import { createTokenForUser } from './utils/auth.js';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.post('/api/auth/login/', async (req: Request, res: Response) => {
  const { email } = req.body ?? {};

  if (!email) {
    return res.status(400).json({ error: 'email is required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(403).json({ error: 'Only registered users can sign in' });
  }

  const token = createTokenForUser({
    _id: String(user._id),
    email: user.email,
  });

  return res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
    },
  });
});

app.get('/api/users/', requireAuth, async (_req: Request, res: Response) => {
  const users = await User.find({}).lean();
  res.json(users);
});

app.get('/api/teams/', requireAuth, async (_req: Request, res: Response) => {
  const teams = await Team.find({}).lean();
  res.json(teams);
});

app.get('/api/activities/', requireAuth, async (_req: Request, res: Response) => {
  const activities = await Activity.find({}).lean();
  res.json(activities);
});

app.get('/api/leaderboard/', requireAuth, async (_req: Request, res: Response) => {
  const leaderboard = await LeaderboardEntry.find({}).lean();
  res.json(leaderboard);
});

app.get('/api/workouts/', requireAuth, async (_req: Request, res: Response) => {
  const workouts = await Workout.find({}).lean();
  res.json(workouts);
});

app.get('/api/health/', (_req: Request, res: Response) => {
  res.json({ status: 'ok', baseUrl, database: db.name });
});

app.listen(port, () => {
  console.log(`OctoFit Tracker API listening on ${baseUrl}`);
});
