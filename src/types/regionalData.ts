import type { DataSourceState, MedicalRegionData } from './medical'
import type { VisitorSummary, HousingSummary, Festival, LocalProgram, Library } from './datasets'

export type Poi = { id: string; name: string; category: string; address?: string; latitude?: number; longitude?: number; image?: string }
export type Pharmacy = { id: string; name: string; address?: string; phone?: string; latitude?: number; longitude?: number }
export type WeatherSummary = { temperature?: number; sky?: string; precipitation?: string; observedAt?: string }
export type SourceResult<T> = { data: T; source: DataSourceState; reason?: string }
export type RegionLivingData = { medical: MedicalRegionData; pharmacies: SourceResult<Pharmacy[]>; tourism: SourceResult<Poi[]>; weather: SourceResult<WeatherSummary | null>; visitor: SourceResult<VisitorSummary | null>; housing: SourceResult<HousingSummary | null>; festival: SourceResult<Festival[]>; ruralExperience: SourceResult<LocalProgram[]>; library: SourceResult<Library[]>; sources: Record<'tourApi' | 'hospital' | 'pharmacy' | 'weatherShort' | 'visitor' | 'housing' | 'festival' | 'ruralExperience' | 'library', DataSourceState> }
