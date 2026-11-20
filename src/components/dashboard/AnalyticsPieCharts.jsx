import AnalyticsPieCard from './AnalyticsPieCard.jsx'

const pieDefinitions = [
  {
    key: 'top_queries',
    labelKey: 'query',
    title: 'Search query click share',
    description: 'Share of clicks across returned top queries',
  },
  {
    key: 'top_pages',
    labelKey: 'page',
    title: 'Top page click share',
    description: 'Share of clicks across returned top pages',
  },
]

export default function AnalyticsPieCharts({ tables }) {
  return (
    <section className="analytics-section [margin-top:40px]" aria-labelledby="analytics-pie-charts-heading">
      <div className="analytics-section__heading [display:flex] [align-items:end] [justify-content:space-between] [gap:20px] [margin-bottom:15px] [&_h2]:[margin:0] [&_h2]:[font-family:'Manrope',_sans-serif] [&_h2]:[font-size:21px] [&_h2]:[font-weight:650] [&_h2]:[letter-spacing:-0.045em] [&.dashboard-eyebrow]:[margin-bottom:7px]">
        <div>
          <p className="dashboard-eyebrow [margin:0_0_11px] [color:var(--accent-text)] [font-size:11px] [font-weight:700] [letter-spacing:0.13em] [text-transform:uppercase]">Click distribution</p>
          <h2 id="analytics-pie-charts-heading">Where search clicks go</h2>
        </div>
      </div>
      <div className="analytics-pie-grid [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:14px] max-[820px]:[grid-template-columns:1fr]">
        {pieDefinitions.map((definition) => (
          <AnalyticsPieCard
            key={definition.key}
            description={definition.description}
            labelKey={definition.labelKey}
            table={tables?.[definition.key]}
            title={definition.title}
          />
        ))}
      </div>
    </section>
  )
}

