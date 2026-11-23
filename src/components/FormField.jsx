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
  return (
    <div className="grid gap-2">
      <label className="text-ink-body text-body-sm font-semibold" htmlFor={id}>
        {label}
      </label>
      <input
        autoComplete={autoComplete}
        className="w-full h-12 py-0 px-3.5 border border-line-strong rounded-lg bg-surface text-ink text-sm transition duration-160 disabled:cursor-not-allowed disabled:opacity-65 placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent/12"
        disabled={disabled}
        id={id}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required
        type={type}
        value={value}
      />
    </div>
  )
}

