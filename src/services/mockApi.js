const SESSION_KEY = 'seo-reporting-demo-session'
const SETTINGS_KEY = 'seo-reporting-demo-settings'
const MOCK_DELAY_MS = 220

const defaultSettings = {
  fullname: 'Demo User',
  integrations: {
    gsc: { enabled: true, property_url: 'https://example.com/' },
    ga4: { enabled: true, property_id: '123456789' },
    google_sheets: { enabled: false, property_id: '' },
  },
}

const topQueries = [
  { query: 'seo reporting dashboard', clicks: 1840, impressions: 18200, ctr_percent: 10.11, position: 2.4 },
  { query: 'search performance report', clicks: 1320, impressions: 21100, ctr_percent: 6.26, position: 4.8 },
  { query: 'google analytics overview', clicks: 980, impressions: 14300, ctr_percent: 6.85, position: 3.7 },
  { query: 'organic traffic trends', clicks: 760, impressions: 12600, ctr_percent: 6.03, position: 5.2 },
  { query: 'seo metrics template', clicks: 590, impressions: 9900, ctr_percent: 5.96, position: 6.1 },
  { query: 'website search insights', clicks: 470, impressions: 8200, ctr_percent: 5.73, position: 7.4 },
  { query: 'keyword performance report', clicks: 380, impressions: 6500, ctr_percent: 5.85, position: 8.2 },
  { query: 'monthly seo analysis', clicks: 290, impressions: 5400, ctr_percent: 5.37, position: 9.6 },
]

const topPages = [
  { page: '/', clicks: 3280, impressions: 38200, ctr_percent: 8.59, position: 3.1 },
  { page: '/features/analytics', clicks: 2140, impressions: 25100, ctr_percent: 8.53, position: 4.2 },
  { page: '/guides/seo-reporting', clicks: 1780, impressions: 19300, ctr_percent: 9.22, position: 3.7 },
  { page: '/blog/search-trends', clicks: 1260, impressions: 18700, ctr_percent: 6.74, position: 5.8 },
  { page: '/resources/templates', clicks: 960, impressions: 14200, ctr_percent: 6.76, position: 6.4 },
  { page: '/about', clicks: 610, impressions: 9800, ctr_percent: 6.22, position: 7.1 },
]

function readStorage(key, fallback) {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function wait(signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('The request was aborted.', 'AbortError'))
      return
    }

    const onAbort = () => {
      window.clearTimeout(timeout)
      reject(new DOMException('The request was aborted.', 'AbortError'))
    }
    const timeout = window.setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, MOCK_DELAY_MS)
    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

function toDateString(date) {
  return date.toISOString().slice(0, 10)
}

function dateOffset(offset) {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return date
}

function buildDailyRows(period) {
  const dayCount = period === 'weekly' ? 7 : 14
  return Array.from({ length: dayCount }, (_, index) => {
    const offset = index - (dayCount - 1)
    const wave = Math.sin(index * 0.82)
    const clicks = Math.round(470 + index * 8 + wave * 68)
    const impressions = Math.round(9200 + index * 115 + wave * 820)
    const users = Math.round(760 + index * 12 + wave * 84)
    const sessions = Math.round(users * 1.38)
    const pageViews = Math.round(sessions * 2.16)

    return {
      search: {
        date: toDateString(dateOffset(offset)),
        clicks,
        impressions,
        ctr_percent: Number(((clicks / impressions) * 100).toFixed(2)),
        position: Number((8.8 - index * 0.045 + wave * 0.24).toFixed(1)),
      },
      analytics: {
        date: toDateString(dateOffset(offset)),
        totalUsers: users,
        sessions,
        screenPageViews: pageViews,
      },
    }
  })
}

function buildPeriodSummary(period) {
  const days = period === 'weekly' ? 7 : 30
  const start = dateOffset(-(days - 1))
  const end = dateOffset(0)
  const previousStart = dateOffset(-(days * 2 - 1))
  const previousEnd = dateOffset(-days)
  return {
    start_date: toDateString(start),
    end_date: toDateString(end),
    comparison_start_date: toDateString(previousStart),
    comparison_end_date: toDateString(previousEnd),
  }
}

