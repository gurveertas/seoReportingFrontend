import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const seriesColors = [
  'var(--chart-series-1)',
  'var(--chart-series-2)',
  'var(--chart-series-3)',
  'var(--chart-series-4)',
]

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function formatAxisValue(value) {
  return new Intl.NumberFormat(undefined, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function makeChartData(chart) {
  if (!Array.isArray(chart?.labels) || !Array.isArray(chart?.datasets)) return null

  const series = chart.datasets.map((dataset, index) => ({
    key: `series_${index}`,
    label: dataset.label || `Series ${index + 1}`,
    color: seriesColors[index % seriesColors.length],
    values: Array.isArray(dataset.data) ? dataset.data : [],
  }))

  const hasNumericValues = series.some((item) =>
    item.values.some((value) => typeof value === 'number' && Number.isFinite(value)),
  )

  if (!chart.labels.length || !series.length || !hasNumericValues) {
    return null
  }

  const data = chart.labels.map((label, index) => {
    const point = { date: label }
    for (const item of series) {
      const value = item.values[index]
      point[item.key] = typeof value === 'number' && Number.isFinite(value) ? value : null
    }
    return point
  })

  return { data, series }
}

export default function AnalyticsChartCard({ title, description, chart }) {
  const chartModel = makeChartData(chart)

  return (
    <article className="min-w-0 overflow-hidden border border-line rounded-xl bg-surface">
      <header className="flex items-start justify-between gap-3 pt-4.5 pb-0 px-4.5">
        <div>
          <h3 className="m-0 text-ink text-xs font-bold">{title}</h3>
          <p className="mt-1.5 mb-0 mx-0 text-ink-muted text-caption">{description}</p>
        </div>
      </header>
      {chartModel ? (
        <div aria-label={`${title}: ${description}`} className="w-full h-chart pt-3.5 pb-0 pl-3 pr-4.5" role="img">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartModel.data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 5" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="date"
                minTickGap={24}
                tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                tickFormatter={formatDate}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                tickFormatter={formatAxisValue}
                tickLine={false}
                width={48}
              />
              <Tooltip
                contentStyle={{
                  border: '1px solid var(--border)',
                  borderRadius: 9,
                  boxShadow: 'var(--shadow-float)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-primary)',
                  fontSize: 12,
                }}
                formatter={(value, name) => [
                  value === null ? '—' : new Intl.NumberFormat().format(value),
                  name,
                ]}
                labelFormatter={formatDate}
              />
              <Legend
                align="left"
                iconType="circle"
                iconSize={7}
                wrapperStyle={{
                  color: 'var(--text-secondary)',
                  fontSize: 11,
                  paddingTop: 14,
                  paddingLeft: 6,
                  paddingRight: 6,
                }}
              />
              {chartModel.series.map((series) => (
                <Line
                  key={series.key}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  connectNulls={false}
                  dataKey={series.key}
                  dot={false}
                  name={series.label}
                  stroke={series.color}
                  strokeWidth={2.5}
                  type="monotone"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="grid min-h-37.5 p-5 place-items-center text-ink-muted text-xs text-center">
          No chart data is available for this period yet.
        </div>
      )}
    </article>
  )
}

