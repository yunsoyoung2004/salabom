import { APARTMENT_RENT_PATH, OFFICETEL_RENT_PATH } from '../config/publicData'
import { regionRuntimeConfig, type SupportedRegionId } from '../config/regionCodes'
import { datasetRows } from './datasetClient'
import { median, toRental } from '../adapters/housingAdapter'
import type { HousingSummary } from '../types/datasets'
import { PublicDataError } from './apiClient'
export async function getHousing(id: SupportedRegionId): Promise<HousingSummary | null> {
  const now = new Date(Date.now() + 9 * 3600000)
  const months = Array.from({length:6}, (_,i) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth()-i-1, 1)).toISOString().slice(0,7).replace('-',''))
  const rows = []; const failures: string[] = []; let firstError: unknown
  for (const month of months) {
    const results = await Promise.allSettled([APARTMENT_RENT_PATH, OFFICETEL_RENT_PATH].map(path => datasetRows(path, { LAWD_CD: regionRuntimeConfig[id].lawdCode, DEAL_YMD: month })))
    for (const [index, result] of results.entries()) {
      if (result.status === 'fulfilled') rows.push(...result.value)
      else { firstError ??= result.reason; failures.push(`${month} ${index === 0 ? 'apartment' : 'officetel'}: ${result.reason instanceof Error ? result.reason.message : 'error'}`) }
    }
  }
  const rentals = rows.map(toRental).filter(x => x !== null)
  if (rows.length && !rentals.length) throw new PublicDataError('Rental rows have no valid deposit/monthlyRent fields', 'api_response_mismatch')
  if (!rentals.length) { if (firstError) throw firstError; return null }
  // Transparent comparison assumption: 4% annual deposit opportunity cost, not a lodging quote.
  const regionalHousingCost = Math.round(median(rentals.map(r => r.monthlyRent + r.deposit * .04/12))!)
  return { regionalHousingCost, housingAffordabilityScore: Math.round(100 / (1 + regionalHousingCost/1000000)), medianDeposit: median(rentals.map(r=>r.deposit))!, medianMonthlyRent: median(rentals.map(r=>r.monthlyRent))!, medianArea: median(rentals.flatMap(r=>r.area === undefined ? [] : [r.area])), transactionCount: rentals.length, months, failures }
}
