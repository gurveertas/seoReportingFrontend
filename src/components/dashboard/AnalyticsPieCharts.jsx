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
    <section className="mt-10" aria-labelledby="analytics-pie-charts-heading">
      <div className="flex items-end justify-between gap-5 mb-4">
        <div>
          <p className="mt-0 mb-3 mx-0 text-accent-text text-label font-bold tracking-eyebrow uppercase">Click distribution</p>
          <h2 className="m-0 font-heading text-section font-medium-bold tracking-tight" id="analytics-pie-charts-heading">Where search clicks go</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3.5 max-charts:grid-cols-1">
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

