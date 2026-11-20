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
    <div className="form-field grid gap-2">
      <label className="form-field__label text-(--text-body) text-[13px] font-semibold" htmlFor={id}>
        {label}
      </label>
      <input
        autoComplete={autoComplete}
        className="form-field__input w-full h-12 py-0 px-3.5 border border-(--border-strong) rounded-[8px] bg-(--surface) text-(--ink) [font:inherit] text-sm transition-[border-color_160ms_ease,_box-shadow_160ms_ease] [&:disabled]:cursor-not-allowed [&:disabled]:opacity-[0.65] [&::placeholder]:text-(--text-faint) [&:focus]:border-(--accent) [&:focus]:outline-none [&:focus]:shadow-[0_0_0_3px_color-mix(in_srgb,_var(--accent)_12%,_transparent)]"
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

