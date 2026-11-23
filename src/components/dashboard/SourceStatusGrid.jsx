import SourceStatusCard from './SourceStatusCard.jsx'

const sourceKeys = ['gsc', 'ga4', 'google_sheets']

export default function SourceStatusGrid({ sources }) {
  return (
    <section className="mt-10" aria-labelledby="source-status-heading">
      <div className="flex items-end justify-between gap-5 mb-4">
        <div>
          <p className="mt-0 mb-3 mx-0 text-accent-text text-label font-bold tracking-eyebrow uppercase">Integrations</p>
          <h2 className="m-0 font-heading text-section font-medium-bold tracking-tight" id="source-status-heading">Source status</h2>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 max-auth-stack:grid-cols-1">
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

