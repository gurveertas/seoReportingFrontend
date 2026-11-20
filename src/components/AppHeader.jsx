import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import { APP_NAME } from '../config/app.js'
import { LogoutApiError, logout } from '../services/auth.js'
import { useTheme } from '../theme/useTheme.js'
import { useWorkspace } from '../workspace/useWorkspace.js'
import ClientFormDialog from './workspace/ClientFormDialog.jsx'
import {
  DashboardIcon,
  LogoutIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
} from './icons/AppIcons.jsx'

const navActionClasses = 'grid size-10.5 place-items-center rounded-xl bg-transparent text-(--text-secondary) no-underline transition hover:-translate-y-px hover:bg-(--surface-muted) hover:text-(--text-primary) disabled:cursor-wait disabled:opacity-65 focus-visible:outline-3 focus-visible:outline-(--focus-ring) focus-visible:outline-offset-[3px] max-[560px]:size-[39px] max-[420px]:size-[34px]'

export default function AppHeader({ activePage }) {
  const navigate = useNavigate()
  const { clientId } = useParams()
  const { signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { clients, createClient, updateClient } = useWorkspace()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')
  const [isClientMenuOpen, setIsClientMenuOpen] = useState(false)
  const [isCreatingClient, setIsCreatingClient] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const selectedClient = clients.find((client) => client.id === clientId)

  async function handleCreateClient(client) {
    if (editingClient) {
      await updateClient(editingClient.id, client)
      setEditingClient(null)
      return
    }
    const created = await createClient(client)
    setIsCreatingClient(false)
    setIsClientMenuOpen(false)
    navigate(`/dashboard/${created.id}`)
  }

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
    <header className="app-header flex fixed top-4.5 left-[50%] z-20 items-center justify-between w-[min(1150px,_calc(100%_-_32px))] min-h-16.5 py-0 pr-4 pl-5.5 -translate-x-1/2 border border-(--border) rounded-[18px] bg-(--surface) shadow-(--shadow-float) max-[560px]:top-3 max-[560px]:min-h-15 max-[560px]:pl-4">
      <div className="flex min-w-0 items-center gap-2 overflow-hidden">
        <Link aria-label={`${APP_NAME} dashboard`} className="app-header__brand min-w-0 overflow-hidden text-(--text-strong) font-manrope text-[19px] font-bold tracking-[-0.05em] no-underline text-ellipsis whitespace-nowrap hover:text-(--accent) focus-visible:outline-2 focus-visible:outline-(--focus-ring) max-[560px]:text-[17px] max-[420px]:text-sm" to="/dashboard">{APP_NAME}</Link>
      </div>
      <nav className="app-header__nav flex shrink-0 grow-0 basis-auto items-center gap-1.75 max-[420px]:gap-1" aria-label="Main navigation">
        {activePage === 'dashboard' && (
          <div className="relative mr-2">
            <button aria-expanded={isClientMenuOpen} aria-haspopup="menu" className="flex min-h-10 max-w-[min(34vw,240px)] items-center gap-2 rounded-xl border border-(--border) bg-(--surface) px-3 text-left text-sm font-semibold text-(--text-primary) transition hover:bg-(--surface-muted) focus-visible:outline-2 focus-visible:outline-(--focus-ring) max-sm:max-w-[42vw]" onClick={() => setIsClientMenuOpen((open) => !open)} type="button">
              <span className="truncate">{selectedClient?.name || 'Select client'}</span>
              <svg aria-hidden="true" className={`size-4 shrink-0 text-(--text-muted) transition-transform ${isClientMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24">
                <path d="m7 10 5 5 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
              </svg>
            </button>
            {isClientMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-30 w-72 max-w-[calc(100vw-32px)] rounded-xl border border-(--border) bg-(--surface) p-2 shadow-xl" role="menu" aria-label="Select a client">
                <p className="mb-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-(--text-muted)">Clients</p>
                {clients.map((client) => (
                  <button aria-current={client.id === clientId ? 'true' : undefined} className="flex min-h-10 w-full items-center justify-between gap-2 rounded-lg px-2 text-left text-sm text-(--text-primary) hover:bg-(--surface-muted)" key={client.id} onClick={() => { navigate(`/dashboard/${client.id}`); setIsClientMenuOpen(false) }} role="menuitem" type="button">
                    <span className="truncate">{client.name}</span>
                    {client.id === clientId && <span className="text-(--accent-text)">✓</span>}
                  </button>
                ))}
                {selectedClient && (
                  <button className="flex min-h-9 w-full items-center rounded-lg px-2 text-left text-xs text-(--text-secondary) hover:bg-(--surface-muted)" onClick={() => { setIsClientMenuOpen(false); setEditingClient(selectedClient) }} role="menuitem" type="button">Edit {selectedClient.name}</button>
                )}
                <div className="my-2 border-t border-(--border-subtle)" />
                <button className="flex min-h-10 w-full items-center gap-2 rounded-lg px-2 text-left text-sm font-semibold text-(--accent-text) hover:bg-(--accent-soft)" onClick={() => { setIsClientMenuOpen(false); setIsCreatingClient(true) }} role="menuitem" type="button"><span aria-hidden="true">＋</span> Add client</button>
              </div>
            )}
          </div>
        )}
        <Link
          aria-current={activePage === 'dashboard' ? 'page' : undefined}
          aria-label="Dashboard"
          className={`app-header__action ${navActionClasses} ${activePage === 'dashboard' ? 'bg-(--accent-soft) text-(--accent-text)' : ''}`}
          to="/dashboard"
          title="Dashboard"
        >
          <DashboardIcon className="size-5 stroke-current stroke-[1.7]" />
          <span className="sr-only">Dashboard</span>
        </Link>
        <Link
          aria-current={activePage === 'settings' ? 'page' : undefined}
          aria-label="Settings"
          className={`app-header__action ${navActionClasses} ${activePage === 'settings' ? 'bg-(--accent-soft) text-(--accent-text)' : ''}`}
          to="/settings"
          title="Settings"
        >
          <SettingsIcon className="size-5 stroke-current stroke-[1.7]" />
          <span className="sr-only">Settings</span>
        </Link>
        <button
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          aria-pressed={theme === 'dark'}
          className={`app-header__action app-header__theme-toggle ${navActionClasses}`}
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          type="button"
        >
          {theme === 'light' ? <MoonIcon className="size-5 stroke-current stroke-[1.7]" /> : <SunIcon className="size-5 stroke-current stroke-[1.7]" />}
          <span className="sr-only">
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
          <LogoutIcon className="size-5 stroke-current stroke-[1.7]" />
          <span className="sr-only">
            {isLoggingOut ? 'Signing out' : 'Sign out'}
          </span>
        </button>
      </nav>
      {logoutError && (
        <div className="app-header__feedback flex absolute top-[calc(100%_+_10px)] right-0 items-start justify-between gap-3 w-[min(360px,_calc(100vw_-_32px))] py-3 px-3.25 border border-(--error-border) rounded-[12px] bg-(--error-bg) shadow-(--shadow-float) text-(--error-text) text-xs leading-normal" role="alert">
          <span>{logoutError}</span>
          <button
            aria-label="Dismiss sign out error"
            className="app-header__feedback-close grid size-6 shrink-0 place-items-center rounded-md bg-transparent text-(--error-text) text-lg leading-none hover:bg-(--error-bg) focus-visible:outline-3 focus-visible:outline-(--focus-ring) focus-visible:outline-offset-0"
            onClick={() => setLogoutError('')}
            type="button"
          >
            ×
          </button>
        </div>
      )}
      {(isCreatingClient || editingClient) && <ClientFormDialog client={editingClient} onClose={() => { setIsCreatingClient(false); setEditingClient(null) }} onSave={handleCreateClient} />}
    </header>
  )
}

