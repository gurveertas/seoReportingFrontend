export default function IntegrationSettingsCard({
  definition,
  value,
  disabled = false,
  onEnabledChange,
  onPropertyChange,
}) {
  const fieldId = `settings-${definition.id}-${definition.field.name}`

  return (
    <section className="integration-settings-card min-w-0 p-5 border border-(--border) rounded-[13px] bg-(--surface) [&:last-child:nth-child(odd)]:col-span-full max-[700px]:[&:last-child:nth-child(odd)]:col-auto max-[520px]:p-4">
      <header className="integration-settings-card__header flex items-start justify-between gap-3.5 mb-4.5 [&_h3]:m-0 [&_h3]:text-[13px] [&_h3]:font-bold [&_p]:pt-1.25 pb-0 px-0 [&_p]:text-(--text-secondary) [&_p]:text-[11px] [&_p]:leading-normal">
        <div>
          <h3>{definition.title}</h3>
          <p>{definition.description}</p>
        </div>
        <label className="integration-settings-card__toggle inline-flex shrink-0 grow-0 basis-auto items-center gap-1.5 text-(--text-secondary) cursor-pointer text-[10px] font-semibold whitespace-nowrap [&_input]:w-3.75 [&_input]:h-3.75 [&_input]:m-0 [&_input]:accent-(--accent) [&_input]:cursor-pointer [&_input:disabled]:cursor-not-allowed [&_input:disabled]:opacity-[0.65] [&_input:focus-visible]:outline-3 outline-(--focus-ring) [&_input:focus-visible]:outline-offset-[3px]">
          <input
            checked={value.enabled}
            disabled={disabled}
            onChange={(event) => onEnabledChange(definition.id, event.target.checked)}
            type="checkbox"
          />
          <span>{value.enabled ? 'Enabled' : 'Disabled'}</span>
        </label>
      </header>
      <div className="integration-settings-card__field grid gap-1.75 [&_label]:text-(--text-body) [&_label]:text-[11px] [&_label]:font-semibold [&_input]:w-full [&_input]:min-h-10.5 [&_input]:py-0 px-3 [&_input]:border border-(--border-strong) [&_input]:rounded-[8px] [&_input]:bg-(--surface) [&_input]:text-(--text-primary) [&_input]:[font:inherit] [&_input]:text-xs [&_input]:transition-[border-color_150ms_ease,_box-shadow_150ms_ease] [&_input:disabled]:cursor-not-allowed [&_input:disabled]:opacity-[0.65] [&_input::placeholder]:text-(--text-muted) [&_input:focus]:border-(--accent) [&_input:focus]:outline-none [&_input:focus]:shadow-[0_0_0_3px_color-mix(in_srgb,_var(--accent)_12%,_transparent)]">
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

