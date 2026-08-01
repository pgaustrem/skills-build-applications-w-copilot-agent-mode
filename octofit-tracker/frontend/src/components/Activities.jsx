import { useEffect, useState } from 'react';

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
const activitiesApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
  : 'http://localhost:8000/api/activities/';

function normalizeItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.items)) return payload.items;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(activitiesApiUrl);
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        const payload = await response.json();
        setActivities(normalizeItems(payload));
      } catch (err) {
        setError(err.message || 'Unable to load activities');
      }
    };

    fetchActivities();
  }, []);

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title h5">Activities</h2>
        <p className="text-muted mb-3">Endpoint: /api/activities/</p>
        {error ? (
          <div className="alert alert-danger mb-0">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Calories</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity._id ?? `${activity.user}-${activity.type}`}>
                    <td>{activity.user}</td>
                    <td>{activity.type}</td>
                    <td>{activity.duration}</td>
                    <td>{activity.calories}</td>
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
