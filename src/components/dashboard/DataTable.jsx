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
    <details className="group/details min-w-0 self-start overflow-hidden rounded-[11px] border border-(--border) bg-(--surface)">
      <summary className="group/summary flex cursor-pointer list-none select-none items-center justify-between gap-3 px-4.5 py-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--focus-ring)">
        <div>
          <h3 className="m-0 text-xs font-bold text-(--text-primary)">{title}</h3>
          {description && <p className="mb-0 mt-1.25 text-[10px] text-(--text-muted)">{description}</p>}
        </div>
        <span className="inline-flex shrink-0 items-center gap-2.5">
          <span className="rounded-full border border-(--border-subtle) bg-(--surface-subtle) px-2 py-1 text-[10px] font-semibold tabular-nums text-(--text-muted) transition-colors group-hover/summary:border-(--border-strong)">
            {rows.length} {rows.length === 1 ? 'row' : 'rows'}
          </span>
          <span aria-hidden="true" className="size-2 rotate-45 border-b-[1.5px] border-r-[1.5px] border-(--text-muted) transition-transform group-hover/summary:border-(--text-primary) group-open/details:-translate-x-0.5 group-open/details:-translate-y-px group-open/details:rotate-225 motion-reduce:transition-none" />
        </span>
      </summary>
      {rows.length > 0 && columns.length > 0 ? (
        <div className="overflow-x-auto border-t border-(--border-subtle)">
          <table aria-label={`${title} report`} className="w-full border-collapse whitespace-nowrap text-left text-[11px]">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    className={`bg-(--table-head-bg) px-3.5 py-2.75 align-middle text-[9px] font-extrabold uppercase tracking-[0.04em] text-(--text-secondary) ${numericColumns.has(column) ? 'text-right' : 'text-left'}`}
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
                <tr className="hover:bg-(--table-head-bg) even:bg-(--surface-subtle)" key={row.id || row.date || row.query || row.page || rowIndex}>
                  {columns.map((column) => (
                    <td
                      className={`border-t border-(--border-subtle) px-3.5 py-2.75 text-(--text-body) tabular-nums transition-colors ${numericColumns.has(column) ? 'text-right' : 'text-left'}`}
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
        <div className="grid min-h-37.5 place-items-center p-5 text-center text-xs text-(--text-muted)">
          No rows are available for this period yet.
        </div>
      )}
    </details>
  )
}

