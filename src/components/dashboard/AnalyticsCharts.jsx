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
      <section className="analytics-section mt-10" aria-labelledby="analytics-charts-heading">
        <div className="analytics-section__heading flex items-end justify-between gap-5 mb-3.75 [&_h2]:m-0 [&_h2]:font-manrope [&_h2]:text-[21px] [&_h2]:font-semibold [&_h2]:tracking-[-0.045em] [&.dashboard-eyebrow]:mb-1.75">
          <div>
            <p className="dashboard-eyebrow pt-0 pb-2.75 px-0 text-(--accent-text) text-[11px] font-bold tracking-[0.13em] uppercase">Daily trends</p>
            <h2 id="analytics-charts-heading">Performance over time</h2>
          </div>
        </div>
        <div className="analytics-chart-grid grid grid-cols-2 gap-3.5 max-[820px]:grid-cols-1">
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

