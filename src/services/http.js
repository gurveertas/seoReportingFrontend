import { API_V1_BASE_URL } from '../config/api.js'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function readMessage(text, fallback) {
  if (!text) return fallback
  try {
    const result = JSON.parse(text)
    const detail = result?.detail
    if (Array.isArray(detail)) return detail.map((item) => item?.msg).filter(Boolean).join(' ') || fallback
    return detail || result?.message || fallback
  } catch {
    return text
  }
}

export async function apiJson(path, { method = 'GET', body, signal, fallback = 'Something went wrong.' } = {}) {
  const response = await fetch(`${API_V1_BASE_URL}${path}`, {
    method,
    credentials: 'include',
    signal,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const text = await response.text()
  if (!response.ok) throw new ApiError(readMessage(text, fallback), response.status)
  return text ? JSON.parse(text) : null
}

export async function apiBlob(path, { fallback = 'Unable to download the file.' } = {}) {
  const response = await fetch(`${API_V1_BASE_URL}${path}`, {
    credentials: 'include',
    headers: { Accept: 'application/pdf' },
  })
  if (!response.ok) throw new ApiError(readMessage(await response.text(), fallback), response.status)
  return response.blob()
}
