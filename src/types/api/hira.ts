export type HiraHospitalItem = {
  ykiho?: string
  yadmNm?: string
  clCdNm?: string
  addr?: string
  XPos?: string
  YPos?: string
  telno?: string
}

export type HiraResponse = {
  response?: {
    header?: { resultCode?: string; resultMsg?: string }
    body?: { items?: { item?: HiraHospitalItem | HiraHospitalItem[] }; totalCount?: number }
  }
}

export type HiraDetailItem = { dgsbjtCdNm?: string; spclDrCnt?: string }
export type HiraDetailResponse = {
  response?: { header?: { resultCode?: string; resultMsg?: string }; body?: { items?: { item?: HiraDetailItem | HiraDetailItem[] } } }
}