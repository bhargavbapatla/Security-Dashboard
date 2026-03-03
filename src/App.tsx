import { type FC } from 'react'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/sonner'
import AppRouter from './routes/AppRouter'

const App: FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />
      <AppRouter />
    </ThemeProvider>
  )
}

export default App
