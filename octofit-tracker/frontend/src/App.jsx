import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME
const baseApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : 'http://localhost:8000/api'

const navItems = [
  { to: '/', label: 'Users' },
  { to: '/teams', label: 'Teams' },
  { to: '/activities', label: 'Activities' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/workouts', label: 'Workouts' },
]

function ResourceView({ endpoint, title }) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title h5">{title}</h2>
        <p className="text-muted mb-3">Endpoint: {endpoint}</p>
        <div className="alert alert-info mb-0">
          This presentation tier is configured to call the backend at {baseApiUrl}.
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="container py-4">
      <header className="mb-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <p className="text-uppercase text-primary fw-semibold mb-1">OctoFit Tracker</p>
            <h1 className="h2 mb-0">Fitness dashboard</h1>
          </div>
          <div className="btn-group" role="navigation" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `btn btn-outline-primary ${isActive ? 'active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<ResourceView endpoint="/api/users/" title="Users" />} />
        <Route path="/teams" element={<ResourceView endpoint="/api/teams/" title="Teams" />} />
        <Route path="/activities" element={<ResourceView endpoint="/api/activities/" title="Activities" />} />
        <Route path="/leaderboard" element={<ResourceView endpoint="/api/leaderboard/" title="Leaderboard" />} />
        <Route path="/workouts" element={<ResourceView endpoint="/api/workouts/" title="Workouts" />} />
      </Routes>
    </div>
  )
}

export default App
