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
      className="report-ready-dialog w-[min(440px,_calc(100%_-_32px))] max-w-none p-0 border border-(--border) rounded-[18px] bg-(--surface) text-(--text-primary) shadow-(--shadow-float) [&::backdrop]:bg-[#101914a8] [&::backdrop]:backdrop-blur-[3px] [&_h2]:m-0 [&_h2]:font-manrope [&_h2]:text-[25px] [&_h2]:font-bold [&_h2]:tracking-[-0.05em]"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      ref={dialogRef}
    >
      <div className="report-ready-dialog__content relative p-[30px] max-[480px]:py-6 px-5">
        <button
          aria-label="Close report dialog"
          className="report-ready-dialog__close grid absolute top-4 right-4 w-[34px] h-[34px] p-0 place-items-center border border-(--border) rounded-[10px] bg-(--surface) text-(--text-secondary) cursor-pointer [font:inherit] [&_span]:text-[21px] [&_span]:leading-none [&:disabled]:cursor-wait [&:disabled]:opacity-[0.65] [&:focus-visible]:outline-3 outline-(--focus-ring) [&:focus-visible]:outline-offset-[3px]"
          disabled={isSaving}
          onClick={onClose}
          type="button"
        >
          <span aria-hidden="true">×</span>
        </button>
        <div className="report-ready-dialog__icon flex items-center gap-1.75 w-fit mb-5 py-2.5 px-3 border border-(--border-subtle) rounded-[12px] bg-(--surface-subtle) text-(--accent-text) [&_svg]:w-[19px] [&_svg]:h-[19px] [&_svg]:stroke-current [&_svg]:stroke-cap-round [&_svg]:stroke-join-round [&_svg]:stroke-[1.7] [&_span]:text-[9px] [&_span]:font-extrabold [&_span]:tracking-[0.06em]" aria-hidden="true">
          <DocumentIcon />
          <span>PDF</span>
        </div>
        <p className="report-ready-dialog__eyebrow pt-0 pb-1.75 px-0 text-(--accent-text) text-[10px] font-bold tracking-[0.1em] uppercase">{periodLabel} analytics</p>
        <h2 id="report-ready-title">Report ready</h2>
        <p className="report-ready-dialog__description pt-2.25 pb-4.5 px-0 text-(--text-secondary) text-[13px] leading-[1.6]" id="report-ready-description">
          Your report is ready to save. It includes the data currently stored for this period.
        </p>
        <div className="report-ready-dialog__file flex items-center justify-between gap-3 py-2.75 px-3 border border-(--border-subtle) rounded-[9px] bg-(--surface-subtle) text-(--text-body) text-[11px] [&_span:first-child]:[overflow:hidden] [&_span:first-child]:text-ellipsis [&_span:first-child]:whitespace-nowrap [&_span:last-child]:shrink-0 grow-0 basis-auto [&_span:last-child]:text-(--text-muted) [&_span:last-child]:tabular-nums">
          <span>{filename}</span>
          <span>{formatFileSize(blob.size)}</span>
        </div>
        {saveError && <p className="report-ready-dialog__error pt-3 pb-0 px-0 text-(--error-text) text-xs leading-normal" role="alert">{saveError}</p>}
        <div className="report-ready-dialog__actions flex justify-end gap-2.25 mt-5.25 [&_button]:min-h-10 [&_button]:py-0 px-3.5 [&_button]:rounded-[8px] [&_button]:cursor-pointer [&_button]:[font:inherit] [&_button]:text-xs [&_button]:font-semibold [&_button]:transition-[background_150ms_ease,_border-color_150ms_ease] [&_button:disabled]:cursor-wait [&_button:disabled]:opacity-[0.65] [&_button:focus-visible]:outline-3 outline-(--focus-ring) [&_button:focus-visible]:outline-offset-[3px]">
          <button
            className="report-ready-dialog__cancel border border-(--border-strong) bg-(--surface) text-(--text-primary) [&:hover:not(:disabled)]:bg-(--surface-muted)"
            disabled={isSaving}
            onClick={onClose}
            type="button"
          >
            Close
          </button>
          <button
            className="report-ready-dialog__save border border-(--accent) bg-(--accent) text-[#fff] [&:hover:not(:disabled)]:border-(--accent-hover) [&:hover:not(:disabled)]:bg-(--accent-hover)"
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

