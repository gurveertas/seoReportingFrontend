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
    <details className="min-w-0 overflow-hidden border border-line rounded-xl bg-surface self-start max-charts:[&:last-child]:col-auto group/table">
      <summary className="flex items-start justify-between gap-3 pt-4.5 pb-0 px-4.5 items-center py-4 cursor-pointer list-none select-none [&::-webkit-details-marker]:none [&:focus-visible]:outline-3 [&:focus-visible]:outline-focus-ring [&:focus-visible]:-outline-offset-3 group-open/table:rotate-225 group-open/table:-translate-x-0.5 group-open/table:-translate-y-px group-hover/summary:border-ink group-hover/summary:border-line-strong group/summary">
        <div>
          <h3 className="m-0 text-ink text-xs font-bold">{title}</h3>
          {description && <p className="mt-1.5 mb-0 mx-0 text-ink-muted text-caption">{description}</p>}
        </div>
        <span className="inline-flex flex-none items-center gap-2.5">
          <span className="py-1 px-2 border border-line-subtle rounded-2xl bg-surface-subtle text-ink-muted text-caption tabular-nums font-semibold">
            {rows.length} {rows.length === 1 ? 'row' : 'rows'}
          </span>
          <span className="w-2 h-2 border-r-2 border-ink-muted border-b-2 rotate-45 -translate-y-0.5 transition-transform duration-160 motion-reduce:transition-none" aria-hidden="true" />
        </span>
      </summary>
      {rows.length > 0 && columns.length > 0 ? (
        <div className="overflow-x-auto border-t border-line-subtle scrollbar-thumb-line-strong scrollbar-track-transparent scrollbar-thin">
          <table className="w-full border-collapse text-label text-left whitespace-nowrap" aria-label={`${title} report`}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    className={`py-3 px-3.5 bg-table-head-bg text-ink-secondary text-micro font-bold-heavy tracking-wide uppercase align-middle ${numericColumns.has(column) ? '' : undefined ?? ''}`}
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
                <tr className="hover:bg-table-head-bg even:bg-surface-subtle even:hover:bg-table-head-bg" key={row.id || row.date || row.query || row.page || rowIndex}>
                  {columns.map((column) => (
                    <td
                      className={`py-3 px-3.5 border-t border-line-subtle text-ink-body tabular-nums transition-colors duration-120 ${numericColumns.has(column) ? '' : undefined ?? ''}`}
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
        <div className="grid min-h-37.5 p-5 place-items-center text-ink-muted text-xs text-center">
          No rows are available for this period yet.
        </div>
      )}
    </details>
  )
}

