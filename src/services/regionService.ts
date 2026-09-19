import { regions } from '../mocks/regions.mock'
export const getRegions = async () => regions
export const getRegion = async (id: string) => regions.find((region) => region.id === id) ?? regions[0]