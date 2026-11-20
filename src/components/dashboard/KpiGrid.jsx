import KpiCard from './KpiCard.jsx'

export default function KpiGrid({ kpis }) {
  if (!Array.isArray(kpis) || kpis.length === 0) {
    return (
      <section className="analytics-section [margin-top:40px]" aria-labelledby="kpi-heading">
        <div className="analytics-section__heading [display:flex] [align-items:end] [justify-content:space-between] [gap:20px] [margin-bottom:15px] [&_h2]:[margin:0] [&_h2]:[font-family:'Manrope',_sans-serif] [&_h2]:[font-size:21px] [&_h2]:[font-weight:650] [&_h2]:[letter-spacing:-0.045em] [&.dashboard-eyebrow]:[margin-bottom:7px]">
          <div>
            <p className="dashboard-eyebrow [margin:0_0_11px] [color:var(--accent-text)] [font-size:11px] [font-weight:700] [letter-spacing:0.13em] [text-transform:uppercase]">At a glance</p>
            <h2 id="kpi-heading">Key performance indicators</h2>
          </div>
        </div>
        <div className="analytics-empty [padding:30px_20px] [border:1px_dashed_var(--border-strong)] [border-radius:11px] [background:var(--surface)] [color:var(--text-secondary)] [font-size:13px] [text-align:center]">No KPI data is available for this period yet.</div>
      </section>
    )
  }

  return (
    <section className="analytics-section [margin-top:40px]" aria-labelledby="kpi-heading">
      <div className="analytics-section__heading [display:flex] [align-items:end] [justify-content:space-between] [gap:20px] [margin-bottom:15px] [&_h2]:[margin:0] [&_h2]:[font-family:'Manrope',_sans-serif] [&_h2]:[font-size:21px] [&_h2]:[font-weight:650] [&_h2]:[letter-spacing:-0.045em] [&.dashboard-eyebrow]:[margin-bottom:7px]">
        <div>
          <p className="dashboard-eyebrow [margin:0_0_11px] [color:var(--accent-text)] [font-size:11px] [font-weight:700] [letter-spacing:0.13em] [text-transform:uppercase]">At a glance</p>
          <h2 id="kpi-heading">Key performance indicators</h2>
        </div>
      </div>
      <div className="kpi-grid [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:13px] max-[700px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[420px]:[grid-template-columns:1fr]">
        {kpis.map((kpi) => <KpiCard key={kpi.key} kpi={kpi} />)}
      </div>
    </section>
  )
}

