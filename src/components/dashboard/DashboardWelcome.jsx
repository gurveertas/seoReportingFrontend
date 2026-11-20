export default function DashboardWelcome({ clientName }) {
  return (
    <section className="dashboard-welcome max-w-165 mb-14.5">
      <p className="dashboard-eyebrow pt-0 pb-2.75 px-0 text-(--accent-text) text-[11px] font-bold tracking-[0.13em] uppercase">Your workspace</p>
      <h1 className="m-0 font-manrope text-[clamp(30px,4vw,44px)] font-semibold tracking-[-0.055em] leading-[1.16]">{clientName ? `${clientName} overview` : 'Search performance overview'}</h1>
      <p className="max-w-140 mt-4 mb-0 text-(--text-secondary) text-[15px] leading-[1.7]">
        Monitor your search and website performance by period, and refresh
        integrations whenever you need the latest stored reports.
      </p>
    </section>
  )
}

