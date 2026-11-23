const PALETTE = [
  'bg-avatar-green-bg text-avatar-green',
  'bg-avatar-blue-bg text-avatar-blue',
  'bg-avatar-ochre-bg text-avatar-ochre',
  'bg-avatar-purple-bg text-avatar-purple',
  'bg-avatar-teal-bg text-avatar-teal',
  'bg-avatar-red-bg text-avatar-red',
]

function hash(value) {
  let total = 0
  for (const char of value) total = (total * 31 + char.charCodeAt(0)) >>> 0
  return total
}

/** Letter tile for a website; colour is stable per name. */
export default function SiteAvatar({ name = '', size = 'md' }) {
  const colors = PALETTE[hash(name) % PALETTE.length]
  const letter = (name.replace(/^(https?:\/\/)?(www\.)?/, '')[0] || '?').toUpperCase()
  const dimensions = size === 'sm' ? 'size-6 rounded-md text-label' : size === 'lg' ? 'size-11 rounded-xl text-lg' : 'size-8 rounded-lg text-xs'
  return (
    <span aria-hidden="true" className={`grid shrink-0 place-items-center font-bold ${dimensions} ${colors}`}>
      {letter}
    </span>
  )
}
