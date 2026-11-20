import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import IntegrationSettingsCard from '../settings/IntegrationSettingsCard.jsx'
import { createEmptyIntegrations, integrationDefinitions } from '../../config/integrations.js'

export default function ClientFormDialog({ onClose, onSave, client = null }) {
  const titleId = useId()
  const [name, setName] = useState(client?.name || '')
  const [integrations, setIntegrations] = useState(client?.integrations || createEmptyIntegrations())
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  function updateIntegration(id, field, value) {
    setIntegrations((current) => ({
      ...current,
      [id]: { ...current[id], [field]: value },
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim()) {
      setError('Enter a client name to continue.')
      return
    }
    for (const definition of integrationDefinitions) {
      const value = integrations[definition.id]
      if (value.enabled && !value[definition.field.name].trim()) {
        setError(`Enter a ${definition.field.label.toLowerCase()} for ${definition.title}.`)
        return
      }
    }
    setIsSaving(true)
    try {
      await onSave({ name: name.trim(), integrations })
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save this client.')
    } finally {
      setIsSaving(false)
    }
  }

  return createPortal((
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section aria-labelledby={titleId} aria-modal="true" className="max-h-[min(90vh,900px)] w-full max-w-3xl overflow-y-auto rounded-2xl border border-(--border) bg-(--surface) p-6 text-(--text-primary) shadow-2xl max-sm:p-4" role="dialog">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[.13em] text-(--accent-text)">Workspace client</p>
            <h2 className="m-0 font-[Manrope,sans-serif] text-2xl font-bold tracking-[-.04em]" id={titleId}>{client ? 'Edit client' : 'Add a client'}</h2>
            <p className="mb-0 mt-2 text-sm leading-6 text-(--text-secondary)">Set up a client and choose which data sources power its reports.</p>
          </div>
          <button aria-label="Close dialog" className="grid size-9 shrink-0 place-items-center rounded-lg border border-(--border) bg-(--surface) text-xl text-(--text-secondary) hover:bg-(--surface-muted) focus-visible:outline-2 focus-visible:outline-(--focus-ring)" disabled={isSaving} onClick={onClose} type="button">×</button>
        </header>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-xs font-semibold text-(--text-body)" htmlFor="client-name">
            Client name
            <input autoFocus className="min-h-11 w-full rounded-lg border border-(--border-strong) bg-(--surface) px-3 text-sm text-(--text-primary) outline-none transition focus:border-(--accent) focus:ring-4 focus:ring-(--accent)/15" id="client-name" maxLength={80} onChange={(event) => setName(event.target.value)} placeholder="e.g. Acme Studio" required value={name} />
          </label>
          <div>
            <h3 className="mb-1 text-sm font-bold">Integrations</h3>
            <p className="mb-3 mt-0 text-xs leading-5 text-(--text-secondary)">Enable each source and fill in its property details. You can update these later.</p>
            <div className="grid grid-cols-2 gap-3 max-[700px]:grid-cols-1">
              {integrationDefinitions.map((definition) => (
                <IntegrationSettingsCard
                  key={definition.id}
                  definition={definition}
                  value={integrations[definition.id]}
                  onEnabledChange={(id, enabled) => updateIntegration(id, 'enabled', enabled)}
                  onPropertyChange={updateIntegration}
                />
              ))}
            </div>
          </div>
          {error && <p className="m-0 text-sm text-(--error-text)" role="alert">{error}</p>}
          <footer className="flex justify-end gap-2 border-t border-(--border-subtle) pt-4 max-sm:flex-col-reverse">
            <button className="min-h-10 rounded-lg border border-(--border-strong) bg-(--surface) px-4 text-sm font-semibold text-(--text-primary) hover:bg-(--surface-muted) disabled:cursor-wait disabled:opacity-60" disabled={isSaving} onClick={onClose} type="button">Cancel</button>
            <button className="min-h-10 rounded-lg bg-(--accent) px-4 text-sm font-semibold text-white hover:bg-(--accent-hover) disabled:cursor-wait disabled:opacity-60" disabled={isSaving} type="submit">{isSaving ? 'Saving…' : client ? 'Save client' : 'Add client'}</button>
          </footer>
        </form>
      </section>
    </div>
  ), document.body)
}
