export default function EndpointSelector({ endpoints, selectedId, onSelect, disabled }) {
  return (
    <nav className="endpoint-selector [display:grid] [gap:8px] max-[820px]:[grid-template-columns:repeat(3,_minmax(0,_1fr))] max-[520px]:[grid-template-columns:1fr]" aria-label="API endpoints">
      {endpoints.map((endpoint) => (
        <button
          key={endpoint.id}
          aria-pressed={selectedId === endpoint.id}
          className={`endpoint-selector__item${selectedId === endpoint.id ? ' is-active' : ''} [display:flex] [align-items:flex-start] [gap:12px] [width:100%] [padding:14px_12px] [border:1px_solid_var(--border)] [border-radius:10px] [background:var(--surface)] [color:var(--text-primary)] [cursor:pointer] [text-align:left] [transition:border-color_160ms_ease,_background_160ms_ease] [&:hover:not(:disabled)]:[border-color:var(--border-strong)] [&:hover:not(:disabled)]:[background:var(--surface-muted)] [&.is-active]:[border-color:var(--border-strong)] [&.is-active]:[background:var(--surface-muted)] [&:disabled]:[cursor:wait] max-[820px]:[align-items:center] max-[820px]:[flex-direction:column] max-[820px]:[text-align:center] max-[520px]:[align-items:center] max-[520px]:[flex-direction:row] max-[520px]:[text-align:left]`}
          disabled={disabled}
          onClick={() => onSelect(endpoint.id)}
          type="button"
        >
          <span className="endpoint-selector__badge [display:grid] [flex:0_0_38px] [height:38px] [place-items:center] [border-radius:9px] [background:var(--accent-soft)] [color:var(--accent-text)] [font-size:10px] [font-weight:800]">{endpoint.shortName}</span>
          <span className="endpoint-selector__copy [display:grid] [min-width:0] [gap:5px] [padding-top:2px] [&_strong]:[font-size:12px] [&_code]:[overflow:hidden] [&_code]:[color:var(--text-secondary)] [&_code]:[font-family:'DM_Sans',_sans-serif] [&_code]:[font-size:10px] [&_code]:[text-overflow:ellipsis] [&_code]:[white-space:nowrap]">
            <strong>{endpoint.name}</strong>
            <code>{new URL(endpoint.url).pathname}</code>
          </span>
        </button>
      ))}
    </nav>
  )
}

