import { API_V1_BASE_URL } from '../config/api.js'

export class AnalyticsApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'AnalyticsApiError'
    this.status = status
  }
}

async function requestDashboard(url, options) {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
  })

  const responseText = await response.text()
  let result = null

  if (responseText) {
    try {
      result = JSON.parse(responseText)
    } catch {
      result = { message: responseText }
    }
  }

  if (!response.ok) {
    throw new AnalyticsApiError(
      result?.detail || result?.message || 'Unable to load analytics.',
      response.status,
    )
  }

  if (!result || typeof result !== 'object') {
    throw new Error('The analytics endpoint returned an invalid response.')
  }

  return result
}

export function getAnalytics(period, signal, clientId, dates) {
  if (!clientId) throw new Error('A client must be selected to load analytics.')
  const query = dates ? `?${new URLSearchParams(dates)}` : ''
  return requestDashboard(`${API_V1_BASE_URL}/clients/${encodeURIComponent(clientId)}/analytics/${period}${query}`, {
    method: 'GET',
    signal,
  })
}

export function refreshAnalytics(period, clientId, dates) {
  if (!clientId) throw new Error('A client must be selected to refresh analytics.')
  const query = new URLSearchParams({ period, ...dates })
  return requestDashboard(
    `${API_V1_BASE_URL}/clients/${encodeURIComponent(clientId)}/analytics/refresh?${query}`,
    { method: 'POST' },
  )
}
