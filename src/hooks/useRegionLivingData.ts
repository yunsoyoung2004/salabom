import { useEffect, useState } from 'react'
import { getRegionLivingData } from '../services/regionDataService'
import type { Region } from '../types/region'
import type { RegionLivingData } from '../types/regionalData'

export function useRegionLivingData(region: Region) {
  const [data, setData] = useState<RegionLivingData | null>(null)
  useEffect(() => {
    let active = true
    getRegionLivingData(region).then((result) => { if (active) setData(result) })
    return () => { active = false }
  }, [region])
  return data
}