import mongoose from 'mongoose';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
export const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

export async function connectDatabase(uri = connectionString) {
  if (mongoose.connection.readyState === 1) {
    return db;
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to octofit_db');
    return db;
  } catch (error) {
    console.error('Error connecting to octofit_db:', error);
    throw error;
  }
}
