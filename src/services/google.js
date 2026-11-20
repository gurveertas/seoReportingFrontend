import { apiJson } from './http.js'

const BASE = '/integrations/google'

/** Ask the backend for Google's consent URL, then leave the app to sign in with Google. */
export async function startGoogleConnect(returnTo = '/sites') {
  const result = await apiJson(`${BASE}/connect?return_to=${encodeURIComponent(returnTo)}`, {
    fallback: 'Unable to start Google sign-in.',
  })
  window.location.assign(result.auth_url)
}

export function getConnections(signal) {
  return apiJson(`${BASE}/connections`, { signal, fallback: 'Unable to load Google accounts.' })
    .then((result) => result.connections)
}

export function syncConnection(connectionId) {
  return apiJson(`${BASE}/connections/${encodeURIComponent(connectionId)}/sync`, {
    method: 'POST',
    fallback: 'Unable to refresh websites for this account.',
  })
}

export function deleteConnection(connectionId) {
  return apiJson(`${BASE}/connections/${encodeURIComponent(connectionId)}`, {
    method: 'DELETE',
    fallback: 'Unable to disconnect this account.',
  })
}

export function getSites(signal) {
  return apiJson(`${BASE}/sites`, { signal, fallback: 'Unable to load websites.' })
}

export function importSites(sites, autoMonthly) {
  return apiJson(`${BASE}/sites/import`, {
    method: 'POST',
    body: { sites, auto_monthly: autoMonthly },
    fallback: 'Unable to add the selected websites.',
  })
}

export const GOOGLE_ERROR_MESSAGES = {
  denied: 'Google access was not granted. Connect again and allow access to continue.',
  expired: 'The sign-in link expired. Please try connecting again.',
  session: 'Your session changed during sign-in. Sign in here, then connect Google again.',
  scopes: 'Search Console access was not granted. Connect again and tick every permission.',
  exchange: 'Google sign-in could not be completed. Please try again.',
  missing_code: 'Google sign-in was interrupted. Please try again.',
  missing_state: 'Google sign-in was interrupted. Please try again.',
  google_error: 'Google returned an error. Please try again.',
}
