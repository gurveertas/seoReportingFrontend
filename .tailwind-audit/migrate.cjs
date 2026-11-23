const fs = require('node:fs')
const { createRequire } = require('node:module')
const { parse } = createRequire(require.resolve('eslint'))('espree')
const files = fs.readdirSync('src', { recursive: true }).filter(file => file.endsWith('.jsx'))
const missing = new Set()

const colors = {
  ink: 'ink', muted: 'ink-secondary', line: 'line', green: 'accent', 'green-dark': 'accent-hover',
  'text-primary': 'ink', 'text-secondary': 'ink-secondary', 'text-strong': 'ink-strong',
  'text-muted': 'ink-muted', 'text-faint': 'ink-faint', 'text-body': 'ink-body',
  border: 'line', 'border-strong': 'line-strong', 'border-subtle': 'line-subtle',
  '#fff': 'white', '#111713': 'night', '#10191480': 'overlay/50', '#101914a8': 'overlay/65',
  '#f3f6f3': 'mist', '#21372d': 'forest', '#d2dbd4': 'mist-muted', '#d3e2d6': 'mist-label',
  '#a6c794': 'mist-focus', '#ffffff40': 'white/25', '#ffffff42': 'white/26',
}
const color = value => colors[value.replace(/^var\(--(.+)\)$/, '$1')] || value.replace(/^var\(--(.+)\)$/, '$1')
const typography = {
  '9px': 'text-micro', '10px': 'text-caption', '11px': 'text-label', '12px': 'text-xs',
  '13px': 'text-body-sm', '13.5px': 'text-nav', '14px': 'text-sm', '15px': 'text-body-lg',
  '16px': 'text-base', '17px': 'text-brand', '19px': 'text-lg', '21px': 'text-section',
  '22px': 'text-2xl', '25px': 'text-2xl', '28px': 'text-display-sm',
  'clamp(25px,_3vw,_32px)': 'text-metric', 'clamp(30px,_3vw,_38px)': 'text-auth-title',
  'clamp(34px,_6vw,_54px)': 'text-error-title', 'clamp(24px,3vw,30px)': 'text-page-title',
}
const tracking = {
  '-0.06em': 'tighter', '-0.055em': 'tighter', '-0.05em': 'tighter', '-0.045em': 'tight',
  '-0.04em': 'tight', '-0.035em': 'tight', '-0.03em': 'tight', '0.04em': 'wide',
  '0.06em': 'wider', '0.08em': 'wider', '0.1em': 'widest', '0.11em': 'widest',
  '0.13em': 'eyebrow', '0.14em': 'eyebrow',
}
const grid = {
  '1fr': '1', 'minmax(0,_1fr)': '1', '1fr_1fr': '2',
  'repeat(2,_minmax(0,_1fr))': '2', 'repeat(3,_minmax(0,_1fr))': '3',
  'minmax(155px,_0.9fr)_minmax(0,_1.1fr)': 'pie',
  'minmax(115px,_0.85fr)_minmax(0,_1.15fr)': 'pie-compact',
  '8px_minmax(0,_1fr)_auto': 'legend', '7px_minmax(0,_1fr)_auto': 'legend',
  'minmax(170px,_0.7fr)_minmax(0,_2fr)': 'refresh-summary',
  'minmax(420px,_0.8fr)_minmax(460px,_1.2fr)': 'auth',
  'minmax(370px,_1fr)_minmax(330px,_0.9fr)': 'auth-compact',
  'auto_minmax(0,1fr)_minmax(200px,260px)_auto': 'site-row',
  'auto_minmax(0,1fr)': 'site-row-compact', '1.1fr_1fr': 'link-site',
}
const breakpoints = { 380: 'compact-phone', 420: 'phone', 480: 'dialog', 520: 'settings', 560: 'analytics', 700: 'auth-stack', 760: 'site-row', 820: 'charts', 900: 'auth-compact' }
const radius = { '6px': 'md', '7px': 'lg', '8px': 'lg', '9px': 'lg', '10px': 'xl', '11px': 'xl', '12px': 'xl', '13px': 'xl', '18px': '2xl', '20px': '2xl', '22px': '3xl', '50%': 'full' }
const sizes = { '100%': 'full', '50%': '1/2', '100vh': 'screen', '100svh': 'svh', 'fit-content': 'fit', none: 'none', 'calc(50%_-_4px)': 'tab-slider', 'min(440px,_calc(100%_-_32px))': 'report-dialog', 'min(590px,_100%)': 'full' }
const animations = {
  'auth-slide-from-left_280ms_ease-out_both': 'auth-from-left',
  'auth-slide-from-right_280ms_ease-out_both': 'auth-from-right',
  'pie-card-enter_440ms_ease-out_both': 'pie-enter',
  'session-check-spin_800ms_linear_infinite': 'session-spin',
  'refresh-icon-spin_850ms_linear_infinite': 'refresh-spin',
  none: 'none',
}
const direct = {
  'align-content:start': 'content-start', 'align-self:start': 'self-start',
  'justify-items:center': 'justify-items-center', 'place-items:center': 'place-items-center',
  'flex:0_0_auto': 'flex-none', 'font:inherit': '', 'font-variant-numeric:tabular-nums': 'tabular-nums',
  'flex-direction:column': 'flex-col', 'flex-wrap:wrap': 'flex-wrap', 'z-index:1': 'z-10',
  'list-style:none': 'list-none', 'user-select:none': 'select-none', 'text-overflow:ellipsis': 'text-ellipsis',
  'text-decoration:none': 'no-underline', 'text-decoration:underline': 'underline', 'text-underline-offset:2px': 'underline-offset-2',
  'background-position:center': 'bg-center', 'background-repeat:no-repeat': 'bg-no-repeat', 'background-size:cover': 'bg-cover',
  'background-image:linear-gradient(135deg,_#101914c7,_#10191469),_var(--not-found-background)': 'bg-not-found-photo',
  'backdrop-filter:blur(8px)': 'backdrop-blur-sm', 'backdrop-filter:blur(3px)': 'backdrop-blur-dialog',
  'box-shadow:0_24px_70px_#0005': 'shadow-not-found', 'box-shadow:var(--shadow-float)': 'shadow-panel',
  'box-shadow:0_1px_3px_#1d29251a': 'shadow-tab',
  'box-shadow:0_0_0_3px_color-mix(in_srgb,_var(--accent)_12%,_transparent)': 'ring-3 ring-accent/12',
  'scrollbar-color:var(--border-strong)_transparent': 'scrollbar-thumb-line-strong scrollbar-track-transparent',
  'scrollbar-width:thin': 'scrollbar-thin', 'vertical-align:middle': 'align-middle',
  'grid-column:1_/_-1': 'col-span-full', 'grid-column:auto': 'col-auto',
  'transition:none': 'transition-none', 'transition:transform_220ms_ease': 'transition-transform duration-220',
  'transform:translate(-50%,_-50%)': '-translate-1/2', 'transform:translateY(-1px)': '-translate-y-px',
  'transform:rotate(45deg)_translateY(-2px)': 'rotate-45 -translate-y-0.5',
  'transform:rotate(225deg)_translate(-2px,_-1px)': 'rotate-225 -translate-x-0.5 -translate-y-px',
  'transform:translateX(100%)': 'translate-x-full', 'transform:translateX(0)': 'translate-x-0',
  "content:''": '', 'animation-delay:90ms': 'animate-pie-enter-delayed',
  'border-collapse:collapse': 'border-collapse',
}
const namedDimensions = {
  'max-width:360px': 'max-w-auth-form', 'max-width:390px': 'max-w-error-copy',
  'height:282px': 'h-chart', 'height:174px': 'h-pie-compact',
}
const exact = {
  'font-[Manrope,sans-serif]': 'font-heading', 'backdrop-blur-[2px]': 'backdrop-blur-xs',
  'transition-[padding]': 'transition-all', 'transition-[width,transform]': 'transition-all',
  'max-h-[calc(100%-2rem)]': 'max-h-inset-dialog', 'max-h-[min(90vh,900px)]': 'max-h-client-dialog',
  'w-[calc(100%-2rem)]': 'w-inset-dialog', 'w-[min(760px,100%)]': 'w-full max-w-charts',
  'max-w-[1240px]': 'max-w-workspace', 'max-w-[940px]': 'max-w-settings',
  'min-w-[680px]': 'min-w-sites-table', 'min-w-[720px]': 'min-w-reports-table',
  'bg-[image:var(--auth-background)]': 'bg-auth-photo',
}
const units = value => value === 'auto' ? 'auto' : value === '0' ? '0' : Math.round(parseFloat(value) / 2) / 2
const space = (value, prefix) => {
  const number = units(value)
  return typeof number === 'number' && number < 0 ? `-${prefix}-${-number}` : `${prefix}-${number}`
}
const spacing = (value, prefix) => {
  const [top, right = top, bottom = top, left = right] = value.split('_')
  if (top === right && top === bottom && top === left) return space(top, prefix)
  return [
    ...(top === bottom ? [space(top, prefix + 'y')] : [space(top, prefix + 't'), space(bottom, prefix + 'b')]),
    ...(left === right ? [space(left, prefix + 'x')] : [space(left, prefix + 'l'), space(right, prefix + 'r')]),
  ].join(' ')
}
function property(key, value) {
  const combined = `${key}:${value}`
  if (combined in direct) return direct[combined]
  if (combined in namedDimensions) return namedDimensions[combined]
  if (key.startsWith('--')) return ''
  if (['display', 'position'].includes(key)) return value
  if (key === 'align-items') return 'items-' + value.replace('flex-', '')
  if (key === 'justify-content') return 'justify-' + value.replace('flex-', '').replace('space-', '')
  if (['background', 'background-color', 'color', 'accent-color', 'border-color', 'border-top-color', 'stroke'].includes(key)) {
    const prefix = { color: 'text', 'accent-color': 'accent', 'border-color': 'border', 'border-top-color': 'border-t', stroke: 'stroke' }[key] || 'bg'
    return prefix + '-' + (value === 'currentColor' ? 'current' : color(value))
  }
  if (key === 'stroke-linecap' || key === 'stroke-linejoin') return ''
  if (key === 'stroke-width') return value === '2' ? 'stroke-2' : 'stroke-ui'
  if (key === 'font-family') return value.includes('Manrope') ? 'font-heading' : 'font-sans'
  if (key === 'font-size' && typography[value]) return typography[value]
  if (key === 'font-weight') return 'font-' + ({ 400: 'normal', 550: 'medium', 600: 'semibold', 650: 'medium-bold', 700: 'bold', 750: 'bold-heavy', 800: 'extrabold' })[value]
  if (key === 'letter-spacing' && tracking[value]) return 'tracking-' + tracking[value]
  if (key === 'line-height') return 'leading-' + ({ 1: 'none', 1.05: 'tight-display', 1.08: 'tight-display', 1.2: 'tight', 1.4: 'snug', 1.5: 'normal', 1.6: 'relaxed', 1.65: 'relaxed', 1.7: 'relaxed' })[value]
  if (key === 'grid-template-columns' && grid[value]) return 'grid-cols-' + grid[value]
  if (key === 'border-radius') return 'rounded-' + radius[value]
  if (key === 'animation') return 'animate-' + animations[value]
  if (key === 'padding' && value.includes('clamp')) return value.startsWith('48px') ? 'px-auth-gutter py-12' : 'p-error-gutter'
  if (key === 'padding' || key === 'margin') return spacing(value, key[0])
  if (/^(padding|margin)-(top|bottom|left|right)$/.test(key)) return space(value, key[0] + key.split('-')[1][0])
  if (key === 'gap') return value.includes('_') ? 'gap-x-5 gap-y-2.5' : space(value, 'gap')
  if (key === 'max-width' && value === '50%') return 'max-w-1/2'
  const dimension = {width:'w',height:'h','min-width':'min-w','max-width':'max-w','min-height':'min-h','max-height':'max-h',top:'top',bottom:'bottom',left:'left',right:'right'}[key]
  if (dimension) return dimension + '-' + (sizes[value] || units(value))
  if (/^border(?:-(?:top|right|bottom))?$/.test(key)) {
    if (value === '0') return 'border-0'
    const [width, style, tone] = value.split('_')
    const prefix = key.replace('top', 't').replace('right', 'r').replace('bottom', 'b')
    return [prefix + (width === '1px' ? '' : width === '1.5px' ? '-2' : '-' + parseInt(width)), style === 'dashed' ? 'border-dashed' : '', 'border-' + color(tone)].filter(Boolean).join(' ')
  }
  if (key === 'outline') {
    if (value === '0') return 'outline-none'
    return 'outline-3 outline-' + color(value.split('_').at(-1))
  }
  if (key === 'outline-offset') return value[0] === '-' ? '-outline-offset-' + parseInt(value.slice(1)) : 'outline-offset-' + parseInt(value)
  if (key === 'transition') {
    const ms = value.match(/(\d+)ms/)[1]
    const type = value.startsWith('transform') ? 'transition-transform' : value.includes('box-shadow') ? 'transition' : value.includes('transform') ? 'transition' : 'transition-colors'
    return `${type} duration-${ms}`
  }
  if (['overflow', 'overflow-x', 'pointer-events', 'white-space', 'cursor'].includes(key)) return key.replace('white-space', 'whitespace') + '-' + value
  if (key === 'text-transform') return value
  if (key === 'text-align') return 'text-' + value
  if (key === 'opacity') return 'opacity-' + Math.round(Number(value) * 100)
  missing.add(combined)
  return ''
}

