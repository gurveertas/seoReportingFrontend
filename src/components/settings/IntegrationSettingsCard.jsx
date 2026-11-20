export default function IntegrationSettingsCard({
  definition,
  value,
  disabled = false,
  onEnabledChange,
  onPropertyChange,
}) {
  const fieldId = `settings-${definition.id}-${definition.field.name}`

  return (
    <section className="integration-settings-card min-w-0 p-5 border border-(--border) rounded-[13px] bg-(--surface) max-[520px]:p-4">
      <header className="integration-settings-card__header flex items-start justify-between gap-3.5 mb-4.5">
        <div>
          <h3 className="m-0 text-[13px] font-bold">{definition.title}</h3>
          <p className="mt-1.25 mb-0 text-(--text-secondary) text-[11px] leading-normal">{definition.description}</p>
        </div>
        <label className="integration-settings-card__toggle inline-flex shrink-0 items-center gap-1.5 text-(--text-secondary) cursor-pointer text-[10px] font-semibold whitespace-nowrap">
          <input
            checked={value.enabled}
            className="size-3.75 m-0 accent-(--accent) cursor-pointer disabled:cursor-not-allowed disabled:opacity-65 focus-visible:outline-2 focus-visible:outline-(--focus-ring)"
            disabled={disabled}
            onChange={(event) => onEnabledChange(definition.id, event.target.checked)}
            type="checkbox"
          />
          <span>{value.enabled ? 'Enabled' : 'Disabled'}</span>
        </label>
      </header>
      <div className="integration-settings-card__field grid gap-1.75">
        <label className="text-(--text-body) text-[11px] font-semibold" htmlFor={fieldId}>{definition.field.label}</label>
        <input
          autoComplete="off"
          className="w-full min-h-10.5 px-3 border border-(--border-strong) rounded-lg bg-(--surface) text-(--text-primary) text-xs transition-[border-color,box-shadow] disabled:cursor-not-allowed disabled:opacity-65 placeholder:text-(--text-muted) focus:border-(--accent) focus:outline-none focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_12%,transparent)]"
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

