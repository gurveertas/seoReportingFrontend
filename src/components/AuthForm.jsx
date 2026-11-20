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
    <main className="auth-panel flex relative flex-col justify-center min-h-screen pt-12 pb-[8.2vw,] pr-[clamp(48px,] pl-[128px)] [&_h1]:m-0 [&_h1]:font-manrope [&_h1]:text-[clamp(30px,_3vw,_38px)] [&_h1]:font-semibold [&_h1]:tracking-[-0.055em] [&_h1]:leading-[1.2] [&_a:focus-visible]:outline-3 outline-(--focus-ring) [&_a:focus-visible]:outline-offset-[3px] max-[900px]:pr-[38px] max-[900px]:pl-[38px] max-[700px]:min-h-screen max-[700px]:pt-7 pb-17.5 px-6 max-[380px]:pr-4.5 max-[380px]:pl-4.5">
      <div className={`auth-panel__inner auth-panel__inner--${transitionDirection} w-full max-w-[360px] py-0 px-auto max-[700px]:py-0 px-auto ${transitionDirection === 'forward' ? 'animate-[auth-slide-from-right_280ms_ease-out_both]' : 'animate-[auth-slide-from-left_280ms_ease-out_both]'}`}>
        <p className="auth-panel__welcome pt-0 pb-3 px-0 text-(--green) text-[13px] font-bold tracking-[0.11em] uppercase">{isSignup ? 'Get started' : 'Welcome back'}</p>
        <h1>{isSignup ? 'Create your account' : `Sign in to ${APP_NAME}`}</h1>
        <p className="auth-panel__subtitle pt-3 pb-[30px] px-0 text-(--muted) text-[15px] leading-[1.6]">
          {isSignup
            ? 'A better view of your search performance starts here.'
            : 'Your insights are right where you left them.'}
        </p>
        <div className={`auth-tabs${isSignup ? ' auth-tabs--signup' : ''} grid relative grid-cols-2 p-1 border border-(--line) rounded-[10px] bg-(--surface-muted) [&::before]:absolute [&::before]:top-1 [&::before]:bottom-1 [&::before]:left-1 [&::before]:w-[calc(50%_-_4px)] [&::before]:rounded-[7px] [&::before]:bg-(--surface) [&::before]:shadow-[0_1px_3px_#1d29251a] [&::before]:content-[''] [&::before]:pointer-events-none [&::before]:transition-[transform_220ms_ease] ${isSignup ? '[&::before]:translate-x-full' : '[&::before]:translate-x-0'}`} role="tablist" aria-label="Account access">
          <button
            aria-selected={!isSignup}
            className={`auth-tabs__tab${!isSignup ? ' is-active' : ''} relative z-1 min-h-10 border-0 rounded-[7px] bg-transparent text-(--text-secondary) cursor-pointer [font:inherit] text-[13px] font-semibold transition-[color_160ms_ease] [&.is-active]:text-(--ink) [&:focus-visible]:outline-3 outline-(--focus-ring) [&:focus-visible]:outline-offset-[3px]`}
            onClick={() => onModeChange('login')}
            role="tab"
            type="button"
          >
            Sign in
          </button>
          <button
            aria-selected={isSignup}
            className={`auth-tabs__tab${isSignup ? ' is-active' : ''} relative z-1 min-h-10 border-0 rounded-[7px] bg-transparent text-(--text-secondary) cursor-pointer [font:inherit] text-[13px] font-semibold transition-[color_160ms_ease] [&.is-active]:text-(--ink) [&:focus-visible]:outline-3 outline-(--focus-ring) [&:focus-visible]:outline-offset-[3px]`}
            onClick={() => onModeChange('signup')}
            role="tab"
            type="button"
          >
            Create account
          </button>
        </div>

        <form className="auth-form grid gap-4.5 mt-[26px]" onSubmit={handleSubmit}>
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
            <p className={`auth-form__status auth-form__status--${status.type} pt-[-2px] pb-0 px-0 text-[13px] leading-normal ${status.type === 'error' ? 'text-(--error-text)' : 'text-(--positive-text)'}`} role={status.type === 'error' ? 'alert' : 'status'}>
              {status.message}
            </p>
          )}
          <button className="auth-form__submit [&:focus-visible]:outline-3 outline-(--focus-ring) [&:focus-visible]:outline-offset-[3px] flex items-center justify-between min-h-12.5 mt-0.5 py-0 px-4.25 border-0 rounded-[8px] bg-(--green) text-[#fff] cursor-pointer [font:inherit] text-sm font-semibold transition-[background_160ms_ease,_transform_160ms_ease] [&:hover:not(:disabled)]:-translate-y-px [&:hover:not(:disabled)]:bg-(--green-dark) [&:disabled]:cursor-wait [&:disabled]:opacity-[0.75] [&_span]:text-[19px] [&_span]:font-normal" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
            {!isSubmitting && <span aria-hidden="true">→</span>}
          </button>
        </form>

        <p className="auth-panel__terms pt-5.5 pb-0 px-0 text-(--text-muted) text-[11px] leading-[1.7] text-center [&_a]:text-(--accent-text) [&_a]:underline [&_a]:underline-offset-[2px]">
          By continuing, you agree to our <a href="#terms">Terms of Service</a> and{' '}
          <a href="#privacy">Privacy Policy</a>.
        </p>
      </div>
      <p className="auth-panel__copyright absolute bottom-6 left-0 w-full m-0 text-(--text-faint) text-[11px] text-center max-[700px]:bottom-5">© 2026 {APP_NAME}</p>
    </main>
  )
}

