import type { Region } from '../types/region'
import type { UserProfile } from '../types/user'

const lifeStyleMatch: Record<string, string[]> = {
  '워케이션형': ['카페', '도서관', '인터넷'],
  '휴식형': ['자연', '온천', '조용함'],
  '활동형': ['관광', '액티비티', '음식'],
  '문화형': ['미술관', '갤러리', '박물관'],
  '가족형': ['가족', '아이', '자연'],
}

export function getRecommendedRegions(profile: UserProfile, allRegions: Region[], count = 3): Region[] {
  const lifestyleKeywords = lifeStyleMatch[profile.lifestyleType] || []
  const scored = allRegions.map((region) => {
    let score = 0
    // 라이프스타일 매칭
    lifestyleKeywords.forEach((keyword) => {
      if (region.tags.some((tag) => tag.includes(keyword))) score += 20
    })
    // 관심사 매칭
    profile.interests.forEach((interest) => {
      if (region.tags.some((tag) => tag.includes(interest))) score += 15
    })
    // 기본 적합도
    score += region.suitability.overall
    return { region, score }
  })
  return scored.sort((a, b) => b.score - a.score).slice(0, count).map((s) => s.region)
}

export function filterByDuration(regions: Region[], duration: string): Region[] {
  return regions.filter((r) => r.stayDuration.includes(duration))
}

export function filterByCategory(items: any[], category: string, categoryField = 'category'): any[] {
  if (category === '전체') return items
  return items.filter((item) => item[categoryField] === category)
}

export function getRegionExplanation(profile: UserProfile, region: Region) {
  return {
    body: `${profile.nickname}님의 ${profile.lifestyleType} 스타일에 ${region.city}는 ${region.tags.slice(0, 3).join(', ')} 특징이 있어 잘 맞습니다!`,
  }
}
