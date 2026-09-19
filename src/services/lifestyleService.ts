import type { Region } from '../types/region'
import type { UserProfile } from '../types/user'
export const getRegionExplanation = (profile: UserProfile, region: Region) => ({ title: `${region.city}가 잘 맞는 이유`, body: `${profile.interests.join('·')}을 선호하고 ${profile.stayDuration} 체류를 원하는 ${profile.nickname}님에게 ${region.city}은 자연환경, 워케이션 시설, 일상 생활권의 균형이 좋아 높은 살아봄 적합도를 보입니다.` })