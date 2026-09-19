import { field, numberField, type RawItem } from '../services/datasetClient'
import type { LocalProgram } from '../types/datasets'
export function toRuralExperience(r: RawItem): LocalProgram {
  return { id: `rural:${field(r,'exprnVilageNm')}:${field(r,'rdnmadr')}`, name: field(r,'exprnVilageNm'), category: field(r,'exprnSe') || '농어촌 체험', description: field(r,'exprnCn'), address: field(r,'rdnmadr') || field(r,'lnmadr'), latitude: numberField(r,'latitude'), longitude: numberField(r,'longitude'), homepage: field(r,'homepageUrl'), phone: field(r,'phoneNumber') }
}
