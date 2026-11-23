import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader.jsx'
import ConnectGoogleButton from '../components/google/ConnectGoogleButton.jsx'
import GoogleMark from '../components/google/GoogleMark.jsx'
import { useAuth } from '../auth/useAuth.js'
import { GOOGLE_ERROR_MESSAGES, getSites, importSites, syncConnection } from '../services/google.js'
import { useWorkspace } from '../workspace/useWorkspace.js'

function defaultGa4(site) {
  return site.ga4_suggestions?.[0]?.property_id || ''
}

export default function SitesPage() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { reloadClients } = useWorkspace()
  const [searchParams, setSearchParams] = useSearchParams()
  const [data, setData] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [selected, setSelected] = useState({})
  const [ga4Choice, setGa4Choice] = useState({})
  const [query, setQuery] = useState('')
  const [autoMonthly, setAutoMonthly] = useState(true)
  const [isImporting, setIsImporting] = useState(false)
  const [syncingId, setSyncingId] = useState(null)
  const [banner, setBanner] = useState(() => {
    const google = searchParams.get('google')
    if (google === 'connected') {
      const email = searchParams.get('email')
      return { type: 'success', text: `Google account${email ? ` ${email}` : ''} connected. Pick the websites you want reports for.` }
    }
    if (google === 'error') {
      return { type: 'error', text: GOOGLE_ERROR_MESSAGES[searchParams.get('reason')] || GOOGLE_ERROR_MESSAGES.google_error }
    }
    return null
  })

  useEffect(() => {
    if (searchParams.has('google')) setSearchParams({}, { replace: true })
  }, [searchParams, setSearchParams])

  const handleAuthError = useCallback((error) => {
    if (error?.status === 401) {
      signOut()
      navigate('/', { replace: true })
      return true
    }
    return false
  }, [navigate, signOut])

  useEffect(() => {
    const controller = new AbortController()
    getSites(controller.signal)
      .then((result) => {
        setData(result)
        setLoadError('')
      })
      .catch((error) => {
        if (controller.signal.aborted || handleAuthError(error)) return
        setLoadError(error.message)
      })
    return () => controller.abort()
  }, [reloadKey, handleAuthError])

  const sites = useMemo(() => data?.sites ?? [], [data])
  const connections = data?.connections ?? []
  const visibleSites = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return sites
    return sites.filter((site) => `${site.display_name} ${site.site_url} ${site.connection_email}`.toLowerCase().includes(term))
  }, [sites, query])
  const selectable = visibleSites.filter((site) => !site.client_id)
  const selectedIds = Object.keys(selected).filter((id) => selected[id])
  const allVisibleSelected = selectable.length > 0 && selectable.every((site) => selected[site.site_id])

  function toggleAll() {
    setSelected((current) => {
      const next = { ...current }
      for (const site of selectable) next[site.site_id] = !allVisibleSelected
      return next
    })
  }

  async function handleSync(connectionId) {
    setSyncingId(connectionId)
    setBanner(null)
    try {
      const result = await syncConnection(connectionId)
      setBanner({ type: 'success', text: `Found ${result.sites} website${result.sites === 1 ? '' : 's'} and ${result.ga4_properties} Analytics propert${result.ga4_properties === 1 ? 'y' : 'ies'}.` })
      setReloadKey((key) => key + 1)
    } catch (error) {
      if (!handleAuthError(error)) setBanner({ type: 'error', text: error.message })
    } finally {
      setSyncingId(null)
    }
  }

  async function handleImport() {
    const bySite = Object.fromEntries(sites.map((site) => [site.site_id, site]))
    const payload = selectedIds.map((siteId) => ({
      site_id: siteId,
      ga4_property_id: (ga4Choice[siteId] ?? defaultGa4(bySite[siteId])) || null,
    }))
    setIsImporting(true)
    setBanner(null)
    try {
      const result = await importSites(payload, autoMonthly)
      await reloadClients()
      setSelected({})
      setReloadKey((key) => key + 1)
      const count = result.created.length
      if (count === 1 && result.updated.length === 0) {
        navigate(`/dashboard/${result.created[0]}`)
        return
      }
      setBanner({ type: 'success', text: `${count} website${count === 1 ? '' : 's'} added${result.updated.length ? `, ${result.updated.length} updated` : ''}.` })
    } catch (error) {
      if (!handleAuthError(error)) setBanner({ type: 'error', text: error.message })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="pb-4">
        <PageHeader
          actions={connections.length > 0 && <ConnectGoogleButton variant="secondary" label="Add another Google account" />}
          description="Every website your connected Google accounts can see in Search Console. Add the ones you want monthly reports for."
          eyebrow="Google Search Console"
          title="Import sites"
        />

        {banner && (
          <div className={`mb-6 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${banner.type === 'error' ? 'border-error-border bg-error-bg text-error-text' : 'border-line bg-accent-soft text-accent-text'}`} role={banner.type === 'error' ? 'alert' : 'status'}>
            <span>{banner.text}</span>
            <button aria-label="Dismiss" className="text-lg leading-none opacity-70 hover:opacity-100" onClick={() => setBanner(null)} type="button">×</button>
          </div>
        )}

        {loadError ? (
          <div className="mt-8 flex items-center justify-between gap-3 rounded-xl border border-error-border bg-error-bg p-4 text-sm text-error-text" role="alert">
            <span>{loadError}</span>
            <button className="rounded-lg border border-error-border bg-surface px-3 py-1.5 text-xs font-semibold" onClick={() => setReloadKey((key) => key + 1)} type="button">Try again</button>
          </div>
        ) : !data ? (
          <p className="mt-8 rounded-xl border border-dashed border-line-strong bg-surface p-8 text-center text-sm text-ink-secondary" role="status">Loading websites…</p>
        ) : connections.length === 0 ? (
          <EmptyConnectState />
        ) : (
          <>
            <section aria-label="Connected Google accounts" className="flex flex-wrap gap-2">
              {connections.map((connection) => (
                <div className="flex items-center gap-3 rounded-xl border border-line bg-surface py-2 pl-3 pr-2 text-xs" key={connection.connection_id}>
                  <span className={`size-2 rounded-full ${connection.status === 'error' ? 'bg-negative-text' : 'bg-positive-text'}`} aria-hidden="true" />
                  <span className="font-semibold">{connection.email}</span>
                  {connection.status === 'error' && <span className="text-error-text">{connection.last_error || 'Needs reconnecting'}</span>}
                  <button className="rounded-lg border border-line-strong px-2.5 py-1.5 font-semibold hover:bg-surface-muted disabled:cursor-wait disabled:opacity-60" disabled={syncingId === connection.connection_id} onClick={() => handleSync(connection.connection_id)} type="button">
                    {syncingId === connection.connection_id ? 'Refreshing…' : 'Refresh list'}
                  </button>
                </div>
              ))}
            </section>

            <section className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface" aria-label="Websites">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line-subtle px-4 py-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-ink-secondary">
                  <input checked={allVisibleSelected} className="size-4 accent-accent" disabled={selectable.length === 0} onChange={toggleAll} type="checkbox" />
                  Select all not yet added ({selectable.length})
                </label>
                <input aria-label="Search websites" className="min-h-9 w-64 max-w-full rounded-lg border border-line-strong bg-surface px-3 text-xs outline-none focus:border-accent" onChange={(event) => setQuery(event.target.value)} placeholder="Search websites" type="search" value={query} />
              </header>
              {visibleSites.length === 0 ? (
                <p className="m-0 px-4 py-10 text-center text-sm text-ink-secondary">
                  {sites.length === 0 ? 'No Search Console websites found for these accounts. Make sure the account has at least Restricted access to a property, then refresh the list.' : 'No websites match your search.'}
                </p>
              ) : (
                <ul className="m-0 divide-y divide-line-subtle p-0">
                  {visibleSites.map((site) => (
                    <SiteRow
                      ga4Properties={data.ga4_properties?.[site.connection_id] ?? []}
                      ga4Value={ga4Choice[site.site_id] ?? defaultGa4(site)}
                      isSelected={Boolean(selected[site.site_id])}
                      key={site.site_id}
                      onGa4Change={(value) => setGa4Choice((current) => ({ ...current, [site.site_id]: value }))}
                      onToggle={() => setSelected((current) => ({ ...current, [site.site_id]: !current[site.site_id] }))}
                      showAccount={connections.length > 1}
                      site={site}
                    />
                  ))}
                </ul>
              )}
            </section>
          </>
        )}

      {selectedIds.length > 0 && (
        <div className="sticky bottom-5 z-20 mx-auto mt-6 flex w-full max-w-charts flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-5 py-3 shadow-panel">
          <label className="flex items-center gap-2 text-xs text-ink-secondary">
            <input checked={autoMonthly} className="size-4 accent-accent" onChange={(event) => setAutoMonthly(event.target.checked)} type="checkbox" />
            Generate a report automatically every month
          </label>
          <button className="min-h-10 rounded-lg bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-hover disabled:cursor-wait disabled:opacity-60" disabled={isImporting} onClick={handleImport} type="button">
            {isImporting ? 'Adding…' : `Add ${selectedIds.length} website${selectedIds.length === 1 ? '' : 's'}`}
          </button>
        </div>
      )}
    </div>
  )
}

