import { useState } from 'react'
import API from '../api'

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

function AdminProfilSection({ currentUser, profilNama, setProfilNama, isUpdatingNama, profilNamaMsg, profilNamaTone, handleUpdateNama, profilEmail, setProfilEmail, isUpdatingEmail, profilEmailMsg, profilEmailTone, handleUpdateEmail, passwordForm, setPasswordForm, isUpdatingPassword, profilPasswordMsg, profilPasswordTone, handleChangePassword }) {
  const [showPasswords, setShowPasswords] = useState({ current: false, baru: false, confirm: false })

  const toggleShow = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <div className="adm-profil-section">
      <div className="adm-profil-hero">
        <div className="adm-profil-hero-bg" />
        <div className="adm-profil-hero-content">
          <div className="adm-profil-hero-left">
            <div className="adm-profil-hero-avatar">
              {currentUser?.nama?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="adm-profil-hero-info">
              <h2 className="adm-profil-hero-name">{currentUser?.nama || 'Admin'}</h2>
              <span className="adm-profil-hero-badge">Administrator</span>
              <p className="adm-profil-hero-email">{currentUser?.email || '-'}</p>
            </div>
          </div>
          <div className="adm-profil-hero-right">
            <div className="adm-profil-hero-stat">
              <span className="adm-profil-hero-stat-value">12</span>
              <span className="adm-profil-hero-stat-label">Total Login</span>
            </div>
            <div className="adm-profil-hero-stat">
              <span className="adm-profil-hero-stat-value">Hari ini</span>
              <span className="adm-profil-hero-stat-label">Login Terakhir</span>
            </div>
          </div>
        </div>
      </div>

      <div className="adm-profil-form-grid">
        <div className="adm-profil-form-card">
          <div className="adm-profil-form-card-header">
            <div className="adm-profil-form-card-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="adm-profil-form-card-title-group">
              <h3>Update Nama</h3>
              <p>Perbarui nama lengkap yang terdaftar</p>
            </div>
          </div>
          <form onSubmit={handleUpdateNama} className="adm-profil-form-body">
            <div className="adm-profil-input-group">
              <label>Nama Lengkap</label>
              <div className="adm-profil-input-wrap">
                <svg className="adm-profil-input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  className="adm-profil-input-field"
                  value={profilNama}
                  onChange={(e) => setProfilNama(e.target.value)}
                  required
                  disabled={isUpdatingNama}
                  placeholder="Nama lengkap"
                />
              </div>
            </div>
            <div className="adm-profil-form-msg-wrap">
              {profilNamaMsg && (
                <div className={`adm-profil-form-msg adm-profil-form-msg--${profilNamaTone}`}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {profilNamaTone === 'success'
                      ? <polyline points="20 6 9 17 4 12" />
                      : profilNamaTone === 'error'
                      ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                      : <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>
                    }
                  </svg>
                  <span>{profilNamaMsg}</span>
                </div>
              )}
            </div>
            <button type="submit" className="adm-profil-submit-btn" disabled={isUpdatingNama}>
              {isUpdatingNama ? (
                <><span className="adm-profil-spinner" /> Menyimpan...</>
              ) : (
                <><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> Simpan Nama</>
              )}
            </button>
          </form>
        </div>

        <div className="adm-profil-form-card">
          <div className="adm-profil-form-card-header">
            <div className="adm-profil-form-card-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 4L12 13 2 4" />
              </svg>
            </div>
            <div className="adm-profil-form-card-title-group">
              <h3>Update Email</h3>
              <p>Perbarui alamat email yang terdaftar</p>
            </div>
          </div>
          <form onSubmit={handleUpdateEmail} className="adm-profil-form-body">
            <div className="adm-profil-input-group">
              <label>Alamat Email</label>
              <div className="adm-profil-input-wrap">
                <svg className="adm-profil-input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 4L12 13 2 4" />
                </svg>
                <input
                  type="email"
                  className="adm-profil-input-field"
                  value={profilEmail}
                  onChange={(e) => setProfilEmail(e.target.value)}
                  required
                  disabled={isUpdatingEmail}
                  placeholder="nama@email.com"
                />
              </div>
            </div>
            <div className="adm-profil-form-msg-wrap">
              {profilEmailMsg && (
                <div className={`adm-profil-form-msg adm-profil-form-msg--${profilEmailTone}`}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {profilEmailTone === 'success'
                      ? <polyline points="20 6 9 17 4 12" />
                      : profilEmailTone === 'error'
                      ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                      : <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>
                    }
                  </svg>
                  <span>{profilEmailMsg}</span>
                </div>
              )}
            </div>
            <button type="submit" className="adm-profil-submit-btn" disabled={isUpdatingEmail}>
              {isUpdatingEmail ? (
                <><span className="adm-profil-spinner" /> Menyimpan...</>
              ) : (
                <><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg> Simpan Email</>
              )}
            </button>
          </form>
        </div>

        <div className="adm-profil-form-card">
          <div className="adm-profil-form-card-header">
            <div className="adm-profil-form-card-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className="adm-profil-form-card-title-group">
              <h3>Ganti Password</h3>
              <p>Gunakan kombinasi kata sandi yang kuat</p>
            </div>
          </div>
          <form onSubmit={handleChangePassword} className="adm-profil-form-body">
            <div className="adm-profil-input-group">
              <label>Password Saat Ini</label>
              <div className="adm-profil-input-wrap">
                <svg className="adm-profil-input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  className="adm-profil-input-field"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm(p => ({ ...p, current: e.target.value }))}
                  required
                  disabled={isUpdatingPassword}
                  autoComplete="current-password"
                  placeholder="Masukkan password saat ini"
                />
                <button type="button" className="adm-profil-pw-toggle" onClick={() => toggleShow('current')} tabIndex={-1}>
                  {showPasswords.current ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            <div className="adm-profil-input-group">
              <label>Password Baru</label>
              <div className="adm-profil-input-wrap">
                <svg className="adm-profil-input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPasswords.baru ? 'text' : 'password'}
                  className="adm-profil-input-field"
                  value={passwordForm.baru}
                  onChange={(e) => setPasswordForm(p => ({ ...p, baru: e.target.value }))}
                  required
                  disabled={isUpdatingPassword}
                  autoComplete="new-password"
                  placeholder="Minimal 6 karakter"
                />
                <button type="button" className="adm-profil-pw-toggle" onClick={() => toggleShow('baru')} tabIndex={-1}>
                  {showPasswords.baru ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            <div className="adm-profil-input-group">
              <label>Konfirmasi Password Baru</label>
              <div className="adm-profil-input-wrap">
                <svg className="adm-profil-input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  className="adm-profil-input-field"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
                  required
                  disabled={isUpdatingPassword}
                  autoComplete="new-password"
                  placeholder="Ketik ulang password baru"
                />
                <button type="button" className="adm-profil-pw-toggle" onClick={() => toggleShow('confirm')} tabIndex={-1}>
                  {showPasswords.confirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            <div className="adm-profil-form-msg-wrap">
              {profilPasswordMsg && (
                <div className={`adm-profil-form-msg adm-profil-form-msg--${profilPasswordTone}`}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {profilPasswordTone === 'success'
                      ? <polyline points="20 6 9 17 4 12" />
                      : profilPasswordTone === 'error'
                      ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                      : <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>
                    }
                  </svg>
                  <span>{profilPasswordMsg}</span>
                </div>
              )}
            </div>
            <button type="submit" className="adm-profil-submit-btn" disabled={isUpdatingPassword}>
              {isUpdatingPassword ? (
                <><span className="adm-profil-spinner" /> Menyimpan...</>
              ) : (
                <><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> Ubah Password</>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="adm-profil-tips">
        <div className="adm-profil-tips-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div className="adm-profil-tips-body">
          <h4>Tips Keamanan</h4>
          <ul>
            <li>Gunakan minimal 8 karakter dengan kombinasi huruf besar, huruf kecil, angka, dan simbol</li>
            <li>Hindari menggunakan kata sandi yang sama untuk akun lain</li>
            <li>Ganti kata sandi secara berkala setiap 3 bulan</li>
            <li>Jangan pernah membagikan kata sandi kepada siapapun</li>
          </ul>
        </div>
        <div className="adm-profil-tips-illustration">
          <svg viewBox="0 0 120 120" width="120" height="120" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.15">
            <rect x="10" y="20" width="100" height="80" rx="8" />
            <rect x="20" y="35" width="80" height="6" rx="3" />
            <rect x="20" y="50" width="60" height="6" rx="3" />
            <rect x="20" y="65" width="40" height="6" rx="3" />
            <circle cx="90" cy="80" r="15" />
            <path d="M86 80l3 3 6-6" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default AdminProfilSection
