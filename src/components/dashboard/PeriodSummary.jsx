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
      <div className="flex flex-wrap gap-8 py-4 px-5 border border-line rounded-xl bg-surface max-analytics:gap-3.5 max-analytics:flex-col">
        <span>Period dates unavailable</span>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-8 py-4 px-5 border border-line rounded-xl bg-surface max-analytics:gap-3.5 max-analytics:flex-col">
      <div className="grid gap-1.5">
        <span className="text-ink-muted text-caption font-bold tracking-wider uppercase">Current period</span>
        <strong className="text-ink text-xs font-medium-bold">{formatRange(period.start_date, period.end_date)}</strong>
      </div>
      <div className="grid gap-1.5">
        <span className="text-ink-muted text-caption font-bold tracking-wider uppercase">Compared with</span>
        <strong className="text-ink text-xs font-medium-bold">
          {formatRange(period.comparison_start_date, period.comparison_end_date)}
        </strong>
      </div>
    </div>
  )
}

