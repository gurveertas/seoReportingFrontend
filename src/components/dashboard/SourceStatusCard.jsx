const sourceNames = {
  gsc: 'Google Search Console',
  ga4: 'Google Analytics 4',
  google_sheets: 'Google Sheets',
}

const statusNames = {
  available: 'Available',
  no_data: 'No data yet',
  refreshed: 'Refreshed',
  not_configured: 'Not configured',
  error: 'Error',
}

function formatTimestamp(value) {
  if (!value) return 'Not fetched yet'
  const timestamp = new Date(value)
  return Number.isNaN(timestamp.getTime())
    ? value
    : timestamp.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export default function SourceStatusCard({ sourceKey, source }) {
  const status = source?.status || 'unknown'

  return (
    <article className="source-status-card">
      <div className="source-status-card__header">
        <h3>{sourceNames[sourceKey] || sourceKey}</h3>
        <span className={`source-status source-status--${status.replaceAll('_', '-')}`}>
          {statusNames[status] || 'Status unavailable'}
        </span>
      </div>
      <p>Last fetched</p>
      <time dateTime={source?.fetched_at || undefined}>
        {formatTimestamp(source?.fetched_at)}
      </time>
    </article>
  )
}
