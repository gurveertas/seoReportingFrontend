import { API_ROUTES, API_V1_BASE_URL, MOCK_API_ENABLED } from '../config/api.js'
import { mockGetPdfReport } from './mockApi.js'

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

export async function getPdfReport(period) {
  const route = API_ROUTES.reports[period]
  if (!route) {
    throw new Error('Unsupported report period.')
  }

  if (MOCK_API_ENABLED) return mockGetPdfReport(period)

  const response = await fetch(`${API_V1_BASE_URL}${route}`, {
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
