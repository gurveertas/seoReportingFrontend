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
    <article className="analytics-pie-card [min-width:0] [overflow:hidden] [border:1px_solid_var(--border)] [border-radius:11px] [background:var(--surface)] [animation:pie-card-enter_440ms_ease-out_both] [&:nth-child(2)]:[animation-delay:90ms] motion-reduce:[animation:none]">
      <header className="analytics-chart-card__header [display:flex] [align-items:flex-start] [justify-content:space-between] [gap:12px] [padding:17px_18px_0] [&_h3]:[margin:0] [&_h3]:[color:var(--text-primary)] [&_h3]:[font-size:12px] [&_h3]:[font-weight:700] [&_p]:[margin:5px_0_0] [&_p]:[color:var(--text-muted)] [&_p]:[font-size:10px]">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </header>
      {share ? (
        <div className="analytics-pie-card__body [display:grid] [grid-template-columns:minmax(155px,_0.9fr)_minmax(0,_1.1fr)] [align-items:center] [gap:12px] [padding:8px_18px_17px] max-[560px]:[grid-template-columns:minmax(115px,_0.85fr)_minmax(0,_1.15fr)] max-[560px]:[gap:7px] max-[560px]:[padding-right:12px] max-[560px]:[padding-left:12px]">
          <div
            aria-label={chartDescription}
            className="analytics-pie-card__visual [position:relative] [width:100%] [height:208px] [min-width:0] max-[560px]:[height:174px]"
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
            <div className="analytics-pie-card__center [display:grid] [position:absolute] [top:50%] [left:50%] [gap:2px] [transform:translate(-50%,_-50%)] [text-align:center] [pointer-events:none] [&_strong]:[color:var(--text-strong)] [&_strong]:[font-family:'Manrope',_sans-serif] [&_strong]:[font-size:21px] [&_strong]:[font-variant-numeric:tabular-nums] [&_strong]:[font-weight:700] [&_strong]:[letter-spacing:-0.05em] [&_span]:[color:var(--text-muted)] [&_span]:[font-size:10px]" aria-hidden="true">
              <strong>{compactNumberFormatter.format(share.total)}</strong>
              <span>clicks</span>
            </div>
          </div>
          <ul className="analytics-pie-legend [display:grid] [min-width:0] [gap:11px] [margin:0] [padding:0] [list-style:none] [&_li]:[display:grid] [&_li]:[grid-template-columns:8px_minmax(0,_1fr)_auto] [&_li]:[align-items:center] [&_li]:[gap:8px] [&_li]:[min-width:0] max-[560px]:[gap:9px] max-[560px]:[&_li]:[grid-template-columns:7px_minmax(0,_1fr)_auto] max-[560px]:[&_li]:[gap:6px]">
            {share.data.map((item, index) => (
              <li key={item.name}>
                <span
                  aria-hidden="true"
                  className="analytics-pie-legend__swatch [width:8px] [height:8px] [border-radius:50%]"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="analytics-pie-legend__name [overflow:hidden] [color:var(--text-body)] [font-size:10px] [text-overflow:ellipsis] [white-space:nowrap] max-[560px]:[font-size:9px]" title={item.name}>
                  {item.name}
                </span>
                <span className="analytics-pie-legend__value [color:var(--text-secondary)] [font-size:10px] [font-variant-numeric:tabular-nums] [font-weight:650] max-[560px]:[font-size:9px]">
                  {percentFormatter.format((item.value / share.total) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="analytics-chart-card__empty [display:grid] [min-height:150px] [padding:20px] [place-items:center] [color:var(--text-muted)] [font-size:12px] [text-align:center]">
          Click data is not available for this period yet.
        </div>
      )}
    </article>
  )
}

