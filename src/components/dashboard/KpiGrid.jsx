import KpiCard from './KpiCard.jsx'

export default function KpiGrid({ kpis }) {
  if (!Array.isArray(kpis) || kpis.length === 0) {
    return (
      <section className="analytics-section" aria-labelledby="kpi-heading">
        <div className="analytics-section__heading">
          <div>
            <p className="dashboard-eyebrow">At a glance</p>
            <h2 id="kpi-heading">Key performance indicators</h2>
          </div>
        </div>
        <div className="analytics-empty">No KPI data is available for this period yet.</div>
      </section>
    )
  }

  return (
    <section className="analytics-section" aria-labelledby="kpi-heading">
      <div className="analytics-section__heading">
        <div>
          <p className="dashboard-eyebrow">At a glance</p>
          <h2 id="kpi-heading">Key performance indicators</h2>
        </div>
      </div>
      <div className="kpi-grid">
        {kpis.map((kpi) => <KpiCard key={kpi.key} kpi={kpi} />)}
      </div>
    </section>
  )
}
