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
    <div className="analytics-controls [display:flex] [align-items:center] [justify-content:space-between] [gap:16px] max-[560px]:[align-items:stretch] max-[560px]:[flex-direction:column]">
      <div className="period-toggle [display:inline-flex] [padding:4px] [border:1px_solid_var(--border)] [border-radius:9px] [background:var(--surface)] [&_button]:[min-width:88px] [&_button]:[min-height:36px] [&_button]:[padding:0_14px] [&_button]:[border:0] [&_button]:[border-radius:6px] [&_button]:[background:transparent] [&_button]:[color:var(--text-secondary)] [&_button]:[cursor:pointer] [&_button]:[font:inherit] [&_button]:[font-size:12px] [&_button]:[font-weight:650] [&_button]:[transition:background_160ms_ease,_color_160ms_ease] [&_button.is-active]:[background:var(--accent)] [&_button.is-active]:[color:#fff] [&_button:disabled]:[cursor:wait] [&_button:disabled]:[opacity:0.6] max-[560px]:[display:grid] max-[560px]:[grid-template-columns:1fr_1fr] max-[560px]:[&_button]:[width:100%]" role="group" aria-label="Analytics period">
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
      <div className="analytics-controls__actions [display:flex] [align-items:center] [gap:9px] max-[560px]:[justify-content:flex-end]">
        <button
          aria-busy={isGeneratingReport}
          className="analytics-report-button [display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [min-height:42px] [padding:0_13px] [border:1px_solid_var(--border-strong)] [border-radius:8px] [background:var(--surface)] [color:var(--text-primary)] [cursor:pointer] [font:inherit] [font-size:12px] [font-weight:650] [transition:background_160ms_ease,_border-color_160ms_ease] [&:hover:not(:disabled)]:[border-color:var(--accent)] [&:hover:not(:disabled)]:[background:var(--surface-muted)] [&:disabled]:[cursor:wait] [&:disabled]:[opacity:0.65] [&_svg]:[width:16px] [&_svg]:[height:16px] [&_svg]:[stroke:var(--accent-text)] [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] [&_svg]:[stroke-width:1.7]"
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
          className="analytics-refresh [display:grid] [align-items:center] [justify-items:center] [width:42px] [height:42px] [padding:0] [border:1px_solid_var(--accent)] [border-radius:8px] [background:var(--accent)] [color:#fff] [cursor:pointer] [transition:background_160ms_ease] [&:hover:not(:disabled)]:[background:var(--accent-hover)] [&:disabled]:[cursor:wait] [&:disabled]:[opacity:0.65] [&_svg]:[width:18px] [&_svg]:[height:18px] [&_svg]:[stroke:currentColor] [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] [&_svg]:[stroke-width:1.8] [&[aria-busy='true']_svg]:[animation:refresh-icon-spin_850ms_linear_infinite] motion-reduce:[&_svg]:[animation:none]"
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

