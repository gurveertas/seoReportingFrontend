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
    <article className="grid content-start min-w-0 min-h-38.5 p-4.5 border border-line rounded-xl bg-surface transition-colors duration-160 [&:hover]:border-line-strong motion-reduce:animate-none motion-reduce:transition-none">
      <header className="m-0">
        <h3 className="overflow-hidden m-0 text-ink-secondary text-xs font-medium-bold text-ellipsis whitespace-nowrap">{kpi.label}</h3>
      </header>
      <div className="flex items-baseline justify-between gap-2.5 min-w-0 mt-5.5">
        <strong className="block overflow-hidden min-w-0 m-0 text-ink-strong font-heading text-metric tabular-nums font-bold tracking-tighter leading-tight-display text-ellipsis">{formatValue(kpi)}</strong>
        <span
          aria-label={`${trendLabel(kpi)}: ${formatChange(kpi)}`}
          className={` ${statusClass} inline-flex flex-none items-center gap-1 max-w-1/2 text-ink-secondary text-caption tabular-nums font-medium-bold whitespace-nowrap`}
          title={trendLabel(kpi)}
        >
          <span className="text-label font-bold" aria-hidden="true">{directionIcon}</span>
          {formatDisplayChange(kpi)}
        </span>
      </div>
      <p className="flex items-baseline gap-1.5 overflow-hidden mt-2.5 mb-0 mx-0 text-ink-muted text-caption text-ellipsis whitespace-nowrap">
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

