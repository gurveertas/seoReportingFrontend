import { lazy, Suspense, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AnalyticsTables from '../components/dashboard/AnalyticsTables.jsx'
import KpiGrid from '../components/dashboard/KpiGrid.jsx'
import PeriodControls from '../components/dashboard/PeriodControls.jsx'
import PeriodSummary from '../components/dashboard/PeriodSummary.jsx'
import RefreshSummary from '../components/dashboard/RefreshSummary.jsx'
import AppHeader from '../components/AppHeader.jsx'
import DashboardWelcome from '../components/dashboard/DashboardWelcome.jsx'
import ReportReadyDialog from '../components/dashboard/ReportReadyDialog.jsx'
import SourceStatusGrid from '../components/dashboard/SourceStatusGrid.jsx'
import { useAuth } from '../auth/useAuth.js'
import { AnalyticsApiError, getAnalytics, refreshAnalytics } from '../services/analytics.js'
import { getPdfReport, ReportApiError } from '../services/reports.js'

const AnalyticsCharts = lazy(() => import('../components/dashboard/AnalyticsCharts.jsx'))

export default function DashboardPage() {
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

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    getAnalytics(period, controller.signal)
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
  }, [period, requestKey, navigate, signOut])

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
      const refreshedDashboard = await refreshAnalytics(period)
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
      const blob = await getPdfReport(period)
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
    <div className="dashboard-page [min-height:100vh] [background:var(--page-bg)] [color:var(--text-primary)] [&.dashboard-welcome]:[margin-bottom:30px]">
      <AppHeader activePage="dashboard" />
      <main className="dashboard-content [width:min(1120px,_calc(100%_-_48px))] [margin:0_auto] [padding:126px_0_56px] max-[520px]:[width:min(100%_-_36px,_1120px)] max-[520px]:[padding-top:112px]" id="main-content" tabIndex="-1">
        <DashboardWelcome />

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
              {dashboard.sources && <SourceStatusGrid sources={dashboard.sources} />}
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

      </main>
      {readyReport && (
        <ReportReadyDialog
          blob={readyReport.blob}
          onClose={() => setReadyReport(null)}
          period={readyReport.period}
        />
      )}
    </div>
  )
}

