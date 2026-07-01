import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DashboardAdmin from './pages/DashboardAdmin'
import DashboardPeminjam from './pages/DashboardPeminjam'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/peminjam/dashboard" element={<DashboardPeminjam />} />
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
      </Routes>
    </Router>
  )
}

export default App
