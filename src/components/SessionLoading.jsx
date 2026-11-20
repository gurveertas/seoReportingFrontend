export default function SessionLoading({ message }) {
  return (
    <main className="session-check grid min-h-screen place-items-center bg-(--page-bg) text-(--text-secondary)" role="status" aria-live="polite">
      <div className="session-check__content grid justify-items-center gap-3.5">
        <span className="session-check__spinner w-8.5 h-8.5 border-[3px] border-(--border) border-t-(--accent) rounded-full animate-[session-check-spin_800ms_linear_infinite] motion-reduce:animate-none motion-reduce:border-(--accent)" aria-hidden="true" />
        <span className="session-check__message text-[13px]">{message}</span>
      </div>
    </main>
  )
}

