import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ConnectGoogleButton from '../components/google/ConnectGoogleButton.jsx'
import GoogleMark from '../components/google/GoogleMark.jsx'
import PageHeader, { StatCard } from '../components/layout/PageHeader.jsx'
import SiteAvatar from '../components/layout/SiteAvatar.jsx'
import ClientFormDialog from '../components/workspace/ClientFormDialog.jsx'
import SessionLoading from '../components/SessionLoading.jsx'
import { useAuth } from '../auth/useAuth.js'
import { getConnections } from '../services/google.js'
import { listWorkspaceReports, monthLabel } from '../services/reports.js'
import { useWorkspace } from '../workspace/useWorkspace.js'

function siteUrl(client) {
  const url = client.integrations?.gsc?.property_url
  return url ? url.replace(/^sc-domain:/, '').replace(/^https?:\/\//, '').replace(/\/$/, '') : 'No Search Console property'
}

export default function OverviewPage() {
  const { currentUser } = useAuth()
  const { clients, isLoading, error, reloadClients, createClient } = useWorkspace()
  const [reports, setReports] = useState({ items: [], latest: null, loaded: false })
  const [connections, setConnections] = useState(null)
  const [isAddingManually, setIsAddingManually] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    listWorkspaceReports(controller.signal)
      .then((result) => setReports({ items: result.reports, latest: result.latest_reportable_month, loaded: true }))
      .catch(() => setReports((current) => ({ ...current, loaded: true })))
    getConnections(controller.signal).then(setConnections).catch(() => setConnections([]))
    return () => controller.abort()
  }, [])

  const latestByClient = useMemo(() => {
    const map = {}
    for (const report of reports.items) {
      if (!map[report.client_id] || report.month > map[report.client_id].month) map[report.client_id] = report
    }
    return map
  }, [reports.items])

  if (isLoading) return <SessionLoading message="Loading your workspace…" />
  if (error) {
    return (
      <div className="rounded-xl border border-error-border bg-error-bg p-5 text-sm text-error-text" role="alert">
        <p className="m-0">{error}</p>
        <button className="mt-3 rounded-lg border border-error-border bg-surface px-3 py-1.5 text-xs font-semibold" onClick={() => reloadClients().catch(() => {})} type="button">Retry</button>
      </div>
    )
  }

  const firstName = (currentUser?.fullname || '').split(' ')[0]
  const autoCount = clients.filter((client) => client.autoMonthly).length
  const readyForLatest = clients.filter((client) => latestByClient[client.id]?.month === reports.latest).length
  const coverage = clients.length ? Math.round((readyForLatest / clients.length) * 100) : 0

  if (clients.length === 0) {
    return (
      <>
        <PageHeader eyebrow="Welcome" title={firstName ? `Hi ${firstName}, let’s get you set up` : 'Let’s get you set up'} />
        <section className="grid overflow-hidden rounded-3xl border border-line bg-surface md:grid-cols-link-site">
          <div className="p-10 max-sm:p-6">
            <span className="mb-5 grid size-12 place-items-center rounded-2xl bg-surface-muted"><GoogleMark className="size-7" /></span>
            <h2 className="m-0 font-heading text-2xl font-extrabold tracking-tight">Connect Google to see your websites</h2>
            <p className="mb-6 mt-3 max-w-md text-sm leading-6 text-ink-secondary">Sign in with the Google account you use for Search Console. Every website it can access is listed, ready to add with one click.</p>
            <ConnectGoogleButton />
            <p className="mb-0 mt-5 text-xs text-ink-muted">
              Using a service account?{' '}
              <button className="font-semibold text-accent-text underline underline-offset-2" onClick={() => setIsAddingManually(true)} type="button">Add a website manually</button>
            </p>
          </div>
          <ol className="m-0 grid content-center gap-5 border-l border-line-subtle bg-surface-subtle p-10 max-md:border-l-0 max-md:border-t max-sm:p-6">
            {[
              ['Connect', 'Read-only access to Search Console and Analytics.'],
              ['Pick websites', 'Analytics properties are matched automatically.'],
              ['Get reports', 'A PDF for every website, every month.'],
            ].map(([title, text], index) => (
              <li className="flex list-none gap-4" key={title}>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent-text">{index + 1}</span>
                <span>
                  <span className="block text-sm font-semibold">{title}</span>
                  <span className="block text-xs leading-5 text-ink-secondary">{text}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
        {isAddingManually && (
          <ClientFormDialog onClose={() => setIsAddingManually(false)} onSave={async (values) => { await createClient(values); setIsAddingManually(false) }} />
        )}
      </>
    )
  }

  return (
    <>
      <PageHeader
        description="Search performance and monthly reports across every website in your workspace."
        eyebrow={new Intl.DateTimeFormat(undefined, { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}
        title={firstName ? `Welcome back, ${firstName}` : 'Overview'}
      />

      <section aria-label="Workspace summary" className="mb-6 grid grid-cols-4 gap-4 max-xl:grid-cols-2 max-sm:gap-3">
        <StatCard className="max-sm:col-span-2" accent hint={reports.latest ? `${readyForLatest} of ${clients.length} websites` : ' '} label={reports.latest ? `${monthLabel(reports.latest)} reports` : 'Latest reports'} value={`${coverage}%`}>
          <div aria-hidden="true" className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-white" style={{ width: `${coverage}%` }} /></div>
        </StatCard>
        <StatCard hint="Added to this workspace" label="Websites" value={clients.length} />
        <StatCard hint={`${clients.length - autoCount} manual`} label="Auto-monthly on" value={autoCount} />
        <StatCard hint={connections?.some((item) => item.status === 'error') ? 'One needs reconnecting' : 'Connected'} label="Google accounts" value={connections ? connections.length : '–'} />
      </section>

      <section aria-labelledby="websites-table" className="overflow-hidden rounded-2xl border border-line bg-surface">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line-subtle px-5 py-4">
          <div>
            <h2 className="m-0 text-body-lg font-bold" id="websites-table">Websites</h2>
            <p className="m-0 mt-0.5 text-xs text-ink-muted">Latest report status for each website</p>
          </div>
          <Link className="rounded-lg border border-line-strong px-3 py-1.5 text-xs font-semibold hover:bg-surface-muted" to="/reports">All reports</Link>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-reports-table border-collapse text-left text-body-sm">
            <thead>
              <tr className="bg-table-head-bg text-label uppercase tracking-wider text-ink-muted">
                <th className="px-5 py-2.5 font-semibold">Website</th>
                <th className="px-3 py-2.5 font-semibold">Sources</th>
                <th className="px-3 py-2.5 font-semibold">Schedule</th>
                <th className="px-3 py-2.5 font-semibold">Latest report</th>
                <th className="px-5 py-2.5"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => {
                const latest = latestByClient[client.id]
                const isCurrent = latest && latest.month === reports.latest
                return (
                  <tr className="border-t border-line-subtle transition hover:bg-surface-subtle" key={client.id}>
                    <td className="px-5 py-3">
                      <Link className="flex min-w-0 items-center gap-3" to={`/dashboard/${client.id}`}>
                        <SiteAvatar name={client.name} />
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-ink">{client.name}</span>
                          <span className="block truncate text-xs text-ink-muted">{siteUrl(client)}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <span className="flex gap-1.5">
                        <SourcePill on={client.integrations?.gsc?.enabled} label="GSC" />
                        <SourcePill on={client.integrations?.ga4?.enabled} label="GA4" />
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-label font-semibold ${client.autoMonthly ? 'bg-positive-bg text-positive-text' : 'bg-surface-muted text-ink-secondary'}`}>
                        <span className={`size-1.5 rounded-full ${client.autoMonthly ? 'bg-positive-text' : 'bg-ink-faint'}`} />
                        {client.autoMonthly ? 'Auto monthly' : 'Manual'}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {!reports.loaded ? <span className="text-ink-faint">…</span> : latest ? (
                        <span className="flex items-center gap-2">
                          <span className="font-medium">{monthLabel(latest.month, 'short')}</span>
                          {!isCurrent && <span className="rounded-full bg-warning-bg px-2 py-0.5 text-caption font-semibold text-warning-text">{monthLabel(reports.latest, 'short')} due</span>}
                        </span>
                      ) : <span className="rounded-full bg-warning-bg px-2 py-0.5 text-label font-semibold text-warning-text">None yet</span>}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link className="text-xs font-semibold text-accent-text hover:underline" to={`/dashboard/${client.id}`}>Open →</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function SourcePill({ on, label }) {
  return (
    <span className={`rounded-md px-1.5 py-0.5 text-caption font-bold ${on ? 'bg-accent-soft text-accent-text' : 'bg-surface-muted text-ink-faint line-through'}`} title={on ? `${label} connected` : `${label} not connected`}>{label}</span>
  )
}
