import { KMA_SHORT_FORECAST_PATH, PUBLIC_DATA_API_KEY } from '../config/publicData'
import { requestPublicJson, PublicDataError } from './apiClient'
import type { KmaForecastItem, KmaForecastResponse } from '../types/api/weather'
import type { WeatherSummary } from '../types/regionalData'

const cache = new Map<string, Promise<WeatherSummary>>()
const asArray = <T,>(value: T | T[] | undefined): T[] => value === undefined ? [] : Array.isArray(value) ? value : [value]

export function getShortForecast(grid: { nx: number; ny: number }, baseDate: string, baseTime: string) {
  const key = `${grid.nx}:${grid.ny}:${baseDate}:${baseTime}`
  const cached = cache.get(key)
  if (cached) return cached
  if (!PUBLIC_DATA_API_KEY) return Promise.reject(new PublicDataError('VITE_PUBLIC_DATA_API_KEY is missing'))
  const request = requestPublicJson<KmaForecastResponse>(KMA_SHORT_FORECAST_PATH, { serviceKey: PUBLIC_DATA_API_KEY, pageNo: 1, numOfRows: 100, dataType: 'JSON', base_date: baseDate, base_time: baseTime, nx: grid.nx, ny: grid.ny })
    .then((response) => {
      if (response.response?.header?.resultCode !== '00') throw new PublicDataError(response.response?.header?.resultMsg ?? 'KMA returned an error')
      const values = new Map(asArray<KmaForecastItem>(response.response?.body?.items?.item).map((item) => [item.category, item]))
      const temperature = Number(values.get('TMP')?.fcstValue)
      return { temperature: Number.isFinite(temperature) ? temperature : undefined, sky: values.get('SKY')?.fcstValue, precipitation: values.get('PTY')?.fcstValue, observedAt: `${values.get('TMP')?.fcstDate ?? baseDate} ${values.get('TMP')?.fcstTime ?? baseTime}` }
    })
  cache.set(key, request)
  request.catch(() => cache.delete(key))
  return request
}