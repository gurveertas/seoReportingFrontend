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
      <div className="period-summary [display:flex] [flex-wrap:wrap] [gap:32px] [padding:16px_19px] [border:1px_solid_var(--border)] [border-radius:10px] [background:var(--surface)] [&>_div]:[display:grid] [&>_div]:[gap:5px] [&_strong]:[color:var(--text-primary)] [&_strong]:[font-size:12px] [&_strong]:[font-weight:650] max-[560px]:[gap:14px] max-[560px]:[flex-direction:column]">
        <span>Period dates unavailable</span>
      </div>
    )
  }

  return (
    <div className="period-summary [display:flex] [flex-wrap:wrap] [gap:32px] [padding:16px_19px] [border:1px_solid_var(--border)] [border-radius:10px] [background:var(--surface)] [&>_div]:[display:grid] [&>_div]:[gap:5px] [&_strong]:[color:var(--text-primary)] [&_strong]:[font-size:12px] [&_strong]:[font-weight:650] max-[560px]:[gap:14px] max-[560px]:[flex-direction:column]">
      <div>
        <span className="period-summary__label [color:var(--text-muted)] [font-size:10px] [font-weight:700] [letter-spacing:0.08em] [text-transform:uppercase]">Current period</span>
        <strong>{formatRange(period.start_date, period.end_date)}</strong>
      </div>
      <div>
        <span className="period-summary__label [color:var(--text-muted)] [font-size:10px] [font-weight:700] [letter-spacing:0.08em] [text-transform:uppercase]">Compared with</span>
        <strong>
          {formatRange(period.comparison_start_date, period.comparison_end_date)}
        </strong>
      </div>
    </div>
  )
}

