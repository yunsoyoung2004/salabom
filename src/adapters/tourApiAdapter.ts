import type { TourApiItem } from '../types/api/tour'
import type { Poi } from '../types/regionalData'

const coordinate = (value: string | undefined) => value && Number.isFinite(Number(value)) ? Number(value) : undefined
export const toPlace = (item: TourApiItem): Poi | null => item.contentid && item.title ? { id: item.contentid, name: item.title, category: item.contenttypeid ?? '관광', address: item.addr1, longitude: coordinate(item.mapx), latitude: coordinate(item.mapy), image: item.firstimage } : null