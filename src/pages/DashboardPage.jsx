import { lazy, Suspense, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AnalyticsTables from '../components/dashboard/AnalyticsTables.jsx'
import KpiGrid from '../components/dashboard/KpiGrid.jsx'
import PeriodControls from '../components/dashboard/PeriodControls.jsx'
import PeriodSummary from '../components/dashboard/PeriodSummary.jsx'
import RefreshSummary from '../components/dashboard/RefreshSummary.jsx'
import SourceStatusGrid from '../components/dashboard/SourceStatusGrid.jsx'
import AppHeader from '../components/AppHeader.jsx'
import DashboardWelcome from '../components/dashboard/DashboardWelcome.jsx'
import { useAuth } from '../auth/useAuth.js'
import { AnalyticsApiError, getAnalytics, refreshAnalytics } from '../services/analytics.js'
import './DashboardPage.css'
import './AnalyticsDashboard.css'

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
    setRefreshSummary(null)
  }

  async function handleRefresh() {
    setIsRefreshing(true)
    setRefreshError('')

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

  function retryLoad() {
    setLoadAttempt((attempt) => attempt + 1)
  }

  return (
    <div className="dashboard-page">
      <AppHeader activePage="dashboard" />
      <main className="dashboard-content">
        <DashboardWelcome />

        <section className="analytics-dashboard" aria-label="Analytics dashboard">
          <div className="analytics-dashboard__toolbar">
            <PeriodControls
              isLoading={isLoading}
              isRefreshing={isRefreshing}
              onChange={handlePeriodChange}
              onRefresh={handleRefresh}
              period={period}
            />
            {isReady && <PeriodSummary period={dashboard.period} />}
          </div>

          {refreshError && (
            <div className="analytics-error" role="alert">
              <span>{refreshError}</span>
            </div>
          )}

          {isLoading ? (
            <div className="analytics-loading" role="status">Loading {period} analytics…</div>
          ) : loadError ? (
            <div className="analytics-error" role="alert">
              <span>{loadError}</span>
              <button onClick={retryLoad} type="button">Try again</button>
            </div>
          ) : dashboard ? (
            <>
              {refreshSummary?.period === period && (
                <RefreshSummary refresh={refreshSummary.result} />
              )}
              <SourceStatusGrid sources={dashboard.sources} />
              <KpiGrid kpis={dashboard.kpis} />
              <Suspense fallback={<div className="analytics-loading">Loading charts…</div>}>
                <AnalyticsCharts charts={dashboard.charts} tables={dashboard.tables} />
              </Suspense>
              <AnalyticsTables tables={dashboard.tables} />
            </>
          ) : (
            <div className="analytics-error" role="alert">
              Analytics data is unavailable.
              <button onClick={retryLoad} type="button">Try again</button>
            </div>
          )}
        </section>

      </main>
    </div>
  )
}
