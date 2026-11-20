import { Link } from 'react-router-dom'
import { APP_NAME } from '../config/app.js'
import { useTheme } from '../theme/useTheme.js'
import { DashboardIcon, MoonIcon, SettingsIcon, SunIcon } from './icons/AppIcons.jsx'
import './AppHeader.css'

export default function AppHeader({ activePage }) {
  const { theme, toggleTheme } = useTheme()

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
      </nav>
    </header>
  )
}
