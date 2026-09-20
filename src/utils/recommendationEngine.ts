import type { Region } from '../types/region'
import type { UserProfile } from '../types/user'
import type { Poi } from '../types/regionalData'

const lifeStyleMatch: Record<string, string[]> = {
  '워케이션형': ['카페', '도서관', '인터넷'],
  '휴식형': ['자연', '온천', '조용함'],
  '활동형': ['관광', '액티비티', '음식'],
  '문화형': ['미술관', '갤러리', '박물관'],
  '가족형': ['가족', '아이', '자연'],
}

const attractionKeywords: Record<string, string[]> = {
  '워케이션형': ['카페', '전시', '박물관', '갤러리', '도서관', '문화'],
  '휴식형': ['온천', '스파', '펜션', '유스호스텔', '휴양', '힐링', '자연'],
  '활동형': ['박물관', '공원', '수상', '스포츠', '액티비티', '레포츠', '음식', '식당', '카페'],
  '문화형': ['박물관', '갤러리', '전시', '문화', '유적', '역사', '예술'],
  '가족형': ['공원', '박물관', '동물', '수족관', '유원지', '놀이터', '아쿠아', '자연'],
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

export function getRecommendedAttractions(profile: UserProfile, attractions: Poi[], count = 10): Poi[] {
  const keywords = attractionKeywords[profile.lifestyleType] || []
  const scored = attractions.map((attraction) => {
    let score = 0
    const nameLower = attraction.name.toLowerCase()
    const categoryLower = attraction.category.toLowerCase()

    keywords.forEach((keyword) => {
      if (nameLower.includes(keyword) || categoryLower.includes(keyword)) score += 10
    })

    profile.interests.forEach((interest) => {
      if (nameLower.includes(interest) || categoryLower.includes(interest)) score += 5
    })

    return { attraction, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((s) => s.attraction)
}
