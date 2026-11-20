import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import { APP_NAME } from '../config/app.js'
import { LogoutApiError, logout } from '../services/auth.js'
import { useTheme } from '../theme/useTheme.js'
import {
  DashboardIcon,
  LogoutIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
} from './icons/AppIcons.jsx'
import './AppHeader.css'

export default function AppHeader({ activePage }) {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  async function handleLogout() {
    setIsLoggingOut(true)
    setLogoutError('')
    let shouldSignOut = false

    try {
      await logout()
      shouldSignOut = true
    } catch (error) {
      if (error instanceof LogoutApiError && (error.status === 401 || error.status === 403)) {
        shouldSignOut = true
      } else {
        setLogoutError(error instanceof Error ? error.message : 'Unable to sign out. Please try again.')
      }
    } finally {
      setIsLoggingOut(false)
    }

    if (shouldSignOut) {
      signOut()
      navigate('/', { replace: true })
    }
  }

  return (
    <header className="app-header">
      <span className="app-header__brand">{APP_NAME}</span>
      <nav className="app-header__nav" aria-label="Main navigation">
        <Link
          aria-current={activePage === 'dashboard' ? 'page' : undefined}
          aria-label="Dashboard"
          className={`app-header__action${activePage === 'dashboard' ? ' is-active' : ''}`}
          to="/dashboard"
          title="Dashboard"
        >
          <DashboardIcon />
          <span className="app-header__sr-only">Dashboard</span>
        </Link>
        <Link
          aria-current={activePage === 'settings' ? 'page' : undefined}
          aria-label="Settings"
          className={`app-header__action${activePage === 'settings' ? ' is-active' : ''}`}
          to="/settings"
          title="Settings"
        >
          <SettingsIcon />
          <span className="app-header__sr-only">Settings</span>
        </Link>
        <button
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          aria-pressed={theme === 'dark'}
          className="app-header__action app-header__theme-toggle"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          type="button"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          <span className="app-header__sr-only">
            Switch to {theme === 'light' ? 'dark' : 'light'} theme
          </span>
        </button>
        <button
          aria-busy={isLoggingOut}
          aria-label={isLoggingOut ? 'Signing out' : 'Sign out'}
          className="app-header__action"
          disabled={isLoggingOut}
          onClick={handleLogout}
          title={isLoggingOut ? 'Signing out' : 'Sign out'}
          type="button"
        >
          <LogoutIcon />
          <span className="app-header__sr-only">
            {isLoggingOut ? 'Signing out' : 'Sign out'}
          </span>
        </button>
      </nav>
      {logoutError && (
        <div className="app-header__feedback" role="alert">
          <span>{logoutError}</span>
          <button
            aria-label="Dismiss sign out error"
            className="app-header__feedback-close"
            onClick={() => setLogoutError('')}
            type="button"
          >
            ×
          </button>
        </div>
      )}
    </header>
  )
}
