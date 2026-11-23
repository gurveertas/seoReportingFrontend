import { useEffect, useRef, useState } from 'react'
import { getUserSettings } from '../../services/settings.js'

const MAX_PLANS = 10
const MAX_WORDS = 20
const secondaryButton = 'min-h-10 rounded-lg border border-(--border-strong) px-3 text-sm font-semibold disabled:opacity-60'

export default function ReportOptionsDialog({ onClose, onGenerate, isGenerating, error }) {
  const dialogRef = useRef(null)
  const planInputRef = useRef(null)
  const nextPlanId = useRef(0)
  const [comparisonAllowed, setComparisonAllowed] = useState(null)
  const [includeComparison, setIncludeComparison] = useState(true)
  const [settingsError, setSettingsError] = useState('')
  const [plans, setPlans] = useState([])
  const [draft, setDraft] = useState('')
  const [planError, setPlanError] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
    return () => dialog.close()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    getUserSettings(controller.signal)
      .then((settings) => {
        if (!controller.signal.aborted) setComparisonAllowed(settings.comparison !== false)
      })
      .catch(() => {
        if (!controller.signal.aborted) setSettingsError('Couldn’t load report settings. Close this form and try again.')
      })
    return () => controller.abort()
  }, [])

  function validateDraft() {
    const plan = draft.trim()
    if (!plan) return ''
    if (plans.length >= MAX_PLANS || plan.split(/\s+/u).length > MAX_WORDS) {
      setPlanError(`Add up to ${MAX_PLANS} plans of ${MAX_WORDS} words each.`)
      planInputRef.current.focus()
      return null
    }
    return plan
  }

  function addPlan() {
    const plan = validateDraft()
    if (!plan) return
    const id = nextPlanId.current++
    setPlans([...plans, { id, text: plan }])
    setDraft('')
    setPlanError('')
    if (plans.length + 1 < MAX_PLANS) planInputRef.current.focus()
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (comparisonAllowed === null || isGenerating) return
    const plan = validateDraft()
    if (plan === null) return
    const nextPlans = plans.map(({ text }) => text)
    if (plan) nextPlans.push(plan)
    onGenerate({ comparison: comparisonAllowed && includeComparison, nextPlans })
  }

  return (
    <dialog
      aria-labelledby="report-options-title"
      className="m-auto max-h-[calc(100%-2rem)] w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-(--border) bg-(--surface) p-0 text-(--text-primary) shadow-(--shadow-float) backdrop:bg-black/55"
      onCancel={(event) => {
        event.preventDefault()
        if (!isGenerating) onClose()
      }}
      ref={dialogRef}
    >
      <form aria-busy={isGenerating} className="grid gap-5 p-5 sm:p-6" onSubmit={handleSubmit}>
        <h2 className="m-0 text-xl font-bold" id="report-options-title">Report options</h2>
        <label className="flex items-center gap-3 text-sm font-semibold">
          <input
            checked={comparisonAllowed === true && includeComparison}
            className="size-4 accent-(--accent)"
            disabled={comparisonAllowed !== true || isGenerating}
            onChange={(event) => setIncludeComparison(event.target.checked)}
            type="checkbox"
          />
          Include comparisons
        </label>
        {comparisonAllowed === false && <p className="m-0 text-xs text-(--text-secondary)">Comparisons are turned off in Settings.</p>}
        <div className="grid gap-2">
          <label className="text-sm font-semibold" htmlFor="report-next-plan">Next plans</label>
          <p className="m-0 text-xs text-(--text-secondary)" id="report-plan-hint">Optional. Up to {MAX_PLANS} plans, {MAX_WORDS} words each ({plans.length}/{MAX_PLANS} added).</p>
          {plans.length > 0 && (
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {plans.map(({ id, text }) => (
                <li className="flex max-w-full items-center gap-2 rounded-2xl bg-(--surface-muted) py-1 pr-1 pl-3 text-xs" key={id}>
                  <span className="min-w-0 wrap-anywhere">{text}</span>
                  <button aria-label={`Remove plan: ${text}`} className="size-7 shrink-0 rounded-full hover:bg-(--surface)" disabled={isGenerating} onClick={() => setPlans(plans.filter((plan) => plan.id !== id))} type="button">×</button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <input
              aria-describedby={planError ? 'report-plan-hint report-plan-error' : 'report-plan-hint'}
              aria-invalid={Boolean(planError)}
              className="min-h-10 min-w-0 flex-1 rounded-lg border border-(--border-strong) bg-(--surface) px-3 text-sm disabled:opacity-60"
              disabled={isGenerating || plans.length >= MAX_PLANS}
              id="report-next-plan"
              onChange={(event) => {
                setDraft(event.target.value)
                setPlanError('')
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
                  event.preventDefault()
                  addPlan()
                }
              }}
              placeholder="Enter a plan"
              ref={planInputRef}
              value={draft}
            />
            <button className={secondaryButton} disabled={isGenerating || !draft.trim() || plans.length >= MAX_PLANS} onClick={addPlan} type="button">Add</button>
          </div>
          {planError && <p className="m-0 text-xs text-(--error-text)" id="report-plan-error" role="alert">{planError}</p>}
        </div>
        {(settingsError || error) && <p className="m-0 text-sm text-(--error-text)" role="alert">{settingsError || error}</p>}
        <div className="flex justify-end gap-2">
          <button className={secondaryButton} disabled={isGenerating} onClick={onClose} type="button">Cancel</button>
          <button className="min-h-10 rounded-lg bg-(--accent) px-4 text-sm font-semibold text-white hover:bg-(--accent-hover) disabled:opacity-60" disabled={comparisonAllowed === null || isGenerating} type="submit">
            {isGenerating ? 'Generating…' : comparisonAllowed === null && !settingsError ? 'Loading settings…' : 'Generate report'}
          </button>
        </div>
      </form>
    </dialog>
  )
}
