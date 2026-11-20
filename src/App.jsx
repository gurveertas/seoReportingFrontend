import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthProvider from './auth/AuthProvider.jsx'
import AuthPage from './components/AuthPage.jsx'
import { GuestRoute, ProtectedRoute } from './components/ProtectedRoute.jsx'
import ThemeProvider from './theme/ThemeProvider.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import { WorkspaceProvider } from './workspace/WorkspaceProvider.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <WorkspaceProvider>
            <Routes>
              <Route path="/" element={<GuestRoute><AuthPage /></GuestRoute>} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard/:clientId?" element={<DashboardPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </WorkspaceProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
