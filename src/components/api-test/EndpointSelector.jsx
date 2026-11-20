export default function EndpointSelector({ endpoints, selectedId, onSelect, disabled }) {
  return (
    <nav className="endpoint-selector" aria-label="API endpoints">
      {endpoints.map((endpoint) => (
        <button
          key={endpoint.id}
          aria-pressed={selectedId === endpoint.id}
          className={`endpoint-selector__item${selectedId === endpoint.id ? ' is-active' : ''}`}
          disabled={disabled}
          onClick={() => onSelect(endpoint.id)}
          type="button"
        >
          <span className="endpoint-selector__badge">{endpoint.shortName}</span>
          <span className="endpoint-selector__copy">
            <strong>{endpoint.name}</strong>
            <code>{new URL(endpoint.url).pathname}</code>
          </span>
        </button>
      ))}
    </nav>
  )
}
