import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth.js'
import { APP_NAME } from '../../config/app.js'
import { LogoutApiError, logout } from '../../services/auth.js'
import { useTheme } from '../../theme/useTheme.js'
import { useWorkspace } from '../../workspace/useWorkspace.js'
import {
  ChevronRightIcon,
  CloseIcon,
  GlobeIcon,
  HomeIcon,
  LogoutIcon,
  MenuIcon,
  MoonIcon,
  PlusIcon,
  ReportsIcon,
  SearchIcon,
  SettingsIcon,
  SidebarIcon,
  SunIcon,
} from '../icons/AppIcons.jsx'
import SiteAvatar from './SiteAvatar.jsx'

const NAV = [
  { to: '/dashboard', label: 'Overview', icon: HomeIcon, end: true },
  { to: '/reports', label: 'Reports', icon: ReportsIcon },
  { to: '/sites', label: 'Import sites', icon: GlobeIcon },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]

const COLLAPSE_KEY = 'sidebar-collapsed'

function readCollapsed() {
  try {
    return window.localStorage.getItem(COLLAPSE_KEY) === '1'
  } catch {
    return false
  }
}


export default function AppLayout() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(readCollapsed)
  // The drawer stays open only on the page it was opened from, so any
  // navigation closes it without an extra effect.
  const [openedOn, setOpenedOn] = useState(null)
  const mobileOpen = openedOn === location.pathname
  const setMobileOpen = (open) => setOpenedOn(open ? location.pathname : null)

  useEffect(() => {
    if (!mobileOpen) return undefined
    const onKey = (event) => { if (event.key === 'Escape') setOpenedOn(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  function toggleCollapsed() {
    setCollapsed((value) => {
      try { window.localStorage.setItem(COLLAPSE_KEY, value ? '0' : '1') } catch { /* storage unavailable */ }
      return !value
    })
  }

  return (
    <div className="min-h-screen bg-page-bg text-ink">
      <a className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-60 focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:shadow" href="#main-content">Skip to content</a>

      {mobileOpen && <div aria-hidden="true" className="fixed inset-0 z-40 bg-black/40 backdrop-blur-hairline lg:hidden" onClick={() => setMobileOpen(false)} />}

      <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      <div className={`transition-all duration-200 ${collapsed ? 'lg:pl-19' : 'lg:pl-66'}`}>
        <Topbar collapsed={collapsed} onMenu={() => setMobileOpen(true)} onToggleCollapsed={toggleCollapsed} />
        <main className="mx-auto w-full max-w-workspace px-8 pb-16 pt-7 max-md:px-5 max-sm:px-4" id="main-content" tabIndex="-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function Sidebar({ collapsed, mobileOpen, onCloseMobile }) {
  const location = useLocation()
  const { clients } = useWorkspace()
  const [query, setQuery] = useState('')
  const hide = collapsed ? 'lg:hidden' : ''
  const visibleClients = useMemo(() => {
    const term = query.trim().toLowerCase()
    return term ? clients.filter((client) => client.name.toLowerCase().includes(term)) : clients
  }, [clients, query])

  return (
    <aside
      aria-label="Sidebar"
      className={`fixed inset-y-0 left-0 z-50 flex w-66 flex-col border-r border-line bg-surface transition-all duration-200 ${collapsed ? 'lg:w-19' : ''}  ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}
    >
      <div className={`flex h-16 shrink-0 items-center gap-3 border-b border-line-subtle px-5 ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}>
        <Link aria-label={`${APP_NAME} overview`} className="flex min-w-0 items-center gap-3" to="/dashboard">
          <span aria-hidden="true" className={`${collapsed ? 'lg:grid' : 'hidden'} size-9 shrink-0 place-items-center font-heading text-2xl font-extrabold tracking-tighter text-accent`}>
            F
          </span>
          <span className={`min-w-0 ${hide}`}>
            <span className="block truncate font-heading text-brand font-extrabold tracking-tight text-ink-strong">{APP_NAME}</span>
            <span className="block text-label font-medium text-ink-muted">SEO reporting</span>
          </span>
        </Link>
        <button aria-label="Close menu" className="ml-auto grid size-8 place-items-center rounded-lg text-ink-secondary hover:bg-surface-muted lg:hidden" onClick={onCloseMobile} type="button"><CloseIcon /></button>
      </div>

      <nav aria-label="Main navigation" className="shrink-0 px-3 pt-4">
        <p className={`mb-1.5 px-3 text-caption font-bold uppercase tracking-eyebrow text-ink-faint ${hide}`}>Workspace</p>
        <ul className="m-0 grid gap-0.5 p-0">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <li className="list-none" key={to}>
              <NavLink
                className={({ isActive }) => `group relative flex h-10 items-center gap-3 rounded-xl px-3 text-nav font-semibold transition  ${collapsed ? 'lg:justify-center lg:px-0' : ''}  ${isActive ? 'bg-accent-soft text-accent-text' : 'text-ink-secondary hover:bg-surface-muted hover:text-ink'}`}
                end={end}
                title={collapsed ? label : undefined}
                to={to}
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span aria-hidden="true" className="absolute -left-3 top-2 h-6 w-1 rounded-r-full bg-accent" />}
                    <Icon />
                    <span className={hide}>{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-5 my-4 h-px shrink-0 bg-line-subtle" />

      <section aria-labelledby="sidebar-sites" className="flex min-h-0 flex-1 flex-col px-3">
        <div className={`mb-2 flex items-center justify-between px-3 ${hide}`}>
          <h2 className="m-0 text-caption font-bold uppercase tracking-eyebrow text-ink-faint" id="sidebar-sites">Websites</h2>
          <span className="rounded-full bg-surface-muted px-2 py-0.5 text-caption font-bold text-ink-secondary">{clients.length}</span>
        </div>
        {clients.length > 5 && (
          <label className={`relative mb-2 block ${hide}`}>
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"><SearchIcon className="size-4" /></span>
            <span className="sr-only">Search websites</span>
            <input className="h-9 w-full rounded-lg border border-line bg-surface-subtle pl-9 pr-3 text-xs outline-none placeholder:text-ink-faint focus:border-accent" onChange={(event) => setQuery(event.target.value)} placeholder="Find a website" type="search" value={query} />
          </label>
        )}
        <ul className="m-0 -mr-1 min-h-0 flex-1 overflow-y-auto p-0 pr-1 scrollbar-thin">
          {visibleClients.map((client) => {
            const active = location.pathname === `/dashboard/${client.id}`
            return (
              <li className="list-none" key={client.id}>
                <Link
                  aria-current={active ? 'page' : undefined}
                  className={`flex h-10 items-center gap-2.5 rounded-xl px-2.5 text-body-sm transition ${collapsed ? 'lg:justify-center lg:px-0' : ''}  ${active ? 'bg-surface-muted font-semibold text-ink' : 'text-ink-secondary hover:bg-surface-muted hover:text-ink'}`}
                  title={collapsed ? client.name : undefined}
                  to={`/dashboard/${client.id}`}
                >
                  <SiteAvatar name={client.name} size="sm" />
                  <span className={`min-w-0 flex-1 truncate ${hide}`}>{client.name}</span>
                  {client.autoMonthly && <span className={`size-1.5 shrink-0 rounded-full bg-positive-text ${hide}`} title="Auto-monthly on" />}
                </Link>
              </li>
            )
          })}
          {clients.length > 0 && visibleClients.length === 0 && <li className={`list-none px-3 py-2 text-xs text-ink-muted ${hide}`}>No matches</li>}
        </ul>
        <Link className={`mb-3 mt-2 flex h-10 shrink-0 items-center gap-2.5 rounded-xl border border-dashed border-line-strong px-3 text-body-sm font-semibold text-ink-secondary transition hover:border-accent hover:text-accent-text  ${collapsed ? 'lg:justify-center lg:px-0' : ''}`} title={collapsed ? 'Add websites' : undefined} to="/sites">
          <PlusIcon />
          <span className={hide}>Add websites</span>
        </Link>
      </section>

      <UserCard collapsed={collapsed} />
    </aside>
  )
}

function UserCard({ collapsed }) {
  const navigate = useNavigate()
  const { currentUser, signOut } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [error, setError] = useState('')
  const name = currentUser?.fullname || currentUser?.username || 'Account'
  const initials = name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()

  async function handleLogout() {
    setIsLoggingOut(true)
    setError('')
    try {
      await logout()
    } catch (logoutError) {
      if (!(logoutError instanceof LogoutApiError && [401, 403].includes(logoutError.status))) {
        setError(logoutError instanceof Error ? logoutError.message : 'Unable to sign out.')
        setIsLoggingOut(false)
        return
      }
    }
    signOut()
    navigate('/', { replace: true })
  }

  return (
    <div className="shrink-0 border-t border-line-subtle p-3">
      {error && <p className="m-0 mb-2 px-2 text-label text-error-text" role="alert">{error}</p>}
      <div className={`flex items-center gap-3 rounded-xl p-2 ${collapsed ? 'lg:flex-col lg:gap-2 lg:p-1' : ''}`}>
        <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent-text">{initials}</span>
        <span className={`min-w-0 flex-1 ${collapsed ? 'lg:hidden' : ''}`}>
          <span className="block truncate text-body-sm font-semibold">{name}</span>
          {currentUser?.username && <span className="block truncate text-label text-ink-muted">@{currentUser.username}</span>}
        </span>
        <button aria-label={isLoggingOut ? 'Signing out' : 'Sign out'} className="grid size-8 shrink-0 place-items-center rounded-lg text-ink-muted transition hover:bg-error-bg hover:text-error-text disabled:cursor-wait disabled:opacity-60" disabled={isLoggingOut} onClick={handleLogout} title="Sign out" type="button">
          <LogoutIcon />
        </button>
      </div>
    </div>
  )
}

const PAGE_TITLES = {
  '/dashboard': 'Overview',
  '/reports': 'Reports',
  '/sites': 'Import sites',
  '/settings': 'Settings',
}

function Topbar({ collapsed, onMenu, onToggleCollapsed }) {
  const location = useLocation()
  const { clients } = useWorkspace()
  const { theme, toggleTheme } = useTheme()
  const websiteMatch = location.pathname.match(/^\/dashboard\/([^/]+)/)
  const website = websiteMatch ? clients.find((client) => client.id === websiteMatch[1]) : null
  const crumbs = website
    ? [{ label: 'Overview', to: '/dashboard' }, { label: website.name }]
    : [{ label: PAGE_TITLES[location.pathname] || APP_NAME }]

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-page-bg/85 px-8 backdrop-blur-md max-md:px-5 max-sm:px-4">
      <button aria-label="Open menu" className="grid size-9 place-items-center rounded-lg border border-line bg-surface text-ink-secondary lg:hidden" onClick={onMenu} type="button"><MenuIcon /></button>
      <button aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-pressed={collapsed} className="hidden size-9 place-items-center rounded-lg text-ink-secondary transition hover:bg-surface-muted hover:text-ink lg:grid" onClick={onToggleCollapsed} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} type="button"><SidebarIcon /></button>
      <span aria-hidden="true" className="hidden h-5 w-px bg-line lg:block" />
      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        <ol className="m-0 flex min-w-0 items-center gap-1.5 p-0 text-body-sm">
          {crumbs.map((crumb, index) => (
            <li className="flex min-w-0 list-none items-center gap-1.5" key={crumb.label}>
              {index > 0 && <span aria-hidden="true" className="text-ink-faint"><ChevronRightIcon className="size-3.5 stroke-2" /></span>}
              {crumb.to
                ? <Link className="truncate text-ink-muted hover:text-ink" to={crumb.to}>{crumb.label}</Link>
                : <span aria-current="page" className="truncate font-semibold text-ink">{crumb.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <Link className="inline-flex h-9 items-center gap-2 rounded-lg bg-accent px-3.5 text-body-sm font-semibold text-white transition hover:bg-accent-hover max-sm:hidden" to="/sites"><PlusIcon className="size-4" />Add websites</Link>
      <button aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} aria-pressed={theme === 'dark'} className="grid size-9 place-items-center rounded-lg text-ink-secondary transition hover:text-ink" onClick={toggleTheme} title="Toggle theme" type="button">
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
      </button>
    </header>
  )
}
