import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../components/AppHeader.jsx'
import IntegrationSettingsCard from '../components/settings/IntegrationSettingsCard.jsx'
import { useAuth } from '../auth/useAuth.js'
import { getUserSettings, SettingsApiError, updateUserSettings } from '../services/settings.js'
import './SettingsPage.css'

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
    <div className="settings-page">
      <AppHeader activePage="settings" />
      <main className="settings-content">
        <p className="dashboard-eyebrow">Workspace</p>
        <h1>Settings</h1>
        <p className="settings-intro">
          Update your profile and choose which data sources power your reports.
        </p>

        {isLoading ? (
          <div className="settings-message" role="status">Loading settings…</div>
        ) : loadError ? (
          <div className="settings-message settings-message--error" role="alert">
            <span>{loadError}</span>
            <button onClick={retryLoad} type="button">Try again</button>
          </div>
        ) : settings && (
          <form className="settings-form" onSubmit={handleSubmit}>
            <section className="settings-panel" aria-labelledby="settings-profile-heading">
              <div className="settings-panel__heading">
                <h2 id="settings-profile-heading">Profile</h2>
                <p>Keep your account details up to date.</p>
              </div>
              <div className="settings-field">
                <label htmlFor="settings-fullname">Full name</label>
                <input
                  autoComplete="name"
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

            <section className="settings-integrations" aria-labelledby="settings-integrations-heading">
              <div className="settings-panel__heading">
                <h2 id="settings-integrations-heading">Integrations</h2>
                <p>Enable the sources you want included in analytics.</p>
              </div>
              <div className="settings-integration-grid">
                {integrationDefinitions.map((definition) => (
                  <IntegrationSettingsCard
                    key={definition.id}
                    definition={definition}
                    onEnabledChange={(id, enabled) => updateIntegration(id, 'enabled', enabled)}
                    onPropertyChange={updateIntegration}
                    value={settings.integrations[definition.id]}
                  />
                ))}
              </div>
            </section>

            <div className="settings-form__footer">
              <div aria-live="polite">
                {saveError && <p className="settings-form__error" role="alert">{saveError}</p>}
                {saveMessage && <p className="settings-form__success" role="status">{saveMessage}</p>}
              </div>
              <button className="settings-form__submit" disabled={isSaving} type="submit">
                {isSaving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
