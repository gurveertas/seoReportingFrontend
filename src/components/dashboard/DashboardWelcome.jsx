export default function DashboardWelcome({ clientName }) {
  return (
    <section className="dashboard-welcome [max-width:660px] [margin-bottom:58px] [&_h1]:[margin:0] [&_h1]:[font-family:'Manrope',_sans-serif] [&_h1]:[font-size:clamp(30px,_4vw,_44px)] [&_h1]:[font-weight:650] [&_h1]:[letter-spacing:-0.055em] [&_h1]:[line-height:1.16] [&>_p:last-child]:[max-width:560px] [&>_p:last-child]:[margin:16px_0_0] [&>_p:last-child]:[color:var(--text-secondary)] [&>_p:last-child]:[font-size:15px] [&>_p:last-child]:[line-height:1.7]">
      <p className="dashboard-eyebrow [margin:0_0_11px] [color:var(--accent-text)] [font-size:11px] [font-weight:700] [letter-spacing:0.13em] [text-transform:uppercase]">Your workspace</p>
      <h1>{clientName ? `${clientName} overview` : 'Search performance overview'}</h1>
      <p>
        Monitor your search and website performance by period, and refresh
        integrations whenever you need the latest stored reports.
      </p>
    </section>
  )
}

