import { ActivityValue, HousingValue, SuitabilityValue, RegionalMetrics, LocalPrograms, RegionalAttractions } from '../components/RegionalData';
import { useState } from "react";
import { getRecommendedRegions, filterByCategory } from '../utils/recommendationEngine';
import {
  Bell,
  Bookmark,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Filter,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Navigation,
  Plus,
  Settings,
  Star,
  ThumbsUp,
  UserRound,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { AppFrame } from "../components/AppFrame";
import {
  BackHeader,
  Chip,
  PageMotion,
  StatCard,
  StayCard,
} from "../components/UI";
import { images, interestLabels, itinerary, stays } from "../data/mockData";
import { regions } from "../mocks/regions.mock";
import { getRegionExplanation } from "../services/lifestyleService";
import { useApp } from "../context/AppContext";
import {
  formatWon,
  getBudget,
  type StayLength,
} from "../services/budgetService";
import { useRegionLivingData } from "../hooks/useRegionLivingData";

const tabLabels = ["전체", "생활", "일", "관광"];

export function Splash() {
  const navigate = useNavigate();
  return (
    <AppFrame nav={false}>
      <PageMotion className="splash">
        <img
          className="splash-image"
          src={images.splash}
          alt="창문 너머의 산과 마을"
        />
        <div className="splash-overlay" />
        <div className="splash-copy">
          <div className="brand">
            살아봄<span>〰</span>
          </div>
          <h1>
            이번 달, 어디에서
            <br />
            살아볼까요?
          </h1>
          <p>여행이 아닌, 삶을 경험하는 새로운 방식</p>
        </div>
        <div className="splash-actions">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="primary-button"
            onClick={() => navigate("/onboarding")}
          >
            시작하기
          </motion.button>
          <button
            className="secondary-button"
            onClick={() => navigate("/home")}
          >
            로그인
          </button>
        </div>
      </PageMotion>
    </AppFrame>
  );
}

export function Onboarding() {
  const navigate = useNavigate();
  const { profile, setProfile } = useApp();
  const [selected, setSelected] = useState(profile.interests);
  const toggle = (interest: string) =>
    setSelected((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : current.length < 3
          ? [...current, interest]
          : current,
    );
  return (
    <AppFrame nav={false}>
      <PageMotion className="page onboarding">
        <BackHeader
          right={
            <div className="stepper">
              <b>1</b>
              <i />
              <span>2</span>
              <i />
              <span>3</span>
            </div>
          }
        />
        <div className="form-head">
          <h1>살아봄을 시작할게요!</h1>
          <p>
            간단한 정보 입력으로
            <br />
            나에게 꼭 맞는 지역을 추천해드려요.
          </p>
        </div>
        <label>
          닉네임
          <input
            value={profile.nickname}
            onChange={(event) =>
              setProfile({ ...profile, nickname: event.target.value })
            }
          />
        </label>
        <label>
          연령대
          <span className="select-like">
            {profile.ageGroup} <ChevronDown size={16} />
          </span>
        </label>
        <label>
          거주 지역
          <span className="select-like">
            {profile.residence} <ChevronDown size={16} />
          </span>
        </label>
        <div className="interest-group">
          <label>
            관심사 <small>(최대 3개 선택)</small>
          </label>
          <div className="interest-grid">
            {interestLabels.map((item) => (
              <button
                onClick={() => toggle(item)}
                className={
                  selected.includes(item) ? "interest selected" : "interest"
                }
                key={item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="primary-button bottom-action"
          onClick={() => {
            setProfile({ ...profile, interests: selected });
            navigate("/lifestyle");
          }}
        >
          다음
        </motion.button>
      </PageMotion>
    </AppFrame>
  );
}

const styles = [
  {
    title: "워케이션형",
    text: "일과 휴식의 균형을 중요하게 생각해요",
    image: images.work,
  },
  {
    title: "힐링형",
    text: "조용한 자연 속에서 재충전하고 싶어요",
    image: images.healing,
  },
  {
    title: "액티비티형",
    text: "다양한 활동과 경험을 즐기고 싶어요",
    image: images.activity,
  },
  {
    title: "로컬 체험형",
    text: "현지 문화와 사람들을 만나고 싶어요",
    image: images.market,
  },
];
export function LifestyleQuiz() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("워케이션형");
  return (
    <AppFrame nav={false}>
      <PageMotion className="page lifestyle">
        <div className="quiz-top">
          <BackHeader />
          <span>1/5</span>
        </div>
        <h1>당신의 ‘살아봄’ 스타일은?</h1>
        <p>
          아래 항목 중 나와 더 가까운 것을
          <br />
          선택해주세요.
        </p>
        <div className="lifestyle-grid">
          {styles.map((style) => (
            <motion.div
              role="button"
              tabIndex={0}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(style.title)}
              className={`lifestyle-card ${selected === style.title ? "selected" : ""}`}
              key={style.title}
            >
              <img src={style.image} alt="" />
              <div>
                <h3>{style.title}</h3>
                <p>{style.text}</p>
              </div>
              {selected === style.title && (
                <span className="selected-check">
                  <Check size={13} />
                </span>
              )}
            </motion.div>
          ))}
        </div>
        <div className="quiz-bottom">
          <div className="progress-line">
            <b />
          </div>
          <button
            className="round-next"
            onClick={() => navigate("/analysis-result")}
          >
            다음 <ChevronRight size={16} />
          </button>
        </div>
      </PageMotion>
    </AppFrame>
  );
}

export function Home() {
  const navigate = useNavigate();
  const { profile } = useApp();
  const [selected, setSelected] = useState<string[]>([]);
  const [explanation, setExplanation] = useState<string | null>(null);
  const recommendedRegions = getRecommendedRegions(profile, regions, 3);
  const toggle = (id: string) =>
    setSelected((items) =>
      items.includes(id)
        ? items.filter((item) => item !== id)
        : items.length < 3
          ? [...items, id]
          : items,
    );
  return (
    <AppFrame>
      <PageMotion className="page home-page">
        <header className="home-header">
          <div>
            <h1>
              {profile.nickname} 님을 위한 체류 추천 <span>👋</span>
            </h1>
            <p>AI가 분석한 당신의 {profile.lifestyleType} 스타일에 맞는 지역이에요</p>
          </div>
          <Bell size={18} />
        </header>
        {recommendedRegions.map((region) => (
          <article className="region-card" key={region.id}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/region/${region.id}`)}
            >
              <img src={region.heroImage} alt={`${region.city} 풍경`} />
              <div className="region-shade" />
              <span className="score">
                살아봄 적합도 <SuitabilityValue region={region} />점
              </span>
              <div className="region-title">
                <span>{region.province}</span>
                <b>{region.city}</b>
              </div>
              <div className="region-tags">
                {region.tags.map((tag) => (
                  <Chip key={tag}>{tag}</Chip>
                ))}
              </div>
              <div className="region-summary">
                <div>
                  <small>추천 체류 기간</small>
                  <strong>{region.stayDuration}</strong>
                </div>
                <span className="chevron-circle">
                  <ChevronRight size={17} />
                </span>
              </div>
            </div>
            <div style={{fontSize:'0.85rem',padding:'8px 0',color:'#666'}}>지역 활력 <ActivityValue region={region} /></div><div className="region-actions">
              <button
                onClick={() =>
                  setExplanation(getRegionExplanation(profile, region).body)
                }
              >
                왜 나에게 잘 맞나요?
              </button>
              <button
                className={
                  selected.includes(region.id) ? "compare-selected" : ""
                }
                onClick={() => toggle(region.id)}
              >
                {selected.includes(region.id) ? "선택됨" : "비교"}
              </button>
            </div>
          </article>
        ))}
      </PageMotion>
      {selected.length > 0 && (
        <div className="compare-bar">
          <span>
            {selected
              .map((id) =>
                regions
                  .find((region) => region.id === id)
                  ?.city.replace("시", ""),
              )
              .join(" · ")}{" "}
            선택됨
          </span>
          <button onClick={() => navigate("/compare")}>비교하기</button>
        </div>
      )}
      {explanation && (
        <div className="sheet-backdrop" onClick={() => setExplanation(null)}>
          <section
            className="bottom-sheet"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="sheet-close"
              onClick={() => setExplanation(null)}
              aria-label="닫기"
            >
              <X size={18} />
            </button>
            <small>살아봄 AI 분석</small>
            <h2>왜 나에게 잘 맞나요?</h2>
            <p>{explanation}</p>
          </section>
        </div>
      )}
    </AppFrame>
  );
}

export function AnalysisResult() {
  const navigate = useNavigate();
  const livingData = useRegionLivingData(regions[0]);
  const scores = [
    ["자연", 94],
    ["카페", 88],
    ["업무환경", 86],
    ["문화생활", 72],
    ["교통", 61],
  ];
  return (
    <AppFrame nav={false}>
      <PageMotion className="page analysis-result">
        <small>살아봄 AI 분석</small>
        <h1>
          당신은
          <br />
          <strong>“바다 옆 워케이션 생활형”</strong>
          <br />
          입니다.
        </h1>
        <p>
          복잡한 도심보다 자연과 가까우면서 업무가 가능한 지역이 잘 맞습니다.
        </p>
        <div className="analysis-bars">
          <p>지역 기반 적합도 <SuitabilityValue region={regions[0]} />점 · 워케이션 <SuitabilityValue region={regions[0]} metric="workation" />점</p>
          <RegionalMetrics data={livingData} />
          {scores.map(([name, score]) => (
            <div key={name as string}>
              <span>{name}</span>
              <i>
                <b style={{ width: `${score}%` }} />
              </i>
              <strong>{score}</strong>
            </div>
          ))}
        </div>
        <button
          className="primary-button full-width"
          onClick={() => navigate("/home")}
        >
          내가 살아볼 도시 찾기
        </button>
      </PageMotion>
    </AppFrame>
  );
}

export function Compare() {
  const navigate = useNavigate();
  const metrics: [string, keyof (typeof regions)[0]["suitability"]][] = [
    ["살아봄 적합도", "overall"],
    ["교통", "transport"],
    ["인터넷", "internet"],
    ["의료", "medical"],
    ["자연", "nature"],
    ["카페/문화", "culture"],
    ["생활 편의시설", "infrastructure"],
    ["워케이션", "workation"],
  ];
  return (
    <AppFrame>
      <PageMotion className="page compare-page">
        <BackHeader title="지역 비교" />
        <p>지금 나에게 잘 맞는 동네를 비교해보세요.</p>
        <div className="compare-cities">
          {regions.slice(0, 3).map((region) => (
            <div key={region.id}>
              <img src={region.heroImage} alt="" />
              <strong>{region.city}</strong>
              <div style={{fontSize:'0.85rem',margin:'4px 0'}}>지역 활력 <ActivityValue region={region} /></div>
              <small>지역 주거비 수준</small>
              <p><HousingValue region={region} /></p>
            </div>
          ))}
        </div>
        <div className="comparison-list">
          {metrics.map(([label, key]) => {

            return (
              <article key={label}>
                <strong>{label}</strong>
                <div>
                  {regions.slice(0, 3).map((region) => (
                    <span
                      
                      key={region.id}
                    >
                      <SuitabilityValue region={region} metric={key} />
                      
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
        <button
          className="primary-button full-width"
          onClick={() => navigate("/region/gangneung")}
        >
          강릉시 자세히 보기
        </button>
      </PageMotion>
    </AppFrame>
  );
}

export function RegionDetail() {
  const navigate = useNavigate();
  const { id = "gangneung" } = useParams();
  const { savedIds, toggleSaved, profile } = useApp();
  const region = regions.find((item) => item.id === id) ?? regions[0];
  const livingData = useRegionLivingData(region);
  const [tab, setTab] = useState("숙소");
  const [duration, setDuration] = useState<StayLength>("1개월");
  const budget = getBudget(region, duration);
  const total = budget.reduce((sum, item) => sum + item.monthly, 0);
  return (
    <AppFrame>
      <PageMotion className="region-detail">
        <div className="detail-hero">
          <img src={region.heroImage} alt={`${region.city} 풍경`} />
          <div className="detail-hero-controls">
            <button
              className="icon-button"
              onClick={() => navigate(-1)}
              aria-label="뒤로 가기"
            >
              <ChevronRight className="back-rotate" size={19} />
            </button>
            <span>
              <button className="icon-button" aria-label="좋아요">
                <Heart size={17} />
              </button>
              <button
                className="icon-button"
                onClick={() => toggleSaved(region.id)}
                aria-label="찜하기"
              >
                <Bookmark
                  size={16}
                  fill={savedIds.includes(region.id) ? "currentColor" : "none"}
                />
              </button>
            </span>
          </div>
        </div>
        <div className="detail-content">
          <h1>
            {region.province} {region.city}
          </h1>
          <p className="rating">
            <Star size={13} fill="currentColor" /> 4.8 (128개 리뷰)
          </p>
          <div className="chips">
            {region.tags.map((tag) => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </div>
          <h2>지역 한눈에 보기</h2>
          <div className="stats-grid">
            <StatCard label="추천 체류 기간" value={region.stayDuration} />
            <StatCard
              label="월 예상 생활비"
              value={`${Math.round(region.monthlyCost / 10000)}만원`}
            />
            <StatCard label="오늘 날씨" value={livingData?.weather.source === "live" && livingData.weather.data?.temperature !== undefined ? `${livingData.weather.data.temperature}°C` : "분석 중"} />
            <StatCard label="안전도" value="매우 높음" />
          </div>
        </div>
        <RegionalMetrics data={livingData} /><div className="tabs detail-tabs">
          {[
            "숙소",
            "즐길거리",
            "생활 인프라",
            "체험 프로그램",
            "생활자 정보",
          ].map((item) => (
            <button
              className={tab === item ? "tab-active" : ""}
              onClick={() => setTab(item)}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="detail-stays">
          <details><summary>지역 프로그램 · 도서관</summary><LocalPrograms data={livingData} libraries /></details>
          {tab === "생활자 정보" ? (
            <div className="living-info">
              {[
                ["실제 생활 난이도", region.livingInfo.difficulty],
                ["차 없이 살기", region.livingInfo.carFree],
                ["병원 접근성", region.livingInfo.medical],
                ["주변 약국", livingData?.pharmacies.source === "live" ? `${livingData.pharmacies.data.length}곳` : livingData?.pharmacies.source === "error" ? "연동 오류" : "공공데이터 확인 중"],
                ["장보기", region.livingInfo.groceries],
                ["밤 생활", region.livingInfo.nightlife],
                ["장기체류 시 불편한 점", region.livingInfo.drawback],
                ["추천 대상", region.livingInfo.recommended],
                ["비추천 대상", region.livingInfo.notRecommended],
              ].map(([label, value]) => (
                <article key={label}>
                  <small>{label}</small>
                  <strong>{value}</strong>
                </article>
              ))}
            </div>
          ) : tab === "체험 프로그램" || tab === "생활 인프라" ? (
            <LocalPrograms data={livingData} libraries={tab === "생활 인프라"} />
          ) : tab === "즐길거리" ? (
            <RegionalAttractions data={livingData} profile={profile} />
          ) : (
            <>
              <div className="section-title">
                <h2>체류 추천 숙소</h2>
                <button onClick={() => navigate("/accommodation")}>
                  전체 보기 <ChevronRight size={15} />
                </button>
              </div>
              {stays.map((stay) => (
                <StayCard {...stay} compact key={stay.name} />
              ))}
            </>
          )}
          <section className="budget-card">
            <h2>이 지역에서 살면 얼마?</h2>
            <p><span>지역 주거비 수준</span><HousingValue region={region} /></p>
            <small>거래 기반 월 환산 참고값 · 아래 단기 체류 예산과 별도</small>
            <div className="duration-tabs">
              {(["1주", "2주", "3주", "1개월"] as StayLength[]).map((item) => (
                <button
                  className={duration === item ? "active" : ""}
                  onClick={() => setDuration(item)}
                  key={item}
                >
                  {item}
                </button>
              ))}
            </div>
            {budget.map((item) => (
              <p key={item.label}>
                <span>{item.label}</span>
                <strong>{formatWon(item.monthly)}</strong>
              </p>
            ))}
            <footer>
              <span>예상 총액</span>
              <strong>{formatWon(total)}</strong>
            </footer>
          </section>
        </div>
      </PageMotion>
    </AppFrame>
  );
}

export function Accommodation() {
  return (
    <AppFrame>
      <PageMotion className="page accommodation">
        <header className="title-header">
          <h1>강릉시 숙소 추천</h1>
          <button className="icon-button">
            <Filter size={18} />
          </button>
        </header>
        <div className="tabs category-tabs">
          <button className="tab-active">전체</button>
          <button>원룸/오피스텔</button>
          <button>한옥/독채</button>
          <button>셰어하우스</button>
        </div>
        <div className="stay-list">
          {stays.map((stay) => (
            <StayCard {...stay} key={stay.name} />
          ))}
        </div>
      </PageMotion>
    </AppFrame>
  );
}

export function Itinerary() {
  const [duration, setDuration] = useState("3일");
  const livingData = useRegionLivingData(regions[0]);
  const livePlaces = livingData?.tourism.data?.slice(0, 3) ?? [];
  const weatherNote = livingData?.weather.source === "live" && livingData.weather.data?.precipitation !== "0" ? "강수 예보에 맞춰 실내 문화시설과 도서관을 중심으로 구성했어요." : "공공데이터 기반 지역 장소와 프로그램을 중심으로 구성했어요.";
  const durations = ["3일", "1주", "2주", "3주", "1개월"];
  return (
    <AppFrame>
      <PageMotion className="page itinerary">
        <header className="title-header no-icon">
          <div>
            <h1>AI가 만든 생활 플랜</h1>
            <p>{duration} 체류 · {weatherNote}</p>
          </div>
        </header>
        <div className="tabs schedule-tabs">
          {durations.map((d) => (
            <button key={d} className={d === duration ? "tab-active" : ""} onClick={() => setDuration(d)}>
              {d}
            </button>
          ))}
        </div>
        <details><summary>지역 체험 · 행사로 생활 플랜 채우기</summary><LocalPrograms data={livingData} activeOnly /></details><div className="timeline">
          {(livePlaces.length ? livePlaces.map((place: any, index: number) => ({ ...itinerary[index], title: place.name, text: place.address ?? place.category, image: place.image || itinerary[index].image })) : itinerary).map((item) => (
            <article className="timeline-item" key={item.day}>
              <div className="timeline-dot" />
              <div className="day">
                <b>{item.day}</b>
              </div>
              <div className="timeline-content">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
                <img src={item.image} alt="" />
              </div>
            </article>
          ))}
        </div>
        <button className="primary-button full-width">
          전체 생활 플랜 보기
        </button>
      </PageMotion>
    </AppFrame>
  );
}

export function MapPage() {
  const [preset, setPreset] = useState("전체");
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const livingData = useRegionLivingData(regions[0]);
  const livePharmacies = livingData?.pharmacies.data ?? [];
  const liveTourism = livingData?.tourism.data ?? [];
  const liveLibraries = livingData?.library.data ?? [];

  const renderedPlaces =
    preset === "생활" ? livePharmacies.slice(0, 3) :
    preset === "일" ? liveLibraries.slice(0, 3) :
    preset === "관광" ? liveTourism.slice(0, 3) :
    [...livePharmacies.slice(0, 1), ...liveLibraries.slice(0, 1), ...liveTourism.slice(0, 1)];

  const markerPositions = [
    [62, 344],
    [162, 204],
    [224, 60],
  ];

  return (
    <AppFrame>
      <PageMotion className="page map-page">
        <header className="title-header">
          <h1>강릉 생활 인프라 지도</h1>
          <button className="icon-button" aria-label="지도 필터">
            <Filter size={18} />
          </button>
        </header>
        <div className="map-chips">
          {tabLabels.map((label) => (
            <button
              className={`chip ${preset === label ? "chip-active" : ""}`}
              onClick={() => { setPreset(label); setSelectedMarker(null); }}
              key={label}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="map-canvas">
          <div className="map-water" />
          <div className="road road-one" />
          <div className="road road-two" />
          <svg className="route" viewBox="0 0 300 440" aria-hidden="true">
            <path d="M62 344 C 82 275, 169 313, 162 204 S 241 125, 224 60" />
          </svg>
          {renderedPlaces.slice(0, 3).map((place: any, index: number) => {
            const [left, top] = markerPositions[index];
            const isSelected = selectedMarker === index;
            return (
              <div key={index}>
                <span
                  className={`map-marker ${isSelected ? "active" : ""}`}
                  style={{ left: Number(left), top: Number(top) }}
                  onClick={() => setSelectedMarker(isSelected ? null : index)}
                  role="button"
                  tabIndex={0}
                >
                  {index + 1}
                </span>
                {isSelected && (
                  <div className="marker-popup" style={{ left: Number(left), top: Number(top) }}>
                    <h4>{place.name}</h4>
                    <p>{place.address || '주소 정보 없음'}</p>
                    {place.phone && <p>📞 {place.phone}</p>}
                  </div>
                )}
              </div>
            );
          })}
          <div className="map-controls">
            <button aria-label="현재 위치">
              <Navigation size={16} />
            </button>
            <button aria-label="확대">+</button>
            <button aria-label="축소">−</button>
          </div>
        </div>
        <details><summary>지역 프로그램 · 도서관 위치</summary><LocalPrograms data={livingData} libraries activeOnly /></details>
        <div className="place-list">
          {renderedPlaces.slice(0, 3).map((place: any, index: number) => (
            <div
              key={place.id || index}
              className={`place-row-interactive ${selectedMarker === index ? "active" : ""}`}
              onClick={() => setSelectedMarker(selectedMarker === index ? null : index)}
              role="button"
              tabIndex={0}
            >
              <span className="place-number">{index + 1}</span>
              <div className="place-info">
                <p className="place-name">{place.name}</p>
                <p className="place-address">{place.address || place.category || '정보 없음'}</p>
              </div>
            </div>
          ))}
        </div>
      </PageMotion>
    </AppFrame>
  );
}

const posts = [
  {
    author: "김길동",
    time: "2시간 전",
    title: "강릉에서 한 달 살아보니 정말 좋았어요! 🌊",
    body: "바다도 멋지고 사람들이 너무 친절해요. 특히 카페가 정말 많아서 너무 좋아요...",
    image: images.beach,
    likes: 32,
    comments: 8,
  },
  {
    author: "워케이션러",
    time: "5시간 전",
    title: "강릉 워케이션 스팟 공유합니다 💻",
    body: "조용하고 인터넷 빠른 곳 추천드려요. 일주일 동안 지내며 찾은 곳들입니다.",
    image: images.work,
    likes: 21,
    comments: 6,
  },
  {
    author: "로컬생활가",
    time: "1일 전",
    title: "이번 주말 로컬마켓 같이 가요!",
    body: "강릉의 맛있는 식재료와 물건을 구경해요.",
    image: images.market,
    likes: 18,
    comments: 12,
  },
];
export function Community() {
  const [category, setCategory] = useState("전체");
  const categories = ["전체", "질문/답변", "정보 공유", "모임/행사"];
  const filteredPosts = filterByCategory(posts, category, "category");
  return (
    <AppFrame>
      <PageMotion className="page community">
        <header className="title-header no-icon">
          <h1>강릉에서 살아본 이야기</h1>
        </header>
        <div className="tabs community-tabs">
          {categories.map((cat) => (
            <button key={cat} className={cat === category ? "tab-active" : ""} onClick={() => setCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
        <div className="post-list">
          {filteredPosts.map((post) => (
            <article className="post-card" key={post.title}>
              <header>
                <div className="avatar">
                  <UserRound size={15} />
                </div>
                <div>
                  <b>{post.author}</b>
                  <small>{post.time}</small>
                </div>
                <MoreHorizontal size={19} />
              </header>
              <h3>{post.title}</h3>
              <div className="post-body">
                <p>{post.body}</p>
                <img src={post.image} alt="" />
              </div>
              <footer>
                <span>
                  <ThumbsUp size={15} /> {post.likes}
                </span>
                <span>
                  <MessageCircle size={15} /> {post.comments}
                </span>
              </footer>
            </article>
          ))}
        </div>
        <button className="fab" aria-label="새 글 쓰기">
          <Plus size={23} />
        </button>
      </PageMotion>
    </AppFrame>
  );
}

export function MyPage() {
  const { profile, savedIds } = useApp();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const menu = [
    ["나의 일정", CalendarDays],
    ["찜한 장소", Heart],
    ["나의 리뷰", Star],
    ["생활비 정산", CircleHelp],
    ["설정", Settings],
  ];
  const saved = regions.filter((region) => savedIds.includes(region.id));

  return (
    <AppFrame>
      <PageMotion className="mypage">
        <header className="profile-header">
          <button className="icon-button" aria-label="설정">
            <Settings size={18} />
          </button>
          <div className="profile-avatar">
            <img src={images.room} alt="프로필" />
          </div>
          <div>
            <h1>{profile.nickname}</h1>
            <p>강릉에서 12일째 살아보는 중 🌱</p>
          </div>
        </header>
        <section className="diary">
          <h2>체류 기록</h2>
          <div className="diary-stats">
            <StatCard label="체류 일수" value="12" />
            <StatCard label="방문한 장소" value="5" />
            <StatCard label="작성한 일기" value="18" />
          </div>
          <div className="menu-list">
            {menu.map(([label, Icon]) => {
              const MenuIcon = Icon as typeof Settings;
              const isActive = activeTab === label;
              return (
                <div key={label as string}>
                  <button
                    onClick={() => setActiveTab(isActive ? null : (label as string))}
                    className={isActive ? "active" : ""}
                  >
                    <MenuIcon size={17} />
                    <span>{label as string}</span>
                    <ChevronRight size={17} />
                  </button>
                  {isActive && (
                    <div className="menu-content">
                      {label === "나의 일정" && (
                        <div className="content-section">
                          <div className="schedule-item">
                            <h4>강릉 12일 체류 일정</h4>
                            <p>📅 2025년 9월 8일 - 9월 20일</p>
                            <p>📍 숙소: 강릉 해변 펜션</p>
                            <div className="schedule-activities">
                              <div className="activity">✓ 정동진 일출 감상</div>
                              <div className="activity">✓ 경포대 해변 산책</div>
                              <div className="activity">✓ 강릉 커피 투어</div>
                              <div className="activity">✓ 오죽헌 방문</div>
                              <div className="activity">✓ 강릉 야경 촬영</div>
                            </div>
                          </div>
                        </div>
                      )}
                      {label === "찜한 장소" && (
                        <div className="content-section">
                          {saved.length ? (
                            <div className="saved-list">
                              {saved.map((region) => (
                                <div key={region.id} className="saved-item">
                                  <img src={region.heroImage} alt={region.city} />
                                  <div>
                                    <h4>{region.city}</h4>
                                    <p>{region.tags.slice(0, 2).join(", ")}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="empty-content">아직 찜한 지역이 없어요.</p>
                          )}
                        </div>
                      )}
                      {label === "나의 리뷰" && (
                        <div className="content-section">
                          <div className="review-item">
                            <h4>경포대 해변 - 훌륭한 일출 명소</h4>
                            <div className="rating">⭐⭐⭐⭐⭐</div>
                            <p>정동진보다 덜 붐비고 조용한데 정말 좋았습니다. 아침 일찍 가시면 한적하게 일출을 감상할 수 있어요.</p>
                            <small>2025년 9월 15일</small>
                          </div>
                          <div className="review-item">
                            <h4>강릉 커피 거리 - 커피의 성지</h4>
                            <div className="rating">⭐⭐⭐⭐</div>
                            <p>정말 커피 맛집이 많아요. 워케이션 하기에 최고의 환경입니다.</p>
                            <small>2025년 9월 12일</small>
                          </div>
                        </div>
                      )}
                      {label === "생활비 정산" && (
                        <div className="content-section">
                          <div className="budget-summary">
                            <div className="budget-item">
                              <span>🏨 숙소</span>
                              <span className="amount">₩1,200,000</span>
                            </div>
                            <div className="budget-item">
                              <span>🍽️ 식사</span>
                              <span className="amount">₩450,000</span>
                            </div>
                            <div className="budget-item">
                              <span>🚗 이동</span>
                              <span className="amount">₩180,000</span>
                            </div>
                            <div className="budget-item">
                              <span>🎯 액티비티</span>
                              <span className="amount">₩320,000</span>
                            </div>
                            <div className="budget-total">
                              <strong>총 예상 생활비</strong>
                              <strong className="total">₩2,150,000</strong>
                            </div>
                          </div>
                        </div>
                      )}
                      {label === "설정" && (
                        <div className="content-section">
                          <div className="setting-item">
                            <label>닉네임</label>
                            <input type="text" value={profile.nickname} disabled />
                          </div>
                          <div className="setting-item">
                            <label>라이프스타일</label>
                            <input type="text" value={profile.lifestyleType} disabled />
                          </div>
                          <div className="setting-item">
                            <label>관심사</label>
                            <input type="text" value={profile.interests.join(", ")} disabled />
                          </div>
                          <button className="logout-btn">로그아웃</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </PageMotion>
    </AppFrame>
  );
}
