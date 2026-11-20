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
      <div className="period-summary">
        <span>Period dates unavailable</span>
      </div>
    )
  }

  return (
    <div className="period-summary">
      <div>
        <span className="period-summary__label">Current period</span>
        <strong>{formatRange(period.start_date, period.end_date)}</strong>
      </div>
      <div>
        <span className="period-summary__label">Compared with</span>
        <strong>
          {formatRange(period.comparison_start_date, period.comparison_end_date)}
        </strong>
      </div>
    </div>
  )
}
