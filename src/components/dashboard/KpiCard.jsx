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
  if (trend === 'up') return 'text-(--positive-text)'
  if (trend === 'down') return 'text-(--negative-text)'
  return 'text-(--text-secondary)'
}

export default function KpiCard({ kpi }) {
  const hasPreviousValue = kpi.previous_value !== null && kpi.previous_value !== undefined
  const statusClass = trendClass(kpi.trend)
  const directionIcon = kpi.trend === 'up' ? '↗' : kpi.trend === 'down' ? '↘' : '·'

  return (
    <article className="kpi-card grid content-start min-w-0 min-h-38.5 p-4.5 border border-(--border) rounded-[11px] bg-(--surface) transition-[border-color_160ms_ease,background_160ms_ease] hover:border-(--border-strong) motion-reduce:animate-none motion-reduce:transition-none">
      <header className="kpi-card__topline m-0">
        <h3 className="m-0 overflow-hidden text-(--text-secondary) text-xs font-semibold text-ellipsis whitespace-nowrap">{kpi.label}</h3>
      </header>
      <div className="kpi-card__value-row flex items-baseline justify-between gap-2.5 min-w-0 mt-5.25">
        <strong className="kpi-card__value block overflow-hidden min-w-0 m-0 text-(--text-strong) font-manrope text-[clamp(25px,3vw,32px)] tabular-nums font-bold tracking-[-0.06em] leading-[1.05] text-ellipsis">{formatValue(kpi)}</strong>
        <span
          aria-label={`${trendLabel(kpi)}: ${formatChange(kpi)}`}
          className={`kpi-card__trend ${statusClass} inline-flex shrink-0 grow-0 basis-auto items-center gap-0.75 max-w-[50%] text-[10px] tabular-nums font-semibold whitespace-nowrap`}
          title={trendLabel(kpi)}
        >
          <span aria-hidden="true" className="text-[11px] font-bold">{directionIcon}</span>
          {formatDisplayChange(kpi)}
        </span>
      </div>
      <p className="kpi-card__comparison flex items-baseline gap-1.25 overflow-hidden mt-2.25 mb-0 text-(--text-muted) text-[10px] text-ellipsis whitespace-nowrap">
        {hasPreviousValue ? (
          <>
            <span className="shrink-0">vs</span>
            <strong className="shrink-0 text-(--text-body) text-[10px] tabular-nums font-semibold whitespace-nowrap">{formatValue({ ...kpi, value: kpi.previous_value })}</strong>
            <span className="shrink-0">previous period</span>
          </>
        ) : (
          'Previous period unavailable'
        )}
      </p>
    </article>
  )
}

