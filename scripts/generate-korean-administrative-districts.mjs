import { readFileSync, writeFileSync } from 'node:fs'

const [, , inputPath, outputPath] = process.argv

if (!inputPath || !outputPath) {
  throw new Error('Usage: node scripts/generate-korean-administrative-districts.mjs <official-cp949-txt> <output-ts>')
}

const source = new TextDecoder('euc-kr').decode(readFileSync(inputPath))
const rows = source
  .split(/\r?\n/)
  .slice(1)
  .map((line) => line.split('\t'))
  .filter(([code, name, status]) => code?.length === 10 && name && status === '존재')
  .map(([code, name]) => ({ code, name }))

const cityNames = new Map(
  rows
    .filter(({ code }) => code.endsWith('00000000'))
    .map(({ code, name }) => [code.slice(0, 2), name]),
)

for (const { code, name } of rows) {
  if (code.endsWith('00000') && !name.includes(' ') && !cityNames.has(code.slice(0, 2))) {
    cityNames.set(code.slice(0, 2), name)
  }
}

const districtNames = new Map(
  rows
    .filter(({ code }) => code.endsWith('00000') && !code.endsWith('00000000'))
    .map(({ code, name }) => [code.slice(0, 5), name]),
)

const districts = {}

for (const { code, name } of rows) {
  if (!code.endsWith('00') || code.endsWith('00000')) continue

  const cityName = cityNames.get(code.slice(0, 2))
  const districtFullName = districtNames.get(code.slice(0, 5))
  if (!cityName || !districtFullName) continue

  const districtName = districtFullName.slice(cityName.length).trim() || cityName
  const neighborhoodName = name.slice(districtFullName.length).trim()
  if (!neighborhoodName) continue

  districts[cityName] ??= {}
  districts[cityName][districtName] ??= []
  if (!districts[cityName][districtName].includes(neighborhoodName)) {
    districts[cityName][districtName].push(neighborhoodName)
  }
}

const generatedAt = new Date().toISOString().slice(0, 10)
const output = `// Generated from the Ministry of the Interior and Safety legal-dong code download.\n// Source: https://www.code.go.kr/stdcode/regCodeL.do\n// Generated: ${generatedAt}; active legal districts only; ri-level entries excluded.\nexport const KOREAN_ADMINISTRATIVE_DISTRICTS: Record<string, Record<string, string[]>> = ${JSON.stringify(districts, null, 2)}\n`

writeFileSync(outputPath, output)
