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
    <div className="grid grid-cols-auth min-h-screen bg-surface text-ink font-sans max-auth-compact:grid-cols-auth-compact max-auth-stack:block max-auth-stack:min-h-screen">
      <AuthForm
        mode={mode}
        onModeChange={handleModeChange}
        transitionDirection={transitionDirection}
      />
      <AuthVisual />
    </div>
  )
}

