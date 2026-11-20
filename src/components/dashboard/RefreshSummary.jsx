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
    <section className="refresh-summary" aria-label="Integration refresh results">
      <div>
        <strong>Refresh complete</strong>
        <span>Each integration reports its own result.</span>
      </div>
      <ul>
        {Object.entries(refresh).map(([source, result]) => (
          <li key={source}>
            <span>{sourceNames[source] || source}</span>
            <strong className={`refresh-summary__status refresh-summary__status--${statusClass(result?.status)}`}>
              {formatStatus(result?.status)}
            </strong>
          </li>
        ))}
      </ul>
    </section>
  )
}
