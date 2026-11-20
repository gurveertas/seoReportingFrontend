export default function JsonBodyEditor({ value, onChange, disabled }) {
  return (
    <div className="json-body-editor [&>_p]:[margin:7px_0_0] [&>_p]:[color:var(--text-muted)] [&>_p]:[font-size:11px]">
      <div className="json-body-editor__heading [display:flex] [align-items:center] [justify-content:space-between] [&_label]:[font-size:12px] [&_label]:[font-weight:700] [&_span]:[color:var(--text-secondary)] [&_span]:[font-size:10px] [&_span]:[font-weight:700] [&_span]:[letter-spacing:0.08em]">
        <label htmlFor="request-body">Request body</label>
        <span>JSON</span>
      </div>
      <textarea
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className="json-body-editor__input [display:block] [width:100%] [min-height:180px] [margin-top:9px] [padding:14px] [border:1px_solid_var(--border-strong)] [border-radius:8px] [background:var(--code-bg)] [color:var(--text-primary)] [font-family:Consolas,_'Courier_New',_monospace] [font-size:12px] [line-height:1.6] [resize:vertical] [&:focus]:[border-color:var(--accent)] [&:focus]:[outline:3px_solid_color-mix(in_srgb,_var(--accent)_12%,_transparent)] [&:disabled]:[opacity:0.7]"
        disabled={disabled}
        id="request-body"
        onChange={onChange}
        spellCheck="false"
        value={value}
      />
      <p>Enter the JSON payload expected by this endpoint.</p>
    </div>
  )
}

