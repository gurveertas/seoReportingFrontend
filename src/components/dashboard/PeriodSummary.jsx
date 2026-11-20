function formatDate(value) {
  if (!value) return null

  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return value

  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatRange(start, end) {
  const formattedStart = formatDate(start)
  const formattedEnd = formatDate(end)
  if (!formattedStart || !formattedEnd) return 'Dates unavailable'
  return `${formattedStart} – ${formattedEnd}`
}

export default function PeriodSummary({ period }) {
  if (!period) {
    return (
      <div className="period-summary flex flex-wrap gap-8 py-4 px-[19px] border border-(--border) rounded-[10px] bg-(--surface) [&>_div]:grid [&>_div]:gap-1.25 [&_strong]:text-(--text-primary) [&_strong]:text-xs [&_strong]:font-semibold max-[560px]:gap-3.5 max-[560px]:flex-col">
        <span>Period dates unavailable</span>
      </div>
    )
  }

  return (
    <div className="period-summary flex flex-wrap gap-8 py-4 px-[19px] border border-(--border) rounded-[10px] bg-(--surface) [&>_div]:grid [&>_div]:gap-1.25 [&_strong]:text-(--text-primary) [&_strong]:text-xs [&_strong]:font-semibold max-[560px]:gap-3.5 max-[560px]:flex-col">
      <div>
        <span className="period-summary__label text-(--text-muted) text-[10px] font-bold tracking-[0.08em] uppercase">Current period</span>
        <strong>{formatRange(period.start_date, period.end_date)}</strong>
      </div>
      <div>
        <span className="period-summary__label text-(--text-muted) text-[10px] font-bold tracking-[0.08em] uppercase">Compared with</span>
        <strong>
          {formatRange(period.comparison_start_date, period.comparison_end_date)}
        </strong>
      </div>
    </div>
  )
}

