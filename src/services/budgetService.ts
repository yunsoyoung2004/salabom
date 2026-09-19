import type { BudgetLine, Region } from '../types/region'
export type StayLength = '1주' | '2주' | '3주' | '1개월'
const factors: Record<StayLength, number> = { '1주': .28, '2주': .53, '3주': .76, '1개월': 1 }
export const getBudget = (region: Region, duration: StayLength): BudgetLine[] => region.budget.map((line) => ({ ...line, monthly: Math.round(line.monthly * factors[duration]) }))
export const formatWon = (value: number) => `${value.toLocaleString('ko-KR')}원`