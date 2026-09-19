import { FESTIVAL_STANDARD_PATH } from '../config/publicData'
import { regionRuntimeConfig, type SupportedRegionId } from '../config/regionCodes'
import { datasetRows, field, uniqueItems } from './datasetClient'
import { toFestival } from '../adapters/festivalAdapter'
export async function getFestivals(id: SupportedRegionId) {
  const config = regionRuntimeConfig[id]
  const rows = await datasetRows(FESTIVAL_STANDARD_PATH, { type: 'json' }, true)
  return uniqueItems(rows.filter(r => {
    const address = `${field(r,'rdnmadr')} ${field(r,'lnmadr')}`
    return address.split(/\s+/).includes(config.city) && config.provinceAliases.some(p => address.split(/\s+/).includes(p))
  }).map(toFestival).filter(r => r.name))
}
