import SectionHeading from './SectionHeading.jsx'
import KpiCard from './KpiCard.jsx'

export default function KpiGrid({ kpis }) {
  return (
    <section className="mt-10" aria-labelledby="kpi-heading">
      <SectionHeading eyebrow="At a glance" id="kpi-heading" title="Key performance indicators" />
      {Array.isArray(kpis) && kpis.length > 0 ? (
        <div className="grid grid-cols-3 gap-3.5 max-auth-stack:grid-cols-2 max-phone:grid-cols-1">
          {kpis.map((kpi) => <KpiCard key={kpi.key} kpi={kpi} />)}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-line-strong bg-surface px-5 py-7.5 text-center text-body-sm text-ink-secondary">
          No KPI data is available for this period yet.
        </div>
      )}
    </section>
  )
}

