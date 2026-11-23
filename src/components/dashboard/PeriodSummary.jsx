import { useRef, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { formatReportRange, reportPeriod } from './reportPeriod.js'

export default function PeriodSummary({ period, onChange, disabled }) {
  const dialogRef = useRef(null)
  const [startDate, setStartDate] = useState(period.start_date)
  const [endDate, setEndDate] = useState(period.end_date)
  const currentRange = formatReportRange(period.start_date, period.end_date)

  function openCalendar() {
    setStartDate(period.start_date)
    setEndDate(period.end_date)
    dialogRef.current.showModal()
  }

  function applyDates(event) {
    event.preventDefault()
    if (!startDate || !endDate || startDate > endDate) return
    onChange(reportPeriod(startDate, endDate))
    dialogRef.current.close()
  }

  return (
    <div className="flex flex-wrap gap-8 py-4 px-5 border border-line rounded-xl bg-surface max-analytics:gap-3.5 max-analytics:flex-col">
      <div className="grid gap-1.5">
        <span className="text-ink-muted text-caption font-bold tracking-wider uppercase">Current period</span>
        <button
          aria-haspopup="dialog"
          aria-label={`Change current period, ${currentRange}`}
          className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-sm text-xs font-medium-bold text-ink hover:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-65"
          disabled={disabled}
          onClick={openCalendar}
          type="button"
        >
          {currentRange}
          <CalendarDays aria-hidden="true" className="size-4 shrink-0 text-accent-text" />
        </button>
      </div>
      <dialog
        aria-labelledby="report-date-range-title"
        className="m-auto w-inset-dialog max-w-sm rounded-2xl border border-line bg-surface p-5 text-ink shadow-panel backdrop:bg-overlay/65"
        ref={dialogRef}
      >
        <form className="grid gap-4" onSubmit={applyDates}>
          <h2 className="font-heading text-lg font-bold" id="report-date-range-title">Select current period</h2>
          <label className="grid gap-1.5 text-xs font-semibold">
            Start date
            <input autoFocus className="min-h-10 w-full rounded-lg border border-line-strong bg-surface px-3" max="9999-12-31" onChange={(event) => setStartDate(event.target.value)} required type="date" value={startDate} />
          </label>
          <label className="grid gap-1.5 text-xs font-semibold">
            End date
            <input className="min-h-10 w-full rounded-lg border border-line-strong bg-surface px-3" max="9999-12-31" min={startDate} onChange={(event) => setEndDate(event.target.value)} required type="date" value={endDate} />
          </label>
          <div className="flex justify-end gap-2">
            <button className="min-h-10 rounded-lg border border-line-strong px-3" onClick={() => dialogRef.current.close()} type="button">Cancel</button>
            <button className="min-h-10 rounded-lg bg-accent px-3 text-white enabled:hover:bg-accent-hover disabled:opacity-65" disabled={!startDate || !endDate || startDate > endDate} type="submit">Apply dates</button>
          </div>
        </form>
      </dialog>
      <div className="grid gap-1.5">
        <span className="text-ink-muted text-caption font-bold tracking-wider uppercase">Compared with</span>
        <strong className="text-ink text-xs font-medium-bold">
          {formatReportRange(period.comparison_start_date, period.comparison_end_date)}
        </strong>
      </div>
    </div>
  )
}
