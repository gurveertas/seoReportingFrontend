import SourceStatusCard from './SourceStatusCard.jsx'

const sourceKeys = ['gsc', 'ga4', 'google_sheets']

export default function SourceStatusGrid({ sources }) {
  return (
    <section className="analytics-section" aria-labelledby="source-status-heading">
      <div className="analytics-section__heading">
        <div>
          <p className="dashboard-eyebrow">Integrations</p>
          <h2 id="source-status-heading">Source status</h2>
        </div>
      </div>
      <div className="source-status-grid">
        {sourceKeys.map((sourceKey) => (
          <SourceStatusCard
            key={sourceKey}
            sourceKey={sourceKey}
            source={sources?.[sourceKey]}
          />
        ))}
      </div>
    </section>
  )
}
