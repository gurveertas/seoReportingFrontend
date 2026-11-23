import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DownloadIcon } from '../components/icons/AppIcons.jsx'
import PageHeader from '../components/layout/PageHeader.jsx'
import SiteAvatar from '../components/layout/SiteAvatar.jsx'
import { downloadStoredReport, listWorkspaceReports, monthLabel, savePdfBlob } from '../services/reports.js'
import { useWorkspace } from '../workspace/useWorkspace.js'

function formatDate(value) {
  return value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : ''
}

function formatSize(bytes) {
  return bytes ? `${Math.max(1, Math.round(bytes / 1024))} KB` : ''
}

export default function ReportsPage() {
  const { clients } = useWorkspace()
  const [state, setState] = useState({ status: 'loading', reports: [], error: '' })
  const [clientFilter, setClientFilter] = useState('')
  const [monthFilter, setMonthFilter] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    listWorkspaceReports(controller.signal)
      .then((result) => setState({ status: 'ready', reports: result.reports, error: '' }))
      .catch((error) => { if (!controller.signal.aborted) setState({ status: 'error', reports: [], error: error.message }) })
    return () => controller.abort()
  }, [reloadKey])

  const names = useMemo(() => Object.fromEntries(clients.map((client) => [client.id, client.name])), [clients])
  const months = useMemo(() => [...new Set(state.reports.map((report) => report.month))].sort().reverse(), [state.reports])
  const rows = state.reports.filter((report) => (!clientFilter || report.client_id === clientFilter) && (!monthFilter || report.month === monthFilter))

  async function handleDownload(report) {
    setBusyId(report.report_id)
    setActionError('')
    try {
      await savePdfBlob(await downloadStoredReport(report.client_id, report.report_id), report.filename)
    } catch (error) {
      setActionError(error.message)
    } finally {
      setBusyId(null)
    }
  }

  const selectClasses = 'h-9 rounded-lg border border-line-strong bg-surface px-3 text-xs font-medium text-ink outline-none focus:border-accent'

  return (
    <>
      <PageHeader description="Every saved monthly PDF across your websites. Generate new ones from a website’s page." eyebrow="Library" title="Reports" />

      <section className="overflow-hidden rounded-2xl border border-line bg-surface">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line-subtle px-5 py-3.5">
          <p className="m-0 text-xs text-ink-muted">{rows.length} report{rows.length === 1 ? '' : 's'}</p>
          <div className="flex flex-wrap gap-2">
            <select aria-label="Filter by website" className={selectClasses} onChange={(event) => setClientFilter(event.target.value)} value={clientFilter}>
              <option value="">All websites</option>
              {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
            </select>
            <select aria-label="Filter by month" className={selectClasses} onChange={(event) => setMonthFilter(event.target.value)} value={monthFilter}>
              <option value="">All months</option>
              {months.map((month) => <option key={month} value={month}>{monthLabel(month)}</option>)}
            </select>
          </div>
        </header>

        {actionError && <p className="m-0 border-b border-line-subtle bg-error-bg px-5 py-2.5 text-sm text-error-text" role="alert">{actionError}</p>}

        {state.status === 'loading' ? (
          <p className="m-0 px-5 py-12 text-center text-sm text-ink-secondary" role="status">Loading reports…</p>
        ) : state.status === 'error' ? (
          <div className="flex items-center justify-between gap-3 px-5 py-6 text-sm text-error-text" role="alert">
            <span>{state.error}</span>
            <button className="rounded-lg border border-error-border px-3 py-1.5 text-xs font-semibold" onClick={() => setReloadKey((key) => key + 1)} type="button">Try again</button>
          </div>
        ) : rows.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="m-0 text-sm font-semibold">No reports {state.reports.length ? 'match these filters' : 'yet'}</p>
            <p className="mb-0 mt-1 text-xs text-ink-muted">Open a website and click <strong>Generate report</strong>, or turn on auto-monthly.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-sites-table border-collapse text-left text-body-sm">
              <thead>
                <tr className="bg-table-head-bg text-label uppercase tracking-wider text-ink-muted">
                  <th className="px-5 py-2.5 font-semibold">Website</th>
                  <th className="px-3 py-2.5 font-semibold">Month</th>
                  <th className="px-3 py-2.5 font-semibold">Generated</th>
                  <th className="px-3 py-2.5 font-semibold">Source</th>
                  <th className="px-5 py-2.5"><span className="sr-only">Download</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((report) => {
                  const name = names[report.client_id] || report.client_name || 'Website'
                  return (
                    <tr className="border-t border-line-subtle transition hover:bg-surface-subtle" key={report.report_id}>
                      <td className="px-5 py-3">
                        <Link className="flex items-center gap-3" to={`/dashboard/${report.client_id}`}>
                          <SiteAvatar name={name} />
                          <span className="min-w-0">  
                            <span className="block truncate font-semibold">{name}</span>
                            <span className="block truncate text-xs text-ink-muted">{report.filename} · {formatSize(report.size)}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="px-3 py-3 font-medium">{monthLabel(report.month)}</td>
                      <td className="px-3 py-3 text-ink-secondary">
                        {formatDate(report.created_at)}
                        {report.warnings?.length > 0 && <span className="ml-2 rounded-full bg-warning-bg px-2 py-0.5 text-caption font-semibold text-warning-text" title={report.warnings.join(' ')}>Warning</span>}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-label font-semibold ${report.trigger === 'scheduled' ? 'bg-positive-bg text-positive-text' : 'bg-surface-muted text-ink-secondary'}`}>{report.trigger === 'scheduled' ? 'Auto' : 'Manual'}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line-strong px-3 text-xs font-semibold transition hover:border-accent hover:text-accent-text disabled:cursor-wait disabled:opacity-60" disabled={busyId === report.report_id} onClick={() => handleDownload(report)} type="button">
                          <DownloadIcon className="size-3.5 stroke-current stroke-2" />{busyId === report.report_id ? 'Saving…' : 'PDF'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}
