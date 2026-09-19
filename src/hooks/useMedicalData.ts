import { useEffect, useState } from 'react'
import { calculateMedicalAccessibility } from '../services/medicalAccessibilityService'
import { getHospitalsByRegion } from '../services/hiraService'
import type { Region } from '../types/region'
import type { MedicalRegionData } from '../types/medical'

const scoreLabel = (score: number) => score >= 80 ? '좋음' : score >= 60 ? '보통' : '확인 필요'
const fallback = (region: Region, reason?: string): MedicalRegionData => ({ institutions: [], accessibility: { score: region.suitability.medical, hospitalCount: 0, nearbyHospitalCount: 0, typeDiversity: 0, explanation: '공공 의료기관 데이터를 불러오지 못해 기존 지역 분석값을 표시합니다.' }, source: reason ? 'error' : 'fallback', reason })

export function useMedicalData(region: Region): MedicalRegionData {
  const [data, setData] = useState<MedicalRegionData>(() => ({ ...fallback(region), source: 'loading' }))
  useEffect(() => {
    const controller = new AbortController()
    setData({ ...fallback(region), source: 'loading' })
    getHospitalsByRegion(region.id as Parameters<typeof getHospitalsByRegion>[0], controller.signal)
      .then((institutions) => {
        if (!institutions.length) throw new Error('No hospitals returned')
        const accessibility = calculateMedicalAccessibility(institutions)
        if (import.meta.env.DEV) console.info('[Salabom Medical Data]', { region: region.city, source: 'HIRA', hospitalsLoaded: institutions.length, accessibilityScore: accessibility.score })
        setData({ institutions, accessibility, source: 'live' })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const reason = error instanceof Error ? error.message : 'Unknown error'
        if (import.meta.env.DEV) console.info('[Salabom Medical Data]', { region: region.city, source: 'MOCK FALLBACK', reason })
        setData(fallback(region, reason))
      })
    return () => controller.abort()
  }, [region])
  return data
}

export { scoreLabel }