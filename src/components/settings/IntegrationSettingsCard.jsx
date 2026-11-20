export default function IntegrationSettingsCard({
  definition,
  value,
  disabled = false,
  onEnabledChange,
  onPropertyChange,
}) {
  const fieldId = `settings-${definition.id}-${definition.field.name}`

  return (
    <section className="integration-settings-card [min-width:0] [padding:20px] [border:1px_solid_var(--border)] [border-radius:13px] [background:var(--surface)] [&:last-child:nth-child(odd)]:[grid-column:1_/_-1] max-[700px]:[&:last-child:nth-child(odd)]:[grid-column:auto] max-[520px]:[padding:16px]">
      <header className="integration-settings-card__header [display:flex] [align-items:flex-start] [justify-content:space-between] [gap:14px] [margin-bottom:18px] [&_h3]:[margin:0] [&_h3]:[font-size:13px] [&_h3]:[font-weight:700] [&_p]:[margin:5px_0_0] [&_p]:[color:var(--text-secondary)] [&_p]:[font-size:11px] [&_p]:[line-height:1.5]">
        <div>
          <h3>{definition.title}</h3>
          <p>{definition.description}</p>
        </div>
        <label className="integration-settings-card__toggle [display:inline-flex] [flex:0_0_auto] [align-items:center] [gap:6px] [color:var(--text-secondary)] [cursor:pointer] [font-size:10px] [font-weight:650] [white-space:nowrap] [&_input]:[width:15px] [&_input]:[height:15px] [&_input]:[margin:0] [&_input]:[accent-color:var(--accent)] [&_input]:[cursor:pointer] [&_input:disabled]:[cursor:not-allowed] [&_input:disabled]:[opacity:0.65] [&_input:focus-visible]:[outline:3px_solid_var(--focus-ring)] [&_input:focus-visible]:[outline-offset:3px]">
          <input
            checked={value.enabled}
            disabled={disabled}
            onChange={(event) => onEnabledChange(definition.id, event.target.checked)}
            type="checkbox"
          />
          <span>{value.enabled ? 'Enabled' : 'Disabled'}</span>
        </label>
      </header>
      <div className="integration-settings-card__field [display:grid] [gap:7px] [&_label]:[color:var(--text-body)] [&_label]:[font-size:11px] [&_label]:[font-weight:650] [&_input]:[width:100%] [&_input]:[min-height:42px] [&_input]:[padding:0_12px] [&_input]:[border:1px_solid_var(--border-strong)] [&_input]:[border-radius:8px] [&_input]:[background:var(--surface)] [&_input]:[color:var(--text-primary)] [&_input]:[font:inherit] [&_input]:[font-size:12px] [&_input]:[transition:border-color_150ms_ease,_box-shadow_150ms_ease] [&_input:disabled]:[cursor:not-allowed] [&_input:disabled]:[opacity:0.65] [&_input::placeholder]:[color:var(--text-muted)] [&_input:focus]:[border-color:var(--accent)] [&_input:focus]:[outline:0] [&_input:focus]:[box-shadow:0_0_0_3px_color-mix(in_srgb,_var(--accent)_12%,_transparent)]">
        <label htmlFor={fieldId}>{definition.field.label}</label>
        <input
          autoComplete="off"
          id={fieldId}
          onChange={(event) => onPropertyChange(
            definition.id,
            definition.field.name,
            event.target.value,
          )}
          placeholder={definition.field.placeholder}
          required={value.enabled}
          disabled={disabled || !value.enabled}
          type={definition.field.type || 'text'}
          value={value[definition.field.name]}
        />
      </div>
    </section>
  )
}

