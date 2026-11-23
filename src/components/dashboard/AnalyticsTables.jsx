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
    <section className="mt-10" aria-labelledby="analytics-tables-heading">
      <div className="flex items-end justify-between gap-5 mb-4">
        <div>
          <p className="mt-0 mb-3 mx-0 text-accent-text text-label font-bold tracking-eyebrow uppercase">Detailed data</p>
          <h2 className="m-0 font-heading text-section font-medium-bold tracking-tight" id="analytics-tables-heading">Reports and tables</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 items-start gap-3.5">
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

