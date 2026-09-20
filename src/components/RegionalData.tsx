import { useRegionLivingData } from '../hooks/useRegionLivingData'
import type { Region } from '../types/region'
import type { RegionLivingData, SourceResult } from '../types/regionalData'
import type { LocalProgram, Festival, Library } from '../types/datasets'
import { livingScores } from '../services/suitabilityService'
import { formatWon } from '../services/budgetService'
import { useState } from 'react'
import { X, MapPin, Phone, Globe, BookOpen, Users } from 'lucide-react'

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

function ProgramCard({item, onSelect}: {item:LocalProgram; onSelect:(item:LocalProgram)=>void}) {
  const isFestival = 'startDate' in item
  const isLibrary = 'opening' in item
  const status = isFestival ? ({current:'진행 중', upcoming:'예정', expired:'지난 행사', unknown:'일정 확인 필요'} as Record<string,string>)[(item as Festival).status] : null

  return <div
    className="program-card"
    onClick={() => onSelect(item)}
    role="button"
    tabIndex={0}
  >
    <div className="program-header">
      <h3>{item.name}</h3>
      {status && <span className={`status-badge status-${status === '진행 중' ? 'active' : status === '예정' ? 'upcoming' : 'expired'}`}>{status}</span>}
    </div>
    <div className="program-meta">
      <span className="category">{item.category}</span>
      {isLibrary && 'seats' in item && <span className="meta-item"><Users size={12} /> {(item as Library).seats}석</span>}
      {isLibrary && 'books' in item && <span className="meta-item"><BookOpen size={12} /> {(item as Library).books}권</span>}
    </div>
    <p className="address"><MapPin size={12} /> {item.address}</p>
    {item.description && <p className="description">{item.description}</p>}
  </div>
}

function ProgramModal({item, onClose}: {item:LocalProgram | null; onClose:()=>void}) {
  if (!item) return null
  const isFestival = 'startDate' in item
  const isLibrary = 'opening' in item
  const status = isFestival ? ({current:'진행 중', upcoming:'예정', expired:'지난 행사', unknown:'일정 확인 필요'} as Record<string,string>)[(item as Festival).status] : null

  return <div className="modal-backdrop" onClick={onClose}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose}><X size={20} /></button>
      <h2>{item.name}</h2>
      <div className="modal-tags">
        <span className="category-tag">{item.category}</span>
        {status && <span className={`status-badge status-${status === '진행 중' ? 'active' : status === '예정' ? 'upcoming' : 'expired'}`}>{status}</span>}
      </div>

      <div className="modal-section">
        <h4>📍 위치</h4>
        <p>{item.address}</p>
      </div>

      {item.description && <div className="modal-section">
        <h4>📝 설명</h4>
        <p>{item.description}</p>
      </div>}

      {isFestival && <div className="modal-section">
        <h4>📅 기간</h4>
        <p>{(item as Festival).startDate} ~ {(item as Festival).endDate}</p>
      </div>}

      {isLibrary && <div className="modal-section">
        <h4>🕐 운영시간</h4>
        <p>{(item as Library).opening}</p>
      </div>}

      {isLibrary && 'seats' in item && <div className="modal-section">
        <h4>🪑 열람좌석</h4>
        <p>{(item as Library).seats}석</p>
      </div>}

      {isLibrary && 'books' in item && <div className="modal-section">
        <h4>📚 소장 도서</h4>
        <p>{(item as Library).books}권</p>
      </div>}

      <div className="modal-actions">
        {item.phone && <a href={`tel:${item.phone}`} className="modal-link">
          <Phone size={14} /> {item.phone}
        </a>}
        {item.latitude !== undefined && item.longitude !== undefined && <a
          href={`https://map.kakao.com/link/map/${encodeURIComponent(item.name)},${item.latitude},${item.longitude}`}
          target="_blank"
          rel="noreferrer"
          className="modal-link"
        >
          <MapPin size={14} /> 지도에서 보기
        </a>}
        {item.homepage && /^https?:\/\//.test(item.homepage) && <a
          href={item.homepage}
          target="_blank"
          rel="noreferrer"
          className="modal-link"
        >
          <Globe size={14} /> 홈페이지
        </a>}
      </div>
    </div>
  </div>
}

function ProgramRows({title, source}: {title:string; source?:SourceResult<LocalProgram[]>}) {
  const [selectedItem, setSelectedItem] = useState<LocalProgram | null>(null)

  return <section className="program-section">
    <div className="section-title">
      <h2>{title}</h2>
      <small>{sourceLabel(source?.source)}</small>
    </div>
    {source?.data.length === 0 && source.source === 'live' && <p className="empty-state">진행 중이거나 예정된 행사가 없습니다.</p>}
    <div className="program-grid">
      {source?.data.map(item => <ProgramCard key={item.id} item={item} onSelect={setSelectedItem} />)}
    </div>
    <ProgramModal item={selectedItem} onClose={() => setSelectedItem(null)} />
  </section>
}

export function LocalPrograms({data, libraries = false, activeOnly = false}: {data:RegionLivingData | null; libraries?:boolean; activeOnly?:boolean}) {
  const festival = data?.festival ? {...data.festival, data:data.festival.data.filter(f => !activeOnly || f.status === 'current' || f.status === 'upcoming')} : undefined
  return <><ProgramRows title="지역 문화축제" source={festival}/><ProgramRows title="농어촌 체험 프로그램" source={data?.ruralExperience}/>{libraries && <ProgramRows title="도서관 · 업무환경 참고" source={data?.library}/>}</>
}
