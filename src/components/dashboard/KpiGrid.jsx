import KpiCard from './KpiCard.jsx'

export default function KpiGrid({ kpis }) {
  if (!Array.isArray(kpis) || kpis.length === 0) {
    return (
      <section className="mt-10" aria-labelledby="kpi-heading">
        <div className="flex items-end justify-between gap-5 mb-4">
          <div>
            <p className="mt-0 mb-3 mx-0 text-accent-text text-label font-bold tracking-eyebrow uppercase">At a glance</p>
            <h2 className="m-0 font-heading text-section font-medium-bold tracking-tight" id="kpi-heading">Key performance indicators</h2>
          </div>
        </div>
        <div className="py-7.5 px-5 border border-dashed border-line-strong rounded-xl bg-surface text-ink-secondary text-body-sm text-center">No KPI data is available for this period yet.</div>
      </section>
    )
  }

  return (
    <section className="mt-10" aria-labelledby="kpi-heading">
      <div className="flex items-end justify-between gap-5 mb-4">
        <div>
          <p className="mt-0 mb-3 mx-0 text-accent-text text-label font-bold tracking-eyebrow uppercase">At a glance</p>
          <h2 className="m-0 font-heading text-section font-medium-bold tracking-tight" id="kpi-heading">Key performance indicators</h2>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3.5 max-auth-stack:grid-cols-2 max-phone:grid-cols-1">
        {kpis.map((kpi) => <KpiCard key={kpi.key} kpi={kpi} />)}
      </div>
    </section>
  )
}

