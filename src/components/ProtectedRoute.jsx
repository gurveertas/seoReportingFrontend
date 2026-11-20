import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'

export function ProtectedRoute() {
  const { authStatus, isAuthenticated, refreshAuth } = useAuth()

  useEffect(() => {
    if (authStatus === 'idle') {
      void refreshAuth()
    }
  }, [authStatus, refreshAuth])

  if (authStatus === 'idle' || authStatus === 'checking') {
    return <div className="session-check" role="status">Verifying your session…</div>
  }

  if (authStatus === 'error') {
    return <Navigate to="/" replace />
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
}

export function GuestRoute({ children }) {
  const { authStatus, isAuthenticated, refreshAuth } = useAuth()

  useEffect(() => {
    if (authStatus === 'idle') {
      void refreshAuth()
    }
  }, [authStatus, refreshAuth])

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}
