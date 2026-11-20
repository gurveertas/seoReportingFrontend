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
    <section className="analytics-section [margin-top:40px]" aria-labelledby="analytics-tables-heading">
      <div className="analytics-section__heading [display:flex] [align-items:end] [justify-content:space-between] [gap:20px] [margin-bottom:15px] [&_h2]:[margin:0] [&_h2]:[font-family:'Manrope',_sans-serif] [&_h2]:[font-size:21px] [&_h2]:[font-weight:650] [&_h2]:[letter-spacing:-0.045em] [&.dashboard-eyebrow]:[margin-bottom:7px]">
        <div>
          <p className="dashboard-eyebrow [margin:0_0_11px] [color:var(--accent-text)] [font-size:11px] [font-weight:700] [letter-spacing:0.13em] [text-transform:uppercase]">Detailed data</p>
          <h2 id="analytics-tables-heading">Reports and tables</h2>
        </div>
      </div>
      <div className="analytics-table-grid [display:grid] [grid-template-columns:minmax(0,_1fr)] [align-items:start] [gap:13px]">
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

