import { type FC } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'

const SidebarLink: FC<{ to: string; label: string }> = ({ to, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm',
          isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent',
        ].join(' ')
      }
    >
      <span>{label}</span>
    </NavLink>
  )
}

const Header: FC = () => {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    navigate('/login', { replace: true })
  }
  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-primary" />
        <span className="text-sm font-semibold tracking-wide">aps</span>
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

const Sidebar: FC = () => {
  return (
    <aside className="flex w-60 flex-col gap-1 border-r p-3">
      <SidebarLink to="/app/dashboard" label="Dashboard" />
      <SidebarLink to="/app/scans" label="Scans" />
    </aside>
  )
}

const DashboardLayout: FC = () => {
  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr] grid-rows-[56px_1fr]">
      <div className="col-span-2">
        <Header />
      </div>
      <div>
        <Sidebar />
      </div>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
