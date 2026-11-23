import { useCallback, useEffect, useState } from 'react'
import { setClientAutoMonthly } from '../../services/clients.js'
import {
  deleteStoredReport,
  downloadStoredReport,
  generateMonthlyReport,
  listReports,
  savePdfBlob,
} from '../../services/reports.js'
import { useWorkspace } from '../../workspace/useWorkspace.js'
import { DocumentIcon } from '../icons/AppIcons.jsx'
import ReportOptionsDialog from './ReportOptionsDialog.jsx'
import { formatReportRange, isCalendarMonth } from './reportPeriod.js'

function monthLabel(value) {
  const [year, month] = value.split('-').map(Number)
  return new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1))
}

function formatDate(value) {
  return value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : ''
}

export default function MonthlyReportsPanel({ client, dates, onAuthError, onReportGenerated }) {
  const { reloadClients } = useWorkspace()
  const [state, setState] = useState({ status: 'loading', reports: [], runs: [], error: '' })
  const month = dates.start_date.slice(0, 7)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showReportOptions, setShowReportOptions] = useState(false)
  const [busyReportId, setBusyReportId] = useState(null)
  const [actionError, setActionError] = useState('')
  const [autoMonthly, setAutoMonthly] = useState(client.autoMonthly)
  const [isSavingSchedule, setIsSavingSchedule] = useState(false)

  const load = useCallback(async (signal) => {
    try {
      const result = await listReports(client.id, signal)
      setState({ status: 'ready', reports: result.reports, runs: result.runs, error: '' })
    } catch (error) {
      if (signal?.aborted || onAuthError(error)) return
      setState((current) => ({ ...current, status: 'error', error: error.message }))
    }
  }, [client.id, onAuthError])

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [load])

  async function handleGenerate(options) {
    setIsGenerating(true)
    setActionError('')
    try {
      await generateMonthlyReport(client.id, month, options, dates)
      setShowReportOptions(false)
      await load()
      onReportGenerated?.(month)
    } catch (error) {
      if (!onAuthError(error)) setActionError(error.message)
      await load()
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleDownload(report) {
    setBusyReportId(report.report_id)
    setActionError('')
    try {
      const blob = await downloadStoredReport(client.id, report.report_id)
      await savePdfBlob(blob, report.filename)
    } catch (error) {
      if (!onAuthError(error)) setActionError(error.message)
    } finally {
      setBusyReportId(null)
    }
  }

  async function handleDelete(report) {
    setBusyReportId(report.report_id)
    setActionError('')
    try {
      await deleteStoredReport(client.id, report.report_id)
      await load()
    } catch (error) {
      if (!onAuthError(error)) setActionError(error.message)
    } finally {
      setBusyReportId(null)
    }
  }

  async function handleScheduleChange(next) {
    setAutoMonthly(next)
    setIsSavingSchedule(true)
    setActionError('')
    try {
      await setClientAutoMonthly(client.id, next)
      await reloadClients()
    } catch (error) {
      setAutoMonthly(!next)
      if (!onAuthError(error)) setActionError(error.message)
    } finally {
      setIsSavingSchedule(false)
    }
  }

  const fullMonth = isCalendarMonth(dates)
  const existing = state.reports.some((report) => {
    if (!report.start_date || !report.end_date) return fullMonth && report.month === month
    return report.start_date === dates.start_date && report.end_date === dates.end_date
  })
  const lastRun = state.runs[0]

  return (
    <section aria-labelledby="monthly-reports-title" className="mb-7 rounded-2xl border border-line bg-surface p-5 max-sm:p-4">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="m-0 font-heading text-lg font-bold tracking-tight" id="monthly-reports-title">Monthly reports</h2>
          <p className="mb-0 mt-1 text-xs text-ink-secondary">Generate and save a PDF for the selected current period.</p>
        </div>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-3 py-2 text-xs">
          <span className="grid">
            <span className="font-semibold text-ink">Auto-generate every month</span>
            <span className="text-ink-muted">Last month’s report is created on the 4th</span>
          </span>
          <span className="relative inline-flex">
            <input checked={autoMonthly} className="peer sr-only" disabled={isSavingSchedule} onChange={(event) => handleScheduleChange(event.target.checked)} role="switch" type="checkbox" />
            <span aria-hidden="true" className="h-6 w-11 rounded-full bg-line-strong transition peer-checked:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring" />
            <span aria-hidden="true" className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
          </span>
        </label>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-hover disabled:cursor-wait disabled:opacity-60" disabled={!month || isGenerating} onClick={() => {
          setActionError('')
          setShowReportOptions(true)
        }} type="button">
          <DocumentIcon className="size-4" strokeWidth={1.7} />
          {isGenerating ? 'Pulling data and building PDF…' : existing ? 'Regenerate report' : 'Generate report'}
        </button>
      </div>

      {showReportOptions && (
        <ReportOptionsDialog error={actionError} isGenerating={isGenerating} onClose={() => setShowReportOptions(false)} onGenerate={handleGenerate} />
      )}

      {actionError && !showReportOptions && <p className="mb-0 mt-3 text-sm text-error-text" role="alert">{actionError}</p>}
      {!actionError && lastRun?.status === 'failed' && (
        <p className="mb-0 mt-3 text-xs text-error-text">Last attempt ({monthLabel(lastRun.month)}, {lastRun.trigger}) failed: {lastRun.error}</p>
      )}

      <div className="mt-5 border-t border-line-subtle pt-4">
        {state.status === 'loading' ? (
          <p className="m-0 text-sm text-ink-secondary" role="status">Loading reports…</p>
        ) : state.status === 'error' ? (
          <p className="m-0 text-sm text-error-text" role="alert">{state.error}</p>
        ) : state.reports.length === 0 ? (
          <p className="m-0 text-sm text-ink-secondary">No reports saved yet.</p>
        ) : (
          <ul className="m-0 grid gap-2 p-0">
            {state.reports.map((report) => (
              <li className="flex list-none flex-wrap items-center justify-between gap-3 rounded-xl bg-surface-muted px-3 py-2.5" key={report.report_id}>
                <div className="min-w-0">
                  <p className="m-0 text-sm font-semibold">
                    {report.start_date && report.end_date ? formatReportRange(report.start_date, report.end_date) : monthLabel(report.month)}
                  </p>
                  <p className="mb-0 mt-0.5 text-label text-ink-muted">
                    {report.trigger === 'scheduled' ? 'Auto-generated' : 'Generated'} {formatDate(report.created_at)}
                    {report.warnings?.length ? ` · ${report.warnings.join(' ')}` : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="min-h-9 rounded-lg border border-line-strong bg-surface px-3 text-xs font-semibold hover:border-accent disabled:cursor-wait disabled:opacity-60" disabled={busyReportId === report.report_id} onClick={() => handleDownload(report)} type="button">Download PDF</button>
                  <button aria-label={`Delete ${monthLabel(report.month)} report`} className="min-h-9 rounded-lg px-2 text-xs text-ink-muted hover:bg-surface hover:text-error-text disabled:opacity-60" disabled={busyReportId === report.report_id} onClick={() => handleDelete(report)} type="button">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
