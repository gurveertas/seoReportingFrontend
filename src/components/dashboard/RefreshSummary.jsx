const sourceNames = {
  gsc: 'Search Console',
  ga4: 'GA4',
  google_sheets: 'Google Sheets',
}

function formatStatus(status) {
  if (!status) return 'Status unavailable'
  return status.replaceAll('_', ' ')
}

function statusClass(status) {
  return (status || 'unknown').replaceAll('_', '-')
}

export default function RefreshSummary({ refresh }) {
  if (!refresh || typeof refresh !== 'object') return null

  return (
    <section className="refresh-summary grid grid-cols-[minmax(170px,0.7fr)_minmax(0,2fr)] items-center gap-5 mb-5.5 py-4 px-4.5 border border-(--border-strong) rounded-[10px] bg-(--accent-soft) max-[560px]:grid-cols-1" aria-label="Integration refresh results">
      <div className="grid gap-1">
        <strong className="text-(--accent-text) text-xs">Refresh complete</strong>
        <span className="text-(--text-muted) text-[10px]">Each integration reports its own result.</span>
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-2.5 m-0 p-0 list-none">
        {Object.entries(refresh).map(([source, result]) => (
          <li className="flex items-center gap-1.75 text-(--text-body) text-[10px]" key={source}>
            <span>{sourceNames[source] || source}</span>
            <strong className={`refresh-summary__status refresh-summary__status--${statusClass(result?.status)} text-(--positive-text) text-[10px] font-bold capitalize ${['error'].includes(result?.status) ? 'text-(--negative-text)' : ['not_configured', 'unknown'].includes(result?.status) ? 'text-(--warning-text)' : ''}`}>
              {formatStatus(result?.status)}
            </strong>
          </li>
        ))}
      </ul>
    </section>
  )
}

