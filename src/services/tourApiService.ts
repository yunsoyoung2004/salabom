import { toPlace } from '../adapters/tourApiAdapter'
import { PUBLIC_DATA_API_KEY, PUBLIC_DATA_DEFAULT_PAGE_SIZE, TOUR_AREA_CODE_PATH, TOUR_AREA_LIST_PATH } from '../config/publicData'
import { requestPublicJson, PublicDataError } from './apiClient'
import type { TourApiItem, TourApiResponse, TourAreaCodeItem, TourAreaCodeResponse } from '../types/api/tour'
import type { Poi } from '../types/regionalData'
import { parseDataset } from './datasetClient'

const cache = new Map<string, Promise<Poi[]>>()
const areaCodeCache = new Map<string, Promise<{ areaCode: string; sigunguCode: string }>>()
const asArray = <T,>(value: T | T[] | undefined): T[] => value === undefined ? [] : Array.isArray(value) ? value : [value]
export const hasTourApiKey = Boolean(PUBLIC_DATA_API_KEY)

function assertSuccess(response: TourApiResponse | TourAreaCodeResponse) {
	parseDataset(response)
	if (response.response?.header?.resultCode !== '0000') throw new PublicDataError(response.response?.header?.resultMsg ?? 'TourAPI returned an error')
}

export function getTourCityCodes(provinceAliases: string[], city: string) {
	const key = `${provinceAliases.join('|')}:${city}`
	const cached = areaCodeCache.get(key)
	if (cached) return cached
	if (!PUBLIC_DATA_API_KEY) return Promise.reject(new PublicDataError('VITE_PUBLIC_DATA_API_KEY is missing'))
	const request = requestPublicJson<TourAreaCodeResponse>(TOUR_AREA_CODE_PATH, { serviceKey: PUBLIC_DATA_API_KEY, MobileOS: 'ETC', MobileApp: 'Salabom', numOfRows: 100, pageNo: 1, _type: 'json' })
		.then((response) => {
			assertSuccess(response)
			const areas = asArray<TourAreaCodeItem>(response.response?.body?.items?.item)
			const area = areas.find((item) => item.name && provinceAliases.includes(item.name))
			if (!area?.code) throw new PublicDataError(`TourAPI area unavailable: ${provinceAliases.join(', ')}`)
			return requestPublicJson<TourAreaCodeResponse>(TOUR_AREA_CODE_PATH, { serviceKey: PUBLIC_DATA_API_KEY, MobileOS: 'ETC', MobileApp: 'Salabom', areaCode: area.code, numOfRows: 100, pageNo: 1, _type: 'json' }).then((cities) => ({ areaCode: area.code!, cities }))
		})
		.then(({ areaCode, cities }) => {
			assertSuccess(cities)
			const cityCode = asArray<TourAreaCodeItem>(cities.response?.body?.items?.item).find((item) => item.name === city)?.code
			if (!cityCode) throw new PublicDataError(`TourAPI sigungu unavailable: ${city}`)
			return { areaCode, sigunguCode: cityCode }
		})
	areaCodeCache.set(key, request)
	request.catch(() => areaCodeCache.delete(key))
	return request
}

export function getTourContent(areaCode: string, sigunguCode?: string) {
	const key = `${areaCode}:${sigunguCode ?? ''}`
	const cached = cache.get(key)
	if (cached) return cached
	if (!PUBLIC_DATA_API_KEY) return Promise.reject(new PublicDataError('VITE_PUBLIC_DATA_API_KEY is missing'))
	const request = requestPublicJson<TourApiResponse>(TOUR_AREA_LIST_PATH, { serviceKey: PUBLIC_DATA_API_KEY, MobileOS: 'ETC', MobileApp: 'Salabom', areaCode, sigunguCode, pageNo: 1, numOfRows: PUBLIC_DATA_DEFAULT_PAGE_SIZE, _type: 'json' })
		.then((response) => {
			assertSuccess(response)
			return asArray<TourApiItem>(response.response?.body?.items?.item).map(toPlace).filter((item): item is Poi => item !== null)
		})
	cache.set(key, request)
	request.catch(() => cache.delete(key))
	return request
}
