import { VISITOR_REGION_PATH } from '../config/publicData'
import { regionRuntimeConfig, type SupportedRegionId } from '../config/regionCodes'
import { datasetRows, field } from './datasetClient'
import { toVisitor } from '../adapters/visitorAdapter'
export async function getVisitors(id: SupportedRegionId) {
  const config = regionRuntimeConfig[id]
  // Publication lag: sample the last day of each of the three preceding months.
  for (let lag = 1; lag <= 3; lag++) {
    const now = new Date(Date.now() + 9 * 3600000)
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - lag + 1, 0)).toISOString().slice(0,10).replaceAll('-','')
    const rows = await datasetRows(VISITOR_REGION_PATH, { MobileOS: 'ETC', MobileApp: 'Salabom', _type: 'json', startYmd: date, endYmd: date })
    const result = toVisitor(rows.filter(r => field(r,'signguNm') === config.city))
    if (result) return result
  }
  return null
}
