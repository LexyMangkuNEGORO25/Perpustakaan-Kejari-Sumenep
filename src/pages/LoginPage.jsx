import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api'
import Footer from '../components/Footer'

const initialForm = { email: '', password: '' }

const MailIcon = () => (
  <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 4L12 13 2 4" />
  </svg>
)

const LockIcon = () => (
  <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

function LoginPage() {
  const [form, setForm] = useState(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [shakeForm, setShakeForm] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setMessage('')
      setShakeForm(false)
      const response = await API.post('/auth/login', {
        email: form.email.trim(),
        password: form.password,
      })
      if (!response.data?.success || !response.data.user) {
        setMessage(response.data?.message || 'Login gagal.')
        setShakeForm(true)
        setTimeout(() => setShakeForm(false), 500)
        return
      }
      const user = response.data.user
      localStorage.setItem('currentUser', JSON.stringify(user))
      localStorage.setItem('token', response.data.token)
      setSuccess(true)
      setMessage('Login berhasil!')
      setTimeout(() => {
        navigate(user.role === 'peminjam' ? '/peminjam/dashboard' : '/admin/dashboard')
      }, 800)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login gagal.')
      setShakeForm(true)
      setTimeout(() => setShakeForm(false), 500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page-wrapper">
      <div className="auth-brand-panel">
        <div className="auth-brand-ring auth-brand-ring--1" />
        <div className="auth-brand-ring auth-brand-ring--2" />
        <div className="auth-brand-content">
          <div className="auth-brand-logo-wrap">
            <img src="/kejaksaan-logo.png" alt="Logo Kejaksaan RI" />
          </div>
          <h1 className="auth-brand-title">Perpustakaan Hukum</h1>
          <p className="auth-brand-sub">Kejaksaan Negeri Sumenep</p>
          <p className="auth-brand-tagline">
            Akses koleksi hukum, jurnal, dan referensi secara digital.
          </p>
          <svg className="auth-brand-illustration" width="180" height="120" viewBox="0 0 180 120" fill="none">
            <rect x="10" y="30" width="50" height="70" rx="3" stroke="#D4AF37" strokeWidth="1.5" fill="rgba(212,175,55,0.05)" />
            <rect x="14" y="36" width="42" height="4" rx="1" fill="rgba(212,175,55,0.3)" />
            <rect x="14" y="44" width="30" height="3" rx="1" fill="rgba(212,175,55,0.2)" />
            <rect x="14" y="52" width="35" height="3" rx="1" fill="rgba(212,175,55,0.2)" />
            <rect x="14" y="60" width="25" height="3" rx="1" fill="rgba(212,175,55,0.15)" />
            <rect x="65" y="25" width="50" height="75" rx="3" stroke="#D4AF37" strokeWidth="1.5" fill="rgba(212,175,55,0.05)" />
            <rect x="69" y="31" width="42" height="4" rx="1" fill="rgba(212,175,55,0.3)" />
            <rect x="69" y="39" width="35" height="3" rx="1" fill="rgba(212,175,55,0.2)" />
            <rect x="69" y="47" width="28" height="3" rx="1" fill="rgba(212,175,55,0.2)" />
            <rect x="69" y="55" width="38" height="3" rx="1" fill="rgba(212,175,55,0.15)" />
            <rect x="120" y="20" width="50" height="80" rx="3" stroke="#D4AF37" strokeWidth="1.5" fill="rgba(212,175,55,0.05)" />
            <rect x="124" y="26" width="42" height="4" rx="1" fill="rgba(212,175,55,0.3)" />
            <rect x="124" y="34" width="32" height="3" rx="1" fill="rgba(212,175,55,0.2)" />
            <rect x="124" y="42" width="36" height="3" rx="1" fill="rgba(212,175,55,0.2)" />
            <circle cx="145" cy="70" r="12" stroke="#D4AF37" strokeWidth="1.2" fill="rgba(212,175,55,0.08)" />
            <path d="M145 65v10M140 70h10" stroke="#D4AF37" strokeWidth="1.2" />
            <line x1="10" y1="105" x2="170" y2="105" stroke="rgba(212,175,55,0.15)" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>
      </div>
      <div className="auth-form-panel">
        <div className="auth-card auth-card-anim">
          <div className="auth-card-header">
            <h2>Masuk</h2>
            <p>Gunakan email dan kata sandi terdaftar</p>
          </div>
          <div className="auth-card-divider" />
          <form
            onSubmit={handleSubmit}
            className={`auth-form${shakeForm ? ' auth-form-shake' : ''}`}
          >
            <div className="auth-input-group">
              <label htmlFor="email">Email</label>
              <div className="auth-input-wrap">
                <MailIcon />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </div>
            </div>
            <div className="auth-input-group">
              <label htmlFor="password">Kata Sandi</label>
              <div className="auth-input-wrap">
                <LockIcon />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan kata sandi"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            <div className="auth-form-options">
              <label className="auth-checkbox">
                <input type="checkbox" defaultChecked />
                <span>Ingat saya</span>
              </label>
              <span className="auth-forgot">Lupa sandi?</span>
            </div>
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading || success}
            >
              {success ? (
                <span className="auth-btn-success">
                  <svg className="auth-check-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
                  </svg>
                  Berhasil!
                </span>
              ) : loading ? (
                <span className="auth-btn-loading">
                  <span className="auth-spinner" />
                  Memproses...
                </span>
              ) : (
                'Masuk ke Dashboard'
              )}
            </button>
          </form>
          {message && (
            <div className={`auth-message auth-message--${success ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          <div className="auth-form-footer">
            <p>
              Belum punya akun? <Link to="/register">Daftar anggota</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
