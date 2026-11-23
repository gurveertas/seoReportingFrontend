import SectionHeading from './SectionHeading.jsx'
import SourceStatusCard from './SourceStatusCard.jsx'

const sourceKeys = ['gsc', 'ga4', 'google_sheets']

export default function SourceStatusGrid({ sources }) {
  return (
    <section className="mt-10" aria-labelledby="source-status-heading">
      <SectionHeading eyebrow="Integrations" id="source-status-heading" title="Source status" />
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

