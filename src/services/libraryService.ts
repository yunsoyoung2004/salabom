import { LIBRARY_STANDARD_PATH } from '../config/publicData'
import { regionRuntimeConfig, type SupportedRegionId } from '../config/regionCodes'
import { datasetRows, field, uniqueItems } from './datasetClient'
import { toLibrary } from '../adapters/libraryAdapter'
export async function getLibraries(id: SupportedRegionId) {
  const c = regionRuntimeConfig[id]
  const rows = await datasetRows(LIBRARY_STANDARD_PATH, { type:'json', CTPRVN_NM: c.provinceAliases[0], SIGNGU_NM: c.city }, true)
  return uniqueItems(rows.filter(r => field(r,'signguNm') === c.city && c.provinceAliases.includes(field(r,'ctprvnNm'))).map(toLibrary).filter(r => r.name))
}
