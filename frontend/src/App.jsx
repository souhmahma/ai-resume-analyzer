import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import LoadingScreen from './components/ui/LoadingScreen'
import ErrorPage from './components/ui/ErrorPage'

import Landing   from './pages/Landing'
import Login     from './pages/auth/Login'
import Register  from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import Analyze   from './pages/Analyze'
import Results   from './pages/Results'
import Profile   from './pages/Profile'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user)   return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (user)    return <Navigate to="/dashboard" replace />
  return children
}

function AppContent() {
  const { loading } = useAuth()
  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/analyze"   element={<ProtectedRoute><Analyze /></ProtectedRoute>} />
        <Route path="/results/:id" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Error pages */}
        <Route path="/403" element={<ErrorPage type={403} />} />
        <Route path="/500" element={<ErrorPage type={500} />} />
        <Route path="*"    element={<ErrorPage type={404} />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background  : '#1e1e2e',
              color       : '#fff',
              border      : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize    : '14px',
            },
            success: {
              iconTheme: { primary: '#6366f1', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  )
}