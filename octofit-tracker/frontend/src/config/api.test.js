import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';

describe('api configuration', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_CODESPACE_NAME', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses the localhost API base by default', async () => {
    const { apiBaseUrl } = await import('./api.js');
    expect(apiBaseUrl).toBe('http://localhost:8000/api');
  });

  it('builds a resource endpoint with the expected trailing slash', async () => {
    const { buildApiEndpoint } = await import('./api.js');
    expect(buildApiEndpoint('users')).toBe('http://localhost:8000/api/users/');
  });
});
