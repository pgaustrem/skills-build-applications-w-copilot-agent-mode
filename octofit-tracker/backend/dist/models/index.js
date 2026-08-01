import mongoose, { Schema } from 'mongoose';
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    team: { type: String, required: false },
    points: { type: Number, default: 0 },
}, { timestamps: true });
const teamSchema = new Schema({
    name: { type: String, required: true, unique: true },
    members: [{ type: String }],
    points: { type: Number, default: 0 },
}, { timestamps: true });
const activitySchema = new Schema({
    user: { type: String, required: true },
    type: { type: String, required: true },
    duration: { type: Number, required: true },
    calories: { type: Number, default: 0 },
}, { timestamps: true });
const leaderboardSchema = new Schema({
    user: { type: String, required: true },
    points: { type: Number, required: true },
    rank: { type: Number, required: true },
}, { timestamps: true });
const workoutSchema = new Schema({
    title: { type: String, required: true },
    focus: { type: String, required: true },
    difficulty: { type: String, required: true },
    duration: { type: Number, required: true },
}, { timestamps: true });
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
const LeaderboardEntry = mongoose.models.LeaderboardEntry || mongoose.model('LeaderboardEntry', leaderboardSchema);
const Workout = mongoose.models.Workout || mongoose.model('Workout', workoutSchema);
export { User, Team, Activity, LeaderboardEntry, Workout };
