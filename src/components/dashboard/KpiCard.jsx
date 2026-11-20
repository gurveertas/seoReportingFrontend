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
    <article className="kpi-card grid content-start min-w-0 min-h-[154px] p-4.5 border border-(--border) rounded-[11px] bg-(--surface) transition-[border-color_160ms_ease,_background_160ms_ease] [&:hover]:border-(--border-strong) motion-reduce:animate-none motion-reduce:transition-none">
      <header className="kpi-card__topline m-0 [&_h3]:[overflow:hidden] [&_h3]:m-0 [&_h3]:text-(--text-secondary) [&_h3]:text-xs [&_h3]:font-semibold [&_h3]:text-ellipsis [&_h3]:whitespace-nowrap">
        <h3>{kpi.label}</h3>
      </header>
      <div className="kpi-card__value-row flex items-baseline justify-between gap-2.5 min-w-0 mt-5.25">
        <strong className="kpi-card__value block [overflow:hidden] min-w-0 m-0 text-(--text-strong) font-manrope text-[clamp(25px,_3vw,_32px)] tabular-nums font-bold tracking-[-0.06em] leading-[1.05] text-ellipsis">{formatValue(kpi)}</strong>
        <span
          aria-label={`${trendLabel(kpi)}: ${formatChange(kpi)}`}
          className={`kpi-card__trend ${statusClass} inline-flex shrink-0 grow-0 basis-auto items-center gap-0.75 max-w-[50%] text-(--text-secondary) text-[10px] tabular-nums font-semibold whitespace-nowrap [&.is-positive]:text-(--positive-text) [&.is-negative]:text-(--negative-text) [&.is-neutral]:text-(--text-secondary) [&.is-unavailable]:text-(--text-secondary) [&>_span]:text-[11px] [&>_span]:font-bold`}
          title={trendLabel(kpi)}
        >
          <span aria-hidden="true">{directionIcon}</span>
          {formatDisplayChange(kpi)}
        </span>
      </div>
      <p className="kpi-card__comparison flex items-baseline gap-1.25 [overflow:hidden] pt-2.25 pb-0 px-0 text-(--text-muted) text-[10px] text-ellipsis whitespace-nowrap [&>_span]:shrink-0 grow-0 basis-auto [&>_strong]:text-(--text-body) [&>_strong]:text-[10px] [&>_strong]:tabular-nums [&>_strong]:font-semibold [&>_strong]:whitespace-nowrap">
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

