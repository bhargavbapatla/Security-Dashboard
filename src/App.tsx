import { type FC } from 'react'
import Login from './pages/Login'
import { ThemeProvider } from './components/theme-provider'

const App: FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Login />
    </ThemeProvider>
  )
}

export default App
