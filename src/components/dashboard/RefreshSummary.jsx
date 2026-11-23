const sourceNames = {
  gsc: 'Search Console',
  ga4: 'GA4',
  google_sheets: 'Google Sheets',
}

function formatStatus(status) {
  if (!status) return 'Status unavailable'
  return status.replaceAll('_', ' ')
}

function statusColor(status) {
  if (status === 'error') return 'text-negative-text'
  if (status === 'not_configured' || status === 'unknown') return 'text-warning-text'
  return 'text-positive-text'
}

export default function RefreshSummary({ refresh }) {
  if (!refresh || typeof refresh !== 'object') return null

  return (
    <section className="grid grid-cols-refresh-summary items-center gap-5 mb-5.5 py-4 px-4.5 border border-line-strong rounded-xl bg-accent-soft max-analytics:grid-cols-1" aria-label="Integration refresh results">
      <div className="grid gap-1">
        <strong className="text-accent-text text-xs">Refresh complete</strong>
        <span className="text-ink-muted text-caption">Each integration reports its own result.</span>
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-2.5 m-0 p-0 list-none">
        {Object.entries(refresh).map(([source, result]) => (
          <li className="flex items-center gap-2 text-ink-body text-caption" key={source}>
            <span>{sourceNames[source] || source}</span>
            <strong className={`font-bold capitalize ${statusColor(result?.status)}`}>
              {formatStatus(result?.status)}
            </strong>
          </li>
        ))}
      </ul>
    </section>
  )
}

