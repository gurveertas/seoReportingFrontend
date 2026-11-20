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
    <div className="auth-layout [--ink:var(--text-primary)] [--muted:var(--text-secondary)] [--line:var(--border)] [--green:var(--accent)] [--green-dark:var(--accent-hover)] [display:grid] [grid-template-columns:minmax(420px,_0.8fr)_minmax(460px,_1.2fr)] [min-height:100vh] [background:var(--surface)] [color:var(--ink)] [font-family:'DM_Sans',_sans-serif] max-[900px]:[grid-template-columns:minmax(370px,_1fr)_minmax(330px,_0.9fr)] max-[700px]:[display:block] max-[700px]:[min-height:100vh]">
      <AuthForm
        mode={mode}
        onModeChange={handleModeChange}
        transitionDirection={transitionDirection}
      />
      <AuthVisual />
    </div>
  )
}

