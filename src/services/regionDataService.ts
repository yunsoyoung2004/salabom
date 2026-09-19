import { getVisitors } from './visitorService'
import { getHousing } from './housingService'
import { getFestivals } from './festivalService'
import { getRuralExperiences } from './ruralExperienceService'
import { getLibraries } from './libraryService'
import { PublicDataError } from './apiClient'
import type { SupportedRegionId } from '../config/regionCodes'
import { getHospitalsByRegion } from './hiraService'
import { calculateMedicalAccessibility } from './medicalAccessibilityService'
import { getPharmaciesByRegion } from './pharmacyService'
import { getTourCityCodes, getTourContent } from './tourApiService'
import { getShortForecast } from './weatherService'
import { regionRuntimeConfig } from '../config/regionCodes'
import type { Region } from '../types/region'
import type { RegionLivingData, SourceResult } from '../types/regionalData'

const failure = <T,>(data: T, error: unknown): SourceResult<T> => ({ data, source: error instanceof PublicDataError ? error.state : 'error', reason: error instanceof Error ? error.message : 'Unknown error' })
async function source<T>(promise: Promise<T>, empty: T): Promise<SourceResult<T>> {
  try { const data = await promise; return { data, source: data === null || (Array.isArray(data) && !data.length) ? 'empty' : 'live' } }
  catch (error) { return failure(empty, error) }
}
const cache = new Map<string, {at: number; promise: Promise<RegionLivingData>}>()
export function getRegionLivingData(region: Region): Promise<RegionLivingData> {
  const existing = cache.get(region.id)
  if (existing && Date.now()-existing.at < 300000) return existing.promise
  const promise = loadRegionLivingData(region)
  cache.set(region.id, {at: Date.now(), promise})
  return promise
}

function latestForecastBase() {
  const korea = new Date(Date.now() + 9 * 60 * 60 * 1000)
  const cycles = [23, 20, 17, 14, 11, 8, 5, 2]
  const hour = korea.getUTCHours()
  const minute = korea.getUTCMinutes()
  const latestHour = minute < 10 ? hour - 1 : hour
  const cycle = cycles.find((value) => value <= latestHour) ?? 23
  if (latestHour < 2) korea.setUTCDate(korea.getUTCDate() - 1)
  return { baseDate: korea.toISOString().slice(0, 10).replaceAll('-', ''), baseTime: `${String(cycle).padStart(2, '0')}00` }
}

async function loadRegionLivingData(region: Region): Promise<RegionLivingData> {
  const config = regionRuntimeConfig[region.id as keyof typeof regionRuntimeConfig]
  const hospitalsPromise = getHospitalsByRegion(region.id as Parameters<typeof getHospitalsByRegion>[0]).then((data) => ({ data, source: data.length ? 'live' as const : 'empty' as const })).catch((error: unknown) => failure([], error))
  const pharmaciesPromise = getPharmaciesByRegion(region.id).then((data) => ({ data, source: data.length ? 'live' as const : 'empty' as const })).catch((error: unknown) => failure([], error))
  const tourismPromise = getTourCityCodes(config.provinceAliases, config.city)
    .then(({ areaCode, sigunguCode }) => getTourContent(areaCode, sigunguCode))
    .then((data) => ({ data, source: data.length ? 'live' as const : 'empty' as const }))
    .catch((error: unknown) => failure([], error))
  const { baseDate, baseTime } = latestForecastBase()
  const weatherPromise = getShortForecast(config.forecastGrid, baseDate, baseTime).then((data) => ({ data, source: 'live' as const })).catch((error: unknown) => failure(null, error))
  const id = region.id as SupportedRegionId
  const [hospitals, pharmacies, tourism, weather, visitor, housing, festival, ruralExperience, library] = await Promise.all([hospitalsPromise, pharmaciesPromise, tourismPromise, weatherPromise, source(getVisitors(id), null), source(getHousing(id), null), source(getFestivals(id), []), source(getRuralExperiences(id), []), source(getLibraries(id), [])])
  if (housing.data?.failures.length) { housing.source = 'fallback'; housing.reason = housing.data.failures.join('; ') }
  const medical = { institutions: hospitals.data, accessibility: calculateMedicalAccessibility(hospitals.data, pharmacies.source === 'live' ? pharmacies.data.length : 0), source: hospitals.source, reason: 'reason' in hospitals ? hospitals.reason : undefined }
  if (import.meta.env.DEV) console.info('[Salabom Data Audit]', { region: region.city, TourAPI: `${tourism.source} (${tourism.data.length})`, HIRA: `${hospitals.source} (${hospitals.data.length})`, Pharmacy: `${pharmacies.source} (${pharmacies.data.length})`, WeatherShort: weather.source })
  return { medical, pharmacies, tourism, weather, visitor, housing, festival, ruralExperience, library, sources: { tourApi: tourism.source, hospital: hospitals.source, pharmacy: pharmacies.source, weatherShort: weather.source, visitor: visitor.source, housing: housing.source, festival: festival.source, ruralExperience: ruralExperience.source, library: library.source } }
}