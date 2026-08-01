import { useEffect, useState } from 'react';

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
const usersApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/';

function normalizeItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.items)) return payload.items;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(usersApiUrl);
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        const payload = await response.json();
        setUsers(normalizeItems(payload));
      } catch (err) {
        setError(err.message || 'Unable to load users');
      }
    };

    fetchUsers();
  }, []);

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title h5">Users</h2>
        <p className="text-muted mb-3">Endpoint: /api/users/</p>
        {error ? (
          <div className="alert alert-danger mb-0">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Team</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id ?? `${user.name}-${user.email}`}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.team}</td>
                    <td>{user.points}</td>
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
