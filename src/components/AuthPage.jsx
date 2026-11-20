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
    <div className="auth-layout grid grid-cols-[minmax(420px,0.8fr)_minmax(460px,1.2fr)] min-h-screen bg-(--surface) text-(--text-primary) font-sans max-[900px]:grid-cols-[minmax(370px,1fr)_minmax(330px,0.9fr)] max-[700px]:block max-[700px]:min-h-screen">
      <AuthForm
        mode={mode}
        onModeChange={handleModeChange}
        transitionDirection={transitionDirection}
      />
      <AuthVisual />
    </div>
  )
}

