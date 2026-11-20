const PALETTE = [
  ['#e8f2eb', '#2f6b48'],
  ['#e9eef6', '#3d5f86'],
  ['#f5eee3', '#8a6431'],
  ['#f1e9f3', '#76508a'],
  ['#e6f1f1', '#2f6e6e'],
  ['#f6e9e7', '#9a4a3e'],
]

function hash(value) {
  let total = 0
  for (const char of value) total = (total * 31 + char.charCodeAt(0)) >>> 0
  return total
}

/** Letter tile for a website; colour is stable per name. */
export default function SiteAvatar({ name = '', size = 'md' }) {
  const [bg, fg] = PALETTE[hash(name) % PALETTE.length]
  const letter = (name.replace(/^(https?:\/\/)?(www\.)?/, '')[0] || '?').toUpperCase()
  const dimensions = size === 'sm' ? 'size-6 text-[11px] rounded-md' : size === 'lg' ? 'size-11 text-lg rounded-xl' : 'size-8 text-xs rounded-lg'
  return (
    <span aria-hidden="true" className={`grid shrink-0 place-items-center font-bold ${dimensions}`} style={{ background: bg, color: fg }}>
      {letter}
    </span>
  )
}
