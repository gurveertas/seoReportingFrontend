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
    <div className="auth-layout [--ink:var(--text-primary)] [--muted:var(--text-secondary)] [--line:var(--border)] [--green:var(--accent)] [--green-dark:var(--accent-hover)] grid grid-cols-[minmax(420px,_0.8fr)_minmax(460px,_1.2fr)] min-h-screen bg-(--surface) text-(--ink) font-sans max-[900px]:grid-cols-[minmax(370px,_1fr)_minmax(330px,_0.9fr)] max-[700px]:block max-[700px]:min-h-screen">
      <AuthForm
        mode={mode}
        onModeChange={handleModeChange}
        transitionDirection={transitionDirection}
      />
      <AuthVisual />
    </div>
  )
}

