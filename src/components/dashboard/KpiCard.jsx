function formatNumber(value, maximumFractionDigits = 2) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return '—'
  return new Intl.NumberFormat(undefined, { maximumFractionDigits }).format(Number(value))
}

function formatValue(kpi) {
  const suffix = kpi.change_unit === 'percentage_points' ? '%' : ''
  return `${formatNumber(kpi.value)}${suffix}`
}

function formatChange(kpi) {
  if (kpi.change === null || kpi.change === undefined) return 'Comparison unavailable'

  const change = Number(kpi.change)
  if (!Number.isFinite(change)) return 'Comparison unavailable'

  const sign = change > 0 ? '+' : ''
  if (kpi.change_unit === 'percent') return `${sign}${formatNumber(change)}%`
  if (kpi.change_unit === 'percentage_points') return `${sign}${formatNumber(change)} pp`
  if (kpi.change_unit === 'positions') return `${sign}${formatNumber(change)} positions`
  return `${sign}${formatNumber(change)}`
}

function formatDisplayChange(kpi) {
  const formattedChange = formatChange(kpi)
  return formattedChange === 'Comparison unavailable' ? '—' : formattedChange
}

function trendLabel(kpi) {
  if (!kpi.trend || kpi.trend === 'unavailable') return 'Unavailable'
  if (kpi.trend === 'steady') return 'Steady'
  if (kpi.change_unit === 'positions') {
    return kpi.trend === 'up' ? 'Improved' : 'Declined'
  }
  return kpi.trend === 'up' ? 'Increased' : 'Decreased'
}

function trendClass(trend) {
  if (trend === 'up') return 'is-positive'
  if (trend === 'down') return 'is-negative'
  if (trend === 'steady') return 'is-neutral'
  return 'is-unavailable'
}

export default function KpiCard({ kpi }) {
  const hasPreviousValue = kpi.previous_value !== null && kpi.previous_value !== undefined
  const statusClass = trendClass(kpi.trend)
  const directionIcon = kpi.trend === 'up' ? '↗' : kpi.trend === 'down' ? '↘' : '·'

  return (
    <article className="kpi-card [display:grid] [align-content:start] [min-width:0] [min-height:154px] [padding:18px] [border:1px_solid_var(--border)] [border-radius:11px] [background:var(--surface)] [transition:border-color_160ms_ease,_background_160ms_ease] [&:hover]:[border-color:var(--border-strong)] motion-reduce:[animation:none] motion-reduce:[transition:none]">
      <header className="kpi-card__topline [margin:0] [&_h3]:[overflow:hidden] [&_h3]:[margin:0] [&_h3]:[color:var(--text-secondary)] [&_h3]:[font-size:12px] [&_h3]:[font-weight:650] [&_h3]:[text-overflow:ellipsis] [&_h3]:[white-space:nowrap]">
        <h3>{kpi.label}</h3>
      </header>
      <div className="kpi-card__value-row [display:flex] [align-items:baseline] [justify-content:space-between] [gap:10px] [min-width:0] [margin-top:21px]">
        <strong className="kpi-card__value [display:block] [overflow:hidden] [min-width:0] [margin:0] [color:var(--text-strong)] [font-family:'Manrope',_sans-serif] [font-size:clamp(25px,_3vw,_32px)] [font-variant-numeric:tabular-nums] [font-weight:700] [letter-spacing:-0.06em] [line-height:1.05] [text-overflow:ellipsis]">{formatValue(kpi)}</strong>
        <span
          aria-label={`${trendLabel(kpi)}: ${formatChange(kpi)}`}
          className={`kpi-card__trend ${statusClass} [display:inline-flex] [flex:0_0_auto] [align-items:center] [gap:3px] [max-width:50%] [color:var(--text-secondary)] [font-size:10px] [font-variant-numeric:tabular-nums] [font-weight:650] [white-space:nowrap] [&.is-positive]:[color:var(--positive-text)] [&.is-negative]:[color:var(--negative-text)] [&.is-neutral]:[color:var(--text-secondary)] [&.is-unavailable]:[color:var(--text-secondary)] [&>_span]:[font-size:11px] [&>_span]:[font-weight:700]`}
          title={trendLabel(kpi)}
        >
          <span aria-hidden="true">{directionIcon}</span>
          {formatDisplayChange(kpi)}
        </span>
      </div>
      <p className="kpi-card__comparison [display:flex] [align-items:baseline] [gap:5px] [overflow:hidden] [margin:9px_0_0] [color:var(--text-muted)] [font-size:10px] [text-overflow:ellipsis] [white-space:nowrap] [&>_span]:[flex:0_0_auto] [&>_strong]:[color:var(--text-body)] [&>_strong]:[font-size:10px] [&>_strong]:[font-variant-numeric:tabular-nums] [&>_strong]:[font-weight:650] [&>_strong]:[white-space:nowrap]">
        {hasPreviousValue ? (
          <>
            <span>vs</span>
            <strong>{formatValue({ ...kpi, value: kpi.previous_value })}</strong>
            <span>previous period</span>
          </>
        ) : (
          'Previous period unavailable'
        )}
      </p>
    </article>
  )
}

