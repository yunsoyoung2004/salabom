import { field, numberField, type RawItem } from '../services/datasetClient'
import type { Festival } from '../types/datasets'
export function toFestival(r: RawItem): Festival {
  const startDate = field(r,'fstvlStartDate'); const endDate = field(r,'fstvlEndDate')
  const today = new Date(Date.now()+9*3600000).toISOString().slice(0,10)
  return { id: `festival:${field(r,'fstvlNm')}:${startDate}`, name: field(r,'fstvlNm'), category: '문화축제', startDate, endDate, venue: field(r,'opar'), description: field(r,'fstvlCo'), address: field(r,'rdnmadr') || field(r,'lnmadr'), latitude: numberField(r,'latitude'), longitude: numberField(r,'longitude'), homepage: field(r,'homepageUrl'), phone: field(r,'phoneNumber'), status: !/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate) ? 'unknown' : endDate < today ? 'expired' : startDate > today ? 'upcoming' : 'current' }
}
