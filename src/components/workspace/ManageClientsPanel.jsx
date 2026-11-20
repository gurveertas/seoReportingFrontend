import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { integrationDefinitions } from '../../config/integrations.js'
import { useWorkspace } from '../../workspace/useWorkspace.js'
import ClientFormDialog from './ClientFormDialog.jsx'

function enabledIntegrationCount(client) {
  return integrationDefinitions.filter((definition) => client.integrations?.[definition.id]?.enabled).length
}

export default function ManageClientsPanel() {
  const navigate = useNavigate()
  const { clients, isLoading, error, reloadClients, createClient, updateClient, deleteClient } = useWorkspace()
  const [editingClient, setEditingClient] = useState(null)
  const [isAddingClient, setIsAddingClient] = useState(false)
  const [deletingClientId, setDeletingClientId] = useState(null)
  const [actionError, setActionError] = useState('')

  async function saveClient(values) {
    if (editingClient) {
      await updateClient(editingClient.id, values)
      setEditingClient(null)
      return
    }

    const created = await createClient(values)
    setIsAddingClient(false)
    if (clients.length === 0) navigate(`/dashboard/${created.id}`)
  }

  async function confirmDelete(clientId) {
    setActionError('')
    try {
      await deleteClient(clientId)
      setDeletingClientId(null)
      if (clients.length === 1) navigate('/dashboard')
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : 'Unable to delete this client.')
    }
  }

  return (
    <section aria-labelledby="manage-clients-title" className="mt-6 mb-7 rounded-xl border border-(--border) bg-(--surface) p-5 max-sm:p-4">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="m-0 text-base font-bold tracking-tight" id="manage-clients-title">Manage clients</h2>
          <p className="mb-0 mt-1 text-xs text-(--text-secondary)">Edit each client’s details and data connections.</p>
        </div>
        <button className="min-h-9 rounded-lg bg-(--accent) px-3 text-xs font-semibold text-white transition hover:bg-(--accent-hover) focus-visible:outline-2 focus-visible:outline-(--focus-ring)" onClick={() => setIsAddingClient(true)} type="button">Add client</button>
      </header>

      {actionError && <p className="mb-3 mt-0 text-sm text-(--error-text)" role="alert">{actionError}</p>}

      {isLoading ? (
        <p className="m-0 py-5 text-center text-sm text-(--text-secondary)" role="status">Loading clients…</p>
      ) : error ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-(--error-bg) px-3 py-3" role="alert">
          <p className="m-0 text-sm text-(--error-text)">{error}</p>
          <button className="min-h-9 rounded-lg border border-(--error-border) bg-(--surface) px-3 text-xs font-semibold text-(--error-text)" onClick={() => reloadClients().catch(() => {})} type="button">Retry</button>
        </div>
      ) : clients.length === 0 ? (
        <p className="m-0 rounded-lg border border-dashed border-(--border-strong) px-4 py-6 text-center text-sm text-(--text-secondary)">No clients yet. Add a client to configure its integrations.</p>
      ) : (
        <ul className="m-0 divide-y divide-(--border-subtle) p-0">
          {clients.map((client) => (
            <li className="list-none py-3 first:pt-0 last:pb-0" key={client.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="m-0 truncate text-sm font-semibold text-(--text-primary)">{client.name}</p>
                  <p className="mb-0 mt-1 text-xs text-(--text-muted)">{enabledIntegrationCount(client)} of 3 integrations enabled</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button className="min-h-9 rounded-lg border border-(--border-strong) bg-(--surface) px-3 text-xs font-semibold text-(--text-primary) hover:bg-(--surface-muted) focus-visible:outline-2 focus-visible:outline-(--focus-ring)" onClick={() => setEditingClient(client)} type="button">Edit</button>
                  <button className="min-h-9 rounded-lg border border-(--error-border) bg-(--surface) px-3 text-xs font-semibold text-(--error-text) hover:bg-(--error-bg) focus-visible:outline-2 focus-visible:outline-(--focus-ring)" onClick={() => setDeletingClientId(client.id)} type="button">Delete</button>
                </div>
              </div>
              {deletingClientId === client.id && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-(--error-bg) px-3 py-2.5" role="group" aria-label={`Confirm deleting ${client.name}`}>
                  <p className="m-0 text-xs text-(--error-text)">Delete <strong>{client.name}</strong>? This can’t be undone.</p>
                  <div className="flex gap-2">
                    <button className="min-h-8 rounded-md px-2 text-xs font-semibold text-(--text-secondary) hover:bg-(--surface)" onClick={() => setDeletingClientId(null)} type="button">Cancel</button>
                    <button className="min-h-8 rounded-md bg-(--negative-text) px-3 text-xs font-semibold text-white hover:opacity-90" onClick={() => confirmDelete(client.id)} type="button">Delete client</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {(editingClient || isAddingClient) && (
        <ClientFormDialog
          client={editingClient}
          onClose={() => { setEditingClient(null); setIsAddingClient(false) }}
          onSave={saveClient}
        />
      )}
    </section>
  )
}
