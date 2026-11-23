import SectionHeading from './SectionHeading.jsx'
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
        <SectionHeading eyebrow="Daily trends" id="analytics-charts-heading" title="Performance over time" />
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

