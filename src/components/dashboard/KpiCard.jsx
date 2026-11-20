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
    <article className="kpi-card">
      <header className="kpi-card__topline">
        <h3>{kpi.label}</h3>
      </header>
      <div className="kpi-card__value-row">
        <strong className="kpi-card__value">{formatValue(kpi)}</strong>
        <span
          aria-label={`${trendLabel(kpi)}: ${formatChange(kpi)}`}
          className={`kpi-card__trend ${statusClass}`}
          title={trendLabel(kpi)}
        >
          <span aria-hidden="true">{directionIcon}</span>
          {formatDisplayChange(kpi)}
        </span>
      </div>
      <p className="kpi-card__comparison">
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
