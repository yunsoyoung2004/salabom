export type DataSourceState = 'live' | 'fallback' | 'loading' | 'error' | 'empty' | 'blocked' | 'blocked_endpoint' | 'api_response_mismatch'

export type MedicalInstitution = {
  id: string
  name: string
  type?: string
  address?: string
  latitude?: number
  longitude?: number
  phone?: string
  departments?: string[]
  specialistCount?: number
}

export type MedicalAccessibility = {
  score: number
  hospitalCount: number
  nearbyHospitalCount: number
  typeDiversity: number
  explanation: string
}

export type MedicalRegionData = {
  institutions: MedicalInstitution[]
  accessibility: MedicalAccessibility
  source: DataSourceState
  reason?: string
}