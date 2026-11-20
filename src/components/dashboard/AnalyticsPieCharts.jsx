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
    <section className="analytics-section" aria-labelledby="analytics-pie-charts-heading">
      <div className="analytics-section__heading">
        <div>
          <p className="dashboard-eyebrow">Click distribution</p>
          <h2 id="analytics-pie-charts-heading">Where search clicks go</h2>
        </div>
      </div>
      <div className="analytics-pie-grid">
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
