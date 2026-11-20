function formatResponseBody(body) {
  if (typeof body === 'string') return body || 'Empty response body'
  return JSON.stringify(body, null, 2)
}

export default function ApiResponsePanel({ response, isLoading }) {
  return (
    <section className="api-response" aria-labelledby="response-title">
      <div className="api-response__heading">
        <h2 id="response-title">Response</h2>
        {response?.status && (
          <span className={`api-response__status api-response__status--${response.ok ? 'success' : 'error'}`}>
            HTTP {response.status}
          </span>
        )}
        {response?.type === 'network-error' && (
          <span className="api-response__status api-response__status--error">Request failed</span>
        )}
        {response?.type === 'validation-error' && (
          <span className="api-response__status api-response__status--error">Invalid body</span>
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
