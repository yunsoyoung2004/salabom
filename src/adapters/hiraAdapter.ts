import type { HiraDetailItem, HiraHospitalItem } from '../types/api/hira'
import type { MedicalInstitution } from '../types/medical'

const numberOrUndefined = (value: string | undefined) => value && Number.isFinite(Number(value)) ? Number(value) : undefined

export function toMedicalInstitution(item: HiraHospitalItem): MedicalInstitution | null {
  if (!item.ykiho || !item.yadmNm) return null
  return { id: item.ykiho, name: item.yadmNm, type: item.clCdNm, address: item.addr, latitude: numberOrUndefined(item.YPos), longitude: numberOrUndefined(item.XPos), phone: item.telno }
}

export function withHiraDetail(institution: MedicalInstitution, details: HiraDetailItem[]): MedicalInstitution {
  const departments = details.map((item) => item.dgsbjtCdNm).filter((value): value is string => Boolean(value))
  const specialistCount = details.reduce((count, item) => count + (Number(item.spclDrCnt) || 0), 0)
  return { ...institution, departments: departments.length ? [...new Set(departments)] : undefined, specialistCount: specialistCount || undefined }
}