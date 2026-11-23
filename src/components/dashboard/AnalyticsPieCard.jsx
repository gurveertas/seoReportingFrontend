import { useEffect, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = [
  'var(--chart-series-1)',
  'var(--chart-series-2)',
  'var(--chart-series-3)',
  'var(--chart-series-4)',
  'var(--chart-series-5)',
]
const MAX_VISIBLE_ITEMS = 4
const numberFormatter = new Intl.NumberFormat()
const compactNumberFormatter = new Intl.NumberFormat(undefined, {
  notation: 'compact',
  maximumFractionDigits: 1,
})
const percentFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
})

function getClickShare(table, labelKey) {
  if (!Array.isArray(table?.rows)) return null

  const rows = table.rows
    .map((row, index) => {
      const clicks = Number(row?.clicks)
      const rawName = row?.[labelKey]

      return {
        name: typeof rawName === 'string' && rawName.trim()
          ? rawName.trim()
          : `Item ${index + 1}`,
        value: clicks,
      }
    })
    .filter((row) => Number.isFinite(row.value) && row.value > 0)
    .sort((first, second) => second.value - first.value)

  if (!rows.length) return null

  const visibleRows = rows.slice(0, MAX_VISIBLE_ITEMS)
  const remainingClicks = rows
    .slice(MAX_VISIBLE_ITEMS)
    .reduce((total, row) => total + row.value, 0)

  if (remainingClicks > 0) {
    visibleRows.push({ name: 'Other', value: remainingClicks })
  }

  return {
    data: visibleRows,
    total: visibleRows.reduce((total, row) => total + row.value, 0),
  }
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)

    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  return prefersReducedMotion
}

export default function AnalyticsPieCard({ title, description, table, labelKey }) {
  const share = getClickShare(table, labelKey)
  const prefersReducedMotion = usePrefersReducedMotion()
  const chartDescription = share
    ? share.data.map((item) => {
      const percent = percentFormatter.format((item.value / share.total) * 100)
      return `${item.name}: ${percent}%`
    }).join(', ')
    : 'No click data is available'

  return (
    <article className="min-w-0 overflow-hidden border border-line rounded-xl bg-surface animate-pie-enter [&:nth-child(2)]:animate-pie-enter-delayed motion-reduce:animate-none">
      <header className="flex items-start justify-between gap-3 pt-4.5 pb-0 px-4.5">
        <div>
          <h3 className="m-0 text-ink text-xs font-bold">{title}</h3>
          <p className="mt-1.5 mb-0 mx-0 text-ink-muted text-caption">{description}</p>
        </div>
      </header>
      {share ? (
        <div className="grid grid-cols-pie items-center gap-3 pt-2 pb-4.5 px-4.5 max-analytics:grid-cols-pie-compact max-analytics:gap-2 max-analytics:pr-3 max-analytics:pl-3">
          <div
            aria-label={chartDescription}
            className="relative w-full h-52 min-w-0 max-analytics:h-pie-compact"
            role="img"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  animationBegin={100}
                  animationDuration={850}
                  animationEasing="ease-out"
                  data={share.data}
                  dataKey="value"
                  endAngle={-270}
                  isAnimationActive={!prefersReducedMotion}
                  nameKey="name"
                  paddingAngle={2}
                  startAngle={90}
                  stroke="var(--surface)"
                  strokeWidth={2}
                  innerRadius="62%"
                  outerRadius="88%"
                >
                  {share.data.map((item, index) => (
                    <Cell key={item.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    border: '1px solid var(--border)',
                    borderRadius: 9,
                    boxShadow: 'var(--shadow-float)',
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text-primary)',
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${numberFormatter.format(value)} clicks`, 'Clicks']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid absolute top-1/2 left-1/2 gap-0.5 -translate-1/2 text-center pointer-events-none" aria-hidden="true">
              <strong className="text-ink-strong font-heading text-section tabular-nums font-bold tracking-tighter">{compactNumberFormatter.format(share.total)}</strong>
              <span className="text-ink-muted text-caption">clicks</span>
            </div>
          </div>
          <ul className="grid min-w-0 gap-3 m-0 p-0 list-none max-analytics:gap-2.5">
            {share.data.map((item, index) => (
              <li className="grid grid-cols-legend items-center gap-2 min-w-0 max-analytics:grid-cols-legend max-analytics:gap-1.5" key={item.name}>
                <span
                  aria-hidden="true"
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="overflow-hidden text-ink-body text-caption text-ellipsis whitespace-nowrap max-analytics:text-micro" title={item.name}>
                  {item.name}
                </span>
                <span className="text-ink-secondary text-caption tabular-nums font-medium-bold max-analytics:text-micro">
                  {percentFormatter.format((item.value / share.total) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="grid min-h-37.5 p-5 place-items-center text-ink-muted text-xs text-center">
          Click data is not available for this period yet.
        </div>
      )}
    </article>
  )
}

