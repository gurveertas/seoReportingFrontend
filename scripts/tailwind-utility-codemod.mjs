import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const files = execFileSync('rg', ['--files', 'src', '-g', '*.jsx'], { encoding: 'utf8' }).trim().split(/\r?\n/)
const propertyNames = new Set(`accent-color align-content align-items align-self animation animation-delay backdrop-filter background background-color background-image background-position background-repeat background-size border border-color border-radius border-top-color bottom box-shadow clip clip-path color content cursor display flex flex-direction flex-wrap font font-family font-size font-variant-numeric font-weight gap grid-column grid-template-columns height justify-content justify-items left letter-spacing line-height list-style margin margin-bottom margin-top max-width min-height min-width opacity outline outline-offset padding padding-left padding-right padding-top place-items pointer-events position right stroke stroke-linecap stroke-linejoin stroke-width text-align text-decoration text-overflow text-transform text-underline-offset top transform transition white-space width z-index`.split(' '))

function arbitrary(value) {
  return value.replaceAll(' ', '_')
}

function colorUtility(prefix, value) {
  const match = value.match(/^var\((--[\w-]+)\)$/)
  return match ? `${prefix}-(${match[1]})` : `${prefix}-[${arbitrary(value)}]`
}

function lengthUtility(prefix, value) {
  const exact = {
    '0': '0', '1px': 'px', '2px': '0.5', '3px': '0.75', '4px': '1', '5px': '1.25',
    '6px': '1.5', '7px': '1.75', '8px': '2', '9px': '2.25', '10px': '2.5', '11px': '2.75',
    '12px': '3', '13px': '3.25', '14px': '3.5', '15px': '3.75', '16px': '4', '17px': '4.25',
    '18px': '4.5', '20px': '5', '21px': '5.25', '22px': '5.5', '24px': '6', '28px': '7',
    '32px': '8', '36px': '9', '40px': '10', '42px': '10.5', '44px': '11', '48px': '12',
    '50px': '12.5', '56px': '14', '60px': '15', '64px': '16', '66px': '16.5', '70px': '17.5',
    '72px': '18', '80px': '20', '88px': '22', '96px': '24', '100%': 'full', '100vh': 'screen',
    '100svh': 'svh', 'none': 'none', 'fit-content': 'fit', 'auto': 'auto',
  }
  if (exact[value] !== undefined) return `${prefix}-${exact[value]}`
  return `${prefix}-[${arbitrary(value)}]`
}

function spacing(prefix, raw) {
  const values = raw.split('_')
  if (values.length === 1) return lengthUtility(prefix, values[0])
  const [top, right, bottom = top, left = right] = values
  const parts = []
  if (top === bottom) parts.push(lengthUtility('py', top))
  else { parts.push(lengthUtility('pt', top), lengthUtility('pb', bottom)) }
  if (right === left) parts.push(lengthUtility('px', right))
  else { parts.push(lengthUtility('pr', right), lengthUtility('pl', left)) }
  return parts.join(' ')
}

