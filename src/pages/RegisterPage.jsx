import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api'
import KtpUpload from '../components/KtpUpload'

const initialForm = { nama_lengkap: '', alamat: '', email: '', password: '' }

const UserIcon = () => (
  <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const MailIcon = () => (
  <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 4L12 13 2 4" />
  </svg>
)

const MapPinIcon = () => (
  <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const LockIcon = () => (
  <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { document.title = 'Daftar | Perpustakaan Hukum' }, [])

  const [ktpBase64, setKtpBase64] = useState('')

  const [showCamera, setShowCamera] = useState(false)
  const [fotoWajah, setFotoWajah] = useState('')
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    if (!showCamera) return
    let cancelled = false
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } })
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return }
        streamRef.current = stream
        const video = videoRef.current
        if (video) {
          video.srcObject = stream
          await video.play()
        }
      } catch {
        if (!cancelled) setMessage('Kamera tidak dapat diakses. Izinkan akses kamera.')
      }
    }
    start()
    return () => {
      cancelled = true
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
        streamRef.current = null
      }
    }
  }, [showCamera])

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  const startCamera = () => {
    setShowCamera(true)
  }

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }, [])

  const capturePhoto = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
      setFotoWajah(dataUrl)
    } catch {
      setMessage('Gagal memproses foto wajah.')
    }
    stopCamera()
  }, [stopCamera])

  const handleKtpChange = (base64) => {
    setKtpBase64(base64)
  }

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fotoWajah) {
      setMessage('Foto wajah wajib diambil.')
      return
    }
    if (!ktpBase64) {
      setMessage('Upload foto KTP wajib diisi.')
      return
    }

    try {
      setLoading(true)
      setMessage('Mengirim data registrasi...')

      const payload = {
        nama: form.nama_lengkap,
        alamat: form.alamat,
        email: form.email,
        password: form.password,
        foto: fotoWajah,
        foto_ktp: ktpBase64,
      }

      const response = await API.post('/auth/register', payload)

      if (!response.data?.success) {
        setMessage(response.data?.message || 'Register gagal.')
        return
      }
      setMessage('Register berhasil! Silakan login.')
      setForm(initialForm)
      setFotoWajah('')
      setKtpBase64('')
      setTimeout(() => navigate('/login'), 1000)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Register gagal.')
    } finally {
      setLoading(false)
    }
  }

  const fotoWajahPreview = fotoWajah

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
            <h2>Daftar Anggota</h2>
            <p>Lengkapi data diri untuk membuat akun baru</p>
          </div>
          <div className="auth-card-divider" />
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form-grid">
              <div className="auth-input-group">
                <label htmlFor="nama_lengkap">Nama Lengkap</label>
                <div className="auth-input-wrap">
                  <UserIcon />
                  <input
                    id="nama_lengkap"
                    type="text"
                    name="nama_lengkap"
                    placeholder="Nama lengkap"
                    value={form.nama_lengkap}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>
              <div className="auth-input-group">
                <label htmlFor="email">Email</label>
                <div className="auth-input-wrap">
                  <MailIcon />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="nama@email.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="auth-input-group">
              <label htmlFor="alamat">Alamat</label>
              <div className="auth-input-wrap">
                <MapPinIcon />
                <textarea
                  id="alamat"
                  name="alamat"
                  placeholder="Alamat lengkap"
                  value={form.alamat}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>
            </div>
            <div className="auth-input-group">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <LockIcon />
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Minimal 8 karakter"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength="8"
                  required
                />
              </div>
            </div>
            <div className="auth-photo-grid">
              <div className="auth-photo-field">
                <label>Foto Wajah <span className="required">*</span></label>
                <div className="auth-photo-area">
                  {showCamera ? (
                    <div className="auth-camera-box">
                      <video ref={videoRef} autoPlay playsInline className="auth-camera-video" />
                      <canvas ref={canvasRef} style={{ display: 'none' }} />
                      <div className="auth-camera-actions">
                        <button type="button" className="auth-camera-btn" onClick={capturePhoto}>Ambil Foto</button>
                        <button type="button" className="auth-camera-btn auth-camera-btn--cancel" onClick={stopCamera}>Batal</button>
                      </div>
                    </div>
                  ) : fotoWajah ? (
                    <div className="auth-photo-preview">
                      <img src={fotoWajahPreview} alt="Foto Wajah" />
                      <button type="button" className="auth-photo-ubah" onClick={() => { setFotoWajah(''); startCamera() }}>Ubah Foto</button>
                    </div>
                  ) : (
                    <button type="button" className="auth-camera-trigger" onClick={startCamera}>
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      <span>Ambil Foto Wajah</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="auth-photo-field">
                <label>Foto KTP <span className="required">*</span></label>
                <KtpUpload value={ktpBase64} onChange={handleKtpChange} />
              </div>
            </div>
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="auth-btn-loading">
                  <span className="auth-spinner" />
                  Memproses...
                </span>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </form>
          {message && (
            <div className={`auth-message auth-message--${message.includes('berhasil') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          <div className="auth-form-footer">
            <p>
              Sudah punya akun? <Link to="/login">Masuk ke portal</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
