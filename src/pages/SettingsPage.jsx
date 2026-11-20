import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../components/AppHeader.jsx'
import { useAuth } from '../auth/useAuth.js'
import { getUserSettings, SettingsApiError, updateUserSettings } from '../services/settings.js'
import ManageClientsPanel from '../components/workspace/ManageClientsPanel.jsx'

function normalizeSettings(data) {
  if (!data || typeof data.fullname !== 'string') {
    throw new Error('The settings response is missing profile data.')
  }

  return {
    fullname: data.fullname,
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
    <div className="settings-page min-h-screen bg-(--page-bg) text-(--text-primary)">
      <AppHeader activePage="settings" />
      <main className="settings-content mx-auto w-[min(940px,calc(100%_-_48px))] pt-[142px] pb-18 max-[520px]:w-[calc(100%_-_36px)] max-[520px]:pt-[128px]" id="main-content" tabIndex="-1">
        <p className="dashboard-eyebrow m-0 pb-2.75 text-(--accent-text) text-[11px] font-bold tracking-[0.13em] uppercase">Workspace</p>
        <h1 className="m-0 font-manrope text-[clamp(32px,4vw,44px)] font-semibold tracking-[-0.055em]">Settings</h1>
        <p className="settings-intro mt-2.5 mb-[27px] text-(--text-secondary) text-sm leading-[1.6]">
          Update your workspace profile and manage client accounts below.
        </p>

        {isLoading ? (
          <div className="settings-message flex items-center justify-between gap-4 min-h-17.5 py-4 px-4.5 border border-(--border) rounded-[11px] bg-(--surface) text-(--text-secondary) text-[13px]" role="status">Loading settings…</div>
        ) : loadError ? (
          <div className="settings-message settings-message--error flex items-center justify-between gap-4 min-h-17.5 py-4 px-4.5 border border-(--error-border) rounded-[11px] bg-(--error-bg) text-(--error-text) text-[13px]" role="alert">
            <span>{loadError}</span>
            <button className="shrink-0 rounded-md border border-(--error-border) bg-(--surface) px-2.5 py-1.75 text-[11px] font-semibold text-(--error-strong) focus-visible:outline-2 focus-visible:outline-(--focus-ring)" onClick={retryLoad} type="button">Try again</button>
          </div>
        ) : settings && (
          <form aria-busy={isSaving} className="settings-form grid gap-5" onSubmit={handleSubmit}>
            <section className="settings-panel min-w-0 p-5 border border-(--border) rounded-[13px] bg-(--surface) max-[520px]:p-4" aria-labelledby="settings-profile-heading">
              <div className="settings-panel__heading mb-4.25">
                <h2 className="m-0 font-manrope text-base font-bold tracking-[-0.035em]" id="settings-profile-heading">Profile</h2>
                <p className="mt-1.25 mb-0 text-(--text-secondary) text-xs leading-normal">Keep your account details up to date.</p>
              </div>
              <div className="settings-field grid gap-1.75">
                <label className="text-(--text-body) text-[11px] font-semibold" htmlFor="settings-fullname">Full name</label>
                <input
                  autoComplete="name"
                  disabled={isSaving}
                  id="settings-fullname"
                  className="w-full min-h-10.5 px-3 border border-(--border-strong) rounded-[8px] bg-(--surface) text-(--text-primary) text-xs transition-[border-color,box-shadow] placeholder:text-(--text-muted) focus:border-(--accent) focus:outline-none focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_12%,transparent)] disabled:cursor-not-allowed disabled:opacity-65"
                  onChange={(event) => {
                    setSettings((current) => ({ ...current, fullname: event.target.value }))
                    setSaveError('')
                    setSaveMessage('')
                  }}
                  required
                  value={settings.fullname}
                />
              </div>
              <div className="mt-5 flex items-center justify-between gap-4 border-t border-(--border-subtle) pt-4 max-[520px]:items-stretch max-[520px]:flex-col-reverse">
                <div aria-live="polite">
                  {saveError && <p className="m-0 text-xs text-(--error-text)" role="alert">{saveError}</p>}
                  {saveMessage && <p className="m-0 text-xs text-(--positive-text)" role="status">{saveMessage}</p>}
                </div>
                <button className="min-h-10 rounded-lg border border-(--accent) bg-(--accent) px-4 text-xs font-semibold text-white transition hover:bg-(--accent-hover) disabled:cursor-wait disabled:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring) max-[520px]:w-full" disabled={isSaving} type="submit">
                  {isSaving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </section>
          </form>
        )}

        <ManageClientsPanel />
      </main>
    </div>
  )
}

