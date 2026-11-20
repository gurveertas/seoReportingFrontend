import { API_ROUTES, API_V1_BASE_URL } from '../config/api.js'
import { apiBlob, apiJson } from './http.js'

export class ReportApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ReportApiError'
    this.status = status
  }
}

function getErrorMessage(responseText) {
  if (!responseText) return 'Unable to generate the report.'

  try {
    const result = JSON.parse(responseText)
    return result?.detail || result?.message || 'Unable to generate the report.'
  } catch {
    return responseText
  }
}

export async function getPdfReport(period, clientId) {
  const route = API_ROUTES.reports[period]
  if (!route) {
    throw new Error('Unsupported report period.')
  }
  if (!clientId) throw new Error('A client must be selected to generate a report.')

  const response = await fetch(`${API_V1_BASE_URL}/clients/${encodeURIComponent(clientId)}${route}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/pdf',
    },
  })

  if (!response.ok) {
    throw new ReportApiError(
      getErrorMessage(await response.text()),
      response.status,
    )
  }

  const blob = await response.blob()
  if (!blob.size || !(await blob.slice(0, 1024).text()).includes('%PDF-')) {
    throw new Error('The reports endpoint did not return a valid PDF.')
  }

  return blob
}

export async function savePdfBlob(blob, filename) {
  if (typeof window.showSaveFilePicker === 'function') {
    let fileHandle
    try {
      fileHandle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'PDF document',
          accept: { 'application/pdf': ['.pdf'] },
        }],
      })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return false
      }
      throw error
    }

    const writable = await fileHandle.createWritable()
    await writable.write(blob)
    await writable.close()
    return true
  }

  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
  return true
}

const clientReportsPath = (clientId) => `/clients/${encodeURIComponent(clientId)}/reports`

export function listReports(clientId, signal) {
  return apiJson(clientReportsPath(clientId), { signal, fallback: 'Unable to load reports.' })
}

export function generateMonthlyReport(clientId, month) {
  return apiJson(`${clientReportsPath(clientId)}/monthly/generate`, {
    method: 'POST',
    body: { month, refresh: true },
    fallback: 'Unable to generate the report.',
  }).then((result) => result.report)
}

export function downloadStoredReport(clientId, reportId) {
  return apiBlob(`${clientReportsPath(clientId)}/${encodeURIComponent(reportId)}/download`)
}

export function deleteStoredReport(clientId, reportId) {
  return apiJson(`${clientReportsPath(clientId)}/${encodeURIComponent(reportId)}`, {
    method: 'DELETE',
    fallback: 'Unable to delete the report.',
  })
}

export function listWorkspaceReports(signal) {
  return apiJson('/reports', { signal, fallback: 'Unable to load reports.' })
}

export function monthLabel(value, style = 'long') {
  if (!value) return ''
  const [year, month] = value.split('-').map(Number)
  return new Intl.DateTimeFormat(undefined, { month: style, year: 'numeric' }).format(new Date(year, month - 1, 1))
}
