export default function JsonBodyEditor({ value, onChange, disabled }) {
  return (
    <div className="json-body-editor">
      <div className="json-body-editor__heading">
        <label htmlFor="request-body">Request body</label>
        <span>JSON</span>
      </div>
      <textarea
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className="json-body-editor__input"
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
