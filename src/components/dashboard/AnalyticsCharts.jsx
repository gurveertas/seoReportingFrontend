import AnalyticsChartCard from './AnalyticsChartCard.jsx'
import AnalyticsPieCharts from './AnalyticsPieCharts.jsx'

const chartDefinitions = [
  {
    key: 'gsc_daily',
    title: 'Search performance',
    description: 'Daily clicks and impressions',
  },
  {
    key: 'ga4_daily',
    title: 'Website activity',
    description: 'Daily users, sessions, and page views',
  },
]

export default function AnalyticsCharts({ charts, tables }) {
  return (
    <>
      <section className="mt-10" aria-labelledby="analytics-charts-heading">
        <div className="flex items-end justify-between gap-5 mb-4">
          <div>
            <p className="mt-0 mb-3 mx-0 text-accent-text text-label font-bold tracking-eyebrow uppercase">Daily trends</p>
            <h2 className="m-0 font-heading text-section font-medium-bold tracking-tight" id="analytics-charts-heading">Performance over time</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3.5 max-charts:grid-cols-1">
          {chartDefinitions.map((definition) => (
            <AnalyticsChartCard
              key={definition.key}
              chart={charts?.[definition.key]}
              description={definition.description}
              title={definition.title}
            />
          ))}
        </div>
      </section>
      <AnalyticsPieCharts tables={tables} />
    </>
  )
}

