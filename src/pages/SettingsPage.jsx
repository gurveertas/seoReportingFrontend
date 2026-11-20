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
      <main className="settings-content w-[min(940px,_calc(100%_-_48px))] py-0 px-auto pt-[142px] pb-18 px-0 [&>_.dashboard-eyebrow]:pt-0 pb-2.75 px-0 [&>_.dashboard-eyebrow]:text-(--accent-text) [&>_.dashboard-eyebrow]:text-[11px] [&>_.dashboard-eyebrow]:font-bold [&>_.dashboard-eyebrow]:tracking-[0.13em] [&>_.dashboard-eyebrow]:uppercase [&_h1]:m-0 [&_h1]:font-manrope [&_h1]:text-[clamp(32px,_4vw,_44px)] [&_h1]:font-semibold [&_h1]:tracking-[-0.055em] max-[520px]:w-[calc(100%_-_36px)] max-[520px]:pt-[128px]" id="main-content" tabIndex="-1">
        <p className="dashboard-eyebrow pt-0 pb-2.75 px-0 text-(--accent-text) text-[11px] font-bold tracking-[0.13em] uppercase">Workspace</p>
        <h1>Settings</h1>
        <p className="settings-intro pt-2.5 pb-[27px] px-0 text-(--text-secondary) text-sm leading-[1.6]">
          Update your workspace profile and manage client accounts below.
        </p>

        {isLoading ? (
          <div className="settings-message flex items-center justify-between gap-4 min-h-17.5 py-4 px-4.5 border border-(--border) rounded-[11px] bg-(--surface) text-(--text-secondary) text-[13px] [&_button]:shrink-0 grow-0 basis-auto [&_button]:py-1.75 px-2.5 [&_button]:border border-(--error-border) [&_button]:rounded-[7px] [&_button]:bg-(--surface) [&_button]:text-(--error-strong) [&_button]:cursor-pointer [&_button]:[font:inherit] [&_button]:text-[11px] [&_button]:font-semibold [&_button:focus-visible]:outline-3 outline-(--focus-ring) [&_button:focus-visible]:outline-offset-[3px]" role="status">Loading settings…</div>
        ) : loadError ? (
          <div className="settings-message settings-message--error flex items-center justify-between gap-4 min-h-17.5 py-4 px-4.5 border border-(--border) rounded-[11px] bg-(--surface) text-(--text-secondary) text-[13px] [&_button]:shrink-0 grow-0 basis-auto [&_button]:py-1.75 px-2.5 [&_button]:border border-(--error-border) [&_button]:rounded-[7px] [&_button]:bg-(--surface) [&_button]:text-(--error-strong) [&_button]:cursor-pointer [&_button]:[font:inherit] [&_button]:text-[11px] [&_button]:font-semibold [&_button:focus-visible]:outline-3 outline-(--focus-ring) [&_button:focus-visible]:outline-offset-[3px] border-(--error-border) bg-(--error-bg) text-(--error-text)" role="alert">
            <span>{loadError}</span>
            <button onClick={retryLoad} type="button">Try again</button>
          </div>
        ) : settings && (
          <form aria-busy={isSaving} className="settings-form grid gap-5 [&_button:focus-visible]:outline-3 outline-(--focus-ring) [&_button:focus-visible]:outline-offset-[3px]" onSubmit={handleSubmit}>
            <section className="settings-panel min-w-0 p-5 border border-(--border) rounded-[13px] bg-(--surface) max-[520px]:p-4" aria-labelledby="settings-profile-heading">
              <div className="settings-panel__heading mb-4.25 [&_h2]:m-0 [&_h2]:font-manrope [&_h2]:text-base [&_h2]:font-bold [&_h2]:tracking-[-0.035em] [&_p]:pt-1.25 pb-0 px-0 [&_p]:text-(--text-secondary) [&_p]:text-xs [&_p]:leading-normal">
                <h2 id="settings-profile-heading">Profile</h2>
                <p>Keep your account details up to date.</p>
              </div>
              <div className="settings-field grid gap-1.75 [&_label]:text-(--text-body) [&_label]:text-[11px] [&_label]:font-semibold [&_input]:w-full [&_input]:min-h-10.5 [&_input]:py-0 px-3 [&_input]:border border-(--border-strong) [&_input]:rounded-[8px] [&_input]:bg-(--surface) [&_input]:text-(--text-primary) [&_input]:[font:inherit] [&_input]:text-xs [&_input]:transition-[border-color_150ms_ease,_box-shadow_150ms_ease] [&_input::placeholder]:text-(--text-muted) [&_input:focus]:border-(--accent) [&_input:focus]:outline-none [&_input:focus]:shadow-[0_0_0_3px_color-mix(in_srgb,_var(--accent)_12%,_transparent)]">
                <label htmlFor="settings-fullname">Full name</label>
                <input
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

