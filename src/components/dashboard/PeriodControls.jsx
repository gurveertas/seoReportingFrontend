import { DocumentIcon, RefreshIcon } from '../icons/AppIcons.jsx'

const periods = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'weekly', label: 'Weekly' },
]

export default function PeriodControls({
  period,
  onChange,
  onRefresh,
  onGenerateReport,
  isLoading,
  isRefreshing,
  isGeneratingReport,
}) {
  return (
    <div className="analytics-controls flex items-center justify-between gap-4 max-[560px]:items-stretch max-[560px]:flex-col">
      <div className="period-toggle inline-flex p-1 border border-(--border) rounded-[9px] bg-(--surface) max-[560px]:grid max-[560px]:grid-cols-2" role="group" aria-label="Analytics period">
        {periods.map((option) => (
          <button
            key={option.id}
            aria-pressed={period === option.id}
            className={`min-w-22 min-h-9 rounded-md text-xs font-semibold transition-colors disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-(--focus-ring) max-[560px]:w-full ${period === option.id ? 'bg-(--accent) text-white' : 'bg-transparent text-(--text-secondary)'}`}
            disabled={isLoading || isRefreshing || isGeneratingReport}
            onClick={() => onChange(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="analytics-controls__actions flex items-center gap-2.25 max-[560px]:justify-end">
        <button
          aria-busy={isGeneratingReport}
          className="analytics-report-button inline-flex items-center justify-center gap-2 min-h-10.5 px-3.25 border border-(--border-strong) rounded-lg bg-(--surface) text-(--text-primary) text-xs font-semibold transition-[background,border-color] hover:not-disabled:border-(--accent) hover:not-disabled:bg-(--surface-muted) disabled:cursor-wait disabled:opacity-65 focus-visible:outline-2 focus-visible:outline-(--focus-ring)"
          disabled={isLoading || isRefreshing || isGeneratingReport}
          onClick={onGenerateReport}
          type="button"
        >
          <DocumentIcon className="size-4 stroke-(--accent-text) stroke-[1.7]" />
          {isGeneratingReport ? 'Generating…' : 'Generate PDF'}
        </button>
        <button
          aria-label={isRefreshing ? 'Refreshing analytics' : 'Refresh analytics'}
          aria-busy={isRefreshing}
          className="analytics-refresh grid size-10.5 place-items-center border border-(--accent) rounded-lg bg-(--accent) text-white transition-colors hover:not-disabled:bg-(--accent-hover) disabled:cursor-wait disabled:opacity-65 focus-visible:outline-2 focus-visible:outline-(--focus-ring)"
          disabled={isLoading || isRefreshing || isGeneratingReport}
          onClick={onRefresh}
          type="button"
          title={isRefreshing ? 'Refreshing analytics' : 'Refresh analytics'}
        >
          <RefreshIcon className={`size-4.5 stroke-current stroke-[1.8] ${isRefreshing ? 'animate-[refresh-icon-spin_850ms_linear_infinite] motion-reduce:animate-none' : ''}`} />
        </button>
      </div>
    </div>
  )
}

