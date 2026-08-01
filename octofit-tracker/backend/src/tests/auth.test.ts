import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../server.js';
import { User } from '../models/index.js';
import { createTokenForUser, signToken, verifyToken } from '../utils/auth.js';
import { connectDatabase } from '../config/database.js';

let mongod: MongoMemoryServer;
let app: ReturnType<typeof createApp>;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  mongod = await MongoMemoryServer.create();
  await connectDatabase(mongod.getUri('octofit_db'));
  app = createApp();

  await User.create({
    name: 'Ava Patel',
    email: 'ava@example.com',
    team: 'Thunder',
    points: 120,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await User.create({
    name: 'Ava Patel',
    email: 'ava@example.com',
    team: 'Thunder',
    points: 120,
  });
});

describe('auth utilities', () => {
  it('creates a token that can be verified round-trip', () => {
    const token = createTokenForUser({ _id: '123', email: 'ava@example.com' });
    const payload = verifyToken(token);

    expect(payload).not.toBeNull();
    expect(payload?.sub).toBe('123');
    expect(payload?.email).toBe('ava@example.com');
    expect(payload?.provider).toBe('oauth2');
  });

  it('rejects a malformed token', () => {
    expect(verifyToken('not-a-token')).toBeNull();
  });
});

describe('login and protected routes', () => {
  it('returns 400 when email is missing', async () => {
    const response = await request(app).post('/api/auth/login/').send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('email is required');
  });

  it('returns 403 when email is not registered', async () => {
    const response = await request(app).post('/api/auth/login/').send({ email: 'missing@example.com' });

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Only registered users can sign in');
  });

  it('returns a token for a registered user', async () => {
    const response = await request(app).post('/api/auth/login/').send({ email: 'ava@example.com' });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
    expect(response.body.user.email).toBe('ava@example.com');
  });

  it('rejects an invalid bearer token for users route', async () => {
    const response = await request(app)
      .get('/api/users/')
      .set('Authorization', 'Bearer not-a-real-token');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized' });
    expect(response.headers['content-type']).toContain('application/json');
  });

  it('rejects a mismatched bearer token signature for users route', async () => {
    const token = signToken({
      sub: '123',
      email: 'ava@example.com',
      provider: 'oauth2',
      exp: Math.floor(Date.now() / 1000) + 60,
    });

    const [header, body, signature] = token.split('.');
    const tamperedToken = `${header}.${body}.not-a-valid-signature`;

    const response = await request(app)
      .get('/api/users/')
      .set('Authorization', `Bearer ${tamperedToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized' });
  });

  it('rejects an expired bearer token for users route', async () => {
    const expiredToken = signToken({
      sub: '123',
      email: 'ava@example.com',
      provider: 'oauth2',
      exp: Math.floor(Date.now() / 1000) - 5,
    });

    const response = await request(app)
      .get('/api/users/')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized' });
  });

  it('protects the users list without a bearer token', async () => {
    const response = await request(app).get('/api/users/');

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
  });

  it('allows access to the users list with a valid bearer token', async () => {
    const loginResponse = await request(app).post('/api/auth/login/').send({ email: 'ava@example.com' });
    const token = loginResponse.body.token;

    const response = await request(app)
      .get('/api/users/')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it.each([
    '/api/teams/',
    '/api/activities/',
    '/api/leaderboard/',
    '/api/workouts/',
  ])('protects %s consistently without a bearer token', async (route) => {
    const response = await request(app).get(route);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized' });
    expect(response.headers['content-type']).toContain('application/json');
  });
});
