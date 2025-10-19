import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '@/lib/firebase'
import { useStore } from '@/store/useStore'

// Pages
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import CreatePitch from '@/pages/CreatePitch'
import Generated from '@/pages/Generated'
import PitchView from '@/pages/PitchView'
import ErrorBoundary from '@/components/ErrorBoundary'

function App() {
  const setUser = useStore((state) => state.setUser)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      // No Firebase config yet; ensure user is null and skip subscription
      setUser(null)
      return () => {}
    }
    let unsubscribe = () => {}
    try {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user)
      })
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Auth subscription failed. Is Firebase configured?', e)
      setUser(null)
    }
    return () => {
      try { unsubscribe && unsubscribe() } catch {}
    }
  }, [setUser])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreatePitch />} />
  <Route path="/generated" element={<ErrorBoundary><Generated /></ErrorBoundary>} />
        <Route path="/pitch/:id" element={<PitchView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
