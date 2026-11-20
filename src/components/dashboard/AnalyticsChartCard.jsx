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
    <article className="analytics-chart-card">
      <header className="analytics-chart-card__header">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </header>
      {chartModel ? (
        <div className="analytics-chart-card__canvas">
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
        <div className="analytics-chart-card__empty">
          No chart data is available for this period yet.
        </div>
      )}
    </article>
  )
}
