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
    <main className="auth-panel relative flex min-h-screen flex-col justify-center px-[clamp(48px,8.2vw,128px)] py-12 max-[900px]:px-9.5 max-[700px]:min-h-screen max-[700px]:px-6 max-[700px]:pt-7 max-[700px]:pb-17.5 max-[380px]:px-4.5">
      <div className={`auth-panel__inner auth-panel__inner--${transitionDirection} mx-auto w-full max-w-90 ${transitionDirection === 'forward' ? 'animate-[auth-slide-from-right_280ms_ease-out_both]' : 'animate-[auth-slide-from-left_280ms_ease-out_both]'}`}>
        <p className="auth-panel__welcome pt-0 pb-3 px-0 text-(--accent) text-[13px] font-bold tracking-[0.11em] uppercase">{isSignup ? 'Get started' : 'Welcome back'}</p>
        <h1 className="m-0 font-manrope text-[clamp(30px,3vw,38px)] font-semibold tracking-[-0.055em] leading-[1.2]">{isSignup ? 'Create your account' : `Sign in to ${APP_NAME}`}</h1>
        <p className="auth-panel__subtitle pt-3 pb-7.5 px-0 text-(--text-secondary) text-[15px] leading-[1.6]">
          {isSignup
            ? 'A better view of your search performance starts here.'
            : 'Your insights are right where you left them.'}
        </p>
        <div className="auth-tabs grid relative grid-cols-2 p-1 border border-(--border) rounded-[10px] bg-(--surface-muted)" role="tablist" aria-label="Account access">
          <span aria-hidden="true" className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-[7px] bg-(--surface) shadow-[0_1px_3px_#1d29251a] pointer-events-none transition-transform duration-200 ${isSignup ? 'translate-x-full' : ''}`} />
          <button
            aria-selected={!isSignup}
            className={`auth-tabs__tab relative z-1 min-h-10 border-0 rounded-[7px] bg-transparent text-(--text-secondary) cursor-pointer text-[13px] font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-(--focus-ring) focus-visible:outline-offset-[3px] ${!isSignup ? 'text-(--text-primary)' : ''}`}
            onClick={() => onModeChange('login')}
            role="tab"
            type="button"
          >
            Sign in
          </button>
          <button
            aria-selected={isSignup}
            className={`auth-tabs__tab relative z-1 min-h-10 border-0 rounded-[7px] bg-transparent text-(--text-secondary) cursor-pointer text-[13px] font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-(--focus-ring) focus-visible:outline-offset-[3px] ${isSignup ? 'text-(--text-primary)' : ''}`}
            onClick={() => onModeChange('signup')}
            role="tab"
            type="button"
          >
            Create account
          </button>
        </div>

        <form className="auth-form grid gap-4.5 mt-6.5" onSubmit={handleSubmit}>
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
            <p className={`auth-form__status auth-form__status--${status.type} -mt-0.5 text-[13px] leading-normal ${status.type === 'error' ? 'text-(--error-text)' : 'text-(--positive-text)'}`} role={status.type === 'error' ? 'alert' : 'status'}>
              {status.message}
            </p>
          )}
          <button className="auth-form__submit flex items-center justify-between min-h-12.5 mt-0.5 px-4.25 border-0 rounded-lg bg-(--accent) text-white cursor-pointer text-sm font-semibold transition-[background,transform] hover:not-disabled:-translate-y-px hover:not-disabled:bg-(--accent-hover) disabled:cursor-wait disabled:opacity-[0.75] focus-visible:outline-3 focus-visible:outline-(--focus-ring) focus-visible:outline-offset-[3px]" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
            {!isSubmitting && <span aria-hidden="true" className="text-[19px] font-normal">→</span>}
          </button>
        </form>

        <p className="auth-panel__terms mt-5.5 text-(--text-muted) text-[11px] leading-[1.7] text-center">
          By continuing, you agree to our <a className="text-(--accent-text) underline underline-offset-2" href="#terms">Terms of Service</a> and{' '}
          <a className="text-(--accent-text) underline underline-offset-2" href="#privacy">Privacy Policy</a>.
        </p>
      </div>
      <p className="auth-panel__copyright absolute bottom-6 left-0 w-full m-0 text-(--text-faint) text-[11px] text-center max-[700px]:bottom-5">© 2026 {APP_NAME}</p>
    </main>
  )
}

