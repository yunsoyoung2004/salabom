import { field, numberField, type RawItem } from '../services/datasetClient'
import type { Library } from '../types/datasets'
export function toLibrary(r: RawItem): Library {
  return { id: `library:${field(r,'lbrryNm')}:${field(r,'rdnmadr')}`, name: field(r,'lbrryNm'), category: '도서관', address: field(r,'rdnmadr'), latitude: numberField(r,'latitude'), longitude: numberField(r,'longitude'), homepage: field(r,'homepageUrl'), phone: field(r,'phoneNumber'), seats: numberField(r,'seatCo'), books: numberField(r,'bookCo'), opening: `평일 ${field(r,'weekdayOperOpenHhmm') || '미제공'}–${field(r,'weekdayOperColseHhmm') || '미제공'} · 토요일 ${field(r,'satOperOperOpenHhmm') || '미제공'}–${field(r,'satOperCloseHhmm') || '미제공'} · 휴관 ${field(r,'closeDay') || '확인 필요'}` }
}
