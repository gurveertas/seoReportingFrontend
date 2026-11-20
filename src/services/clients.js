import { API_ROUTES, API_V1_BASE_URL } from '../config/api.js'
import { createEmptyIntegrations, integrationDefinitions } from '../config/integrations.js'

const CLIENTS_URL = `${API_V1_BASE_URL}${API_ROUTES.clients}`

export class ClientsApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ClientsApiError'
    this.status = status
  }
}

async function readResponse(response, fallback) {
  const text = await response.text()
  let result = null
  if (text) {
    try {
      result = JSON.parse(text)
    } catch {
      result = { message: text }
    }
  }
  if (!response.ok) {
    throw new ClientsApiError(result?.detail || result?.message || fallback, response.status)
  }
  return result
}

function fromApiClient(client) {
  const integrations = createEmptyIntegrations()
  for (const definition of integrationDefinitions) {
    const value = client?.[definition.id] || client?.integrations?.[definition.id] || {}
    integrations[definition.id] = {
      enabled: Boolean(value.enabled),
      [definition.field.name]: value[definition.field.name] == null ? '' : String(value[definition.field.name]),
    }
  }

  return {
    id: String(client?.id ?? client?.client_id ?? client?.uuid ?? ''),
    name: String(client?.name ?? ''),
    integrations,
    autoMonthly: Boolean(client?.auto_monthly),
    googleConnectionId: client?.google_connection_id ?? null,
    createdAt: client?.created_at ?? client?.createdAt ?? null,
  }
}

function toApiClient(client) {
  return {
    name: client.name.trim(),
    ...Object.fromEntries(integrationDefinitions.map(({ id, field }) => [
      id,
      {
        enabled: Boolean(client.integrations?.[id]?.enabled),
        [field.name]: String(client.integrations?.[id]?.[field.name] ?? ''),
      },
    ])),
  }
}

function toApiClientPatch(client) {
  const payload = toApiClient(client)
  const { name, ...integrations } = payload
  return { name, integrations }
}

function unwrapClient(result) {
  return result?.client || result?.data || result
}

export async function getClients(signal) {
  const response = await fetch(CLIENTS_URL, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
    signal,
  })
  const result = await readResponse(response, 'Unable to load clients.')
  const list = Array.isArray(result) ? result : result?.clients ?? result?.data
  if (!Array.isArray(list)) throw new Error('The clients endpoint returned an invalid response.')
  return list.map(fromApiClient)
}

export async function createClient(client) {
  const response = await fetch(CLIENTS_URL, {
    method: 'POST',
    credentials: 'include',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(toApiClientPatch(client)),
  })
  const result = await readResponse(response, 'Unable to create client.')
  return result ? fromApiClient(unwrapClient(result)) : null
}

export async function updateClient(clientId, client) {
  const response = await fetch(`${CLIENTS_URL}/${encodeURIComponent(clientId)}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(toApiClientPatch(client)),
  })
  await readResponse(response, 'Unable to update client.')
}

export async function deleteClient(clientId) {
  const response = await fetch(`${CLIENTS_URL}/${encodeURIComponent(clientId)}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
  await readResponse(response, 'Unable to delete client.')
}

export async function setClientAutoMonthly(clientId, autoMonthly) {
  const response = await fetch(`${CLIENTS_URL}/${encodeURIComponent(clientId)}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ auto_monthly: Boolean(autoMonthly) }),
  })
  return fromApiClient(await readResponse(response, 'Unable to update the monthly schedule.'))
}
