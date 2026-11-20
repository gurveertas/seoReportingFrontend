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
      <section className="analytics-section [margin-top:40px]" aria-labelledby="analytics-charts-heading">
        <div className="analytics-section__heading [display:flex] [align-items:end] [justify-content:space-between] [gap:20px] [margin-bottom:15px] [&_h2]:[margin:0] [&_h2]:[font-family:'Manrope',_sans-serif] [&_h2]:[font-size:21px] [&_h2]:[font-weight:650] [&_h2]:[letter-spacing:-0.045em] [&.dashboard-eyebrow]:[margin-bottom:7px]">
          <div>
            <p className="dashboard-eyebrow [margin:0_0_11px] [color:var(--accent-text)] [font-size:11px] [font-weight:700] [letter-spacing:0.13em] [text-transform:uppercase]">Daily trends</p>
            <h2 id="analytics-charts-heading">Performance over time</h2>
          </div>
        </div>
        <div className="analytics-chart-grid [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:14px] max-[820px]:[grid-template-columns:1fr]">
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

