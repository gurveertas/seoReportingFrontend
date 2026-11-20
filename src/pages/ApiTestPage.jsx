import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ApiResponsePanel from '../components/api-test/ApiResponsePanel.jsx'
import EndpointSelector from '../components/api-test/EndpointSelector.jsx'
import JsonBodyEditor from '../components/api-test/JsonBodyEditor.jsx'
import AppHeader from '../components/AppHeader.jsx'
import { DATA_TEST_ENDPOINTS } from '../config/api.js'
import { requestDataSource } from '../services/dataSources.js'
import './ApiTestPage.css'

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
    <div className="api-test-page">
      <AppHeader activePage="test-api" />
      <main className="api-test-content">
        <div className="api-test-intro">
          <p className="dashboard-eyebrow">Developer tools</p>
          <h1>API route tester</h1>
          <p>Select a data source, enter its JSON request body, and inspect the response.</p>
        </div>

        <div className="api-test-layout">
          <EndpointSelector
            disabled={isLoading}
            endpoints={DATA_TEST_ENDPOINTS}
            onSelect={selectEndpoint}
            selectedId={activeEndpoint.id}
          />

          <section className="api-test-workspace" aria-label={`${activeEndpoint.name} request`}>
            <div className="api-test-workspace__endpoint">
              <span className="api-method">POST</span>
              <div>
                <h2>{activeEndpoint.name}</h2>
                <code>{activeEndpoint.url}</code>
              </div>
            </div>

            <form className="api-request-form" onSubmit={handleSubmit}>
              <JsonBodyEditor
                disabled={isLoading}
                onChange={updateRequestBody}
                value={requestBodies[activeEndpoint.id]}
              />
              <button className="api-request-form__submit" disabled={isLoading} type="submit">
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
