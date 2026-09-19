import { numberField, type RawItem } from '../services/datasetClient'
export const median = (values: number[]) => { const s = [...values].sort((a,b) => a-b); const m = Math.floor(s.length/2); return s.length ? s.length % 2 ? s[m] : (s[m-1]+s[m])/2 : undefined }
export function toRental(row: RawItem) {
  const deposit = numberField(row,'deposit'); const monthlyRent = numberField(row,'monthlyRent')
  if (deposit === undefined || monthlyRent === undefined || deposit < 0 || monthlyRent < 0) return null
  return { deposit: deposit * 10000, monthlyRent: monthlyRent * 10000, area: numberField(row,'excluUseAr') }
}
