import { PUBLIC_DATA_API_KEY } from '../config/publicData'
import { PublicDataError, requestPublicJson } from './apiClient'
export type RawItem = Record<string, unknown>
export const uniqueItems = <T extends {id:string}>(rows: T[]): T[] => [...new Map(rows.map(r => [r.id,r])).values()]
const object = (v: unknown): RawItem => v && typeof v === 'object' && !Array.isArray(v) ? v as RawItem : {}
export const field = (row: RawItem, name: string): string => String(row[name] ?? row[name.replace(/[A-Z]/g, c => `_${c}`).toUpperCase()] ?? '')
export const numberField = (row: RawItem, name: string): number | undefined => {
  const v = field(row, name).replaceAll(',', '').trim()
  return v !== '' && Number.isFinite(Number(v)) ? Number(v) : undefined
}
export function parseDataset(payload: unknown, standard = false) {
  const root = object(payload)
  const auth = object(object(root.OpenAPI_ServiceResponse).cmmMsgHeader)
  if (auth.returnReasonCode) throw new PublicDataError(`API ${auth.returnReasonCode}: ${auth.returnAuthMsg}`, 'blocked_endpoint')
  const response = object(root.response ?? (standard ? root : undefined))
  const header = object(response.header)
  const code = String(header.resultCode ?? '')
  if (!['00', '000', '0000', '0', '03'].includes(code)) throw new PublicDataError(`API ${code || 'missing resultCode'}: ${String(header.resultMsg ?? '')}`, code ? (['12','20','21','30','31','32'].includes(code) ? 'blocked_endpoint' : 'error') : 'api_response_mismatch')
  const body = object(response.body)
  const total = Number(body.totalCount ?? 0)
  const raw = standard && Array.isArray(body.items) ? body.items : object(body.items).item
  const items: RawItem[] = raw == null || raw === '' ? [] : Array.isArray(raw) ? raw.map(object) : [object(raw)]
  if ((total > 0 && !items.length) || items.some(x => !Object.keys(x).length)) throw new PublicDataError(`totalCount=${total}; response keys=${Object.keys(response)}; body keys=${Object.keys(body)}; items type=${Array.isArray(body.items) ? 'array' : typeof body.items}; items keys=${Object.keys(object(body.items))}`, 'api_response_mismatch')
  return { items, total, code, message: String(header.resultMsg ?? '') }
}
const cache = new Map<string, Promise<RawItem[]>>()
export function datasetRows(path: string, params: Record<string, string | number> = {}, standard = false) {
  const key = JSON.stringify([path, params, standard])
  if (cache.has(key)) return cache.get(key)!
  const promise = (async () => {
    if (!PUBLIC_DATA_API_KEY) throw new PublicDataError('Public data key missing')
    const rows: RawItem[] = []
    for (let pageNo = 1; pageNo <= 100; pageNo++) {
      const result = parseDataset(await requestPublicJson(path, { serviceKey: PUBLIC_DATA_API_KEY, ...params, pageNo, numOfRows: 1000 }), standard)
      rows.push(...result.items)
      if (rows.length >= result.total) return rows
      if (!result.items.length) throw new PublicDataError('Pagination ended before totalCount', 'api_response_mismatch')
    }
    throw new PublicDataError('Pagination limit exceeded', 'api_response_mismatch')
  })()
  cache.set(key, promise)
  promise.catch(() => cache.delete(key))
  return promise
}
