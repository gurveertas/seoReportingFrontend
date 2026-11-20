import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader.jsx'
import SiteAvatar from '../components/layout/SiteAvatar.jsx'
import AnalyticsTables from '../components/dashboard/AnalyticsTables.jsx'
import KpiGrid from '../components/dashboard/KpiGrid.jsx'
import PeriodControls from '../components/dashboard/PeriodControls.jsx'
import PeriodSummary from '../components/dashboard/PeriodSummary.jsx'
import RefreshSummary from '../components/dashboard/RefreshSummary.jsx'
import ReportReadyDialog from '../components/dashboard/ReportReadyDialog.jsx'
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
      <div className="rounded-xl border border-(--error-border) bg-(--error-bg) p-5 text-sm text-(--error-text)" role="alert">
        <p className="m-0">{error}</p>
        <button className="mt-3 rounded-lg border border-(--error-border) bg-(--surface) px-3 py-1.5 text-xs font-semibold" onClick={() => reloadClients().catch(() => {})} type="button">Retry</button>
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
  const [loadAttempt, setLoadAttempt] = useState(0)
  const requestKey = `${period}:${loadAttempt}`
  const [loadState, setLoadState] = useState({
    key: 'monthly:0',
    status: 'loading',
    data: null,
    error: null,
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState('')
  const [refreshSummary, setRefreshSummary] = useState(null)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
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

    getAnalytics(period, controller.signal, client.id)
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
  }, [period, requestKey, navigate, signOut, client])

  const isLoading = loadState.key !== requestKey || loadState.status === 'loading'
  const dashboard = loadState.key === requestKey ? loadState.data : null
  const loadError = loadState.key === requestKey ? loadState.error : null
  const isReady = !isLoading && !loadError && dashboard !== null

  function handlePeriodChange(nextPeriod) {
    setPeriod(nextPeriod)
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
      const refreshedDashboard = await refreshAnalytics(period, client.id)
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

  async function handleGenerateReport() {
    setIsGeneratingReport(true)
    setReportError('')
    setRefreshError('')

    try {
      const blob = await getPdfReport(period, client.id)
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
    <div className="dashboard-page">
        <PageHeader
          actions={(
            <button className="h-9 rounded-lg border border-(--border-strong) bg-(--surface) px-3.5 text-[13px] font-semibold transition hover:bg-(--surface-muted)" onClick={() => setIsEditing(true)} type="button">Edit website</button>
          )}
          description={siteLabel(client)}
          eyebrow={client.autoMonthly ? 'Website · auto-monthly on' : 'Website'}
          leading={<SiteAvatar name={client.name} size="lg" />}
          title={client.name}
        />
        <MonthlyReportsPanel client={client} onAuthError={handleAuthError} onReportGenerated={() => setLoadAttempt((attempt) => attempt + 1)} />

        <section aria-busy={isLoading} className="analytics-dashboard [&_button:focus-visible]:[outline:3px_solid_var(--focus-ring)] [&_button:focus-visible]:[outline-offset:3px]" aria-label="Analytics dashboard">
          <div className="analytics-dashboard__toolbar [display:grid] [gap:16px] [margin-bottom:28px]">
            <PeriodControls
              isLoading={isLoading}
              isRefreshing={isRefreshing}
              isGeneratingReport={isGeneratingReport}
              onChange={handlePeriodChange}
              onGenerateReport={handleGenerateReport}
              onRefresh={handleRefresh}
              period={period}
            />
            {isReady && <PeriodSummary period={dashboard.period} />}
          </div>

          {refreshError && (
            <div className="analytics-error [display:flex] [align-items:center] [justify-content:space-between] [gap:18px] [padding:15px_17px] [border:1px_solid_var(--error-border)] [border-radius:9px] [background:var(--error-bg)] [color:var(--error-text)] [font-size:13px] [&_button]:[flex:0_0_auto] [&_button]:[padding:7px_10px] [&_button]:[border:1px_solid_var(--error-border)] [&_button]:[border-radius:6px] [&_button]:[background:var(--surface)] [&_button]:[color:var(--error-strong)] [&_button]:[cursor:pointer] [&_button]:[font:inherit] [&_button]:[font-size:11px] [&_button]:[font-weight:700]" role="alert">
              <span>{refreshError}</span>
            </div>
          )}

          {reportError && (
            <div className="analytics-error [display:flex] [align-items:center] [justify-content:space-between] [gap:18px] [padding:15px_17px] [border:1px_solid_var(--error-border)] [border-radius:9px] [background:var(--error-bg)] [color:var(--error-text)] [font-size:13px] [&_button]:[flex:0_0_auto] [&_button]:[padding:7px_10px] [&_button]:[border:1px_solid_var(--error-border)] [&_button]:[border-radius:6px] [&_button]:[background:var(--surface)] [&_button]:[color:var(--error-strong)] [&_button]:[cursor:pointer] [&_button]:[font:inherit] [&_button]:[font-size:11px] [&_button]:[font-weight:700]" role="alert">
              <span>{reportError}</span>
            </div>
          )}

          {isLoading ? (
            <div className="analytics-loading [padding:30px_20px] [border:1px_dashed_var(--border-strong)] [border-radius:11px] [background:var(--surface)] [color:var(--text-secondary)] [font-size:13px] [text-align:center]" role="status">Loading {period} analytics…</div>
          ) : loadError ? (
            <div className="analytics-error [display:flex] [align-items:center] [justify-content:space-between] [gap:18px] [padding:15px_17px] [border:1px_solid_var(--error-border)] [border-radius:9px] [background:var(--error-bg)] [color:var(--error-text)] [font-size:13px] [&_button]:[flex:0_0_auto] [&_button]:[padding:7px_10px] [&_button]:[border:1px_solid_var(--error-border)] [&_button]:[border-radius:6px] [&_button]:[background:var(--surface)] [&_button]:[color:var(--error-strong)] [&_button]:[cursor:pointer] [&_button]:[font:inherit] [&_button]:[font-size:11px] [&_button]:[font-weight:700]" role="alert">
              <span>{loadError}</span>
              <button onClick={retryLoad} type="button">Try again</button>
            </div>
          ) : dashboard ? (
            <>
              {refreshSummary?.period === period && (
                <RefreshSummary refresh={refreshSummary.result} />
              )}
              <KpiGrid kpis={dashboard.kpis} />
              <Suspense fallback={<div className="analytics-loading [padding:30px_20px] [border:1px_dashed_var(--border-strong)] [border-radius:11px] [background:var(--surface)] [color:var(--text-secondary)] [font-size:13px] [text-align:center]">Loading charts…</div>}>
                <AnalyticsCharts charts={dashboard.charts} tables={dashboard.tables} />
              </Suspense>
              <AnalyticsTables tables={dashboard.tables} />
            </>
          ) : (
            <div className="analytics-error [display:flex] [align-items:center] [justify-content:space-between] [gap:18px] [padding:15px_17px] [border:1px_solid_var(--error-border)] [border-radius:9px] [background:var(--error-bg)] [color:var(--error-text)] [font-size:13px] [&_button]:[flex:0_0_auto] [&_button]:[padding:7px_10px] [&_button]:[border:1px_solid_var(--error-border)] [&_button]:[border-radius:6px] [&_button]:[background:var(--surface)] [&_button]:[color:var(--error-strong)] [&_button]:[cursor:pointer] [&_button]:[font:inherit] [&_button]:[font-size:11px] [&_button]:[font-weight:700]" role="alert">
              Analytics data is unavailable.
              <button onClick={retryLoad} type="button">Try again</button>
            </div>
          )}
        </section>

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

