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
    <div className="flex items-center justify-between gap-4 max-analytics:items-stretch max-analytics:flex-col">
      <div className="inline-flex p-1 border border-line rounded-lg bg-surface max-analytics:grid max-analytics:grid-cols-2" role="group" aria-label="Analytics period">
        {periods.map((option) => (
          <button
            key={option.id}
            aria-pressed={period === option.id}
            className={`min-w-22 min-h-9 py-0 px-3.5 border-0 rounded-md bg-transparent text-ink-secondary cursor-pointer text-xs font-medium-bold transition-colors duration-160 aria-pressed:bg-accent aria-pressed:text-white disabled:cursor-wait disabled:opacity-60 max-analytics:w-full ${period === option.id ? 'is-active' : '' ?? ''}`}
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
          className="inline-flex items-center justify-center gap-2 min-h-10.5 py-0 px-3.5 border border-line-strong rounded-lg bg-surface text-ink cursor-pointer text-xs font-medium-bold transition-colors duration-160 [&:hover:not(:disabled)]:border-accent [&:hover:not(:disabled)]:bg-surface-muted [&:disabled]:cursor-wait [&:disabled]:opacity-65"
          disabled={isLoading || isRefreshing || isGeneratingReport}
          onClick={onGenerateReport}
          type="button"
        >
          <DocumentIcon className="w-4 h-4 stroke-accent-text stroke-ui" />
          {isGeneratingReport ? 'Generating…' : 'Generate PDF'}
        </button>
        <button
          aria-label={isRefreshing ? 'Refreshing analytics' : 'Refresh analytics'}
          aria-busy={isRefreshing}
          className="grid items-center justify-items-center w-10.5 h-10.5 p-0 border border-accent rounded-lg bg-accent text-white cursor-pointer transition-colors duration-160 [&:hover:not(:disabled)]:bg-accent-hover [&:disabled]:cursor-wait [&:disabled]:opacity-65 group"
          disabled={isLoading || isRefreshing || isGeneratingReport}
          onClick={onRefresh}
          type="button"
          title={isRefreshing ? 'Refreshing analytics' : 'Refresh analytics'}
        >
          <RefreshIcon className="w-4.5 h-4.5 stroke-current stroke-ui group-aria-busy:animate-refresh-spin motion-reduce:animate-none" />
        </button>
      </div>
    </div>
  )
}