const variants = {
  '&:hover': 'hover', '&:hover:not(:disabled)': 'enabled:hover', '&:disabled': 'disabled',
  '&:focus': 'focus', '&:focus-visible': 'focus-visible', '&::placeholder': 'placeholder',
  '&::backdrop': 'backdrop', '&::before': 'before', '&:last-child': 'last',
  '&:last-child:nth-child(odd)': 'last:odd', '&:nth-child(2)': 'nth-2',
  '&::-webkit-details-marker': 'marker', '&.is-active': 'aria-selected',
  '&[aria-busy=\'true\']_svg': 'group-aria-busy',
}

function splitVariants(token) {
  const parts = []
  let depth = 0
  let start = 0
  for (let index = 0; index < token.length; index += 1) {
    if (token[index] === '[') depth += 1
    if (token[index] === ']') depth -= 1
    if (token[index] === ':' && depth === 0) {
      parts.push(token.slice(start, index))
      start = index + 1
    }
  }
  parts.push(token.slice(start))
  return parts
}

function utility(value, hasVariants) {
  if (exact[value]) return exact[value]
  if (!value.includes('[')) {
    if (!hasVariants && /^(auth-|analytics-|dashboard-|form-field|integration-settings-|kpi-|not-found-|period-|refresh-summary|report-ready-|session-check|settings-|source-status-|is-(active|numeric))/.test(value)) return ''
    return value.replace(/([a-z-]+)-\(--([a-z-]+)\)/g, (_, prefix, tone) => prefix + '-' + (prefix === 'shadow' ? 'panel' : color(tone)))
  }
  if (value.startsWith('[')) {
    const colon = value.indexOf(':')
    return property(value.slice(1, colon), value.slice(colon + 1, -1))
  }
  const [, prefix, argument] = value.match(/^(.+?)-\[(.*)\]$/) || []
  if (prefix === 'text' && typography[argument]) return typography[argument]
  if (prefix === 'grid-cols' && grid[argument]) return 'grid-cols-' + grid[argument]
  if (prefix === 'tracking') return 'tracking-' + tracking[argument.replace('.', '0.').replace('-0.', '-0.')]
  if (['w', 'size', 'pl', 'z'].includes(prefix)) return prefix === 'z' ? `z-${argument}` : space(argument, prefix)
  missing.add(value)
  return ''
}

