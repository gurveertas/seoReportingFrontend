import { MOCK_API_ENABLED } from '../config/api.js'
import { mockRequestDataSource } from './mockApi.js'

export async function requestDataSource(url, body) {
  if (MOCK_API_ENABLED) return mockRequestDataSource(url, body)

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const responseText = await response.text()
  let responseBody = responseText

  if (responseText) {
    try {
      responseBody = JSON.parse(responseText)
    } catch {
      responseBody = responseText
    }
  }

  return {
    ok: response.ok,
    status: response.status,
    body: responseBody,
  }
}
