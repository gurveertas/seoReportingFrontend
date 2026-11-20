function formatResponseBody(body) {
  if (typeof body === 'string') return body || 'Empty response body'
  return JSON.stringify(body, null, 2)
}

export default function ApiResponsePanel({ response, isLoading }) {
  return (
    <section className="api-response [margin-top:27px] [&_pre]:[overflow:auto] [&_pre]:[max-height:360px] [&_pre]:[min-height:90px] [&_pre]:[margin:10px_0_0] [&_pre]:[padding:14px] [&_pre]:[border:1px_solid_var(--border)] [&_pre]:[border-radius:8px] [&_pre]:[background:var(--code-bg)] [&_pre]:[color:var(--code-text)] [&_pre]:[font-family:Consolas,_'Courier_New',_monospace] [&_pre]:[font-size:11px] [&_pre]:[line-height:1.65] [&_pre]:[white-space:pre-wrap] [&_pre]:[word-break:break-word]" aria-labelledby="response-title">
      <div className="api-response__heading [display:flex] [align-items:center] [gap:10px] [&_h2]:[margin:0] [&_h2]:[font-size:13px]">
        <h2 id="response-title">Response</h2>
        {response?.status && (
          <span className={`api-response__status api-response__status--${response.ok ? 'success' : 'error'} [padding:4px_7px] [border-radius:20px] [font-size:10px] [font-weight:700] ${response.ok ? '[background:var(--positive-bg)] [color:var(--positive-text)]' : '[background:var(--negative-bg)] [color:var(--negative-text)]'}`}>
            HTTP {response.status}
          </span>
        )}
        {response?.type === 'network-error' && (
          <span className="api-response__status api-response__status--error [padding:4px_7px] [border-radius:20px] [font-size:10px] [font-weight:700] [background:var(--negative-bg)] [color:var(--negative-text)]">Request failed</span>
        )}
        {response?.type === 'validation-error' && (
          <span className="api-response__status api-response__status--error [padding:4px_7px] [border-radius:20px] [font-size:10px] [font-weight:700] [background:var(--negative-bg)] [color:var(--negative-text)]">Invalid body</span>
        )}
      </div>
      <pre aria-live="polite">
        {isLoading
          ? 'Sending request…'
          : response
            ? response.message || formatResponseBody(response.body)
            : 'No request sent yet. The server response will appear here.'}
      </pre>
    </section>
  )
}

