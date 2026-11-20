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
    <section className="analytics-section" aria-labelledby="analytics-tables-heading">
      <div className="analytics-section__heading">
        <div>
          <p className="dashboard-eyebrow">Detailed data</p>
          <h2 id="analytics-tables-heading">Reports and tables</h2>
        </div>
      </div>
      <div className="analytics-table-grid">
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
