import KpiCard from './KpiCard.jsx'

export default function KpiGrid({ kpis }) {
  if (!Array.isArray(kpis) || kpis.length === 0) {
    return (
      <section className="analytics-section mt-10" aria-labelledby="kpi-heading">
        <div className="analytics-section__heading flex items-end justify-between gap-5 mb-3.75">
          <div>
            <p className="dashboard-eyebrow mb-1.75 px-0 text-(--accent-text) text-[11px] font-bold tracking-[0.13em] uppercase">At a glance</p>
            <h2 className="m-0 font-manrope text-[21px] font-semibold tracking-[-0.045em]" id="kpi-heading">Key performance indicators</h2>
          </div>
        </div>
        <div className="analytics-empty py-[30px] px-5 border border-dashed border-(--border-strong) rounded-[11px] bg-(--surface) text-(--text-secondary) text-[13px] text-center">No KPI data is available for this period yet.</div>
      </section>
    )
  }

  return (
    <section className="analytics-section mt-10" aria-labelledby="kpi-heading">
      <div className="analytics-section__heading flex items-end justify-between gap-5 mb-3.75">
        <div>
          <p className="dashboard-eyebrow mb-1.75 px-0 text-(--accent-text) text-[11px] font-bold tracking-[0.13em] uppercase">At a glance</p>
          <h2 className="m-0 font-manrope text-[21px] font-semibold tracking-[-0.045em]" id="kpi-heading">Key performance indicators</h2>
        </div>
      </div>
      <div className="kpi-grid grid grid-cols-3 gap-3.25 max-[700px]:grid-cols-2 max-[420px]:grid-cols-1">
        {kpis.map((kpi) => <KpiCard key={kpi.key} kpi={kpi} />)}
      </div>
    </section>
  )
}