function matchesSelector(entry, selector, ancestor) {
  const [, tag, nested] = selector.match(/^&(?:>_||_)([a-z0-9]+)(?:_([a-z0-9]+))?$/) || []
  if (!tag) return false
  const tagMatch = (item, expected) => expected === 'svg' ? item.tag === 'svg' || item.tag === 'Icon' || item.tag.endsWith('Icon') : item.tag === expected || (expected === 'a' && item.tag === 'Link')
  if (!tagMatch(entry, nested || tag)) return false
  if (nested) return tagMatch(entry.parent ?? {}, tag) && (!selector.startsWith('&>_') || entry.parent.parent === ancestor)
  return !selector.startsWith('&>_') || entry.parent === ancestor
}

function migrateToken(token, entry, entries) {
  const parts = splitVariants(token)
  const base = utility(parts.pop(), parts.length > 0)
  if (!base) return ''
  const prefix = []
  let selector
  for (const part of parts) {
    const breakpoint = part.match(/^max-\[(\d+)px\]$/)
    if (breakpoint) prefix.push('max-' + breakpoints[breakpoint[1]])
    else if (part === '[&.dashboard-eyebrow]' || part === '[&.is-numeric]' || part === '[&.is-positive]' || part === '[&.is-negative]' || part === '[&.is-neutral]' || part === '[&.is-unavailable]') return ''
    else if (part.includes('_tbody_tr')) {
      selector = '&_tr'
      if (part.includes('even')) prefix.push('even')
      if (part.includes('hover')) prefix.push('hover')
    } else if (part === '[&>:first-child]') {
      const target = entries.find(candidate => candidate.parent === entry)
      if (target) target.add.push('max-sm:col-span-2')
      return ''
    } else if (part.startsWith('[&_button.is-active]')) {
      selector = '&_button'
      prefix.push('aria-pressed')
    } else if (part.includes('analytics-table-card__')) {
      entry.add.push('group')
      const target = entries.find(candidate => candidate.parent && candidate.raw?.includes(part.includes('chevron') ? 'analytics-table-card__chevron' : 'analytics-table-card__row-count'))
      if (target) target.add.push(...base.split(' ').map(item => `${part.includes('[open]') ? 'group-open/table' : 'group-hover/summary'}:${item}`))
      return ''
    } else if (part === "[&[aria-busy='true']_svg]") {
      selector = '&_svg'
      entry.add.push('group')
      prefix.push('group-aria-busy')
    } else if (variants[part]) prefix.push(variants[part])
    else if (part.startsWith('[&_') || part.startsWith('[&>_')) {
      const match = part.slice(1, -1).match(/^(.*?)(?:::?(focus-visible|focus|disabled|placeholder|first-child|last-child))?$/)
      selector = match[1]
      if (match[2]) prefix.push(match[2] === 'first-child' ? 'first' : match[2] === 'last-child' ? 'last' : match[2])
    } else prefix.push(part)
  }
  const output = base.split(' ').filter(Boolean).map(item => [...prefix, item].join(':')).join(' ')
  if (selector) {
    const descendants = entries.filter(candidate => {
      let parent = candidate.parent
      while (parent && parent !== entry) parent = parent.parent
      return parent === entry && matchesSelector(candidate, selector, entry) && (selector !== '&_tr' || candidate.parent?.tag === 'tbody')
    })
    for (const descendant of descendants) descendant.add.push(...output.split(' '))
    return ''
  }
  return output
}

