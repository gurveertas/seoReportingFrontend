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

function monthOptions(latest, count = 18) {
  if (!latest) return []
  let [year, month] = latest.split('-').map(Number)
  const options = []
  for (let index = 0; index < count; index += 1) {
    const value = `${year}-${String(month).padStart(2, '0')}`
    const label = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1))
    options.push({ value, label })
    month -= 1
    if (month === 0) { month = 12; year -= 1 }
  }
  return options
}

function monthLabel(value) {
  const [year, month] = value.split('-').map(Number)
  return new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1))
}

function formatDate(value) {
  return value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : ''
}

export default function MonthlyReportsPanel({ client, onAuthError, onReportGenerated }) {
  const { reloadClients } = useWorkspace()
  const [state, setState] = useState({ status: 'loading', reports: [], runs: [], latest: null, error: '' })
  const [month, setMonth] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showReportOptions, setShowReportOptions] = useState(false)
  const [busyReportId, setBusyReportId] = useState(null)
  const [actionError, setActionError] = useState('')
  const [autoMonthly, setAutoMonthly] = useState(client.autoMonthly)
  const [isSavingSchedule, setIsSavingSchedule] = useState(false)

  const load = useCallback(async (signal) => {
    try {
      const result = await listReports(client.id, signal)
      setState({ status: 'ready', reports: result.reports, runs: result.runs, latest: result.latest_reportable_month, error: '' })
      setMonth((current) => current || result.latest_reportable_month)
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
      await generateMonthlyReport(client.id, month, options)
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

  const options = monthOptions(state.latest)
  const existing = state.reports.find((report) => report.month === month)
  const lastRun = state.runs[0]

  return (
    <section aria-labelledby="monthly-reports-title" className="mb-7 rounded-2xl border border-(--border) bg-(--surface) p-5 max-sm:p-4">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="m-0 font-[Manrope,sans-serif] text-lg font-bold tracking-[-.03em]" id="monthly-reports-title">Monthly reports</h2>
          <p className="mb-0 mt-1 text-xs text-(--text-secondary)">Pick a month to pull fresh Search Console and Analytics data and save a PDF.</p>
        </div>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-(--border) px-3 py-2 text-xs">
          <span className="grid">
            <span className="font-semibold text-(--text-primary)">Auto-generate every month</span>
            <span className="text-(--text-muted)">Last month’s report is created on the 4th</span>
          </span>
          <span className="relative inline-flex">
            <input checked={autoMonthly} className="peer sr-only" disabled={isSavingSchedule} onChange={(event) => handleScheduleChange(event.target.checked)} role="switch" type="checkbox" />
            <span aria-hidden="true" className="h-6 w-11 rounded-full bg-(--border-strong) transition peer-checked:bg-(--accent) peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--focus-ring)" />
            <span aria-hidden="true" className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
          </span>
        </label>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <select aria-label="Report month" className="min-h-10 rounded-lg border border-(--border-strong) bg-(--surface) px-3 text-sm" disabled={!options.length || isGenerating} onChange={(event) => setMonth(event.target.value)} value={month}>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <button className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-(--accent) px-4 text-sm font-semibold text-white hover:bg-(--accent-hover) disabled:cursor-wait disabled:opacity-60 [&_svg]:size-4 [&_svg]:stroke-current [&_svg]:[stroke-width:1.7]" disabled={!month || isGenerating} onClick={() => {
          setActionError('')
          setShowReportOptions(true)
        }} type="button">
          <DocumentIcon />
          {isGenerating ? 'Pulling data and building PDF…' : existing ? 'Regenerate report' : 'Generate report'}
        </button>
      </div>

      {showReportOptions && (
        <ReportOptionsDialog error={actionError} isGenerating={isGenerating} onClose={() => setShowReportOptions(false)} onGenerate={handleGenerate} />
      )}

      {actionError && !showReportOptions && <p className="mb-0 mt-3 text-sm text-(--error-text)" role="alert">{actionError}</p>}
      {!actionError && lastRun?.status === 'failed' && (
        <p className="mb-0 mt-3 text-xs text-(--error-text)">Last attempt ({monthLabel(lastRun.month)}, {lastRun.trigger}) failed: {lastRun.error}</p>
      )}

      <div className="mt-5 border-t border-(--border-subtle) pt-4">
        {state.status === 'loading' ? (
          <p className="m-0 text-sm text-(--text-secondary)" role="status">Loading reports…</p>
        ) : state.status === 'error' ? (
          <p className="m-0 text-sm text-(--error-text)" role="alert">{state.error}</p>
        ) : state.reports.length === 0 ? (
          <p className="m-0 text-sm text-(--text-secondary)">No reports saved yet.</p>
        ) : (
          <ul className="m-0 grid gap-2 p-0">
            {state.reports.map((report) => (
              <li className="flex list-none flex-wrap items-center justify-between gap-3 rounded-xl bg-(--surface-muted) px-3 py-2.5" key={report.report_id}>
                <div className="min-w-0">
                  <p className="m-0 text-sm font-semibold">{monthLabel(report.month)}</p>
                  <p className="mb-0 mt-0.5 text-[11px] text-(--text-muted)">
                    {report.trigger === 'scheduled' ? 'Auto-generated' : 'Generated'} {formatDate(report.created_at)}
                    {report.warnings?.length ? ` · ${report.warnings.join(' ')}` : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="min-h-9 rounded-lg border border-(--border-strong) bg-(--surface) px-3 text-xs font-semibold hover:border-(--accent) disabled:cursor-wait disabled:opacity-60" disabled={busyReportId === report.report_id} onClick={() => handleDownload(report)} type="button">Download PDF</button>
                  <button aria-label={`Delete ${monthLabel(report.month)} report`} className="min-h-9 rounded-lg px-2 text-xs text-(--text-muted) hover:bg-(--surface) hover:text-(--error-text) disabled:opacity-60" disabled={busyReportId === report.report_id} onClick={() => handleDelete(report)} type="button">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
