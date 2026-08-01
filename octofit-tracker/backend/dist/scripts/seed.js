import mongoose from 'mongoose';
import { User, Team, Activity, LeaderboardEntry, Workout } from '../models/index.js';
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
    try {
        await mongoose.connect(connectionString);
        console.log('Connected to octofit_db');
        await User.deleteMany({});
        await Team.deleteMany({});
        await Activity.deleteMany({});
        await LeaderboardEntry.deleteMany({});
        await Workout.deleteMany({});
        await User.insertMany([
            { name: 'Ava Patel', email: 'ava@example.com', team: 'Thunder', points: 120 },
            { name: 'Leo Martinez', email: 'leo@example.com', team: 'Lightning', points: 135 },
            { name: 'Mia Johnson', email: 'mia@example.com', team: 'Thunder', points: 110 },
        ]);
        await Team.insertMany([
            { name: 'Thunder', members: ['Ava Patel', 'Mia Johnson'], points: 230 },
            { name: 'Lightning', members: ['Leo Martinez'], points: 135 },
        ]);
        await Activity.insertMany([
            { user: 'Ava Patel', type: 'Running', duration: 25, calories: 220 },
            { user: 'Leo Martinez', type: 'Strength', duration: 40, calories: 300 },
            { user: 'Mia Johnson', type: 'Walking', duration: 35, calories: 140 },
        ]);
        await LeaderboardEntry.insertMany([
            { user: 'Leo Martinez', points: 135, rank: 1 },
            { user: 'Ava Patel', points: 120, rank: 2 },
            { user: 'Mia Johnson', points: 110, rank: 3 },
        ]);
        await Workout.insertMany([
            { title: 'Morning Sprint Circuit', focus: 'Cardio', difficulty: 'Intermediate', duration: 20 },
            { title: 'Core Stability Flow', focus: 'Core', difficulty: 'Beginner', duration: 15 },
            { title: 'Power Push Session', focus: 'Strength', difficulty: 'Advanced', duration: 30 },
        ]);
        console.log('Database seeding complete');
        await mongoose.disconnect();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
