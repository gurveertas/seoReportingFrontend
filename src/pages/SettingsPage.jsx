import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../components/AppHeader.jsx'
import IntegrationSettingsCard from '../components/settings/IntegrationSettingsCard.jsx'
import { useAuth } from '../auth/useAuth.js'
import { getUserSettings, SettingsApiError, updateUserSettings } from '../services/settings.js'

const integrationDefinitions = [
  {
    id: 'gsc',
    title: 'Google Search Console',
    description: 'Connect the Search Console property used for search reports.',
    field: {
      name: 'property_url',
      label: 'Property URL',
      placeholder: 'https://example.com/',
      type: 'url',
    },
  },
  {
    id: 'ga4',
    title: 'Google Analytics 4',
    description: 'Set the GA4 property used for website analytics.',
    field: {
      name: 'property_id',
      label: 'Property ID',
      placeholder: '123456789',
    },
  },
  {
    id: 'google_sheets',
    title: 'Google Sheets',
    description: 'Set the spreadsheet used for additional reporting data.',
    field: {
      name: 'property_id',
      label: 'Spreadsheet ID',
      placeholder: 'spreadsheet-id',
    },
  },
]

function normalizeSettings(data) {
  if (!data || typeof data.fullname !== 'string' || !data.integrations) {
    throw new Error('The settings response is missing profile or integration data.')
  }

  const integrations = {}
  for (const definition of integrationDefinitions) {
    const integration = data.integrations[definition.id]
    if (!integration || typeof integration.enabled !== 'boolean') {
      throw new Error(`The settings response is missing ${definition.title} settings.`)
    }

    const propertyValue = integration[definition.field.name]
    integrations[definition.id] = {
      enabled: integration.enabled,
      [definition.field.name]: propertyValue === null || propertyValue === undefined
        ? ''
        : String(propertyValue),
    }
  }

  return {
    fullname: data.fullname,
    integrations,
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

  function updateIntegration(id, field, value) {
    setSettings((current) => ({
      ...current,
      integrations: {
        ...current.integrations,
        [id]: {
          ...current.integrations[id],
          [field]: value,
        },
      },
    }))
    setSaveError('')
    setSaveMessage('')
  }

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

    for (const definition of integrationDefinitions) {
      const integration = settings.integrations[definition.id]
      if (integration.enabled && !integration[definition.field.name].trim()) {
        setSaveError(`Enter a ${definition.field.label.toLowerCase()} for ${definition.title}.`)
        return
      }
    }

    const payload = {
      fullname,
      integrations: Object.fromEntries(
        integrationDefinitions.map((definition) => {
          const value = settings.integrations[definition.id]
          return [
            definition.id,
            {
              enabled: value.enabled,
              [definition.field.name]: value[definition.field.name].trim(),
            },
          ]
        }),
      ),
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
      <main className="settings-content [width:min(940px,_calc(100%_-_48px))] [margin:0_auto] [padding:142px_0_72px] [&>_.dashboard-eyebrow]:[margin:0_0_11px] [&>_.dashboard-eyebrow]:[color:var(--accent-text)] [&>_.dashboard-eyebrow]:[font-size:11px] [&>_.dashboard-eyebrow]:[font-weight:700] [&>_.dashboard-eyebrow]:[letter-spacing:0.13em] [&>_.dashboard-eyebrow]:[text-transform:uppercase] [&_h1]:[margin:0] [&_h1]:[font-family:'Manrope',_sans-serif] [&_h1]:[font-size:clamp(32px,_4vw,_44px)] [&_h1]:[font-weight:650] [&_h1]:[letter-spacing:-0.055em] max-[520px]:[width:calc(100%_-_36px)] max-[520px]:[padding-top:128px]">
        <p className="dashboard-eyebrow [margin:0_0_11px] [color:var(--accent-text)] [font-size:11px] [font-weight:700] [letter-spacing:0.13em] [text-transform:uppercase]">Workspace</p>
        <h1>Settings</h1>
        <p className="settings-intro [margin:10px_0_27px] [color:var(--text-secondary)] [font-size:14px] [line-height:1.6]">
          Update your profile and choose which data sources power your reports.
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
            </section>

            <section className="settings-integrations [display:grid] [gap:0]" aria-labelledby="settings-integrations-heading">
              <div className="settings-panel__heading [margin-bottom:17px] [&_h2]:[margin:0] [&_h2]:[font-family:'Manrope',_sans-serif] [&_h2]:[font-size:16px] [&_h2]:[font-weight:700] [&_h2]:[letter-spacing:-0.035em] [&_p]:[margin:5px_0_0] [&_p]:[color:var(--text-secondary)] [&_p]:[font-size:12px] [&_p]:[line-height:1.5]">
                <h2 id="settings-integrations-heading">Integrations</h2>
                <p>Enable the sources you want included in analytics.</p>
              </div>
              <div className="settings-integration-grid [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:12px] max-[700px]:[grid-template-columns:1fr]">
                {integrationDefinitions.map((definition) => (
                  <IntegrationSettingsCard
                    key={definition.id}
                    definition={definition}
                    disabled={isSaving}
                    onEnabledChange={(id, enabled) => updateIntegration(id, 'enabled', enabled)}
                    onPropertyChange={updateIntegration}
                    value={settings.integrations[definition.id]}
                  />
                ))}
              </div>
            </section>

            <div className="settings-form__footer [display:flex] [align-items:center] [justify-content:space-between] [gap:16px] max-[520px]:[align-items:stretch] max-[520px]:[flex-direction:column-reverse]">
              <div aria-live="polite">
                {saveError && <p className="settings-form__error [margin:0] [font-size:12px] [color:var(--error-text)]" role="alert">{saveError}</p>}
                {saveMessage && <p className="settings-form__success [margin:0] [font-size:12px] [color:var(--positive-text)]" role="status">{saveMessage}</p>}
              </div>
              <button className="settings-form__submit [min-height:42px] [padding:0_16px] [border:1px_solid_var(--accent)] [border-radius:8px] [background:var(--accent)] [color:#fff] [cursor:pointer] [font:inherit] [font-size:12px] [font-weight:650] [transition:background_150ms_ease] [&:hover:not(:disabled)]:[background:var(--accent-hover)] [&:disabled]:[cursor:wait] [&:disabled]:[opacity:0.65] max-[520px]:[width:100%]" disabled={isSaving} type="submit">
                {isSaving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}

