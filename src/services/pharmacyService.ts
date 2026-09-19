import { PHARMACY_LIST_PATH, PUBLIC_DATA_API_KEY, PUBLIC_DATA_DEFAULT_PAGE_SIZE } from '../config/publicData'
import { requestPublicJson, PublicDataError } from './apiClient'
import type { PharmacyApiItem, PharmacyApiResponse } from '../types/api/pharmacy'
import type { Pharmacy } from '../types/regionalData'
import type { Region } from '../types/region'

const cache = new Map<string, Promise<Pharmacy[]>>()
const queries: Record<Region['id'], { Q0: string; Q1: string }> = {
  gangneung: { Q0: '강원특별자치도', Q1: '강릉시' }, tongyeong: { Q0: '경상남도', Q1: '통영시' }, namhae: { Q0: '경상남도', Q1: '남해군' }, sokcho: { Q0: '강원특별자치도', Q1: '속초시' }, seogwipo: { Q0: '제주특별자치도', Q1: '서귀포시' },
}
const asArray = <T,>(value: T | T[] | undefined): T[] => value === undefined ? [] : Array.isArray(value) ? value : [value]
const coordinate = (value: string | undefined) => value && Number.isFinite(Number(value)) ? Number(value) : undefined
const toPharmacy = (item: PharmacyApiItem): Pharmacy | null => item.hpid && item.dutyName ? { id: item.hpid, name: item.dutyName, address: item.dutyAddr, phone: item.dutyTel1, latitude: coordinate(item.wgs84Lat), longitude: coordinate(item.wgs84Lon) } : null

export function getPharmaciesByRegion(regionId: Region['id']) {
  const cached = cache.get(regionId)
  if (cached) return cached
  if (!PUBLIC_DATA_API_KEY) return Promise.reject(new PublicDataError('VITE_PUBLIC_DATA_API_KEY is missing'))
  const query = queries[regionId]
  const request = requestPublicJson<PharmacyApiResponse>(PHARMACY_LIST_PATH, { serviceKey: PUBLIC_DATA_API_KEY, ...query, pageNo: 1, numOfRows: PUBLIC_DATA_DEFAULT_PAGE_SIZE, _type: 'json' })
    .then((response) => {
      if (response.response?.header?.resultCode !== '00') throw new PublicDataError(response.response?.header?.resultMsg ?? 'Pharmacy API returned an error')
      return asArray<PharmacyApiItem>(response.response?.body?.items?.item).map(toPharmacy).filter((item): item is Pharmacy => item !== null)
    })
  cache.set(regionId, request)
  request.catch(() => cache.delete(regionId))
  return request
}