import { API_ROUTES, API_V1_BASE_URL } from '../config/api.js'

export class SettingsApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'SettingsApiError'
    this.status = status
  }
}

function getErrorMessage(responseText) {
  if (!responseText) return 'Unable to update your settings.'

  try {
    const result = JSON.parse(responseText)
    return result?.detail || result?.message || 'Unable to update your settings.'
  } catch {
    return responseText
  }
}

export async function getUserSettings(signal) {
  const response = await fetch(`${API_V1_BASE_URL}${API_ROUTES.userSettings}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  const responseText = await response.text()
  if (!response.ok) {
    throw new SettingsApiError(getErrorMessage(responseText), response.status)
  }

  try {
    const settings = JSON.parse(responseText)
    if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
      throw new Error('The settings endpoint returned an invalid response.')
    }
    return settings
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('The settings endpoint returned invalid JSON.', { cause: error })
    }
    throw error
  }
}

export async function updateUserSettings(settings) {
  const response = await fetch(`${API_V1_BASE_URL}${API_ROUTES.userSettings}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  })

  if (!response.ok) {
    throw new SettingsApiError(
      getErrorMessage(await response.text()),
      response.status,
    )
  }
}
