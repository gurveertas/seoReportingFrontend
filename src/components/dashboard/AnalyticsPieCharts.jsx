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
    <section className="analytics-section mt-10" aria-labelledby="analytics-pie-charts-heading">
      <div className="analytics-section__heading flex items-end justify-between gap-5 mb-3.75">
        <div>
          <p className="dashboard-eyebrow mb-1.75 px-0 text-(--accent-text) text-[11px] font-bold tracking-[0.13em] uppercase">Click distribution</p>
          <h2 className="m-0 font-manrope text-[21px] font-semibold tracking-[-0.045em]" id="analytics-pie-charts-heading">Where search clicks go</h2>
        </div>
      </div>
      <div className="analytics-pie-grid grid grid-cols-2 gap-3.5 max-[820px]:grid-cols-1">
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

