export default function SessionLoading({ message }) {
  return (
    <main className="session-check" role="status" aria-live="polite">
      <div className="session-check__content">
        <span className="session-check__spinner" aria-hidden="true" />
        <span className="session-check__message">{message}</span>
      </div>
    </main>
  )
}
