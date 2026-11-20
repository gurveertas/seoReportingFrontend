import AppHeader from '../components/AppHeader.jsx'
import { SettingsIcon } from '../components/icons/AppIcons.jsx'
import './SettingsPage.css'

export default function SettingsPage() {
  return (
    <div className="settings-page">
      <AppHeader activePage="settings" />
      <main className="settings-content">
        <p className="dashboard-eyebrow">Workspace</p>
        <h1>Settings</h1>
        <section className="settings-placeholder">
          <div className="settings-placeholder__icon" aria-hidden="true">
            <SettingsIcon />
          </div>
          <h2>Settings are coming soon</h2>
          <p>This space is ready for the preferences you choose to add.</p>
        </section>
      </main>
    </div>
  )
}
