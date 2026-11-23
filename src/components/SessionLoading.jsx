export default function SessionLoading({ message }) {
  return (
    <main className="grid min-h-screen place-items-center bg-page-bg text-ink-secondary" role="status" aria-live="polite">
      <div className="grid justify-items-center gap-3.5">
        <span className="w-8.5 h-8.5 border-3 border-line border-t-accent rounded-full animate-session-spin motion-reduce:animate-none motion-reduce:border-accent" aria-hidden="true" />
        <span className="text-body-sm">{message}</span>
      </div>
    </main>
  )
}

