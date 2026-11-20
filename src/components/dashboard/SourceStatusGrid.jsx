import SourceStatusCard from './SourceStatusCard.jsx'

const sourceKeys = ['gsc', 'ga4', 'google_sheets']

export default function SourceStatusGrid({ sources }) {
  return (
    <section className="analytics-section [margin-top:40px]" aria-labelledby="source-status-heading">
      <div className="analytics-section__heading [display:flex] [align-items:end] [justify-content:space-between] [gap:20px] [margin-bottom:15px] [&_h2]:[margin:0] [&_h2]:[font-family:'Manrope',_sans-serif] [&_h2]:[font-size:21px] [&_h2]:[font-weight:650] [&_h2]:[letter-spacing:-0.045em] [&.dashboard-eyebrow]:[margin-bottom:7px]">
        <div>
          <p className="dashboard-eyebrow [margin:0_0_11px] [color:var(--accent-text)] [font-size:11px] [font-weight:700] [letter-spacing:0.13em] [text-transform:uppercase]">Integrations</p>
          <h2 id="source-status-heading">Source status</h2>
        </div>
      </div>
      <div className="source-status-grid [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:12px] max-[700px]:[grid-template-columns:1fr]">
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

