import SectionHeading from './SectionHeading.jsx'
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
      <SectionHeading eyebrow="Click distribution" id="analytics-pie-charts-heading" title="Where search clicks go" />
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

