import { useState } from 'react'
import AuthForm from './AuthForm.jsx'
import AuthVisual from './AuthVisual.jsx'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [transitionDirection, setTransitionDirection] = useState('forward')

  function handleModeChange(nextMode) {
    if (nextMode === mode) return

    setTransitionDirection(nextMode === 'signup' ? 'forward' : 'backward')
    setMode(nextMode)
  }

  return (
    <div className="grid min-h-screen grid-cols-auth bg-surface font-sans text-ink max-auth-compact:grid-cols-auth-compact max-auth-stack:block">
      <AuthForm
        mode={mode}
        onModeChange={handleModeChange}
        transitionDirection={transitionDirection}
      />
      <AuthVisual />
    </div>
  )
}

