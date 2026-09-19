export type TourApiItem = { contentid?: string; title?: string; contenttypeid?: string; addr1?: string; mapx?: string; mapy?: string; firstimage?: string }
export type TourApiResponse = { response?: { header?: { resultCode?: string; resultMsg?: string }; body?: { items?: { item?: TourApiItem | TourApiItem[] } } } }
export type TourAreaCodeItem = { code?: string; name?: string; rnum?: number }
export type TourAreaCodeResponse = { response?: { header?: { resultCode?: string; resultMsg?: string }; body?: { items?: { item?: TourAreaCodeItem | TourAreaCodeItem[] } } } }