function declaration(content) {
  if (content.startsWith('&')) return null
  const colon = content.indexOf(':')
  if (colon < 1) return null
  const property = content.slice(0, colon)
  if (!propertyNames.has(property)) return null
  const raw = content.slice(colon + 1)
  const value = raw.replaceAll('_', ' ')
  const n = value.match(/^(\d+(?:\.\d+)?)px$/)?.[1]
  const px = n ? Number(n) : null

  switch (property) {
    case 'display': return ({ flex: 'flex', grid: 'grid', block: 'block', 'inline-flex': 'inline-flex', none: 'hidden' })[value] || null
    case 'position': return ({ absolute: 'absolute', relative: 'relative', fixed: 'fixed', sticky: 'sticky' })[value] || null
    case 'align-items': return ({ center: 'items-center', 'flex-start': 'items-start', start: 'items-start', end: 'items-end', baseline: 'items-baseline', stretch: 'items-stretch' })[value] || null
    case 'align-content': return value === 'start' ? 'content-start' : null
    case 'align-self': return value === 'start' ? 'self-start' : null
    case 'justify-content': return ({ center: 'justify-center', 'space-between': 'justify-between', 'flex-end': 'justify-end' })[value] || null
    case 'justify-items': return value === 'center' ? 'justify-items-center' : null
    case 'place-items': return value === 'center' ? 'place-items-center' : null
    case 'flex-direction': return ({ column: 'flex-col', row: 'flex-row', 'column-reverse': 'flex-col-reverse' })[value] || null
    case 'flex-wrap': return value === 'wrap' ? 'flex-wrap' : value === 'nowrap' ? 'flex-nowrap' : null
    case 'flex': return value === '0 0 auto' ? 'shrink-0 grow-0 basis-auto' : `flex-[${arbitrary(value)}]`
    case 'gap': {
      const [y, x] = value.split(' ')
      return x ? `${lengthUtility('gap-y', y)} ${lengthUtility('gap-x', x)}` : lengthUtility('gap', value)
    }
    case 'grid-template-columns': {
      const predefined = { '1fr': 'grid-cols-1', '1fr 1fr': 'grid-cols-2', 'repeat(2, minmax(0, 1fr))': 'grid-cols-2', 'repeat(3, minmax(0, 1fr))': 'grid-cols-3', 'minmax(0, 1fr)': 'grid-cols-1' }
      return predefined[value] || `grid-cols-[${arbitrary(value)}]`
    }
    case 'grid-column': return value === 'auto' ? 'col-auto' : value === '1 / -1' ? 'col-span-full' : `col-[${arbitrary(value)}]`
    case 'min-width': return value === '0' ? 'min-w-0' : lengthUtility('min-w', value)
    case 'max-width': return value === 'none' ? 'max-w-none' : lengthUtility('max-w', value)
    case 'width': return value === '100%' ? 'w-full' : lengthUtility('w', value)
    case 'height': return lengthUtility('h', value)
    case 'min-height': return lengthUtility('min-h', value)
    case 'max-width': return value === 'none' ? 'max-w-none' : lengthUtility('max-w', value)
    case 'margin': return spacing('m', raw)
    case 'margin-bottom': return lengthUtility('mb', value)
    case 'margin-top': return lengthUtility('mt', value)
    case 'padding': return spacing('p', raw)
    case 'padding-left': return lengthUtility('pl', value)
    case 'padding-right': return lengthUtility('pr', value)
    case 'padding-top': return lengthUtility('pt', value)
    case 'border-radius': return value === '50%' ? 'rounded-full' : `rounded-[${arbitrary(value)}]`
    case 'border': {
      if (value === '0') return 'border-0'
      const borderColor = value.match(/var\((--[\w-]+)\)/)?.[1]
      const style = value.includes('dashed') ? 'border-dashed' : ''
      const width = value.match(/^(\d+px)/)?.[1]
      const color = borderColor ? `border-(${borderColor})` : value.match(/#[\da-fA-F]+/)?.[0] ? `border-[${value.match(/#[\da-fA-F]+/)[0]}]` : ''
      const thickness = width === '1px' ? 'border' : width ? `border-[${width}]` : 'border'
      return [thickness, style, color].filter(Boolean).join(' ')
    }
    case 'border-color': case 'border-top-color': return colorUtility(property === 'border-top-color' ? 'border-t' : 'border', value)
    case 'background': case 'background-color': return value === 'transparent' ? 'bg-transparent' : value.startsWith('var(') ? colorUtility('bg', value) : `bg-[${arbitrary(value)}]`
    case 'background-image': return `bg-[image:${arbitrary(value)}]`
    case 'background-position': return value === 'center' ? 'bg-center' : `bg-[position:${arbitrary(value)}]`
    case 'background-repeat': return value === 'no-repeat' ? 'bg-no-repeat' : `bg-[repeat:${arbitrary(value)}]`
    case 'background-size': return value === 'cover' ? 'bg-cover' : `bg-[size:${arbitrary(value)}]`
    case 'color': return colorUtility('text', value)
    case 'font-family': return value.includes('Manrope') ? 'font-manrope' : value.includes('monospace') ? 'font-mono' : 'font-sans'
    case 'font-size': {
      const standard = { '9px': 'text-[9px]', '10px': 'text-[10px]', '11px': 'text-[11px]', '12px': 'text-xs', '13px': 'text-[13px]', '14px': 'text-sm', '15px': 'text-[15px]', '16px': 'text-base', '17px': 'text-[17px]', '18px': 'text-lg', '19px': 'text-[19px]', '21px': 'text-[21px]', '25px': 'text-[25px]' }
      return standard[value] || `text-[${arbitrary(value)}]`
    }
    case 'font-weight': return px !== null ? `font-[${value}]` : ({ '400': 'font-normal', '600': 'font-semibold', '650': 'font-semibold', '700': 'font-bold', '750': 'font-bold', '800': 'font-extrabold' })[value] || `font-[${value}]`
    case 'font': return null
    case 'font-variant-numeric': return value === 'tabular-nums' ? 'tabular-nums' : null
    case 'letter-spacing': return ({ '-0.035em': 'tracking-[-0.035em]', '-0.045em': 'tracking-[-0.045em]', '-0.05em': 'tracking-[-0.05em]', '-0.055em': 'tracking-[-0.055em]', '-0.06em': 'tracking-[-0.06em]', '0.06em': 'tracking-[0.06em]', '0.08em': 'tracking-[0.08em]', '0.1em': 'tracking-[0.1em]', '0.11em': 'tracking-[0.11em]', '0.13em': 'tracking-[0.13em]' })[value] || `tracking-[${arbitrary(value)}]`
    case 'line-height': return ({ '1': 'leading-none', '1.05': 'leading-[1.05]', '1.08': 'leading-[1.08]', '1.16': 'leading-[1.16]', '1.2': 'leading-[1.2]', '1.5': 'leading-normal', '1.6': 'leading-[1.6]', '1.65': 'leading-[1.65]', '1.7': 'leading-[1.7]' })[value] || `leading-[${arbitrary(value)}]`
    case 'cursor': return ({ pointer: 'cursor-pointer', wait: 'cursor-wait', 'not-allowed': 'cursor-not-allowed' })[value] || null
    case 'overflow': return value === 'hidden' ? 'overflow-hidden' : value === 'auto' ? 'overflow-auto' : null
    case 'text-align': return ({ center: 'text-center', left: 'text-left', right: 'text-right' })[value] || null
    case 'text-transform': return ({ uppercase: 'uppercase', capitalize: 'capitalize', lowercase: 'lowercase' })[value] || null
    case 'text-decoration': return ({ none: 'no-underline', underline: 'underline' })[value] || null
    case 'text-underline-offset': return `underline-offset-[${arbitrary(value)}]`
    case 'text-overflow': return value === 'ellipsis' ? 'text-ellipsis' : null
    case 'white-space': return ({ nowrap: 'whitespace-nowrap', 'pre-wrap': 'whitespace-pre-wrap' })[value] || `whitespace-[${arbitrary(value)}]`
    case 'opacity': return `opacity-[${value}]`
    case 'overflow': return ({ hidden: 'overflow-hidden', auto: 'overflow-auto' })[value] || `overflow-${value}`
    case 'position': return ({ absolute: 'absolute', relative: 'relative', fixed: 'fixed' })[value] || null
    case 'top': case 'right': case 'bottom': case 'left': {
      const scale = { '0': '0', '4px': '1', '8px': '2', '12px': '3', '16px': '4', '18px': '4.5', '20px': '5', '24px': '6' }
      return `${value.startsWith('-') ? '-' : ''}${property}-${scale[value] || `[${arbitrary(value)}]`}`
    }
    case 'z-index': return `z-${value}`
    case 'box-shadow': return value.startsWith('var(') ? `shadow-(${value.slice(4, -1)})` : `shadow-[${arbitrary(value)}]`
    case 'outline': {
      if (value === '0') return 'outline-none'
      const width = value.match(/^(\d+)px/)?.[1]
      const c = value.match(/var\((--[\w-]+)\)/)?.[1] || value.match(/#[\da-fA-F]+/)?.[0]
      return [width ? `outline-${width}` : 'outline', c ? colorUtility('outline', c.startsWith('--') ? `var(${c})` : c) : ''].filter(Boolean).join(' ')
    }
    case 'outline-offset': return `outline-offset-[${arbitrary(value)}]`
    case 'pointer-events': return value === 'none' ? 'pointer-events-none' : 'pointer-events-auto'
    case 'list-style': return value === 'none' ? 'list-none' : `list-[${arbitrary(value)}]`
    case 'transform': {
      if (value === 'translateX(-50%)') return '-translate-x-1/2'
      if (value === 'translateX(0)') return 'translate-x-0'
      if (value === 'translateX(100%)') return 'translate-x-full'
      if (value === 'translateY(-1px)') return '-translate-y-px'
      if (value === 'translate(-50%, -50%)') return '-translate-x-1/2 -translate-y-1/2'
      return `transform-[${arbitrary(value)}]`
    }
    case 'transition': return value === 'none' ? 'transition-none' : `transition-[${arbitrary(value)}]`
    case 'animation': return value === 'none' ? 'animate-none' : `animate-[${arbitrary(value)}]`
    case 'animation-delay': return `delay-[${arbitrary(value)}]`
    case 'backdrop-filter': return value.startsWith('blur(') ? `backdrop-blur-[${value.slice(5, -1)}]` : `backdrop-filter-[${arbitrary(value)}]`
    case 'accent-color': return colorUtility('accent', value)
    case 'stroke': return value === 'currentColor' ? 'stroke-current' : colorUtility('stroke', value)
    case 'stroke-linecap': return `stroke-cap-${value}`
    case 'stroke-linejoin': return `stroke-join-${value}`
    case 'stroke-width': return `stroke-[${arbitrary(value)}]`
    case 'clip': return `clip-[${arbitrary(value)}]`
    case 'clip-path': return `clip-path-[${arbitrary(value)}]`
    case 'content': return `content-['']`
    case 'place-items': return value === 'center' ? 'place-items-center' : null
    case 'flex-wrap': return value === 'wrap' ? 'flex-wrap' : null
    case 'pointer-events': return value === 'none' ? 'pointer-events-none' : null
    default: return null
  }
}

for (const file of files) {
  let source = readFileSync(file, 'utf8')
  source = source.replace(/\[([a-z-]+):([^\]]+)\]/g, (full, property, value) => {
    if (!propertyNames.has(property)) return full
    const converted = declaration(`${property}:${value}`)
    return converted || full
  })
  writeFileSync(file, source)
}
