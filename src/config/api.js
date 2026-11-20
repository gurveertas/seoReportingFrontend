export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api/v1'
const normalizedApiBaseUrl = API_BASE_URL.replace(/\/+$/, '')
export const API_V1_BASE_URL = normalizedApiBaseUrl.endsWith('/api/v1')
  ? normalizedApiBaseUrl
  : `${normalizedApiBaseUrl}/api/v1`

export const API_ROUTES = {
  login: '/auth/login',
  signup: '/auth/signup',
  logout: '/auth/logout',
  me: '/auth/me',
  userSettings: '/me',
  reports: {
    monthly: '/reports/monthly',
    weekly: '/reports/weekly',
  },
}

export const DATA_TEST_ENDPOINTS = [
  {
    id: 'gsc',
    shortName: 'GSC',
    name: 'Google Search Console',
    description: 'Inspect search queries, pages, impressions, and clicks.',
    url: 'https://seoreportingbackend.fastapicloud.dev/api/v1/gsc/search-performance',
  },
  {
    id: 'ga4',
    shortName: 'GA4',
    name: 'Google Analytics 4',
    description: 'Check the report response from your GA4 integration.',
    url: 'https://seoreportingbackend.fastapicloud.dev/api/v1/ga4/report',
  },
  {
    id: 'sheets',
    shortName: 'Sheets',
    name: 'Google Sheets',
    description: 'Test reading values from a configured spreadsheet.',
    url: 'https://seoreportingbackend.fastapicloud.dev/api/v1/google-sheets/values',
  },
]
