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
    <section className="refresh-summary [display:grid] [grid-template-columns:minmax(170px,_0.7fr)_minmax(0,_2fr)] [align-items:center] [gap:20px] [margin-bottom:22px] [padding:16px_18px] [border:1px_solid_var(--border-strong)] [border-radius:10px] [background:var(--accent-soft)] [&>_div]:[display:grid] [&>_div]:[gap:4px] [&>_div_strong]:[color:var(--accent-text)] [&>_div_strong]:[font-size:12px] [&>_div_span]:[color:var(--text-muted)] [&>_div_span]:[font-size:10px] [&_ul]:[display:flex] [&_ul]:[flex-wrap:wrap] [&_ul]:[gap:10px_20px] [&_ul]:[margin:0] [&_ul]:[padding:0] [&_ul]:[list-style:none] [&_li]:[display:flex] [&_li]:[align-items:center] [&_li]:[gap:7px] [&_li]:[color:var(--text-body)] [&_li]:[font-size:10px] max-[560px]:[grid-template-columns:1fr]" aria-label="Integration refresh results">
      <div>
        <strong>Refresh complete</strong>
        <span>Each integration reports its own result.</span>
      </div>
      <ul>
        {Object.entries(refresh).map(([source, result]) => (
          <li key={source}>
            <span>{sourceNames[source] || source}</span>
            <strong className={`refresh-summary__status refresh-summary__status--${statusClass(result?.status)} [color:var(--positive-text)] [font-size:10px] [font-weight:700] [text-transform:capitalize] ${['error'].includes(result?.status) ? '[color:var(--negative-text)]' : ['not_configured', 'unknown'].includes(result?.status) ? '[color:var(--warning-text)]' : ''}`}>
              {formatStatus(result?.status)}
            </strong>
          </li>
        ))}
      </ul>
    </section>
  )
}

