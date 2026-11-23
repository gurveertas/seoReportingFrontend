import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader.jsx'
import SiteAvatar from '../components/layout/SiteAvatar.jsx'
import AnalyticsTables from '../components/dashboard/AnalyticsTables.jsx'
import KpiGrid from '../components/dashboard/KpiGrid.jsx'
import PeriodControls from '../components/dashboard/PeriodControls.jsx'
import PeriodSummary from '../components/dashboard/PeriodSummary.jsx'
import { defaultReportPeriod } from '../components/dashboard/reportPeriod.js'
import RefreshSummary from '../components/dashboard/RefreshSummary.jsx'
import ReportReadyDialog from '../components/dashboard/ReportReadyDialog.jsx'
import ReportOptionsDialog from '../components/dashboard/ReportOptionsDialog.jsx'
import { useAuth } from '../auth/useAuth.js'
import { AnalyticsApiError, getAnalytics, refreshAnalytics } from '../services/analytics.js'
import { getPdfReport, ReportApiError } from '../services/reports.js'
import { useWorkspace } from '../workspace/useWorkspace.js'
import ClientFormDialog from '../components/workspace/ClientFormDialog.jsx'
import SessionLoading from '../components/SessionLoading.jsx'
import MonthlyReportsPanel from '../components/dashboard/MonthlyReportsPanel.jsx'

const AnalyticsCharts = lazy(() => import('../components/dashboard/AnalyticsCharts.jsx'))

export default function DashboardPage() {
  const { clientId } = useParams()
  const { clients, isLoading, error, reloadClients } = useWorkspace()
  const selectedClient = clients.find((client) => client.id === clientId)

  if (isLoading) return <SessionLoading message="Loading website…" />
  if (error) {
    return (
      <div className="rounded-xl border border-error-border bg-error-bg p-5 text-sm text-error-text" role="alert">
        <p className="m-0">{error}</p>
        <button className="mt-3 rounded-lg border border-error-border bg-surface px-3 py-1.5 text-xs font-semibold" onClick={() => reloadClients().catch(() => {})} type="button">Retry</button>
      </div>
    )
  }
  if (!selectedClient) return <Navigate to="/dashboard" replace />
  return <ClientDashboard key={selectedClient.id} client={selectedClient} />
}

