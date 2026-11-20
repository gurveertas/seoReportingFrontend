import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'

export function ProtectedRoute() {
  const { authStatus, isAuthenticated } = useAuth()

  if (authStatus === 'checking') {
    return <div className="session-check" role="status">Verifying your session…</div>
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
}

export function GuestRoute({ children }) {
  const { authStatus, isAuthenticated } = useAuth()

  if (authStatus === 'checking') {
    return <div className="session-check" role="status">Verifying your session…</div>
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}
