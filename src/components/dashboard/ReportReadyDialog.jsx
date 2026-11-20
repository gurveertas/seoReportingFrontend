import { useEffect, useRef, useState } from 'react'
import { APP_NAME } from '../../config/app.js'
import { savePdfBlob } from '../../services/reports.js'
import { DocumentIcon } from '../icons/AppIcons.jsx'
import './ReportReadyDialog.css'

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
      className="report-ready-dialog"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      ref={dialogRef}
    >
      <div className="report-ready-dialog__content">
        <button
          aria-label="Close report dialog"
          className="report-ready-dialog__close"
          disabled={isSaving}
          onClick={onClose}
          type="button"
        >
          <span aria-hidden="true">×</span>
        </button>
        <div className="report-ready-dialog__icon" aria-hidden="true">
          <DocumentIcon />
          <span>PDF</span>
        </div>
        <p className="report-ready-dialog__eyebrow">{periodLabel} analytics</p>
        <h2 id="report-ready-title">Report ready</h2>
        <p className="report-ready-dialog__description" id="report-ready-description">
          Your report is ready to save. It includes the data currently stored for this period.
        </p>
        <div className="report-ready-dialog__file">
          <span>{filename}</span>
          <span>{formatFileSize(blob.size)}</span>
        </div>
        {saveError && <p className="report-ready-dialog__error" role="alert">{saveError}</p>}
        <div className="report-ready-dialog__actions">
          <button
            className="report-ready-dialog__cancel"
            disabled={isSaving}
            onClick={onClose}
            type="button"
          >
            Close
          </button>
          <button
            className="report-ready-dialog__save"
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
