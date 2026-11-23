import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteConnection, getConnections, syncConnection } from '../../services/google.js'
import ConnectGoogleButton from './ConnectGoogleButton.jsx'

function formatDate(value) {
  if (!value) return 'never'
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

export default function GoogleAccountsPanel() {
  const [connections, setConnections] = useState(null)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [message, setMessage] = useState('')

  const load = useCallback((signal) => getConnections(signal)
    .then((items) => { setConnections(items); setError('') })
    .catch((loadError) => { if (!signal?.aborted) setError(loadError.message) }), [])

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [load])

  async function handleSync(connectionId) {
    setBusyId(connectionId)
    setMessage('')
    setError('')
    try {
      const result = await syncConnection(connectionId)
      setMessage(`Found ${result.sites} website${result.sites === 1 ? '' : 's'}.`)
      await load()
    } catch (syncError) {
      setError(syncError.message)
      await load()
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(connectionId) {
    setBusyId(connectionId)
    setMessage('')
    try {
      const result = await deleteConnection(connectionId)
      setConfirmId(null)
      setMessage(result.linked_clients
        ? `Disconnected. ${result.linked_clients} website${result.linked_clients === 1 ? '' : 's'} using this account will stop updating until you reconnect it.`
        : 'Disconnected.')
      await load()
    } catch (deleteError) {
      setError(deleteError.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section aria-labelledby="google-accounts-title" className="mt-6 rounded-xl border border-line bg-surface p-5 max-sm:p-4">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="m-0 text-base font-bold tracking-tight" id="google-accounts-title">Google accounts</h2>
          <p className="mb-0 mt-1 text-xs text-ink-secondary">Read-only access to Search Console and Analytics. Websites from these accounts appear on the <Link className="text-accent-text underline" to="/sites">Websites</Link> page.</p>
        </div>
        <ConnectGoogleButton label={connections?.length ? 'Add account' : 'Connect Google account'} returnTo="/sites" variant={connections?.length ? 'secondary' : 'primary'} />
      </header>

      {error && <p className="mb-3 mt-0 text-sm text-error-text" role="alert">{error}</p>}
      {message && <p className="mb-3 mt-0 text-sm text-positive-text" role="status">{message}</p>}

      {connections === null ? (
        !error && <p className="m-0 py-4 text-center text-sm text-ink-secondary" role="status">Loading accounts…</p>
      ) : connections.length === 0 ? (
        <p className="m-0 rounded-lg border border-dashed border-line-strong px-4 py-6 text-center text-sm text-ink-secondary">No Google account connected yet.</p>
      ) : (
        <ul className="m-0 divide-y divide-line-subtle p-0">
          {connections.map((connection) => (
            <li className="list-none py-3 first:pt-0 last:pb-0" key={connection.connection_id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {connection.picture
                    ? <img alt="" className="size-9 rounded-full" referrerPolicy="no-referrer" src={connection.picture} />
                    : <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent-text">{(connection.email || '?')[0].toUpperCase()}</span>}
                  <div className="min-w-0">
                    <p className="m-0 truncate text-sm font-semibold">{connection.email}</p>
                    <p className={`mb-0 mt-0.5 text-xs ${connection.status === 'error' ? 'text-error-text' : 'text-ink-muted'}`}>
                      {connection.status === 'error' ? (connection.last_error || 'Needs reconnecting') : `Websites refreshed ${formatDate(connection.sites_synced_at)}`}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button className="min-h-9 rounded-lg border border-line-strong bg-surface px-3 text-xs font-semibold hover:bg-surface-muted disabled:cursor-wait disabled:opacity-60" disabled={busyId === connection.connection_id} onClick={() => handleSync(connection.connection_id)} type="button">
                    {busyId === connection.connection_id ? 'Working…' : 'Refresh websites'}
                  </button>
                  <button className="min-h-9 rounded-lg border border-error-border bg-surface px-3 text-xs font-semibold text-error-text hover:bg-error-bg" onClick={() => setConfirmId(connection.connection_id)} type="button">Disconnect</button>
                </div>
              </div>
              {connection.status === 'error' && (
                <div className="mt-2"><ConnectGoogleButton label="Reconnect" returnTo="/settings" variant="secondary" /></div>
              )}
              {confirmId === connection.connection_id && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-error-bg px-3 py-2.5" role="group">
                  <p className="m-0 text-xs text-error-text">Disconnect <strong>{connection.email}</strong>? Websites using it will stop updating.</p>
                  <div className="flex gap-2">
                    <button className="min-h-8 rounded-md px-2 text-xs font-semibold text-ink-secondary hover:bg-surface" onClick={() => setConfirmId(null)} type="button">Cancel</button>
                    <button className="min-h-8 rounded-md bg-negative-text px-3 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60" disabled={busyId === connection.connection_id} onClick={() => handleDelete(connection.connection_id)} type="button">Disconnect</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
