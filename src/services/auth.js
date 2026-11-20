import { API_V1_BASE_URL, API_ROUTES } from '../config/api.js'

function parseResponseBody(responseText) {
  if (!responseText) return null

  try {
    return JSON.parse(responseText)
  } catch {
    return { message: responseText }
  }
}

function getErrorMessage(result, fallback) {
  return result?.message || result?.detail || fallback
}

export async function submitAuthForm(mode, values) {
  const payload = mode === 'signup'
    ? { fullName: values.fullName, username: values.username, password: values.password }
    : { username: values.username, password: values.password }

  const response = await fetch(`${API_V1_BASE_URL}${API_ROUTES[mode]}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  const result = parseResponseBody(await response.text())

  if (!response.ok) {
    throw new Error(getErrorMessage(result, 'Something went wrong. Please try again.'))
  }

  return result
}

export async function getCurrentUser() {
  const response = await fetch(`${API_V1_BASE_URL}${API_ROUTES.me}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })

  if (response.status === 401 || response.status === 403) {
    return null
  }

  const result = parseResponseBody(await response.text())

  if (!response.ok) {
    throw new Error(getErrorMessage(result, 'Unable to verify your session.'))
  }

  return result ?? {}
}