function buildMockDashboard(period, refreshed = false) {
  const dailyRows = buildDailyRows(period)
  const volume = period === 'weekly' ? 0.25 : 1
  const searchClicks = dailyRows.map((item) => item.search.clicks)
  const searchImpressions = dailyRows.map((item) => item.search.impressions)
  const users = dailyRows.map((item) => item.analytics.totalUsers)
  const sessions = dailyRows.map((item) => item.analytics.sessions)
  const pageViews = dailyRows.map((item) => item.analytics.screenPageViews)

  const dashboard = {
    period: buildPeriodSummary(period),
    kpis: [
      { key: 'clicks', label: 'Organic clicks', value: Math.round(18420 * volume), change: 12.4, change_unit: 'percent', trend: 'up', previous_value: Math.round(16390 * volume) },
      { key: 'impressions', label: 'Search impressions', value: Math.round(412870 * volume), change: 8.2, change_unit: 'percent', trend: 'up', previous_value: Math.round(381570 * volume) },
      { key: 'ctr', label: 'Average CTR', value: 4.46, change: 0.3, change_unit: 'percentage_points', trend: 'up', previous_value: 4.16 },
      { key: 'position', label: 'Average position', value: 8.7, change: -1.2, change_unit: 'positions', trend: 'up', previous_value: 9.9 },
      { key: 'users', label: 'Website users', value: Math.round(24681 * volume), change: 6.8, change_unit: 'percent', trend: 'up', previous_value: Math.round(23109 * volume) },
      { key: 'sessions', label: 'Sessions', value: Math.round(34120 * volume), change: -2.1, change_unit: 'percent', trend: 'down', previous_value: Math.round(34852 * volume) },
    ],
    charts: {
      gsc_daily: {
        labels: dailyRows.map((item) => item.search.date),
        datasets: [
          { label: 'Clicks', data: searchClicks },
          { label: 'Impressions', data: searchImpressions },
        ],
      },
      ga4_daily: {
        labels: dailyRows.map((item) => item.analytics.date),
        datasets: [
          { label: 'Users', data: users },
          { label: 'Sessions', data: sessions },
          { label: 'Page views', data: pageViews },
        ],
      },
    },
    tables: {
      gsc_daily: {
        columns: ['date', 'clicks', 'impressions', 'ctr_percent', 'position'],
        rows: dailyRows.map((item) => item.search),
      },
      ga4_daily: {
        columns: ['date', 'totalUsers', 'sessions', 'screenPageViews'],
        rows: dailyRows.map((item) => item.analytics),
      },
      top_queries: { columns: ['query', 'clicks', 'impressions', 'ctr_percent', 'position'], rows: topQueries },
      top_pages: { columns: ['page', 'clicks', 'impressions', 'ctr_percent', 'position'], rows: topPages },
      google_sheets: {
        columns: ['campaign', 'leads', 'conversions', 'notes'],
        rows: [
          { campaign: 'Spring launch', leads: 184, conversions: 32, notes: 'Above target' },
          { campaign: 'Brand search', leads: 126, conversions: 27, notes: 'On target' },
          { campaign: 'Guides and resources', leads: 98, conversions: 14, notes: 'Review landing page' },
        ],
      },
    },
    sources: {
      gsc: { status: refreshed ? 'refreshed' : 'available', fetched_at: new Date().toISOString() },
      ga4: { status: 'available', fetched_at: new Date(Date.now() - 1000 * 60 * 18).toISOString() },
      google_sheets: { status: 'no_data', fetched_at: null },
    },
  }

  if (refreshed) {
    dashboard.refresh = {
      gsc: { status: 'refreshed' },
      ga4: { status: 'refreshed' },
      google_sheets: { status: 'not_configured' },
    }
  }

  return dashboard
}

export async function mockGetCurrentUser() {
  await wait()
  return readStorage(SESSION_KEY, null)
}

export async function mockSubmitAuth(mode, values) {
  await wait()
  const previousSession = readStorage(SESSION_KEY, null)
  const session = {
    username: values.username.trim() || 'demo',
    fullname: mode === 'signup'
      ? values.fullName.trim()
      : previousSession?.username === values.username.trim()
        ? previousSession.fullname
        : values.username.trim() || 'Demo User',
    demo: true,
  }
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export async function mockLogout() {
  await wait()
  window.localStorage.removeItem(SESSION_KEY)
}

export async function mockGetSettings(signal) {
  await wait(signal)
  const session = readStorage(SESSION_KEY, null)
  const settings = readStorage(SETTINGS_KEY, null) || {
    ...defaultSettings,
    fullname: session?.fullname || defaultSettings.fullname,
  }
  return structuredClone(settings)
}

export async function mockUpdateSettings(settings) {
  await wait()
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export async function mockGetAnalytics(period, signal) {
  await wait(signal)
  return buildMockDashboard(period)
}

export async function mockRefreshAnalytics(period) {
  await wait()
  return buildMockDashboard(period, true)
}

export async function mockRequestDataSource(url, body) {
  await wait()
  if (body?.mockError) {
    return { ok: false, status: 503, body: { detail: 'Mock service unavailable. The endpoint is ready to retry.' } }
  }

  if (url.includes('/gsc/')) {
    return {
      ok: true,
      status: 200,
      body: { property: 'https://example.com/', clicks: 18420, impressions: 412870, rows: topQueries.slice(0, 3) },
    }
  }
  if (url.includes('/ga4/')) {
    return {
      ok: true,
      status: 200,
      body: { property_id: '123456789', total_users: 24681, sessions: 34120, page_views: 73699 },
    }
  }
  return { ok: true, status: 200, body: { spreadsheet: 'Demo marketing report', range: 'Overview!A1:D4', values: [['Campaign', 'Leads', 'Conversions'], ['Spring launch', 184, 32], ['Brand search', 126, 27]] } }
}

function makeDemoPdf(period) {
  const text = `(${period === 'weekly' ? 'Weekly' : 'Monthly'} SEO report - Demo data) Tj`
  const content = `BT /F1 18 Tf 72 720 Td ${text} ET`
  const objects = [
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >> endobj',
    `4 0 obj << /Length ${content.length} >> stream\n${content}\nendstream endobj`,
    '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
  ]
  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  for (const object of objects) {
    offsets.push(pdf.length)
    pdf += `${object}\n`
  }
  const xrefOffset = pdf.length
  pdf += `xref\n0 ${offsets.length}\n0000000000 65535 f \n`
  pdf += offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')
  pdf += `trailer << /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
  return new Blob([pdf], { type: 'application/pdf' })
}

export async function mockGetPdfReport(period) {
  await wait()
  return makeDemoPdf(period)
}
