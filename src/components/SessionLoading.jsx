export default function SessionLoading({ message }) {
  return (
    <main className="session-check [display:grid] [min-height:100vh] [place-items:center] [background:var(--page-bg)] [color:var(--text-secondary)]" role="status" aria-live="polite">
      <div className="session-check__content [display:grid] [justify-items:center] [gap:14px]">
        <span className="session-check__spinner [width:34px] [height:34px] [border:3px_solid_var(--border)] [border-top-color:var(--accent)] [border-radius:50%] [animation:session-check-spin_800ms_linear_infinite] motion-reduce:[animation:none] motion-reduce:[border-color:var(--accent)]" aria-hidden="true" />
        <span className="session-check__message [font-size:13px]">{message}</span>
      </div>
    </main>
  )
}

