import type { Poi } from './regionalData'
export type LocalProgram = Poi & { description?: string; homepage?: string; phone?: string }
export type Festival = LocalProgram & { startDate: string; endDate: string; venue: string; status: 'current' | 'upcoming' | 'expired' | 'unknown' }
export type Library = LocalProgram & { opening: string; seats?: number; books?: number }
export type VisitorSummary = { regionalActivityScore: number; dailyVisitors: number; date: string; category: string }
export type HousingSummary = { regionalHousingCost: number; housingAffordabilityScore: number; medianDeposit: number; medianMonthlyRent: number; transactionCount: number; months: string[]; medianArea?: number; failures: string[] }
