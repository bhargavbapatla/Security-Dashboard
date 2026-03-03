import { type FC } from 'react'
import { Outlet } from 'react-router-dom'

const ProtectedLayout: FC = () => {
  return <Outlet />
}

export default ProtectedLayout
