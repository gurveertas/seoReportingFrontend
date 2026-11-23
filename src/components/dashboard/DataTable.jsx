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
  return (
    <details className="group/table min-w-0 self-start overflow-hidden rounded-xl border border-line bg-surface">
      <summary className="group/summary flex cursor-pointer list-none items-start justify-between gap-3 px-4.5 pt-4.5 select-none focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-focus-ring">
        <div>
          <h3 className="m-0 text-ink text-xs font-bold">{title}</h3>
          {description && <p className="mt-1.5 mb-0 mx-0 text-ink-muted text-caption">{description}</p>}
        </div>
        <span className="inline-flex flex-none items-center gap-2.5">
          <span className="rounded-full border border-line-subtle bg-surface-subtle px-2 py-1 text-caption font-semibold text-ink-muted tabular-nums group-hover/summary:border-line-strong">
            {rows.length} {rows.length === 1 ? 'row' : 'rows'}
          </span>
          <span className="size-2 -translate-y-0.5 rotate-45 border-r-2 border-b-2 border-ink-muted transition-transform duration-160 group-open/table:-translate-x-0.5 group-open/table:-translate-y-px group-open/table:rotate-225 group-hover/summary:border-ink motion-reduce:transition-none" aria-hidden="true" />
        </span>
      </summary>
      {rows.length > 0 && columns.length > 0 ? (
        <div className="overflow-x-auto border-t border-line-subtle scrollbar-thumb-line-strong scrollbar-track-transparent scrollbar-thin">
          <table className="w-full border-collapse text-label text-left whitespace-nowrap" aria-label={`${title} report`}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    className="bg-table-head-bg px-3.5 py-2.5 align-middle text-micro font-bold-heavy tracking-wide text-ink-secondary uppercase"
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
                      className="border-t border-line-subtle px-3.5 py-2.5 text-ink-body tabular-nums"
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

