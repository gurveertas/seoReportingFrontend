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
    <div className="form-field [display:grid] [gap:8px]">
      <label className="form-field__label [color:var(--text-body)] [font-size:13px] [font-weight:600]" htmlFor={id}>
        {label}
      </label>
      <input
        autoComplete={autoComplete}
        className="form-field__input [width:100%] [height:48px] [padding:0_14px] [border:1px_solid_var(--border-strong)] [border-radius:8px] [background:var(--surface)] [color:var(--ink)] [font:inherit] [font-size:14px] [transition:border-color_160ms_ease,_box-shadow_160ms_ease] [&:disabled]:[cursor:not-allowed] [&:disabled]:[opacity:0.65] [&::placeholder]:[color:var(--text-faint)] [&:focus]:[border-color:var(--accent)] [&:focus]:[outline:0] [&:focus]:[box-shadow:0_0_0_3px_color-mix(in_srgb,_var(--accent)_12%,_transparent)]"
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

