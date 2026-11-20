import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import { APP_NAME } from '../config/app.js'
import { MOCK_API_ENABLED } from '../config/api.js'
import { LogoutApiError, logout } from '../services/auth.js'
import { useTheme } from '../theme/useTheme.js'
import {
  CodeIcon,
  DashboardIcon,
  LogoutIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
} from './icons/AppIcons.jsx'

const navActionClasses = '[display:grid] [width:42px] [height:42px] [padding:0] [place-items:center] [border:0] [border-radius:12px] [background:transparent] [color:var(--text-secondary)] [cursor:pointer] [text-decoration:none] [transition:background_160ms_ease,_color_160ms_ease,_transform_160ms_ease] [&:hover]:[transform:translateY(-1px)] [&:hover]:[background:var(--surface-muted)] [&:hover]:[color:var(--text-primary)] [&:disabled]:[cursor:wait] [&:disabled]:[opacity:0.65] [&.is-active]:[background:var(--accent-soft)] [&.is-active]:[color:var(--accent-text)] [&_svg]:[width:20px] [&_svg]:[height:20px] [&_svg]:[stroke:currentColor] [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] [&_svg]:[stroke-width:1.7] [&:focus-visible]:[outline:3px_solid_var(--focus-ring)] [&:focus-visible]:[outline-offset:3px] max-[560px]:[width:39px] max-[560px]:[height:39px] max-[420px]:[width:34px] max-[420px]:[height:34px]'

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
    <header className="app-header [display:flex] [position:fixed] [top:18px] [left:50%] [z-index:20] [align-items:center] [justify-content:space-between] [width:min(1150px,_calc(100%_-_32px))] [min-height:66px] [padding:0_16px_0_22px] [transform:translateX(-50%)] [border:1px_solid_var(--border)] [border-radius:18px] [background:var(--surface)] [box-shadow:var(--shadow-float)] max-[560px]:[top:12px] max-[560px]:[min-height:60px] max-[560px]:[padding-left:16px]">
      <a className="[position:fixed] [top:8px] [left:8px] [z-index:50] [transform:translateY(-160%)] [padding:10px_14px] [border-radius:8px] [background:var(--accent)] [color:#fff] [font-size:12px] [font-weight:700] [text-decoration:none] [transition:transform_150ms_ease] [&:focus]:[transform:translateY(0)] [&:focus-visible]:[outline:3px_solid_var(--focus-ring)] [&:focus-visible]:[outline-offset:3px] motion-reduce:[transition:none]" href="#main-content">Skip to main content</a>
      <div className="[display:flex] [min-width:0] [align-items:center] [gap:8px] [overflow:hidden]">
        <span className="app-header__brand [min-width:0] [overflow:hidden] [color:var(--text-strong)] [font-family:'Manrope',_sans-serif] [font-size:19px] [font-weight:750] [letter-spacing:-0.05em] [text-overflow:ellipsis] [white-space:nowrap] max-[560px]:[font-size:17px] max-[420px]:[font-size:14px]">{APP_NAME}</span>
        {MOCK_API_ENABLED && <span className="[flex:0_0_auto] [padding:4px_6px] [border-radius:5px] [background:var(--accent-soft)] [color:var(--accent-text)] [font-size:8px] [font-weight:800] [letter-spacing:0.07em]">DEMO</span>}
      </div>
      <nav className="app-header__nav [display:flex] [flex:0_0_auto] [align-items:center] [gap:7px] max-[420px]:[gap:4px]" aria-label="Main navigation">
        <Link
          aria-current={activePage === 'dashboard' ? 'page' : undefined}
          aria-label="Dashboard"
          className={`app-header__action${activePage === 'dashboard' ? ' is-active' : ''} ${navActionClasses}`}
          to="/dashboard"
          title="Dashboard"
        >
          <DashboardIcon />
          <span className="app-header__sr-only [position:absolute] [overflow:hidden] [width:1px] [height:1px] [clip:rect(0,_0,_0,_0)] [white-space:nowrap] [clip-path:inset(50%)]">Dashboard</span>
        </Link>
        <Link
          aria-current={activePage === 'test-api' ? 'page' : undefined}
          aria-label="API tester"
          className={`app-header__action${activePage === 'test-api' ? ' is-active' : ''} ${navActionClasses}`}
          to="/test-api"
          title="API tester"
        >
          <CodeIcon />
          <span className="app-header__sr-only [position:absolute] [overflow:hidden] [width:1px] [height:1px] [clip:rect(0,_0,_0,_0)] [white-space:nowrap] [clip-path:inset(50%)]">API tester</span>
        </Link>
        <Link
          aria-current={activePage === 'settings' ? 'page' : undefined}
          aria-label="Settings"
          className={`app-header__action${activePage === 'settings' ? ' is-active' : ''} ${navActionClasses}`}
          to="/settings"
          title="Settings"
        >
          <SettingsIcon />
          <span className="app-header__sr-only [position:absolute] [overflow:hidden] [width:1px] [height:1px] [clip:rect(0,_0,_0,_0)] [white-space:nowrap] [clip-path:inset(50%)]">Settings</span>
        </Link>
        <button
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          aria-pressed={theme === 'dark'}
          className={`app-header__action app-header__theme-toggle ${navActionClasses}`}
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          type="button"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          <span className="app-header__sr-only [position:absolute] [overflow:hidden] [width:1px] [height:1px] [clip:rect(0,_0,_0,_0)] [white-space:nowrap] [clip-path:inset(50%)]">
            Switch to {theme === 'light' ? 'dark' : 'light'} theme
          </span>
        </button>
        <button
          aria-busy={isLoggingOut}
          aria-label={isLoggingOut ? 'Signing out' : 'Sign out'}
          className={`app-header__action ${navActionClasses}`}
          disabled={isLoggingOut}
          onClick={handleLogout}
          title={isLoggingOut ? 'Signing out' : 'Sign out'}
          type="button"
        >
          <LogoutIcon />
          <span className="app-header__sr-only [position:absolute] [overflow:hidden] [width:1px] [height:1px] [clip:rect(0,_0,_0,_0)] [white-space:nowrap] [clip-path:inset(50%)]">
            {isLoggingOut ? 'Signing out' : 'Sign out'}
          </span>
        </button>
      </nav>
      {logoutError && (
        <div className="app-header__feedback [display:flex] [position:absolute] [top:calc(100%_+_10px)] [right:0] [align-items:flex-start] [justify-content:space-between] [gap:12px] [width:min(360px,_calc(100vw_-_32px))] [padding:12px_13px] [border:1px_solid_var(--error-border)] [border-radius:12px] [background:var(--error-bg)] [box-shadow:var(--shadow-float)] [color:var(--error-text)] [font-size:12px] [line-height:1.5]" role="alert">
          <span>{logoutError}</span>
          <button
            aria-label="Dismiss sign out error"
            className="app-header__feedback-close [display:grid] [flex:0_0_24px] [width:24px] [height:24px] [padding:0] [place-items:center] [border:0] [border-radius:6px] [background:transparent] [color:var(--error-text)] [cursor:pointer] [font:inherit] [font-size:18px] [line-height:1] [&:hover]:[background:color-mix(in_srgb,_var(--error-text)_10%,_transparent)] [&:focus-visible]:[outline:3px_solid_var(--focus-ring)] [&:focus-visible]:[outline-offset:2px]"
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

