import { useEffect, useRef } from 'react'
import { useMedicalData } from '../hooks/useMedicalData'
import { regions } from '../mocks/regions.mock'
import type { Region } from '../types/region'

function RegionMedicalLoader({ region, refresh }: { region: Region; refresh: () => void }) {
  const medical = useMedicalData(region)
  const lastScore = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (medical.source !== 'live' || lastScore.current === medical.accessibility.score) return
    lastScore.current = medical.accessibility.score
    const previousMedical = region.suitability.medical
    region.suitability.medical = medical.accessibility.score
    region.suitability.overall = Math.max(0, Math.min(100, region.suitability.overall + Math.round((medical.accessibility.score - previousMedical) * 0.12)))
    region.livingInfo.medical = `${medical.accessibility.score}점 · ${medical.accessibility.hospitalCount}곳`
    refresh()
  }, [medical, refresh, region])

  return null
}

export function MedicalDataBridge({ refresh }: { refresh: () => void }) {
  return <>{regions.map((region) => <RegionMedicalLoader key={region.id} region={region} refresh={refresh} />)}</>
}