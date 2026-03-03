import { type FC, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Loader from '@/components/Loader'
import ProtectedLayout from '@/layouts/ProtectedLayout'
import PublicLayout from '@/layouts/PublicLayout'
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
const Login = lazy(() => import('@/pages/Login'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Scans = lazy(() => import('@/pages/Scans'))
const Projects = lazy(() => import('@/pages/Projects'))
const Schedule = lazy(() => import('@/pages/Schedule'))
const Notifications = lazy(() => import('@/pages/Notifications'))
const SettingsPage = lazy(() => import('@/pages/Settings'))
const Support = lazy(() => import('@/pages/Support'))

const AppRouter: FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route element={<PublicLayout />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
            </Route>
          </Route>
          <Route element={<ProtectedLayout />}>
            <Route path="/app" element={<DashboardLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="scans" element={<Scans />} />
              <Route path="projects" element={<Projects />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="support" element={<Support />} />
            </Route>
          </Route>
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default AppRouter