function siteLabel(client) {
  const url = client.integrations?.gsc?.property_url
  return url ? url.replace(/^sc-domain:/, '').replace(/^https?:\/\//, '').replace(/\/$/, '') : 'Search Console not set'
}

function ClientDashboard({ client }) {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [period, setPeriod] = useState('monthly')
  const [dates, setDates] = useState(() => defaultReportPeriod('monthly'))
  const [loadAttempt, setLoadAttempt] = useState(0)
  const requestKey = `${period}:${dates.start_date}:${dates.end_date}:${loadAttempt}`
  const [loadState, setLoadState] = useState({
    key: requestKey,
    status: 'loading',
    data: null,
    error: null,
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState('')
  const [refreshSummary, setRefreshSummary] = useState(null)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [showReportOptions, setShowReportOptions] = useState(false)
  const [reportError, setReportError] = useState('')
  const [readyReport, setReadyReport] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const { updateClient } = useWorkspace()
  const handleAuthError = useCallback((error) => {
    if (error?.status === 401) {
      signOut()
      navigate('/', { replace: true })
      return true
    }
    return false
  }, [navigate, signOut])

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    getAnalytics(period, controller.signal, client.id, dates)
      .then((data) => {
        if (active) {
          setLoadState({ key: requestKey, status: 'ready', data, error: null })
        }
      })
      .catch((error) => {
        if (!active || controller.signal.aborted) return

        if (error instanceof AnalyticsApiError && error.status === 401) {
          signOut()
          navigate('/', { replace: true })
          return
        }

        setLoadState({
          key: requestKey,
          status: 'error',
          data: null,
          error: error instanceof Error ? error.message : 'Unable to load analytics.',
        })
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [period, dates, requestKey, navigate, signOut, client])

  const isLoading = loadState.key !== requestKey || loadState.status === 'loading'
  const dashboard = loadState.key === requestKey ? loadState.data : null
  const loadError = loadState.key === requestKey ? loadState.error : null

  function handlePeriodChange(nextPeriod) {
    if (period === nextPeriod) return
    setPeriod(nextPeriod)
    handleDatesChange(defaultReportPeriod(nextPeriod))
  }

  function handleDatesChange(nextDates) {
    setDates(nextDates)
    setRefreshError('')
    setReportError('')
    setRefreshSummary(null)
  }

  async function handleRefresh() {
    setIsRefreshing(true)
    setRefreshError('')
    setReportError('')
    setRefreshSummary(null)

    try {
      const refreshedDashboard = await refreshAnalytics(period, client.id, dates)
      setLoadState({
        key: requestKey,
        status: 'ready',
        data: refreshedDashboard,
        error: null,
      })
      setRefreshSummary({
        period,
        result: refreshedDashboard.refresh,
      })
    } catch (error) {
      if (error instanceof AnalyticsApiError && error.status === 401) {
        signOut()
        navigate('/', { replace: true })
        return
      }

      setRefreshError(error instanceof Error ? error.message : 'Unable to refresh analytics.')
    } finally {
      setIsRefreshing(false)
    }
  }

  async function handleGenerateReport(options) {
    setIsGeneratingReport(true)
    setReportError('')
    setRefreshError('')

    try {
      const blob = await getPdfReport(period, client.id, options, dates)
      setShowReportOptions(false)
      setReadyReport({ blob, period })
    } catch (error) {
      if (error instanceof ReportApiError && (error.status === 401 || error.status === 403)) {
        signOut()
        navigate('/', { replace: true })
        return
      }

      setReportError(error instanceof Error ? error.message : 'Unable to generate the report.')
    } finally {
      setIsGeneratingReport(false)
    }
  }

  function retryLoad() {
    setLoadAttempt((attempt) => attempt + 1)
  }

  return (
    <div>
        <PageHeader
          actions={(
            <button className="h-9 rounded-lg border border-line-strong bg-surface px-3.5 text-body-sm font-semibold transition hover:bg-surface-muted" onClick={() => setIsEditing(true)} type="button">Edit website</button>
          )}
          description={siteLabel(client)}
          eyebrow={client.autoMonthly ? 'Website · auto-monthly on' : 'Website'}
          leading={<SiteAvatar name={client.name} size="lg" />}
          title={client.name}
        />
        <MonthlyReportsPanel client={client} dates={dates} onAuthError={handleAuthError} onReportGenerated={() => setLoadAttempt((attempt) => attempt + 1)} />

        <section aria-busy={isLoading} aria-label="Analytics dashboard">
          <div className="grid gap-4 mb-7">
            <PeriodControls
              isLoading={isLoading}
              isRefreshing={isRefreshing}
              isGeneratingReport={isGeneratingReport}
              onChange={handlePeriodChange}
              onGenerateReport={() => {
                setReportError('')
                setShowReportOptions(true)
              }}
              onRefresh={handleRefresh}
              period={period}
            />
            <PeriodSummary disabled={isRefreshing || isGeneratingReport} onChange={handleDatesChange} period={dates} />
          </div>

          {refreshError && <AnalyticsError message={refreshError} />}
          {reportError && !showReportOptions && <AnalyticsError message={reportError} />}

          {isLoading ? (
            <AnalyticsLoading>Loading {period} analytics…</AnalyticsLoading>
          ) : loadError ? (
            <AnalyticsError message={loadError} onRetry={retryLoad} />
          ) : dashboard ? (
            <>
              {refreshSummary?.period === period && (
                <RefreshSummary refresh={refreshSummary.result} />
              )}
              <KpiGrid kpis={dashboard.kpis} />
              <Suspense fallback={<AnalyticsLoading>Loading charts…</AnalyticsLoading>}>
                <AnalyticsCharts charts={dashboard.charts} tables={dashboard.tables} />
              </Suspense>
              <AnalyticsTables tables={dashboard.tables} />
            </>
          ) : (
            <AnalyticsError message="Analytics data is unavailable." onRetry={retryLoad} />
          )}
        </section>

      {showReportOptions && (
        <ReportOptionsDialog error={reportError} isGenerating={isGeneratingReport} onClose={() => setShowReportOptions(false)} onGenerate={handleGenerateReport} />
      )}
      {readyReport && (
        <ReportReadyDialog
          blob={readyReport.blob}
          onClose={() => setReadyReport(null)}
          period={readyReport.period}
        />
      )}
      {isEditing && (
        <ClientFormDialog
          client={client}
          onClose={() => setIsEditing(false)}
          onSave={async (values) => { await updateClient(client.id, values); setIsEditing(false) }}
        />
      )}
    </div>
  )
}

function AnalyticsLoading({ children }) {
  return <div className="rounded-xl border border-dashed border-line-strong bg-surface px-5 py-7.5 text-center text-body-sm text-ink-secondary" role="status">{children}</div>
}

function AnalyticsError({ message, onRetry }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-error-border bg-error-bg p-4 text-body-sm text-error-text" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button className="flex-none cursor-pointer rounded-md border border-error-border bg-surface px-2.5 py-2 text-label font-bold text-error-strong focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus-ring" onClick={onRetry} type="button">
          Try again
        </button>
      )}
    </div>
  )
}

