const columnLabels = {
  clicks: 'Clicks',
  impressions: 'Impressions',
  date: 'Date',
  query: 'Query',
  page: 'Page',
  ctr_percent: 'CTR (%)',
  totalUsers: 'Total users',
  sessions: 'Sessions',
  screenPageViews: 'Page views',
  position: 'Avg. position',
}

function formatCell(value, column) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'number') {
    const formatted = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value)
    return column === 'ctr_percent' ? `${formatted}%` : formatted
  }
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function getColumns(table) {
  if (Array.isArray(table?.columns) && table.columns.length) return table.columns
  if (Array.isArray(table?.rows) && table.rows.length) return Object.keys(table.rows[0])
  return []
}

export default function DataTable({ table, title, description }) {
  const columns = getColumns(table)
  const rows = Array.isArray(table?.rows) ? table.rows : []
  const numericColumns = new Set(columns.filter((column) =>
    rows.some((row) => typeof row?.[column] === 'number'),
  ))

  return (
    <details className="analytics-table-card">
      <summary className="analytics-table-card__header">
        <div>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
        <span className="analytics-table-card__meta">
          <span className="analytics-table-card__row-count">
            {rows.length} {rows.length === 1 ? 'row' : 'rows'}
          </span>
          <span className="analytics-table-card__chevron" aria-hidden="true" />
        </span>
      </summary>
      {rows.length > 0 && columns.length > 0 ? (
        <div className="analytics-table-scroll">
          <table aria-label={`${title} report`}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    className={numericColumns.has(column) ? 'is-numeric' : undefined}
                    key={column}
                    scope="col"
                  >
                    {columnLabels[column] || column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={row.id || row.date || row.query || row.page || rowIndex}>
                  {columns.map((column) => (
                    <td
                      className={numericColumns.has(column) ? 'is-numeric' : undefined}
                      key={column}
                    >
                      {formatCell(row?.[column], column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="analytics-table-card__empty">
          No rows are available for this period yet.
        </div>
      )}
    </details>
  )
}
