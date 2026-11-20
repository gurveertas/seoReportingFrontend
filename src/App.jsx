import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthProvider from './auth/AuthProvider.jsx'
import AuthPage from './components/AuthPage.jsx'
import { GuestRoute, ProtectedRoute } from './components/ProtectedRoute.jsx'
import ThemeProvider from './theme/ThemeProvider.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import OverviewPage from './pages/OverviewPage.jsx'
import ReportsPage from './pages/ReportsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import SitesPage from './pages/SitesPage.jsx'
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
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<OverviewPage />} />
                  <Route path="/dashboard/:clientId" element={<DashboardPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/sites" element={<SitesPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </WorkspaceProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
