const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeZone: 'UTC',
})

export function formatReportRange(startDate, endDate) {
  return `${dateFormatter.format(new Date(`${startDate}T00:00:00Z`))} – ${dateFormatter.format(new Date(`${endDate}T00:00:00Z`))}`
}

export function isCalendarMonth({ start_date, end_date }) {
  if (!start_date.endsWith('-01')) return false
  const nextMonth = new Date(`${start_date}T00:00:00Z`)
  nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1, 0)
  return end_date === toDateString(nextMonth)
}

function toDateString(date) {
  return date.toISOString().slice(0, 10)
}

function shiftDays(value, days) {
  const date = new Date(`${value}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return toDateString(date)
}

export function reportPeriod(startDate, endDate) {
  return {
    start_date: startDate,
    end_date: endDate,
    comparison_start_date: shiftDays(startDate, -30),
    comparison_end_date: shiftDays(startDate, -1),
  }
}

export function defaultReportPeriod(preset, today = new Date()) {
  const year = today.getFullYear()
  const month = today.getMonth()
  if (preset === 'weekly') {
    const currentDate = toDateString(new Date(Date.UTC(year, month, today.getDate())))
    return reportPeriod(shiftDays(currentDate, -7), shiftDays(currentDate, -1))
  }
  return reportPeriod(
    toDateString(new Date(Date.UTC(year, month - 1, 1))),
    toDateString(new Date(Date.UTC(year, month, 0))),
  )
}
