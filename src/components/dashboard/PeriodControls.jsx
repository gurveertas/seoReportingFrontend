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
    <div className="flex items-center justify-between gap-4 max-analytics:flex-col max-analytics:items-stretch">
      <div className="inline-flex p-1 border border-line rounded-lg bg-surface max-analytics:grid max-analytics:grid-cols-2" role="group" aria-label="Analytics period">
        {periods.map((option) => (
          <button
            key={option.id}
            aria-pressed={period === option.id}
            className="min-h-9 min-w-22 cursor-pointer rounded-md px-3.5 text-xs font-medium-bold text-ink-secondary transition-colors duration-160 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus-ring disabled:cursor-wait disabled:opacity-60 aria-pressed:bg-accent aria-pressed:text-white max-analytics:w-full"
            disabled={isLoading || isRefreshing || isGeneratingReport}
            onClick={() => onChange(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2.5 max-analytics:justify-end">
        <button
          aria-busy={isGeneratingReport}
          className="inline-flex min-h-10.5 cursor-pointer items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-3.5 text-xs font-medium-bold text-ink transition-colors duration-160 enabled:hover:border-accent enabled:hover:bg-surface-muted focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus-ring disabled:cursor-wait disabled:opacity-65"
          disabled={isLoading || isRefreshing || isGeneratingReport}
          onClick={onGenerateReport}
          type="button"
        >
          <DocumentIcon className="size-4 stroke-accent-text" strokeWidth={1.7} />
          {isGeneratingReport ? 'Generating…' : 'Generate PDF'}
        </button>
        <button
          aria-label={isRefreshing ? 'Refreshing analytics' : 'Refresh analytics'}
          aria-busy={isRefreshing}
          className="group grid size-10.5 cursor-pointer place-items-center rounded-lg border border-accent bg-accent text-white transition-colors duration-160 enabled:hover:bg-accent-hover focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus-ring disabled:cursor-wait disabled:opacity-65"
          disabled={isLoading || isRefreshing || isGeneratingReport}
          onClick={onRefresh}
          type="button"
          title={isRefreshing ? 'Refreshing analytics' : 'Refresh analytics'}
        >
          <RefreshIcon className="size-4.5 motion-safe:group-aria-busy:animate-refresh-spin" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  )
}

