export default function IntegrationSettingsCard({
  definition,
  value,
  onEnabledChange,
  onPropertyChange,
}) {
  const fieldId = `settings-${definition.id}-${definition.field.name}`

  return (
    <section className="integration-settings-card">
      <header className="integration-settings-card__header">
        <div>
          <h3>{definition.title}</h3>
          <p>{definition.description}</p>
        </div>
        <label className="integration-settings-card__toggle">
          <input
            checked={value.enabled}
            onChange={(event) => onEnabledChange(definition.id, event.target.checked)}
            type="checkbox"
          />
          <span>{value.enabled ? 'Enabled' : 'Disabled'}</span>
        </label>
      </header>
      <div className="integration-settings-card__field">
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
          type={definition.field.type || 'text'}
          value={value[definition.field.name]}
        />
      </div>
    </section>
  )
}
