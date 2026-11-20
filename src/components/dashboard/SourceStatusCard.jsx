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
    <article className="source-status-card [min-width:0] [padding:16px_17px] [border:1px_solid_var(--border)] [border-radius:10px] [background:var(--surface)] [&>_p]:[margin:15px_0_4px] [&>_p]:[color:var(--text-muted)] [&>_p]:[font-size:10px] [&_time]:[color:var(--text-secondary)] [&_time]:[font-size:11px] [&_time]:[font-weight:550] max-[700px]:[padding:15px]">
      <div className="source-status-card__header [display:flex] [align-items:flex-start] [justify-content:space-between] [gap:9px] [&_h3]:[margin:0] [&_h3]:[color:var(--text-primary)] [&_h3]:[font-size:12px] [&_h3]:[font-weight:700] [&_h3]:[line-height:1.4]">
        <h3>{sourceNames[sourceKey] || sourceKey}</h3>
        <span className={`source-status source-status--${status.replaceAll('_', '-')} [flex:0_0_auto] [padding:4px_7px] [border-radius:20px] [background:var(--surface-muted)] [color:var(--text-secondary)] [font-size:9px] [font-weight:750] [text-transform:capitalize] ${['available', 'refreshed'].includes(status) ? '[background:var(--positive-bg)] [color:var(--positive-text)]' : status === 'error' ? '[background:var(--negative-bg)] [color:var(--negative-text)]' : '[background:var(--warning-bg)] [color:var(--warning-text)]'}`}>
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

