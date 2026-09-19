import { useRegionLivingData } from '../hooks/useRegionLivingData'
import type { Region } from '../types/region'
import type { RegionLivingData, SourceResult } from '../types/regionalData'
import type { LocalProgram, Festival, Library } from '../types/datasets'
import { livingScores } from '../services/suitabilityService'
import { formatWon } from '../services/budgetService'
const labels: Record<string,string> = {live:'공공데이터 연동', empty:'등록 정보 없음', fallback:'일부 자료만 반영', error:'불러오기 실패', blocked_endpoint:'제공처 연결 불가', api_response_mismatch:'응답 형식 확인 필요'}
const sourceLabel = (source?: string) => labels[source ?? ''] ?? '불러오는 중'
export function ActivityValue({region}: {region:Region}) {
  const d = useRegionLivingData(region)
  return <span>지역 활력 {d?.visitor.data ? `${d.visitor.data.regionalActivityScore}점` : sourceLabel(d?.visitor.source)}</span>
}
export function SuitabilityValue({region, metric = 'overall'}: {region:Region; metric?: keyof Region['suitability']}) {
  const d = useRegionLivingData(region)
  return <>{livingScores(region,d)[metric]}</>
}
export function HousingValue({region}: {region:Region}) {
  const d = useRegionLivingData(region)
  return <span>{d?.housing.data ? `${formatWon(d.housing.data.regionalHousingCost)}/월${d.housing.source === 'fallback' ? ' (일부)' : ''}` : sourceLabel(d?.housing.source)}</span>
}
export function RegionalMetrics({data}: {data:RegionLivingData | null}) {
  const v = data?.visitor; const h = data?.housing
  return <section className="living-info" aria-label="지역 공공데이터 지표">
    <article><small>지역 활력</small><strong>{v?.data ? `${v.data.regionalActivityScore}점` : sourceLabel(v?.source)}</strong>{v?.data && <p>{v.data.date} · {v.data.category} · 이동통신 기반 일 방문자 {v.data.dailyVisitors.toLocaleString()}명. 로그 환산 자체 지표(0–100).</p>}</article>
    <article><small>지역 주거비 수준</small><strong>{h?.data ? `${formatWon(h.data.regionalHousingCost)}/월` : sourceLabel(h?.source)}</strong>{h?.data && <p>최근 6개월 {h.data.transactionCount}건 · 보증금 중앙값 {formatWon(h.data.medianDeposit)} · 월세 중앙값 {formatWon(h.data.medianMonthlyRent)}. 월세+보증금×연 4%÷12의 중앙값. {h.source === 'fallback' && '일부 조회 실패로 제한된 표본입니다.'}</p>}</article>
  </section>
}
function ProgramRows({title, source}: {title:string; source?:SourceResult<LocalProgram[]>}) {
  return <section><div className="section-title"><h2>{title}</h2><small>{sourceLabel(source?.source)}</small></div>{source?.data.length === 0 && source.source === 'live' && <p>진행 중이거나 예정된 행사가 없습니다.</p>}{source?.data.map(item => <article className="living-info" key={item.id}><h3>{item.name}</h3><p>{item.category} · {item.address}</p>{item.description && <p>{item.description}</p>}{'opening' in item && <p>{(item as Library).opening}</p>}{'seats' in item && item.seats !== undefined && <p>열람좌석 {String(item.seats)}석</p>}{'books' in item && item.books !== undefined && <p>도서 {String(item.books)}권</p>}{'startDate' in item && <p>{(item as Festival).startDate}–{(item as Festival).endDate} · {{current:'진행 중',upcoming:'예정',expired:'지난 행사',unknown:'일정 확인 필요'}[(item as Festival).status]}</p>}{item.phone && <p>{item.phone}</p>}{item.latitude !== undefined && item.longitude !== undefined && <a href={`https://map.kakao.com/link/map/${encodeURIComponent(item.name)},${item.latitude},${item.longitude}`} target="_blank" rel="noreferrer">지도에서 위치 보기</a>}{item.homepage && /^https?:\/\//.test(item.homepage) && <a href={item.homepage} target="_blank" rel="noreferrer"> 홈페이지</a>}</article>)}</section>
}
export function LocalPrograms({data, libraries = false, activeOnly = false}: {data:RegionLivingData | null; libraries?:boolean; activeOnly?:boolean}) {
  const festival = data?.festival ? {...data.festival, data:data.festival.data.filter(f => !activeOnly || f.status === 'current' || f.status === 'upcoming')} : undefined
  return <><ProgramRows title="지역 문화축제" source={festival}/><ProgramRows title="농어촌 체험 프로그램" source={data?.ruralExperience}/>{libraries && <ProgramRows title="도서관 · 업무환경 참고" source={data?.library}/>}</>
}
