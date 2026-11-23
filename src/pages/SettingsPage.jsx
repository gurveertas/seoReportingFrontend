import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader.jsx'
import { useAuth } from '../auth/useAuth.js'
import { getUserSettings, SettingsApiError, updateUserSettings } from '../services/settings.js'
import ManageClientsPanel from '../components/workspace/ManageClientsPanel.jsx'
import GoogleAccountsPanel from '../components/google/GoogleAccountsPanel.jsx'

function normalizeSettings(data) {
  if (!data || typeof data.fullname !== 'string') {
    throw new Error('The settings response is missing profile data.')
  }

  return {
    fullname: data.fullname,
    comparison: data.comparison !== false,
  }
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [settings, setSettings] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    getUserSettings(controller.signal)
      .then((data) => {
        if (active) {
          setSettings(normalizeSettings(data))
        }
      })
      .catch((error) => {
        if (!active || controller.signal.aborted) return

        if (error instanceof SettingsApiError && (error.status === 401 || error.status === 403)) {
          signOut()
          navigate('/', { replace: true })
          return
        }

        setLoadError(error instanceof Error ? error.message : 'Unable to load settings.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [loadAttempt, navigate, signOut])

  function retryLoad() {
    setLoadError('')
    setIsLoading(true)
    setLoadAttempt((attempt) => attempt + 1)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaveError('')
    setSaveMessage('')

    const fullname = settings.fullname.trim()
    if (!fullname) {
      setSaveError('Enter your full name.')
      return
    }

    const payload = {
      fullname,
      comparison: settings.comparison,
    }

    setIsSaving(true)
    try {
      await updateUserSettings(payload)
      setSettings((current) => ({ ...current, fullname }))
      setSaveMessage('Settings saved successfully.')
    } catch (error) {
      if (error instanceof SettingsApiError && (error.status === 401 || error.status === 403)) {
        signOut()
        navigate('/', { replace: true })
        return
      }

      setSaveError(error instanceof Error ? error.message : 'Unable to save settings.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-settings">
        <PageHeader description="Update your profile, connect Google accounts and manage your websites." eyebrow="Workspace" title="Settings" />

        {isLoading ? (
          <div className="flex items-center justify-between gap-4 min-h-17.5 py-4 px-4.5 border border-line rounded-xl bg-surface text-ink-secondary text-body-sm" role="status">Loading settings…</div>
        ) : loadError ? (
          <div className="flex items-center justify-between gap-4 min-h-17.5 py-4 px-4.5 border border-line rounded-xl bg-surface text-ink-secondary text-body-sm border-error-border bg-error-bg text-error-text" role="alert">
            <span>{loadError}</span>
            <button className="flex-none py-2 px-2.5 border border-error-border rounded-lg bg-surface text-error-strong cursor-pointer text-label font-medium-bold focus-visible:outline-3 focus-visible:outline-focus-ring focus-visible:outline-offset-3" onClick={retryLoad} type="button">Try again</button>
          </div>
        ) : settings && (
          <form aria-busy={isSaving} className="grid gap-5" onSubmit={handleSubmit}>
            <section className="min-w-0 p-5 border border-line rounded-xl bg-surface max-settings:p-4" aria-labelledby="settings-profile-heading">
              <div className="mb-4.5">
                <h2 className="m-0 font-heading text-base font-bold tracking-tight" id="settings-profile-heading">Profile</h2>
                <p className="mt-1.5 mb-0 mx-0 text-ink-secondary text-xs leading-normal">Keep your account details up to date.</p>
              </div>
              <div className="grid gap-2">
                <label className="text-ink-body text-label font-medium-bold" htmlFor="settings-fullname">Full name</label>
                <input className="w-full min-h-10.5 py-0 px-3 border border-line-strong rounded-lg bg-surface text-ink text-xs transition duration-150 placeholder:text-ink-muted focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent/12"
                  autoComplete="name"
                  disabled={isSaving}
                  id="settings-fullname"
                  onChange={(event) => {
                    setSettings((current) => ({ ...current, fullname: event.target.value }))
                    setSaveError('')
                    setSaveMessage('')
                  }}
                  required
                  value={settings.fullname}
                />
              </div>
              <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-line p-3">
                <span className="grid gap-1">
                  <span className="text-sm font-semibold">Report comparisons</span>
                  <span className="text-xs text-ink-secondary">When turned off, generated reports won’t include comparisons for any metric.</span>
                </span>
                <input
                  checked={settings.comparison}
                  className="size-4 shrink-0 accent-accent"
                  disabled={isSaving}
                  onChange={(event) => {
                    setSettings({ ...settings, comparison: event.target.checked })
                    setSaveError('')
                    setSaveMessage('')
                  }}
                  role="switch"
                  type="checkbox"
                />
              </label>
              <div className="mt-5 flex items-center justify-between gap-4 border-t border-line-subtle pt-4 max-settings:items-stretch max-settings:flex-col-reverse">
                <div aria-live="polite">
                  {saveError && <p className="m-0 text-xs text-error-text" role="alert">{saveError}</p>}
                  {saveMessage && <p className="m-0 text-xs text-positive-text" role="status">{saveMessage}</p>}
                </div>
                <button className="min-h-10 rounded-lg border border-accent bg-accent px-4 text-xs font-semibold text-white transition hover:bg-accent-hover disabled:cursor-wait disabled:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring max-settings:w-full focus-visible:outline-3 focus-visible:outline-focus-ring focus-visible:outline-offset-3" disabled={isSaving} type="submit">
                  {isSaving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </section>
          </form>
        )}

        <GoogleAccountsPanel />
        <ManageClientsPanel />
    </div>
  )
}

