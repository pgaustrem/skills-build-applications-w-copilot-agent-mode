import { useEffect, useState } from 'react';

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
const workoutsApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
  : 'http://localhost:8000/api/workouts/';

function normalizeItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.items)) return payload.items;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch(workoutsApiUrl);
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        const payload = await response.json();
        setWorkouts(normalizeItems(payload));
      } catch (err) {
        setError(err.message || 'Unable to load workouts');
      }
    };

    fetchWorkouts();
  }, []);

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title h5">Workouts</h2>
        <p className="text-muted mb-3">Endpoint: /api/workouts/</p>
        {error ? (
          <div className="alert alert-danger mb-0">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Focus</th>
                  <th>Difficulty</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((workout) => (
                  <tr key={workout._id ?? workout.title}>
                    <td>{workout.title}</td>
                    <td>{workout.focus}</td>
                    <td>{workout.difficulty}</td>
                    <td>{workout.duration}</td>
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
