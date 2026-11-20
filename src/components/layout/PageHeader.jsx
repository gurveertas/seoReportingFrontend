export default function PageHeader({ eyebrow, title, description, actions, leading }) {
  return (
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div className="flex min-w-0 items-center gap-4">
        {leading}
        <div className="min-w-0">
          {eyebrow && <p className="mb-1.5 mt-0 text-[11px] font-bold uppercase tracking-[.14em] text-(--accent-text)">{eyebrow}</p>}
          <h1 className="m-0 truncate font-[Manrope,sans-serif] text-[clamp(24px,3vw,30px)] font-extrabold tracking-[-.045em] text-(--text-strong)">{title}</h1>
          {description && <p className="mb-0 mt-1.5 max-w-2xl text-sm leading-6 text-(--text-secondary)">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}

export function StatCard({ label, value, hint, accent = false, children }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border p-5 ${accent ? 'border-transparent bg-gradient-to-br from-(--accent) to-(--accent-hover) text-white' : 'border-(--border) bg-(--surface)'}`}>
      <p className={`m-0 text-xs font-semibold ${accent ? 'text-white/75' : 'text-(--text-secondary)'}`}>{label}</p>
      <p className="mb-0 mt-2 font-[Manrope,sans-serif] text-[28px] font-extrabold leading-none tracking-[-.04em]">{value}</p>
      {hint && <p className={`mb-0 mt-2 text-xs ${accent ? 'text-white/75' : 'text-(--text-muted)'}`}>{hint}</p>}
      {children}
    </div>
  )
}
