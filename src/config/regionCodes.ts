export type SupportedRegionId = 'gangneung' | 'tongyeong' | 'namhae' | 'sokcho' | 'seogwipo'

export const medicalRegionQueries: Record<SupportedRegionId, { Q0: string; Q1: string }> = {
  gangneung: { Q0: '강원특별자치도', Q1: '강릉시' },
  tongyeong: { Q0: '경상남도', Q1: '통영시' },
  namhae: { Q0: '경상남도', Q1: '남해군' },
  sokcho: { Q0: '강원특별자치도', Q1: '속초시' },
  seogwipo: { Q0: '제주특별자치도', Q1: '서귀포시' },
}

export const regionRuntimeConfig: Record<SupportedRegionId, { provinceAliases: string[]; city: string; lawdCode: string; forecastGrid: { nx: number; ny: number } }> = {
  gangneung: { provinceAliases: ['강원특별자치도', '강원도', '강원'], city: '강릉시', lawdCode: '51150', forecastGrid: { nx: 92, ny: 131 } },
  tongyeong: { provinceAliases: ['경상남도', '경남'], city: '통영시', lawdCode: '48220', forecastGrid: { nx: 87, ny: 68 } },
  namhae: { provinceAliases: ['경상남도', '경남'], city: '남해군', lawdCode: '48840', forecastGrid: { nx: 77, ny: 68 } },
  sokcho: { provinceAliases: ['강원특별자치도', '강원도', '강원'], city: '속초시', lawdCode: '51210', forecastGrid: { nx: 87, ny: 141 } },
  seogwipo: { provinceAliases: ['제주특별자치도', '제주도', '제주'], city: '서귀포시', lawdCode: '50130', forecastGrid: { nx: 88, ny: 69 } },
}
