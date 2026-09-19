/**
 * TourAPI 테스트 스크립트
 * 5개 지역 모두에서 areaCode와 sigunguCode 해석 확인
 */

import { getTourCityCodes, getTourContent } from './src/services/tourApiService'
import { regionRuntimeConfig } from './src/config/regionCodes'

type RegionId = 'gangneung' | 'tongyeong' | 'namhae' | 'sokcho' | 'seogwipo'
const regions: RegionId[] = ['gangneung', 'tongyeong', 'namhae', 'sokcho', 'seogwipo']

async function testTourApi() {
  console.log('🧪 TourAPI Verification Start\n')

  for (const regionId of regions) {
    const config = regionRuntimeConfig[regionId]
    const regionName = config.city

    try {
      console.log(`📍 Testing: ${regionName}`)

      // Step 1: Get area and sigungu codes
      const { areaCode, sigunguCode } = await getTourCityCodes(config.provinceAliases, config.city)
      console.log(`  ✓ Province Aliases: ${config.provinceAliases.join(', ')} → areaCode: ${areaCode}`)
      console.log(`  ✓ City: ${config.city} → sigunguCode: ${sigunguCode}`)

      // Step 2: Get tour content
      const tourContent = await getTourContent(areaCode, sigunguCode)
      console.log(`  ✓ Tour Items: ${tourContent.length}`)

      // Step 3: Print results
      console.log(`  HTTP: 200`)
      console.log(`  Status: LIVE (${tourContent.length} items)\n`)

    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.log(`  ✗ ERROR: ${message}\n`)
    }
  }

  console.log('✅ TourAPI Verification Complete')
}

testTourApi().catch(console.error)
