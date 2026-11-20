import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthProvider from './auth/AuthProvider.jsx'
import AuthPage from './components/AuthPage.jsx'
import { GuestRoute, ProtectedRoute } from './components/ProtectedRoute.jsx'
import ThemeProvider from './theme/ThemeProvider.jsx'
import ApiTestPage from './pages/ApiTestPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<GuestRoute><AuthPage /></GuestRoute>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/test-api" element={<ApiTestPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
