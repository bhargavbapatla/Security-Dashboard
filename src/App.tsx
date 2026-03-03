import { type FC } from 'react'
import Login from './pages/Login'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/sonner'

const App: FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />
      <Login />
    </ThemeProvider>
  )
}

export default App
