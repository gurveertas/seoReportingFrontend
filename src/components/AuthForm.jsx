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
    <main className="flex relative flex-col justify-center min-h-screen px-auth-gutter py-12 max-auth-compact:pr-9.5 max-auth-compact:pl-9.5 max-auth-stack:min-h-screen max-auth-stack:pt-7 max-auth-stack:pb-17.5 max-auth-stack:px-6 max-compact-phone:pr-4.5 max-compact-phone:pl-4.5">
      <div className={`${transitionDirection} w-full max-w-auth-form my-0 mx-auto max-auth-stack:my-0 max-auth-stack:mx-auto ${transitionDirection === 'forward' ? 'animate-auth-from-right' : 'animate-auth-from-left'}`}>
        <p className="mt-0 mb-3 mx-0 text-accent text-body-sm font-bold tracking-widest uppercase">{isSignup ? 'Get started' : 'Welcome back'}</p>
        <h1 className="m-0 font-heading text-auth-title font-medium-bold tracking-tighter leading-tight">{isSignup ? 'Create your account' : `Sign in to ${APP_NAME}`}</h1>
        <p className="mt-3 mb-7.5 mx-0 text-ink-secondary text-body-lg leading-relaxed">
          {isSignup
            ? 'A better view of your search performance starts here.'
            : 'Your insights are right where you left them.'}
        </p>
        <div className={` grid relative grid-cols-2 p-1 border border-line rounded-xl bg-surface-muted [&::before]:absolute [&::before]:top-1 [&::before]:bottom-1 [&::before]:left-1 [&::before]:w-tab-slider [&::before]:rounded-lg [&::before]:bg-surface [&::before]:shadow-tab [&::before]:pointer-events-none [&::before]:transition-transform [&::before]:duration-220 ${isSignup ? '[&::before]:translate-x-full' : '[&::before]:translate-x-0'}`} role="tablist" aria-label="Account access">
          <button
            aria-selected={!isSignup}
            className={` relative z-10 min-h-10 border-0 rounded-lg bg-transparent text-ink-secondary cursor-pointer text-body-sm font-semibold transition-colors duration-160 [&.is-active]:text-ink [&:focus-visible]:outline-3 [&:focus-visible]:outline-focus-ring [&:focus-visible]:outline-offset-3`}
            onClick={() => onModeChange('login')}
            role="tab"
            type="button"
          >
            Sign in
          </button>
          <button
            aria-selected={isSignup}
            className={` relative z-10 min-h-10 border-0 rounded-lg bg-transparent text-ink-secondary cursor-pointer text-body-sm font-semibold transition-colors duration-160 [&.is-active]:text-ink [&:focus-visible]:outline-3 [&:focus-visible]:outline-focus-ring [&:focus-visible]:outline-offset-3`}
            onClick={() => onModeChange('signup')}
            role="tab"
            type="button"
          >
            Create account
          </button>
        </div>

        <form className="grid gap-4.5 mt-6.5" onSubmit={handleSubmit}>
          {fieldDefinitions[mode].map((field) => (
            <FormField
              key={field.name}
              {...field}
              disabled={isSubmitting}
              id={`auth-${field.name}`}
              onChange={handleChange}
              value={values[field.name]}
            />
          ))}
          {status.message && (
            <p className={`${status.type} -mt-0.5 mb-0 mx-0 text-body-sm leading-normal ${status.type === 'error' ? 'text-error-text' : 'text-positive-text'}`} role={status.type === 'error' ? 'alert' : 'status'}>
              {status.message}
            </p>
          )}
          <button className="[&:focus-visible]:outline-3 [&:focus-visible]:outline-focus-ring [&:focus-visible]:outline-offset-3 flex items-center justify-between min-h-12.5 mt-0.5 py-0 px-4.5 border-0 rounded-lg bg-accent text-white cursor-pointer text-sm font-medium-bold transition duration-160 [&:hover:not(:disabled)]:-translate-y-px [&:hover:not(:disabled)]:bg-accent-hover [&:disabled]:cursor-wait [&:disabled]:opacity-75" disabled={isSubmitting} type="submit">
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

