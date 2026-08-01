import express from 'express';
import cors from 'cors';
import db from './config/database.js';
import { User, Team, Activity, LeaderboardEntry, Workout } from './models/index.js';
const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
app.get('/api/users/', async (_req, res) => {
    const users = await User.find({}).lean();
    res.json(users);
});
app.get('/api/teams/', async (_req, res) => {
    const teams = await Team.find({}).lean();
    res.json(teams);
});
app.get('/api/activities/', async (_req, res) => {
    const activities = await Activity.find({}).lean();
    res.json(activities);
});
app.get('/api/leaderboard/', async (_req, res) => {
    const leaderboard = await LeaderboardEntry.find({}).lean();
    res.json(leaderboard);
});
app.get('/api/workouts/', async (_req, res) => {
    const workouts = await Workout.find({}).lean();
    res.json(workouts);
});
app.get('/api/health/', (_req, res) => {
    res.json({ status: 'ok', baseUrl, database: db.name });
});
app.listen(port, () => {
    console.log(`OctoFit Tracker API listening on ${baseUrl}`);
});
