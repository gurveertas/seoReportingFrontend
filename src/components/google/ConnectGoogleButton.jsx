import { useState } from 'react'
import { startGoogleConnect } from '../../services/google.js'
import GoogleMark from './GoogleMark.jsx'

export default function ConnectGoogleButton({ label = 'Connect Google account', variant = 'primary', returnTo = '/sites' }) {
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState('')

  async function handleClick() {
    setIsStarting(true)
    setError('')
    try {
      await startGoogleConnect(returnTo)
    } catch (startError) {
      setError(startError instanceof Error ? startError.message : 'Unable to start Google sign-in.')
      setIsStarting(false)
    }
  }

  const classes = variant === 'primary'
    ? 'bg-accent text-white hover:bg-accent-hover border-transparent'
    : 'bg-surface text-ink hover:bg-surface-muted border-line-strong'

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <button
        className={`inline-flex min-h-11 items-center gap-2.5 rounded-lg border px-4 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${classes}`}
        disabled={isStarting}
        onClick={handleClick}
        type="button"
      >
        <span className="grid size-6 place-items-center rounded-full bg-white"><GoogleMark className="size-4" /></span>
        {isStarting ? 'Opening Google…' : label}
      </button>
      {error && <p className="m-0 max-w-xs text-center text-xs text-error-text" role="alert">{error}</p>}
    </div>
  )
}
