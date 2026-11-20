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
    <div className="analytics-controls">
      <div className="period-toggle" role="group" aria-label="Analytics period">
        {periods.map((option) => (
          <button
            key={option.id}
            aria-pressed={period === option.id}
            className={period === option.id ? 'is-active' : ''}
            disabled={isLoading || isRefreshing || isGeneratingReport}
            onClick={() => onChange(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="analytics-controls__actions">
        <button
          aria-busy={isGeneratingReport}
          className="analytics-report-button"
          disabled={isLoading || isRefreshing || isGeneratingReport}
          onClick={onGenerateReport}
          type="button"
        >
          <DocumentIcon />
          {isGeneratingReport ? 'Generating…' : 'Generate PDF'}
        </button>
        <button
          aria-label={isRefreshing ? 'Refreshing analytics' : 'Refresh analytics'}
          aria-busy={isRefreshing}
          className="analytics-refresh"
          disabled={isLoading || isRefreshing || isGeneratingReport}
          onClick={onRefresh}
          type="button"
          title={isRefreshing ? 'Refreshing analytics' : 'Refresh analytics'}
        >
          <RefreshIcon />
        </button>
      </div>
    </div>
  )
}
