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
    <main className="auth-panel">
      <div className={`auth-panel__inner auth-panel__inner--${transitionDirection}`}>
        <p className="auth-panel__welcome">{isSignup ? 'Get started' : 'Welcome back'}</p>
        <h1>{isSignup ? 'Create your account' : `Sign in to ${APP_NAME}`}</h1>
        <p className="auth-panel__subtitle">
          {isSignup
            ? 'A better view of your search performance starts here.'
            : 'Your insights are right where you left them.'}
        </p>

        <div className={`auth-tabs${isSignup ? ' auth-tabs--signup' : ''}`} role="tablist" aria-label="Account access">
          <button
            aria-selected={!isSignup}
            className={`auth-tabs__tab${!isSignup ? ' is-active' : ''}`}
            onClick={() => onModeChange('login')}
            role="tab"
            type="button"
          >
            Sign in
          </button>
          <button
            aria-selected={isSignup}
            className={`auth-tabs__tab${isSignup ? ' is-active' : ''}`}
            onClick={() => onModeChange('signup')}
            role="tab"
            type="button"
          >
            Create account
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {fieldDefinitions[mode].map((field) => (
            <FormField
              key={field.name}
              {...field}
              id={`auth-${field.name}`}
              onChange={handleChange}
              value={values[field.name]}
            />
          ))}
          {status.message && (
            <p className={`auth-form__status auth-form__status--${status.type}`} role="status">
              {status.message}
            </p>
          )}
          <button className="auth-form__submit" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
            {!isSubmitting && <span aria-hidden="true">→</span>}
          </button>
        </form>

        <p className="auth-panel__terms">
          By continuing, you agree to our <a href="#terms">Terms of Service</a> and{' '}
          <a href="#privacy">Privacy Policy</a>.
        </p>
      </div>
      <p className="auth-panel__copyright">© 2026 {APP_NAME}</p>
    </main>
  )
}
