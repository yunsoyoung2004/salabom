import type { Region } from '../types/region'
import type { RegionLivingData } from '../types/regionalData'
export function livingScores(region: Region, data: RegionLivingData | null) {
  const scores = {...region.suitability}
  if (data?.housing.source === 'live' && data.housing.data) scores.housing = data.housing.data.housingAffordabilityScore
  if (data?.library.source === 'live') scores.workation = Math.round(region.suitability.workation * .8 + Math.min(100, data.library.data.length * 10) * .2)
  const activity = data?.visitor.source === 'live' ? data.visitor.data?.regionalActivityScore : undefined
  scores.overall = Math.max(0, Math.min(100, Math.round(region.suitability.overall + (scores.housing-region.suitability.housing)*.15 + (scores.workation-region.suitability.workation)*.1 + (activity === undefined ? 0 : (activity-50)*.1))))
  return scores
}
