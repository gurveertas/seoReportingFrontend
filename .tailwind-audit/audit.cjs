const fs = require('node:fs')
const files = fs.readdirSync('src', {recursive:true}).filter(x => /\.(jsx|js)$/.test(x))
const counts = {}
for (const file of files) {
  const input = fs.readFileSync('src/' + file,'utf8')
  for (const match of input.matchAll(/[^\s"'{}`<>]*\[[^\s"'{}`<>]*?\][^\s"'{}`<>]*/g)) {
    const token = match[0]
    if (/(?:^|:)\[|[-:]\[|\]\:/.test(token)) counts[token] = (counts[token] || 0) + 1
  }
}
fs.writeFileSync('.tailwind-audit/tokens.json', JSON.stringify(counts,null,2))
console.log(Object.keys(counts).sort().join('\n'))
