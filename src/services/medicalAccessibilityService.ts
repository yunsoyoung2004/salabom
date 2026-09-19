import type { MedicalAccessibility, MedicalInstitution } from '../types/medical'

export function calculateMedicalAccessibility(institutions: MedicalInstitution[], pharmacyCount = 0): MedicalAccessibility {
  const hospitalCount = institutions.length
  const typeDiversity = new Set(institutions.map((item) => item.type).filter(Boolean)).size
  const nearbyHospitalCount = institutions.filter((item) => item.latitude !== undefined && item.longitude !== undefined).length
  // Counts use saturation, not linear growth: without population and travel-time data this limits the advantage of large cities.
  const countScore = Math.min(45, Math.round(45 * Math.log1p(hospitalCount) / Math.log(31)))
  const diversityScore = Math.min(25, typeDiversity * 7)
  const locationScore = hospitalCount ? Math.min(20, Math.round(20 * nearbyHospitalCount / hospitalCount)) : 0
  const pharmacyScore = Math.min(10, Math.round(10 * Math.log1p(pharmacyCount) / Math.log(11)))
  const score = Math.min(100, countScore + diversityScore + locationScore + pharmacyScore)
  return { score, hospitalCount, nearbyHospitalCount, typeDiversity, explanation: `의료기관 ${hospitalCount}곳과 약국 ${pharmacyCount}곳을 포화 보정해 반영한 접근성 점수입니다.` }
}