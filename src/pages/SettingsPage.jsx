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
    <div className="settings-page [min-height:100vh] [background:var(--page-bg)] [color:var(--text-primary)]">
      <AppHeader activePage="settings" />
      <main className="settings-content [width:min(940px,_calc(100%_-_48px))] [margin:0_auto] [padding:142px_0_72px] [&>_.dashboard-eyebrow]:[margin:0_0_11px] [&>_.dashboard-eyebrow]:[color:var(--accent-text)] [&>_.dashboard-eyebrow]:[font-size:11px] [&>_.dashboard-eyebrow]:[font-weight:700] [&>_.dashboard-eyebrow]:[letter-spacing:0.13em] [&>_.dashboard-eyebrow]:[text-transform:uppercase] [&_h1]:[margin:0] [&_h1]:[font-family:'Manrope',_sans-serif] [&_h1]:[font-size:clamp(32px,_4vw,_44px)] [&_h1]:[font-weight:650] [&_h1]:[letter-spacing:-0.055em] max-[520px]:[width:calc(100%_-_36px)] max-[520px]:[padding-top:128px]" id="main-content" tabIndex="-1">
        <p className="dashboard-eyebrow [margin:0_0_11px] [color:var(--accent-text)] [font-size:11px] [font-weight:700] [letter-spacing:0.13em] [text-transform:uppercase]">Workspace</p>
        <h1>Settings</h1>
        <p className="settings-intro [margin:10px_0_27px] [color:var(--text-secondary)] [font-size:14px] [line-height:1.6]">
          Update your workspace profile and manage client accounts below.
        </p>

        {isLoading ? (
          <div className="settings-message [display:flex] [align-items:center] [justify-content:space-between] [gap:16px] [min-height:70px] [padding:16px_18px] [border:1px_solid_var(--border)] [border-radius:11px] [background:var(--surface)] [color:var(--text-secondary)] [font-size:13px] [&_button]:[flex:0_0_auto] [&_button]:[padding:7px_10px] [&_button]:[border:1px_solid_var(--error-border)] [&_button]:[border-radius:7px] [&_button]:[background:var(--surface)] [&_button]:[color:var(--error-strong)] [&_button]:[cursor:pointer] [&_button]:[font:inherit] [&_button]:[font-size:11px] [&_button]:[font-weight:650] [&_button:focus-visible]:[outline:3px_solid_var(--focus-ring)] [&_button:focus-visible]:[outline-offset:3px]" role="status">Loading settings…</div>
        ) : loadError ? (
          <div className="settings-message settings-message--error [display:flex] [align-items:center] [justify-content:space-between] [gap:16px] [min-height:70px] [padding:16px_18px] [border:1px_solid_var(--border)] [border-radius:11px] [background:var(--surface)] [color:var(--text-secondary)] [font-size:13px] [&_button]:[flex:0_0_auto] [&_button]:[padding:7px_10px] [&_button]:[border:1px_solid_var(--error-border)] [&_button]:[border-radius:7px] [&_button]:[background:var(--surface)] [&_button]:[color:var(--error-strong)] [&_button]:[cursor:pointer] [&_button]:[font:inherit] [&_button]:[font-size:11px] [&_button]:[font-weight:650] [&_button:focus-visible]:[outline:3px_solid_var(--focus-ring)] [&_button:focus-visible]:[outline-offset:3px] [border-color:var(--error-border)] [background:var(--error-bg)] [color:var(--error-text)]" role="alert">
            <span>{loadError}</span>
            <button onClick={retryLoad} type="button">Try again</button>
          </div>
        ) : settings && (
          <form aria-busy={isSaving} className="settings-form [display:grid] [gap:20px] [&_button:focus-visible]:[outline:3px_solid_var(--focus-ring)] [&_button:focus-visible]:[outline-offset:3px]" onSubmit={handleSubmit}>
            <section className="settings-panel [min-width:0] [padding:20px] [border:1px_solid_var(--border)] [border-radius:13px] [background:var(--surface)] max-[520px]:[padding:16px]" aria-labelledby="settings-profile-heading">
              <div className="settings-panel__heading [margin-bottom:17px] [&_h2]:[margin:0] [&_h2]:[font-family:'Manrope',_sans-serif] [&_h2]:[font-size:16px] [&_h2]:[font-weight:700] [&_h2]:[letter-spacing:-0.035em] [&_p]:[margin:5px_0_0] [&_p]:[color:var(--text-secondary)] [&_p]:[font-size:12px] [&_p]:[line-height:1.5]">
                <h2 id="settings-profile-heading">Profile</h2>
                <p>Keep your account details up to date.</p>
              </div>
              <div className="settings-field [display:grid] [gap:7px] [&_label]:[color:var(--text-body)] [&_label]:[font-size:11px] [&_label]:[font-weight:650] [&_input]:[width:100%] [&_input]:[min-height:42px] [&_input]:[padding:0_12px] [&_input]:[border:1px_solid_var(--border-strong)] [&_input]:[border-radius:8px] [&_input]:[background:var(--surface)] [&_input]:[color:var(--text-primary)] [&_input]:[font:inherit] [&_input]:[font-size:12px] [&_input]:[transition:border-color_150ms_ease,_box-shadow_150ms_ease] [&_input::placeholder]:[color:var(--text-muted)] [&_input:focus]:[border-color:var(--accent)] [&_input:focus]:[outline:0] [&_input:focus]:[box-shadow:0_0_0_3px_color-mix(in_srgb,_var(--accent)_12%,_transparent)]">
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

