import { Routes, Route, Navigate } from 'react-router-dom'
import OverlayPage from './pages/OverlayPage'
import ControlPage from './pages/ControlPage'

export default function App() {
  return (
    <Routes>
      <Route path="/overlay" element={<OverlayPage />} />
      <Route path="/control" element={<ControlPage />} />
      <Route path="*" element={<Navigate to="/control" replace />} />
    </Routes>
  )
}
