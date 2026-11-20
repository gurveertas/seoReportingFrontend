import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ApiResponsePanel from '../components/api-test/ApiResponsePanel.jsx'
import EndpointSelector from '../components/api-test/EndpointSelector.jsx'
import JsonBodyEditor from '../components/api-test/JsonBodyEditor.jsx'
import AppHeader from '../components/AppHeader.jsx'
import { DATA_TEST_ENDPOINTS, MOCK_API_ENABLED } from '../config/api.js'
import { requestDataSource } from '../services/dataSources.js'

const initialBodies = Object.fromEntries(
  DATA_TEST_ENDPOINTS.map((endpoint) => [endpoint.id, '{\n  \n}']),
)

export default function ApiTestPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedId = searchParams.get('endpoint')
  const activeEndpoint = DATA_TEST_ENDPOINTS.find((endpoint) => endpoint.id === selectedId)
    ?? DATA_TEST_ENDPOINTS[0]
  const [requestBodies, setRequestBodies] = useState(initialBodies)
  const [responses, setResponses] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  function selectEndpoint(id) {
    setSearchParams({ endpoint: id })
  }

  function updateRequestBody(event) {
    const body = event.target.value
    setRequestBodies((current) => ({ ...current, [activeEndpoint.id]: body }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    let body
    try {
      body = JSON.parse(requestBodies[activeEndpoint.id])
    } catch (error) {
      setResponses((current) => ({
        ...current,
        [activeEndpoint.id]: {
          type: 'validation-error',
          message: error instanceof Error ? `Invalid JSON: ${error.message}` : 'Invalid JSON body.',
        },
      }))
      return
    }

    setIsLoading(true)
    setResponses((current) => ({ ...current, [activeEndpoint.id]: null }))

    try {
      const result = await requestDataSource(activeEndpoint.url, body)
      setResponses((current) => ({
        ...current,
        [activeEndpoint.id]: { ...result, type: 'http-response' },
      }))
    } catch (error) {
      setResponses((current) => ({
        ...current,
        [activeEndpoint.id]: {
          type: 'network-error',
          message: error instanceof Error ? error.message : 'Unable to reach the endpoint.',
        },
      }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="api-test-page [min-height:100vh] [background:var(--page-bg)] [color:var(--text-primary)] [&_button:focus-visible]:[outline:3px_solid_var(--focus-ring)] [&_button:focus-visible]:[outline-offset:2px]">
      <AppHeader activePage="test-api" />
      <main className="api-test-content [width:min(1180px,_calc(100%_-_48px))] [margin:0_auto] [padding:126px_0_72px] max-[520px]:[width:calc(100%_-_36px)] max-[520px]:[padding-top:112px]" id="main-content" tabIndex="-1">
        <div className="api-test-intro [margin-bottom:30px] [&_h1]:[margin:0] [&_h1]:[font-family:'Manrope',_sans-serif] [&_h1]:[font-size:clamp(30px,_4vw,_40px)] [&_h1]:[font-weight:650] [&_h1]:[letter-spacing:-0.055em] [&>_p:last-child]:[margin:10px_0_0] [&>_p:last-child]:[color:var(--text-secondary)] [&>_p:last-child]:[font-size:14px]">
          <p className="dashboard-eyebrow [margin:0_0_11px] [color:var(--accent-text)] [font-size:11px] [font-weight:700] [letter-spacing:0.13em] [text-transform:uppercase]">Developer tools</p>
          <h1>API route tester</h1>
          <p className="[margin:10px_0_0] [color:var(--text-secondary)] [font-size:14px]">Select a data source, enter its JSON request body, and inspect the response.</p>
          {MOCK_API_ENABLED && <p className="[margin:8px_0_0] [color:var(--accent-text)] [font-size:12px]">Demo mode: send <code>{'{"mockError":true}'}</code> to preview an error response.</p>}
        </div>

        <div className="api-test-layout [display:grid] [grid-template-columns:minmax(270px,_0.72fr)_minmax(0,_1.8fr)] [align-items:start] [gap:20px] max-[820px]:[grid-template-columns:1fr]">
          <EndpointSelector
            disabled={isLoading}
            endpoints={DATA_TEST_ENDPOINTS}
            onSelect={selectEndpoint}
            selectedId={activeEndpoint.id}
          />

          <section className="api-test-workspace [padding:clamp(18px,_3vw,_28px)] [border:1px_solid_var(--border)] [border-radius:13px] [background:var(--surface)] [box-shadow:var(--shadow-float)]" aria-label={`${activeEndpoint.name} request`}>
            <div className="api-test-workspace__endpoint [display:flex] [align-items:flex-start] [gap:13px] [padding-bottom:21px] [border-bottom:1px_solid_var(--border-subtle)] [&_h2]:[margin:0_0_6px] [&_h2]:[font-size:15px] [&_code]:[display:block] [&_code]:[color:var(--text-secondary)] [&_code]:[font-family:'DM_Sans',_sans-serif] [&_code]:[font-size:11px] [&_code]:[line-height:1.55] [&_code]:[overflow-wrap:anywhere]">
              <span className="api-method [flex:0_0_auto] [padding:6px_8px] [border-radius:5px] [background:var(--positive-bg)] [color:var(--positive-text)] [font-size:10px] [font-weight:800]">POST</span>
              <div>
                <h2>{activeEndpoint.name}</h2>
                <code>{activeEndpoint.url}</code>
              </div>
            </div>

            <form className="api-request-form [margin-top:21px]" onSubmit={handleSubmit}>
              <JsonBodyEditor
                disabled={isLoading}
                onChange={updateRequestBody}
                value={requestBodies[activeEndpoint.id]}
              />
              <button className="api-request-form__submit [display:inline-flex] [align-items:center] [justify-content:space-between] [gap:20px] [min-width:150px] [min-height:43px] [margin-top:15px] [padding:0_14px] [border:0] [border-radius:8px] [background:var(--accent)] [color:#fff] [cursor:pointer] [font:inherit] [font-size:12px] [font-weight:650] [&:hover:not(:disabled)]:[background:var(--accent-hover)] [&:disabled]:[cursor:wait] [&:disabled]:[opacity:0.7] [&_span]:[font-size:17px]" disabled={isLoading} type="submit">
                {isLoading ? 'Sending…' : 'Send request'}
                {!isLoading && <span aria-hidden="true">→</span>}
              </button>
            </form>

            <ApiResponsePanel
              isLoading={isLoading}
              response={responses[activeEndpoint.id]}
            />
          </section>
        </div>
      </main>
    </div>
  )
}

