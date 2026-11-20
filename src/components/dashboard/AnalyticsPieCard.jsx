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
    <article className={`analytics-pie-card min-w-0 overflow-hidden border border-(--border) rounded-[11px] bg-(--surface) animate-[pie-card-enter_440ms_ease-out_both] motion-reduce:animate-none ${title === 'Top page click share' ? 'delay-[90ms]' : ''}`}>
      <header className="analytics-chart-card__header flex items-start justify-between gap-3 pt-4.25 px-4.5">
        <div>
          <h3 className="m-0 text-(--text-primary) text-xs font-bold">{title}</h3>
          <p className="mt-1.25 mb-0 text-(--text-muted) text-[10px]">{description}</p>
        </div>
      </header>
      {share ? (
        <div className="analytics-pie-card__body grid grid-cols-[minmax(155px,_0.9fr)_minmax(0,_1.1fr)] items-center gap-3 pt-2 pb-4.25 px-4.5 max-[560px]:grid-cols-[minmax(115px,_0.85fr)_minmax(0,_1.15fr)] max-[560px]:gap-1.75 max-[560px]:pr-3 max-[560px]:pl-3">
          <div
            aria-label={chartDescription}
            className="analytics-pie-card__visual relative w-full h-[208px] min-w-0 max-[560px]:h-[174px]"
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
            <div className="analytics-pie-card__center grid absolute top-[50%] left-[50%] gap-0.5 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none" aria-hidden="true">
              <strong className="text-(--text-strong) font-manrope text-[21px] tabular-nums font-bold tracking-[-0.05em]">{compactNumberFormatter.format(share.total)}</strong>
              <span className="text-(--text-muted) text-[10px]">clicks</span>
            </div>
          </div>
          <ul className="analytics-pie-legend grid min-w-0 gap-2.75 m-0 p-0 list-none max-[560px]:gap-2.25">
            {share.data.map((item, index) => (
              <li className="grid min-w-0 grid-cols-[8px_minmax(0,1fr)_auto] items-center gap-2 max-[560px]:grid-cols-[7px_minmax(0,1fr)_auto] max-[560px]:gap-1.5" key={item.name}>
                <span
                  aria-hidden="true"
                  className="analytics-pie-legend__swatch w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="analytics-pie-legend__name overflow-hidden text-(--text-body) text-[10px] text-ellipsis whitespace-nowrap max-[560px]:text-[9px]" title={item.name}>
                  {item.name}
                </span>
                <span className="analytics-pie-legend__value text-(--text-secondary) text-[10px] tabular-nums font-semibold max-[560px]:text-[9px]">
                  {percentFormatter.format((item.value / share.total) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="analytics-chart-card__empty grid min-h-[150px] p-5 place-items-center text-(--text-muted) text-xs text-center">
          Click data is not available for this period yet.
        </div>
      )}
    </article>
  )
}

