import { RURAL_EXPERIENCE_PATH } from '../config/publicData'
import { regionRuntimeConfig, type SupportedRegionId } from '../config/regionCodes'
import { datasetRows, field, uniqueItems } from './datasetClient'
import { toRuralExperience } from '../adapters/ruralExperienceAdapter'
export async function getRuralExperiences(id: SupportedRegionId) {
  const c = regionRuntimeConfig[id]
  const rows = await datasetRows(RURAL_EXPERIENCE_PATH, { type:'json', ctprvnNm: c.provinceAliases[0], signguNm: c.city }, true)
  return uniqueItems(rows.filter(r => field(r,'signguNm') === c.city && c.provinceAliases.includes(field(r,'ctprvnNm'))).map(toRuralExperience).filter(r => r.name))
}
