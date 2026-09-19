import { field, numberField, type RawItem } from '../services/datasetClient'
import type { VisitorSummary } from '../types/datasets'
export function toVisitor(rows: RawItem[]): VisitorSummary | null {
  // Keep one visitor category and one day; never sum incompatible populations or days.
  const valid = rows.filter(r => (numberField(r, 'touNum') ?? -1) >= 0).sort((a,b) => field(b,'baseYmd').localeCompare(field(a,'baseYmd')) || field(a,'touDivCd').localeCompare(field(b,'touDivCd')))
  const row = valid.find(r => field(r,'touDivNm').includes('외지인')) ?? valid[0]
  if (!row) return null
  const dailyVisitors = numberField(row, 'touNum')!
  return { dailyVisitors, date: field(row,'baseYmd'), category: field(row,'touDivNm'), regionalActivityScore: Math.round(Math.min(100, Math.log10(1 + dailyVisitors) / 6 * 100)) }
}
