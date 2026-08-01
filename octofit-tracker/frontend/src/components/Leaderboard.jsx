import { useEffect, useState } from 'react';
import { buildApiEndpoint } from '../config/api.js';

function normalizeItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.items)) return payload.items;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(buildApiEndpoint('leaderboard'));
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        const payload = await response.json();
        setLeaderboard(normalizeItems(payload));
      } catch (err) {
        setError(err.message || 'Unable to load leaderboard');
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title h5">Leaderboard</h2>
        <p className="text-muted mb-3">Endpoint: /api/leaderboard/</p>
        {error ? (
          <div className="alert alert-danger mb-0">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr key={entry._id ?? `${entry.rank}-${entry.user}`}>
                    <td>{entry.rank}</td>
                    <td>{entry.user}</td>
                    <td>{entry.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
