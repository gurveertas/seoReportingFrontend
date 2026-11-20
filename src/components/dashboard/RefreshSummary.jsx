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
    <section className="refresh-summary grid grid-cols-[minmax(170px,_0.7fr)_minmax(0,_2fr)] items-center gap-5 mb-5.5 py-4 px-4.5 border border-(--border-strong) rounded-[10px] bg-(--accent-soft) [&>_div]:grid [&>_div]:gap-1 [&>_div_strong]:text-(--accent-text) [&>_div_strong]:text-xs [&>_div_span]:text-(--text-muted) [&>_div_span]:text-[10px] [&_ul]:flex [&_ul]:flex-wrap [&_ul]:gap-y-2.5 gap-x-5 [&_ul]:m-0 [&_ul]:p-0 [&_ul]:list-none [&_li]:flex [&_li]:items-center [&_li]:gap-1.75 [&_li]:text-(--text-body) [&_li]:text-[10px] max-[560px]:grid-cols-1" aria-label="Integration refresh results">
      <div>
        <strong>Refresh complete</strong>
        <span>Each integration reports its own result.</span>
      </div>
      <ul>
        {Object.entries(refresh).map(([source, result]) => (
          <li key={source}>
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

