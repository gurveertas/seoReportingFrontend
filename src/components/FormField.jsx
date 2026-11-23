import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function FormField({
  autoComplete,
  disabled = false,
  id,
  label,
  name,
  onChange,
  placeholder,
  type = 'text',
  value,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="grid gap-2">
      <label className="text-ink-body text-body-sm font-semibold" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          autoComplete={autoComplete}
          className={`h-12 w-full rounded-lg border border-line-strong bg-surface pl-3.5 text-sm text-ink transition duration-160 placeholder:text-ink-faint focus:border-accent focus:ring-3 focus:ring-accent/12 focus:outline-none disabled:cursor-not-allowed disabled:opacity-65 ${isPassword ? 'pr-14' : 'pr-3.5'}`}
          disabled={disabled}
          id={id}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          required
          type={isPassword && isPasswordVisible ? 'text' : type}
          value={value}
        />
        {isPassword && (
          <button
            aria-controls={id}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            className="absolute inset-y-1 right-1 grid w-11 cursor-pointer place-items-center rounded-md text-ink-secondary enabled:hover:bg-surface-muted enabled:hover:text-ink focus-visible:outline-2 focus-visible:outline-focus-ring disabled:opacity-65"
            disabled={disabled}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            type="button"
          >
            {isPasswordVisible ? <EyeOff aria-hidden="true" className="size-5" /> : <Eye aria-hidden="true" className="size-5" />}
          </button>
        )}
      </div>
    </div>
  )
}

