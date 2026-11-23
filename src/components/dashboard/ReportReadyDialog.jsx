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
      className="w-report-dialog max-w-none p-0 border border-line rounded-2xl bg-surface text-ink shadow-panel [&::backdrop]:bg-overlay/65 [&::backdrop]:backdrop-blur-dialog"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      ref={dialogRef}
    >
      <div className="relative p-7.5 max-dialog:py-6 max-dialog:px-5">
        <button
          aria-label="Close report dialog"
          className="grid absolute top-4 right-4 w-8.5 h-8.5 p-0 place-items-center border border-line rounded-xl bg-surface text-ink-secondary cursor-pointer [&:disabled]:cursor-wait [&:disabled]:opacity-65 [&:focus-visible]:outline-3 [&:focus-visible]:outline-focus-ring [&:focus-visible]:outline-offset-3"
          disabled={isSaving}
          onClick={onClose}
          type="button"
        >
          <span className="text-section leading-none" aria-hidden="true">×</span>
        </button>
        <div className="flex items-center gap-2 w-fit mb-5 py-2.5 px-3 border border-line-subtle rounded-xl bg-surface-subtle text-accent-text" aria-hidden="true">
          <DocumentIcon className="w-5 h-5 stroke-current stroke-ui" />
          <span className="text-micro font-extrabold tracking-wider">PDF</span>
        </div>
        <p className="mt-0 mb-2 mx-0 text-accent-text text-caption font-bold tracking-widest uppercase">{periodLabel} analytics</p>
        <h2 className="m-0 font-heading text-2xl font-bold tracking-tighter" id="report-ready-title">Report ready</h2>
        <p className="mt-2.5 mb-4.5 mx-0 text-ink-secondary text-body-sm leading-relaxed" id="report-ready-description">
          Your report is ready to save. It includes the data currently stored for this period.
        </p>
        <div className="flex items-center justify-between gap-3 py-3 px-3 border border-line-subtle rounded-lg bg-surface-subtle text-ink-body text-label">
          <span className="first:overflow-hidden first:text-ellipsis first:whitespace-nowrap last:flex-none last:text-ink-muted last:tabular-nums">{filename}</span>
          <span className="first:overflow-hidden first:text-ellipsis first:whitespace-nowrap last:flex-none last:text-ink-muted last:tabular-nums">{formatFileSize(blob.size)}</span>
        </div>
        {saveError && <p className="mt-3 mb-0 mx-0 text-error-text text-xs leading-normal" role="alert">{saveError}</p>}
        <div className="flex justify-end gap-2.5 mt-5.5">
          <button
            className="border border-line-strong bg-surface text-ink [&:hover:not(:disabled)]:bg-surface-muted min-h-10 py-0 px-3.5 rounded-lg cursor-pointer text-xs font-medium-bold transition-colors duration-150 disabled:cursor-wait disabled:opacity-65 focus-visible:outline-3 focus-visible:outline-focus-ring focus-visible:outline-offset-3"
            disabled={isSaving}
            onClick={onClose}
            type="button"
          >
            Close
          </button>
          <button
            className="border border-accent bg-accent text-white [&:hover:not(:disabled)]:border-accent-hover [&:hover:not(:disabled)]:bg-accent-hover min-h-10 py-0 px-3.5 rounded-lg cursor-pointer text-xs font-medium-bold transition-colors duration-150 disabled:cursor-wait disabled:opacity-65 focus-visible:outline-3 focus-visible:outline-focus-ring focus-visible:outline-offset-3"
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

