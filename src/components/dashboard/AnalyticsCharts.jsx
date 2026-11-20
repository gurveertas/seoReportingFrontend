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
        <div className="analytics-section__heading flex items-end justify-between gap-5 mb-3.75">
          <div>
            <p className="dashboard-eyebrow mb-1.75 px-0 text-(--accent-text) text-[11px] font-bold tracking-[0.13em] uppercase">Daily trends</p>
            <h2 className="m-0 font-manrope text-[21px] font-semibold tracking-[-0.045em]" id="analytics-charts-heading">Performance over time</h2>
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

