export default function DashboardWelcome({ clientName }) {
  return (
    <section className="dashboard-welcome max-w-[660px] mb-[58px] [&_h1]:m-0 [&_h1]:font-manrope [&_h1]:text-[clamp(30px,_4vw,_44px)] [&_h1]:font-semibold [&_h1]:tracking-[-0.055em] [&_h1]:leading-[1.16] [&>_p:last-child]:max-w-[560px] [&>_p:last-child]:pt-4 pb-0 px-0 [&>_p:last-child]:text-(--text-secondary) [&>_p:last-child]:text-[15px] [&>_p:last-child]:leading-[1.7]">
      <p className="dashboard-eyebrow pt-0 pb-2.75 px-0 text-(--accent-text) text-[11px] font-bold tracking-[0.13em] uppercase">Your workspace</p>
      <h1>{clientName ? `${clientName} overview` : 'Search performance overview'}</h1>
      <p>
        Monitor your search and website performance by period, and refresh
        integrations whenever you need the latest stored reports.
      </p>
    </section>
  )
}

