export const images = {
  splash: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85',
  gangneung: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=85',
  tongyeong: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85',
  namhae: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1000&q=85',
  room: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85',
  stay: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=85',
  work: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=700&q=85',
  healing: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=700&q=85',
  activity: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=700&q=85',
  market: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=700&q=85',
  cafe: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=700&q=85',
  beach: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=700&q=85',
}

export const interestLabels = ['자연', '카페', '워케이션', '로컬체험', '요리', '사진']
export const stays = [
  { name: '스테이 강릉 오션뷰', price: '₩750,000 / 월', rating: '4.7 (32)', image: images.room, tags: ['오션뷰', '워크스페이스', '주차', '와이파이'] },
  { name: '안목 스테이 하우스', price: '₩650,000 / 월', rating: '4.6 (18)', image: images.stay, tags: ['산책로 5분', '주방', '세탁기'] },
]
export const itinerary = [
  { day: '08:30 · 아침', title: '동네 카페에서 아침', text: '안목해변을 바라보며 오늘의 일을 정리해요', image: images.cafe },
  { day: '10:00 · 업무', title: '코워킹 스페이스에서 업무', text: '집중이 필요한 오전 업무 시간이에요', image: images.work },
  { day: '13:00 · 식사', title: '로컬 식당에서 점심', text: '동네 사람들이 찾는 식당에서 한 끼를 먹어요', image: images.market },
  { day: '18:30 · 일상', title: '중앙시장 장보기', text: '저녁 식사 재료를 사고 해변을 산책해요', image: images.beach },
]