export default function IntegrationSettingsCard({
  definition,
  value,
  disabled = false,
  onEnabledChange,
  onPropertyChange,
}) {
  const fieldId = `settings-${definition.id}-${definition.field.name}`

  return (
    <section className="min-w-0 p-5 border border-line rounded-xl bg-surface last:odd:col-span-full max-auth-stack:last:odd:col-auto max-settings:p-4">
      <header className="flex items-start justify-between gap-3.5 mb-4.5">
        <div>
          <h3 className="m-0 text-body-sm font-bold">{definition.title}</h3>
          <p className="mt-1.5 mb-0 mx-0 text-ink-secondary text-label leading-normal">{definition.description}</p>
        </div>
        <label className="inline-flex flex-none items-center gap-1.5 text-ink-secondary cursor-pointer text-caption font-medium-bold whitespace-nowrap">
          <input className="size-4 m-0 accent-accent cursor-pointer disabled:cursor-not-allowed disabled:opacity-65 focus-visible:outline-3 focus-visible:outline-focus-ring focus-visible:outline-offset-3"
            checked={value.enabled}
            disabled={disabled}
            onChange={(event) => onEnabledChange(definition.id, event.target.checked)}
            type="checkbox"
          />
          <span>{value.enabled ? 'Enabled' : 'Disabled'}</span>
        </label>
      </header>
      <div className="grid gap-2">
        <label className="text-ink-body text-label font-medium-bold" htmlFor={fieldId}>{definition.field.label}</label>
        <input className="w-full min-h-10.5 py-0 px-3 border border-line-strong rounded-lg bg-surface text-ink text-xs transition duration-150 disabled:cursor-not-allowed disabled:opacity-65 placeholder:text-ink-muted focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent/12"
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

