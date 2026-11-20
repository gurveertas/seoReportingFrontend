import DataTable from './DataTable.jsx'

const tableDefinitions = [
  {
    key: 'gsc_daily',
    title: 'Search Console by day',
    description: 'Clicks, impressions, click-through rate, and position',
  },
  {
    key: 'ga4_daily',
    title: 'Analytics by day',
    description: 'Users, sessions, and page views',
  },
  {
    key: 'top_queries',
    title: 'Top search queries',
  },
  {
    key: 'top_pages',
    title: 'Top pages',
  },
  {
    key: 'google_sheets',
    title: 'Google Sheets',
    description: 'Values from the configured spreadsheet range',
  },
]

export default function AnalyticsTables({ tables }) {
  return (
    <section className="analytics-section mt-10" aria-labelledby="analytics-tables-heading">
      <div className="analytics-section__heading flex items-end justify-between gap-5 mb-3.75 [&_h2]:m-0 [&_h2]:font-manrope [&_h2]:text-[21px] [&_h2]:font-semibold [&_h2]:tracking-[-0.045em] [&.dashboard-eyebrow]:mb-1.75">
        <div>
          <p className="dashboard-eyebrow pt-0 pb-2.75 px-0 text-(--accent-text) text-[11px] font-bold tracking-[0.13em] uppercase">Detailed data</p>
          <h2 id="analytics-tables-heading">Reports and tables</h2>
        </div>
      </div>
      <div className="analytics-table-grid grid grid-cols-1 items-start gap-3.25">
        {tableDefinitions.map((definition) => (
          <DataTable
            key={definition.key}
            description={definition.description}
            table={tables?.[definition.key]}
            title={definition.title}
          />
        ))}
      </div>
    </section>
  )
}

