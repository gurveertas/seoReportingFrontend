import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormField from './FormField.jsx'
import { submitAuthForm } from '../services/auth.js'
import { APP_NAME } from '../config/app.js'
import { useAuth } from '../auth/useAuth.js'

const fieldDefinitions = {
  login: [
    { name: 'username', label: 'Username', placeholder: 'Your username', autoComplete: 'username' },
    { name: 'password', label: 'Password', placeholder: 'Your password', autoComplete: 'current-password', type: 'password' },
  ],
  signup: [
    { name: 'fullName', label: 'Full name', placeholder: 'How should we call you?', autoComplete: 'name' },
    { name: 'username', label: 'Username', placeholder: 'Choose a username', autoComplete: 'username' },
    { name: 'password', label: 'Password', placeholder: 'Create a password', autoComplete: 'new-password', type: 'password' },
  ],
}

export default function AuthForm({ mode, onModeChange, transitionDirection }) {
  const isSignup = mode === 'signup'
  const navigate = useNavigate()
  const { refreshAuth } = useAuth()
  const [values, setValues] = useState({ fullName: '', username: '', password: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setValues((currentValues) => ({ ...currentValues, [name]: value }))
    if (status.message) setStatus({ type: '', message: '' })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus({ type: '', message: '' })
    setIsSubmitting(true)

    try {
      await submitAuthForm(mode, values)
      const session = await refreshAuth()

      if (session.authenticated) {
        navigate('/dashboard', { replace: true })
        return
      }

      if (mode === 'login') {
        return
      }

      setStatus({
        type: 'success',
        message: 'Your account has been created successfully.',
      })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unable to reach the server. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col justify-center px-auth-gutter py-12 max-auth-compact:px-9.5 max-auth-stack:px-6 max-auth-stack:pt-7 max-auth-stack:pb-17.5 max-compact-phone:px-4.5">
      <div className={`mx-auto w-full max-w-auth-form ${transitionDirection === 'forward' ? 'animate-auth-from-right' : 'animate-auth-from-left'}`}>
        <p className="mb-3 text-body-sm font-bold tracking-widest text-accent uppercase">{isSignup ? 'Get started' : 'Welcome back'}</p>
        <h1 className="font-heading text-auth-title font-medium-bold tracking-tighter">{isSignup ? 'Create your account' : `Sign in to ${APP_NAME}`}</h1>
        <p className="mt-3 mb-7.5 text-body-lg leading-relaxed text-ink-secondary">
          {isSignup
            ? 'A better view of your search performance starts here.'
            : 'Your insights are right where you left them.'}
        </p>
        <div className="relative grid grid-cols-2 rounded-xl border border-line bg-surface-muted p-1" role="tablist" aria-label="Account access">
          <span aria-hidden="true" className={`pointer-events-none absolute inset-y-1 left-1 w-tab-slider rounded-lg bg-surface shadow-tab transition-transform duration-220 ${isSignup ? 'translate-x-full' : 'translate-x-0'}`} />
          <AuthTab selected={!isSignup} onClick={() => onModeChange('login')}>Sign in</AuthTab>
          <AuthTab selected={isSignup} onClick={() => onModeChange('signup')}>Create account</AuthTab>
        </div>

        <form className="grid gap-4.5 mt-6.5" onSubmit={handleSubmit}>
          {fieldDefinitions[mode].map((field) => (
            <FormField
              key={field.type === 'password' ? `${mode}-${field.name}` : field.name}
              {...field}
              disabled={isSubmitting}
              id={`auth-${field.name}`}
              onChange={handleChange}
              value={values[field.name]}
            />
          ))}
          {status.message && (
            <p className={`-mt-0.5 text-body-sm leading-normal ${status.type === 'error' ? 'text-error-text' : 'text-positive-text'}`} role={status.type === 'error' ? 'alert' : 'status'}>
              {status.message}
            </p>
          )}
          <button
            className="mt-0.5 flex min-h-12.5 cursor-pointer items-center justify-between rounded-lg bg-accent px-4.5 text-sm font-medium-bold text-white transition duration-160 enabled:hover:-translate-y-px enabled:hover:bg-accent-hover focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus-ring disabled:cursor-wait disabled:opacity-75"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
            {!isSubmitting && <span className="text-lg font-normal" aria-hidden="true">→</span>}
          </button>
        </form>

        <p className="mt-5.5 mb-0 mx-0 text-ink-muted text-label leading-relaxed text-center">
          By continuing, you agree to our <a className="focus-visible:outline-3 focus-visible:outline-focus-ring focus-visible:outline-offset-3 text-accent-text underline underline-offset-2" href="#terms">Terms of Service</a> and{' '}
          <a className="focus-visible:outline-3 focus-visible:outline-focus-ring focus-visible:outline-offset-3 text-accent-text underline underline-offset-2" href="#privacy">Privacy Policy</a>.
        </p>
      </div>
      <p className="absolute bottom-6 left-0 w-full m-0 text-ink-faint text-label text-center max-auth-stack:bottom-5">© 2026 {APP_NAME}</p>
    </main>
  )
}

function AuthTab({ selected, onClick, children }) {
  return (
    <button
      aria-selected={selected}
      className="relative min-h-10 cursor-pointer rounded-lg text-body-sm font-semibold text-ink-secondary transition-colors duration-160 aria-selected:text-ink focus-visible:z-10 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
      onClick={onClick}
      role="tab"
      type="button"
    >
      {children}
    </button>
  )
}