function walk(node, visit) {
  if (!node || typeof node.type !== 'string') return
  visit(node)
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach(child => walk(child, visit))
    else walk(value, visit)
  }
}

for (const file of files) {
  const path = 'src/' + file
  const input = fs.readFileSync(path, 'utf8')
  const ast = parse(input, { ecmaVersion: 'latest', sourceType: 'module', range: true, ecmaFeatures: { jsx: true } })
  const entries = []
  walk(ast, node => {
    if (!['JSXElement', 'JSXFragment'].includes(node.type)) return
    const opening = node.openingElement
    const attr = opening?.attributes.find(item => item.name?.name === 'className')
    const entry = { node, opening, attr, tag: opening?.name.name ?? '', raw: attr && input.slice(...attr.range), add: [], replacements: [] }
    entry.parent = entries.findLast(candidate => candidate.node.range[0] < node.range[0] && candidate.node.range[1] >= node.range[1])
    entries.push(entry)
  })
  const update = (raw, entry) => {
    const [leading] = raw.match(/^\s*/)
    const [trailing] = raw.match(/\s*$/)
    const tokens = raw.trim().split(/\s+/).filter(Boolean)
    const values = tokens.flatMap(token => migrateToken(token, entry, entries).split(' ')).filter(Boolean)
    return leading + [...new Set(values)].join(' ') + trailing
  }
  for (const entry of entries) {
    const attr = entry.attr
    if (!attr) continue
    if (attr.value?.type === 'Literal') {
      const [start, end] = attr.value.range
      entry.replacements.push([start + 1, end - 1, update(attr.value.value, entry)])
    } else walk(attr.value, node => {
      if (node.type === 'TemplateElement') entry.replacements.push([node.range[0] + 1, node.range[1] - (node.tail ? 1 : 2), update(node.value.raw, entry)])
      if (node.type === 'Literal' && typeof node.value === 'string' && (/\[|^ is-active|^ auth-tabs--|^is-numeric|\(--/.test(node.value))) {
        entry.replacements.push([node.range[0] + 1, node.range[1] - 1, update(node.value, entry)])
      }
    })
  }
  const edits = []
  for (const entry of entries) {
    const { opening, attr, replacements } = entry
    if (!opening) continue
    const extra = [...new Set(entry.add)].filter(item => item !== 'group').join(' ')
    const isTable = entry.raw?.includes('analytics-table-card [')
    const isSummary = entry.raw?.includes('analytics-table-card__header [')
    const group = isTable ? 'group/table' : isSummary ? 'group/summary' : entry.add.includes('group') ? 'group' : ''
    const additions = [extra, group].filter(Boolean).join(' ')
    if (!attr) {
      if (additions) edits.push([opening.name.range[1], opening.name.range[1], ` className="${additions}"`])
      continue
    }
    const [start, end] = attr.range
    let output = input.slice(start, end)
    for (const [from, to, replacement] of replacements.sort((a,b) => b[0] - a[0])) {
      output = output.slice(0, from - start) + replacement + output.slice(to - start)
    }
    if (additions) {
      if (attr.value.type === 'Literal') output = output.slice(0,-1) + ' ' + additions + output.slice(-1)
      else if (attr.value.expression.type === 'TemplateLiteral') output = output.slice(0,-2) + ' ' + additions + output.slice(-2)
      else output = `className={\`${additions} \${${output.slice(11,-1)} ?? ''}\`}`
    }
    output = output.replace(/(?:\$\{isSignup \? ' +' : ''\}|\$\{!isSignup \? ' +' : ''\})/g, '').replace(/ +(["`])$/, '$1').replace(/^(className=["`]) +/, '$1')
    if (output === 'className=""') {
      const removalStart = input[start - 1] === ' ' ? start - 1 : start
      edits.push([removalStart, end, ''])
    } else edits.push([start, end, output])
  }
  if (process.argv.includes('--write')) {
    let result = input
    for (const [start, end, output] of edits.sort((a,b) => b[0] - a[0])) result = result.slice(0,start) + output + result.slice(end)
    if (result !== input) fs.writeFileSync(path, result)
  }
}
console.log([...missing].sort().join('\n'))
