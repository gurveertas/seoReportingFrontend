const periods = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'weekly', label: 'Weekly' },
]

export default function PeriodControls({
  period,
  onChange,
  onRefresh,
  isLoading,
  isRefreshing,
}) {
  return (
    <div className="analytics-controls">
      <div className="period-toggle" role="group" aria-label="Analytics period">
        {periods.map((option) => (
          <button
            key={option.id}
            aria-pressed={period === option.id}
            className={period === option.id ? 'is-active' : ''}
            disabled={isLoading || isRefreshing}
            onClick={() => onChange(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      <button
        className="analytics-refresh"
        disabled={isLoading || isRefreshing}
        onClick={onRefresh}
        type="button"
      >
        <span aria-hidden="true">↻</span>
        {isRefreshing ? 'Refreshing…' : 'Refresh data'}
      </button>
    </div>
  )
}
