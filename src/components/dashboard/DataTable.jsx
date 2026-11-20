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
    <details className="analytics-table-card [min-width:0] [overflow:hidden] [border:1px_solid_var(--border)] [border-radius:11px] [background:var(--surface)] [align-self:start] [&[open]_.analytics-table-card__chevron]:[transform:rotate(225deg)_translate(-2px,_-1px)] max-[820px]:[&:last-child]:[grid-column:auto]">
      <summary className="analytics-table-card__header [display:flex] [align-items:flex-start] [justify-content:space-between] [gap:12px] [padding:17px_18px_0] [&_h3]:[margin:0] [&_h3]:[color:var(--text-primary)] [&_h3]:[font-size:12px] [&_h3]:[font-weight:700] [&_p]:[margin:5px_0_0] [&_p]:[color:var(--text-muted)] [&_p]:[font-size:10px] [align-items:center] [padding:16px_18px] [cursor:pointer] [list-style:none] [user-select:none] [&::-webkit-details-marker]:[display:none] [&:focus-visible]:[outline:3px_solid_var(--focus-ring)] [&:focus-visible]:[outline-offset:-3px] [&:hover_.analytics-table-card__chevron]:[border-color:var(--text-primary)] [&:hover_.analytics-table-card__row-count]:[border-color:var(--border-strong)]">
        <div>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
        <span className="analytics-table-card__meta [display:inline-flex] [flex:0_0_auto] [align-items:center] [gap:10px]">
          <span className="analytics-table-card__row-count [padding:4px_8px] [border:1px_solid_var(--border-subtle)] [border-radius:20px] [background:var(--surface-subtle)] [color:var(--text-muted)] [font-size:10px] [font-variant-numeric:tabular-nums] [font-weight:600]">
            {rows.length} {rows.length === 1 ? 'row' : 'rows'}
          </span>
          <span className="analytics-table-card__chevron [width:8px] [height:8px] [border-right:1.5px_solid_var(--text-muted)] [border-bottom:1.5px_solid_var(--text-muted)] [transform:rotate(45deg)_translateY(-2px)] [transition:transform_160ms_ease] motion-reduce:[transition:none]" aria-hidden="true" />
        </span>
      </summary>
      {rows.length > 0 && columns.length > 0 ? (
        <div className="analytics-table-scroll [overflow-x:auto] [border-top:1px_solid_var(--border-subtle)] [scrollbar-color:var(--border-strong)_transparent] [scrollbar-width:thin] [&_table]:[width:100%] [&_table]:[border-collapse:collapse] [&_table]:[font-size:11px] [&_table]:[text-align:left] [&_table]:[white-space:nowrap] [&_th]:[padding:11px_14px] [&_th]:[background:var(--table-head-bg)] [&_th]:[color:var(--text-secondary)] [&_th]:[font-size:9px] [&_th]:[font-weight:750] [&_th]:[letter-spacing:0.04em] [&_th]:[text-transform:uppercase] [&_th]:[vertical-align:middle] [&_td]:[padding:11px_14px] [&_td]:[border-top:1px_solid_var(--border-subtle)] [&_td]:[color:var(--text-body)] [&_td]:[font-variant-numeric:tabular-nums] [&_td]:[transition:background-color_120ms_ease] [&.is-numeric]:[text-align:right] [&_tbody_tr:hover]:[background:var(--table-head-bg)] [&_tbody_tr:nth-child(even)]:[background:var(--surface-subtle)] [&_tbody_tr:nth-child(even):hover]:[background:var(--table-head-bg)]">
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
        <div className="analytics-table-card__empty [display:grid] [min-height:150px] [padding:20px] [place-items:center] [color:var(--text-muted)] [font-size:12px] [text-align:center]">
          No rows are available for this period yet.
        </div>
      )}
    </details>
  )
}

