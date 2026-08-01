import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Users from './Users.jsx';

describe('Users component', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a users table when the API responds with a list', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [
        { name: 'Ava Patel', email: 'ava@example.com', team: 'Thunder', points: 120 },
      ],
    });

    render(<Users />);

    await waitFor(() => {
      expect(screen.getByText('Ava Patel')).toBeInTheDocument();
    });

    expect(screen.getByText('ava@example.com')).toBeInTheDocument();
    expect(screen.getByText('Thunder')).toBeInTheDocument();
  });

  it('renders an error message when the fetch fails', async () => {
    global.fetch.mockRejectedValue(new Error('Unable to load users'));

    render(<Users />);

    await waitFor(() => {
      expect(screen.getByText('Unable to load users')).toBeInTheDocument();
    });
  });
});