function SiteRow({ site, isSelected, onToggle, ga4Value, onGa4Change, ga4Properties, showAccount }) {
  const added = Boolean(site.client_id)
  const suggestedIds = new Set((site.ga4_suggestions ?? []).map((item) => item.property_id))
  const others = ga4Properties.filter((item) => !suggestedIds.has(item.property_id))
  const checkboxId = `site-${site.site_id}`

  return (
    <li className={`grid list-none grid-cols-site-row items-center gap-4 px-4 py-3 max-site-row:grid-cols-site-row-compact ${isSelected ? 'bg-accent-soft/40' : ''}`}>
      <input aria-label={`Select ${site.display_name}`} checked={added || isSelected} className="size-4 accent-accent" disabled={added} id={checkboxId} onChange={onToggle} type="checkbox" />
      <label className="min-w-0 cursor-pointer" htmlFor={checkboxId}>
        <span className="block truncate text-sm font-semibold">{site.display_name}</span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-label text-ink-muted">
          <span className="truncate">{site.site_url}</span>
          <span className="rounded bg-surface-muted px-1.5 py-0.5 font-semibold">{site.property_type === 'domain' ? 'Domain property' : 'URL prefix'}</span>
          {showAccount && <span>· {site.connection_email}</span>}
        </span>
      </label>
      <div className="max-site-row:col-start-2">
        {added ? (
          <span className="text-xs text-ink-muted">Added as <strong className="text-ink">{site.client_name}</strong></span>
        ) : (
          <select aria-label={`Google Analytics property for ${site.display_name}`} className="min-h-9 w-full rounded-lg border border-line-strong bg-surface px-2 text-xs" onChange={(event) => onGa4Change(event.target.value)} value={ga4Value}>
            <option value="">No Google Analytics</option>
            {site.ga4_suggestions?.length > 0 && (
              <optgroup label="Matches this website">
                {site.ga4_suggestions.map((item) => <option key={item.property_id} value={item.property_id}>{item.display_name} ({item.property_id})</option>)}
              </optgroup>
            )}
            {others.length > 0 && (
              <optgroup label="Other properties">
                {others.map((item) => <option key={item.property_id} value={item.property_id}>{item.display_name} · {item.account_name}</option>)}
              </optgroup>
            )}
          </select>
        )}
      </div>
      <div className="max-site-row:col-start-2">
        {added && <Link className="text-xs font-semibold text-accent-text hover:underline" to={`/dashboard/${site.client_id}`}>Open dashboard →</Link>}
      </div>
    </li>
  )
}

function EmptyConnectState() {
  return (
    <section className="mt-8 rounded-2xl border border-line bg-surface px-8 py-12 text-center max-sm:px-5">
      <GoogleMark className="mx-auto mb-5 size-12" />
      <h2 className="m-0 font-heading text-2xl font-bold tracking-tight">Connect your Google account</h2>
      <p className="mx-auto mb-6 mt-3 max-w-md text-sm leading-6 text-ink-secondary">
        Sign in with the Google account you use for Search Console and Analytics. We list every website it can access, and you choose which ones get reports.
      </p>
      <ConnectGoogleButton />
      <p className="mx-auto mb-0 mt-5 max-w-sm text-label leading-5 text-ink-muted">Read-only access. We can’t change anything in your Google accounts, and you can disconnect at any time from Settings.</p>
    </section>
  )
}
