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
    <article className="min-w-0 py-4 px-4.5 border border-line rounded-xl bg-surface max-auth-stack:p-4">
      <div className="flex items-start justify-between gap-2.5">
        <h3 className="m-0 text-ink text-xs font-bold leading-snug">{sourceNames[sourceKey] || sourceKey}</h3>
        <span className={`flex-none rounded-full px-2 py-1 text-micro font-bold-heavy capitalize ${['available', 'refreshed'].includes(status) ? 'bg-positive-bg text-positive-text' : status === 'error' ? 'bg-negative-bg text-negative-text' : 'bg-warning-bg text-warning-text'}`}>
          {statusNames[status] || 'Status unavailable'}
        </span>
      </div>
      <p className="mt-4 mb-1 mx-0 text-ink-muted text-caption">Last fetched</p>
      <time className="text-ink-secondary text-label font-medium" dateTime={source?.fetched_at || undefined}>
        {formatTimestamp(source?.fetched_at)}
      </time>
    </article>
  )
}

