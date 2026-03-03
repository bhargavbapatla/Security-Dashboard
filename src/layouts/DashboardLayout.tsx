import { type FC, useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  FolderKanban,
  Radar,
  CalendarClock,
  Bell,
  Settings,
  LifeBuoy,
  ChevronRight,
} from 'lucide-react'

const Header: FC = () => {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    navigate('/login', { replace: true })
  }
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-primary" />
        <span className="text-sm font-semibold tracking-wide text-foreground">aps</span>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Button size="sm" variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  )
}

const navTop = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/app/scans', icon: Radar, label: 'Scans' },
  { to: '/app/schedule', icon: CalendarClock, label: 'Schedule' },
]

const navBottom = [
  { to: '/app/notifications', icon: Bell, label: 'Notifications' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
  { to: '/app/support', icon: LifeBuoy, label: 'Support' },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-[#1a2e2b] text-primary dark:bg-[#1a2e2b]'
      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
  ].join(' ')

const Sidebar: FC<{ isScanInProgress?: boolean }> = ({ isScanInProgress }) => {
  return (
    <aside className="flex h-full w-60 flex-col border-r border-border bg-card px-3 py-4">
      {/* Top nav */}
      <nav className="flex flex-col gap-1">
        {navTop.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={navLinkClass}>
            <div className="relative">
              <Icon className="h-4 w-4 shrink-0" />
              {to === '/app/scans' && isScanInProgress && (
                <span className="absolute -bottom-0 -left-0 h-1.5 w-1.5 rounded-full bg-[#f97316] ring-1 ring-card dark:ring-background" />
              )}
            </div>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="my-3 h-px bg-border" />

      {/* Bottom nav */}
      <nav className="flex flex-col gap-1">
        {navBottom.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={navLinkClass}>
            <Icon className="h-4 w-4 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User profile pinned to bottom */}
      <div className="mt-auto">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-accent cursor-pointer transition-colors">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
            A
          </div>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-xs font-semibold text-foreground">admin@edu.com</span>
            <span className="truncate text-xs text-muted-foreground">Security Lead</span>
          </div>
          <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
        </div>
      </div>
    </aside>
  )
}

import { type Scan } from '@/data/scans'

export interface DashboardContextType {
  isScanInProgress: boolean;
  setIsScanInProgress: (val: boolean) => void;
  newScanResult: Scan | null;
  setNewScanResult: (scan: Scan | null) => void;
}

const DashboardLayout: FC = () => {
  const [isScanInProgress, setIsScanInProgress] = useState(false)
  const [newScanResult, setNewScanResult] = useState<Scan | null>(null)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar — sticky, always full viewport height minus header */}
        <div className="sticky top-0 h-[calc(100vh-56px)] w-60 shrink-0 self-start">
          <Sidebar isScanInProgress={isScanInProgress} />
        </div>
        {/* Main content scrolls independently and matches sidebar height */}
        <main className="h-[calc(100vh-56px)] flex-1 overflow-y-auto p-4 bg-background">
          <Outlet context={{
            isScanInProgress, setIsScanInProgress,
            newScanResult, setNewScanResult
          } satisfies DashboardContextType} />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
