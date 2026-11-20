import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormField from './FormField.jsx'
import { submitAuthForm } from '../services/auth.js'
import { APP_NAME } from '../config/app.js'
import { useAuth } from '../auth/useAuth.js'
import { MOCK_API_ENABLED } from '../config/api.js'

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
    <main className="auth-panel [display:flex] [position:relative] [flex-direction:column] [justify-content:center] [min-height:100vh] [padding:48px_clamp(48px,_8.2vw,_128px)] [&_h1]:[margin:0] [&_h1]:[font-family:'Manrope',_sans-serif] [&_h1]:[font-size:clamp(30px,_3vw,_38px)] [&_h1]:[font-weight:650] [&_h1]:[letter-spacing:-0.055em] [&_h1]:[line-height:1.2] [&_a:focus-visible]:[outline:3px_solid_var(--focus-ring)] [&_a:focus-visible]:[outline-offset:3px] max-[900px]:[padding-right:38px] max-[900px]:[padding-left:38px] max-[700px]:[min-height:100vh] max-[700px]:[padding:28px_24px_70px] max-[380px]:[padding-right:18px] max-[380px]:[padding-left:18px]">
      <div className={`auth-panel__inner auth-panel__inner--${transitionDirection} [width:100%] [max-width:360px] [margin:0_auto] max-[700px]:[margin:0_auto] ${transitionDirection === 'forward' ? '[animation:auth-slide-from-right_280ms_ease-out_both]' : '[animation:auth-slide-from-left_280ms_ease-out_both]'}`}>
        <p className="auth-panel__welcome [margin:0_0_12px] [color:var(--green)] [font-size:13px] [font-weight:700] [letter-spacing:0.11em] [text-transform:uppercase]">{isSignup ? 'Get started' : 'Welcome back'}</p>
        <h1>{isSignup ? 'Create your account' : `Sign in to ${APP_NAME}`}</h1>
        <p className="auth-panel__subtitle [margin:12px_0_30px] [color:var(--muted)] [font-size:15px] [line-height:1.6]">
          {isSignup
            ? 'A better view of your search performance starts here.'
            : 'Your insights are right where you left them.'}
        </p>
        {MOCK_API_ENABLED && (
          <p className="[margin:-18px_0_20px] [padding:10px_12px] [border:1px_solid_var(--border)] [border-radius:8px] [background:var(--accent-soft)] [color:var(--accent-text)] [font-size:12px] [line-height:1.5]" role="status">
            Demo mode is on. Use any username and password to preview the app.
          </p>
        )}

        <div className={`auth-tabs${isSignup ? ' auth-tabs--signup' : ''} [display:grid] [position:relative] [grid-template-columns:1fr_1fr] [padding:4px] [border:1px_solid_var(--line)] [border-radius:10px] [background:var(--surface-muted)] [&::before]:[position:absolute] [&::before]:[top:4px] [&::before]:[bottom:4px] [&::before]:[left:4px] [&::before]:[width:calc(50%_-_4px)] [&::before]:[border-radius:7px] [&::before]:[background:var(--surface)] [&::before]:[box-shadow:0_1px_3px_#1d29251a] [&::before]:[content:''] [&::before]:[pointer-events:none] [&::before]:[transition:transform_220ms_ease] ${isSignup ? '[&::before]:[transform:translateX(100%)]' : '[&::before]:[transform:translateX(0)]'}`} role="tablist" aria-label="Account access">
          <button
            aria-selected={!isSignup}
            className={`auth-tabs__tab${!isSignup ? ' is-active' : ''} [position:relative] [z-index:1] [min-height:40px] [border:0] [border-radius:7px] [background:transparent] [color:var(--text-secondary)] [cursor:pointer] [font:inherit] [font-size:13px] [font-weight:600] [transition:color_160ms_ease] [&.is-active]:[color:var(--ink)] [&:focus-visible]:[outline:3px_solid_var(--focus-ring)] [&:focus-visible]:[outline-offset:3px]`}
            onClick={() => onModeChange('login')}
            role="tab"
            type="button"
          >
            Sign in
          </button>
          <button
            aria-selected={isSignup}
            className={`auth-tabs__tab${isSignup ? ' is-active' : ''} [position:relative] [z-index:1] [min-height:40px] [border:0] [border-radius:7px] [background:transparent] [color:var(--text-secondary)] [cursor:pointer] [font:inherit] [font-size:13px] [font-weight:600] [transition:color_160ms_ease] [&.is-active]:[color:var(--ink)] [&:focus-visible]:[outline:3px_solid_var(--focus-ring)] [&:focus-visible]:[outline-offset:3px]`}
            onClick={() => onModeChange('signup')}
            role="tab"
            type="button"
          >
            Create account
          </button>
        </div>

        <form className="auth-form [display:grid] [gap:18px] [margin-top:26px]" onSubmit={handleSubmit}>
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
            <p className={`auth-form__status auth-form__status--${status.type} [margin:-2px_0_0] [font-size:13px] [line-height:1.5] ${status.type === 'error' ? '[color:var(--error-text)]' : '[color:var(--positive-text)]'}`} role={status.type === 'error' ? 'alert' : 'status'}>
              {status.message}
            </p>
          )}
          <button className="auth-form__submit [&:focus-visible]:[outline:3px_solid_var(--focus-ring)] [&:focus-visible]:[outline-offset:3px] [display:flex] [align-items:center] [justify-content:space-between] [min-height:50px] [margin-top:2px] [padding:0_17px] [border:0] [border-radius:8px] [background:var(--green)] [color:#fff] [cursor:pointer] [font:inherit] [font-size:14px] [font-weight:650] [transition:background_160ms_ease,_transform_160ms_ease] [&:hover:not(:disabled)]:[transform:translateY(-1px)] [&:hover:not(:disabled)]:[background:var(--green-dark)] [&:disabled]:[cursor:wait] [&:disabled]:[opacity:0.75] [&_span]:[font-size:19px] [&_span]:[font-weight:400]" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
            {!isSubmitting && <span aria-hidden="true">→</span>}
          </button>
        </form>

        <p className="auth-panel__terms [margin:22px_0_0] [color:var(--text-muted)] [font-size:11px] [line-height:1.7] [text-align:center] [&_a]:[color:var(--accent-text)] [&_a]:[text-decoration:underline] [&_a]:[text-underline-offset:2px]">
          By continuing, you agree to our <a href="#terms">Terms of Service</a> and{' '}
          <a href="#privacy">Privacy Policy</a>.
        </p>
      </div>
      <p className="auth-panel__copyright [position:absolute] [bottom:24px] [left:0] [width:100%] [margin:0] [color:var(--text-faint)] [font-size:11px] [text-align:center] max-[700px]:[bottom:20px]">© 2026 {APP_NAME}</p>
    </main>
  )
}

