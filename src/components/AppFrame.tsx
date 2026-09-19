import type { ReactNode } from 'react'
import { CalendarDays, Compass, House, Map, UserRound } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'

const navItems = [{ to: '/home', label: '홈', icon: House }, { to: '/map', label: '지도', icon: Map }, { to: '/itinerary', label: '일정', icon: CalendarDays }, { to: '/community', label: '커뮤니티', icon: Compass }, { to: '/mypage', label: '마이', icon: UserRound }]

export function AppFrame({ children, nav = true }: { children: ReactNode; nav?: boolean }) {
  const location = useLocation()
  return <div className="app-frame"><main className={`app-scroll ${nav ? 'with-nav' : ''}`}>{children}</main>{nav && <nav className="bottom-nav" aria-label="주요 메뉴">{navItems.map(({ to, label, icon: Icon }) => { const active = location.pathname === to; return <NavLink className={`nav-item ${active ? 'active' : ''}`} to={to} key={to}><Icon size={17} strokeWidth={active ? 2.6 : 1.8} /><span>{label}</span></NavLink> })}</nav>}</div>
}