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
      <div className="period-toggle inline-flex p-1 border border-(--border) rounded-[9px] bg-(--surface) [&_button]:min-w-22 [&_button]:min-h-9 [&_button]:py-0 px-3.5 [&_button]:border-0 [&_button]:rounded-[6px] [&_button]:bg-transparent [&_button]:text-(--text-secondary) [&_button]:cursor-pointer [&_button]:[font:inherit] [&_button]:text-xs [&_button]:font-semibold [&_button]:transition-[background_160ms_ease,_color_160ms_ease] [&_button.is-active]:bg-(--accent) [&_button.is-active]:text-[#fff] [&_button:disabled]:cursor-wait [&_button:disabled]:opacity-[0.6] max-[560px]:grid max-[560px]:grid-cols-2 max-[560px]:[&_button]:w-full" role="group" aria-label="Analytics period">
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
      <div className="analytics-controls__actions flex items-center gap-2.25 max-[560px]:justify-end">
        <button
          aria-busy={isGeneratingReport}
          className="analytics-report-button inline-flex items-center justify-center gap-2 min-h-10.5 py-0 px-3.25 border border-(--border-strong) rounded-[8px] bg-(--surface) text-(--text-primary) cursor-pointer [font:inherit] text-xs font-semibold transition-[background_160ms_ease,_border-color_160ms_ease] [&:hover:not(:disabled)]:border-(--accent) [&:hover:not(:disabled)]:bg-(--surface-muted) [&:disabled]:cursor-wait [&:disabled]:opacity-[0.65] [&_svg]:w-4 [&_svg]:h-4 [&_svg]:stroke-(--accent-text) [&_svg]:stroke-cap-round [&_svg]:stroke-join-round [&_svg]:stroke-[1.7]"
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
          className="analytics-refresh grid items-center justify-items-center w-10.5 h-10.5 p-0 border border-(--accent) rounded-[8px] bg-(--accent) text-[#fff] cursor-pointer transition-[background_160ms_ease] [&:hover:not(:disabled)]:bg-(--accent-hover) [&:disabled]:cursor-wait [&:disabled]:opacity-[0.65] [&_svg]:w-4.5 [&_svg]:h-4.5 [&_svg]:stroke-current [&_svg]:stroke-cap-round [&_svg]:stroke-join-round [&_svg]:stroke-[1.8] [&[aria-busy='true']_svg]:animate-[refresh-icon-spin_850ms_linear_infinite] motion-reduce:[&_svg]:animate-none"
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

