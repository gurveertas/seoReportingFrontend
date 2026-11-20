import { useEffect, useRef, useState } from 'react'
import { APP_NAME } from '../../config/app.js'
import { savePdfBlob } from '../../services/reports.js'
import { DocumentIcon } from '../icons/AppIcons.jsx'

function getFilename(period) {
  const appSlug = APP_NAME.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `${appSlug || 'analytics'}-${period}-report.pdf`
}

function formatFileSize(size) {
  return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(size / 1024)} KB`
}

export default function ReportReadyDialog({ blob, period, onClose }) {
  const dialogRef = useRef(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const filename = getFilename(period)
  const periodLabel = period === 'weekly' ? 'Weekly' : 'Monthly'

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()

    return () => {
      if (dialog?.open) dialog.close()
    }
  }, [])

  async function handleSave() {
    setIsSaving(true)
    setSaveError('')

    try {
      const saved = await savePdfBlob(blob, filename)
      setIsSaving(false)
      if (saved) onClose()
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save the PDF.')
      setIsSaving(false)
    }
  }

  function handleCancel(event) {
    event.preventDefault()
    if (!isSaving) onClose()
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget && !isSaving) onClose()
  }

  return (
    <dialog
      aria-describedby="report-ready-description"
      aria-labelledby="report-ready-title"
      aria-modal="true"
      className="report-ready-dialog [width:min(440px,_calc(100%_-_32px))] [max-width:none] [padding:0] [border:1px_solid_var(--border)] [border-radius:18px] [background:var(--surface)] [color:var(--text-primary)] [box-shadow:var(--shadow-float)] [&::backdrop]:[background:#101914a8] [&::backdrop]:[backdrop-filter:blur(3px)] [&_h2]:[margin:0] [&_h2]:[font-family:'Manrope',_sans-serif] [&_h2]:[font-size:25px] [&_h2]:[font-weight:700] [&_h2]:[letter-spacing:-0.05em]"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      ref={dialogRef}
    >
      <div className="report-ready-dialog__content [position:relative] [padding:30px] max-[480px]:[padding:24px_20px]">
        <button
          aria-label="Close report dialog"
          className="report-ready-dialog__close [display:grid] [position:absolute] [top:16px] [right:16px] [width:34px] [height:34px] [padding:0] [place-items:center] [border:1px_solid_var(--border)] [border-radius:10px] [background:var(--surface)] [color:var(--text-secondary)] [cursor:pointer] [font:inherit] [&_span]:[font-size:21px] [&_span]:[line-height:1] [&:disabled]:[cursor:wait] [&:disabled]:[opacity:0.65] [&:focus-visible]:[outline:3px_solid_var(--focus-ring)] [&:focus-visible]:[outline-offset:3px]"
          disabled={isSaving}
          onClick={onClose}
          type="button"
        >
          <span aria-hidden="true">×</span>
        </button>
        <div className="report-ready-dialog__icon [display:flex] [align-items:center] [gap:7px] [width:fit-content] [margin-bottom:20px] [padding:10px_12px] [border:1px_solid_var(--border-subtle)] [border-radius:12px] [background:var(--surface-subtle)] [color:var(--accent-text)] [&_svg]:[width:19px] [&_svg]:[height:19px] [&_svg]:[stroke:currentColor] [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] [&_svg]:[stroke-width:1.7] [&_span]:[font-size:9px] [&_span]:[font-weight:800] [&_span]:[letter-spacing:0.06em]" aria-hidden="true">
          <DocumentIcon />
          <span>PDF</span>
        </div>
        <p className="report-ready-dialog__eyebrow [margin:0_0_7px] [color:var(--accent-text)] [font-size:10px] [font-weight:700] [letter-spacing:0.1em] [text-transform:uppercase]">{periodLabel} analytics</p>
        <h2 id="report-ready-title">Report ready</h2>
        <p className="report-ready-dialog__description [margin:9px_0_18px] [color:var(--text-secondary)] [font-size:13px] [line-height:1.6]" id="report-ready-description">
          Your report is ready to save. It includes the data currently stored for this period.
        </p>
        <div className="report-ready-dialog__file [display:flex] [align-items:center] [justify-content:space-between] [gap:12px] [padding:11px_12px] [border:1px_solid_var(--border-subtle)] [border-radius:9px] [background:var(--surface-subtle)] [color:var(--text-body)] [font-size:11px] [&_span:first-child]:[overflow:hidden] [&_span:first-child]:[text-overflow:ellipsis] [&_span:first-child]:[white-space:nowrap] [&_span:last-child]:[flex:0_0_auto] [&_span:last-child]:[color:var(--text-muted)] [&_span:last-child]:[font-variant-numeric:tabular-nums]">
          <span>{filename}</span>
          <span>{formatFileSize(blob.size)}</span>
        </div>
        {saveError && <p className="report-ready-dialog__error [margin:12px_0_0] [color:var(--error-text)] [font-size:12px] [line-height:1.5]" role="alert">{saveError}</p>}
        <div className="report-ready-dialog__actions [display:flex] [justify-content:flex-end] [gap:9px] [margin-top:21px] [&_button]:[min-height:40px] [&_button]:[padding:0_14px] [&_button]:[border-radius:8px] [&_button]:[cursor:pointer] [&_button]:[font:inherit] [&_button]:[font-size:12px] [&_button]:[font-weight:650] [&_button]:[transition:background_150ms_ease,_border-color_150ms_ease] [&_button:disabled]:[cursor:wait] [&_button:disabled]:[opacity:0.65] [&_button:focus-visible]:[outline:3px_solid_var(--focus-ring)] [&_button:focus-visible]:[outline-offset:3px]">
          <button
            className="report-ready-dialog__cancel [border:1px_solid_var(--border-strong)] [background:var(--surface)] [color:var(--text-primary)] [&:hover:not(:disabled)]:[background:var(--surface-muted)]"
            disabled={isSaving}
            onClick={onClose}
            type="button"
          >
            Close
          </button>
          <button
            className="report-ready-dialog__save [border:1px_solid_var(--accent)] [background:var(--accent)] [color:#fff] [&:hover:not(:disabled)]:[border-color:var(--accent-hover)] [&:hover:not(:disabled)]:[background:var(--accent-hover)]"
            disabled={isSaving}
            onClick={handleSave}
            type="button"
          >
            {isSaving ? 'Saving…' : 'Save PDF'}
          </button>
        </div>
      </div>
    </dialog>
  )
}

