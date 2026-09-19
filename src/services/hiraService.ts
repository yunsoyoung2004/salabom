import { HIRA_DETAIL_PATH, HIRA_HOSPITAL_LIST_PATH, PUBLIC_DATA_API_KEY, PUBLIC_DATA_DEFAULT_PAGE_SIZE } from '../config/publicData'
import { medicalRegionQueries, type SupportedRegionId } from '../config/regionCodes'
import { toMedicalInstitution, withHiraDetail } from '../adapters/hiraAdapter'
import { requestPublicJson, PublicDataError } from './apiClient'
import type { HiraDetailItem, HiraDetailResponse, HiraHospitalItem, HiraResponse } from '../types/api/hira'
import type { MedicalInstitution } from '../types/medical'

const hospitalCache = new Map<string, Promise<MedicalInstitution[]>>()
const detailCache = new Map<string, Promise<MedicalInstitution>>()
const asArray = <T,>(value: T | T[] | undefined): T[] => value === undefined ? [] : Array.isArray(value) ? value : [value]

function assertSuccess(response: HiraResponse | HiraDetailResponse) {
  const header = response.response?.header
  if (!response.response || (header?.resultCode && header.resultCode !== '00')) throw new PublicDataError(header?.resultMsg ?? 'HIRA returned an error')
}

export function getHospitalsByRegion(regionId: SupportedRegionId, signal?: AbortSignal) {
  const cached = hospitalCache.get(regionId)
  if (cached) return cached
  if (!PUBLIC_DATA_API_KEY) return Promise.reject(new PublicDataError('VITE_PUBLIC_DATA_API_KEY is missing'))
  const query = medicalRegionQueries[regionId]
  const request = requestPublicJson<HiraResponse>(HIRA_HOSPITAL_LIST_PATH, { serviceKey: PUBLIC_DATA_API_KEY, pageNo: 1, numOfRows: PUBLIC_DATA_DEFAULT_PAGE_SIZE, ...query }, { signal })
    .then((response) => { assertSuccess(response); return asArray<HiraHospitalItem>(response.response?.body?.items?.item).map(toMedicalInstitution).filter((item): item is MedicalInstitution => item !== null) })
  hospitalCache.set(regionId, request)
  request.catch(() => hospitalCache.delete(regionId))
  return request
}

export function getHospitalDetail(institution: MedicalInstitution, signal?: AbortSignal) {
  const cached = detailCache.get(institution.id)
  if (cached) return cached
  if (!PUBLIC_DATA_API_KEY) return Promise.reject(new PublicDataError('VITE_PUBLIC_DATA_API_KEY is missing'))
  const request = requestPublicJson<HiraDetailResponse>(HIRA_DETAIL_PATH, { serviceKey: PUBLIC_DATA_API_KEY, ykiho: institution.id, _type: 'json' }, { signal })
    .then((response) => { assertSuccess(response); return withHiraDetail(institution, asArray<HiraDetailItem>(response.response?.body?.items?.item)) })
  detailCache.set(institution.id, request)
  request.catch(() => detailCache.delete(institution.id))
  return request
}