import { useMemo, useState } from 'react'
import KartuAnggotaSection from './KartuAnggotaSection'
import RequestBukuSection from './RequestBukuSection'

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

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

function ProfilSection({
  currentUser, activeBorrows, loanHistory,
  profilNama, setProfilNama, isUpdatingNama, profilNamaMsg, profilNamaTone, handleUpdateNama,
  profilEmail, setProfilEmail, isUpdatingEmail, profilEmailMsg, profilEmailTone, handleUpdateEmail,
  passwordForm, setPasswordForm, isUpdatingPassword, profilPasswordMsg, profilPasswordTone, handleChangePassword
}) {
  const [showPasswords, setShowPasswords] = useState({ current: false, baru: false, confirm: false })

  const toggleShow = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }
  const profileInfo = [
    { label: 'Nama Lengkap', value: currentUser?.nama || '-' },
    { label: 'Email', value: currentUser?.email || '-' },
    { label: 'Status Akun', value: 'Aktif' },
    {
      label: 'Nomor Anggota',
      value: currentUser?.id ? `AGT-${String(currentUser.id).padStart(4, '0')}` : '-',
    },
  ]

  const stats = [
    { label: 'Total Dipinjam', value: loanHistory.length },
    { label: 'Aktif', value: activeBorrows.filter(b => ['booking','dipinjam','terlambat','menunggu_pembayaran'].includes(b.status)).length },
    { label: 'Selesai', value: loanHistory.filter(b => b.status === 'dikembalikan').length },
    { label: 'Booking Aktif', value: activeBorrows.filter(b => b.status === 'booking').length },
  ]

  const { monthlyData, yearlyData, maxMonthly, maxYearly } = useMemo(() => {
    const months = {}
    const years = {}
    for (const b of loanHistory) {
      if (!b.tanggal_pinjam) continue
      const d = new Date(b.tanggal_pinjam)
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      months[m] = (months[m] || 0) + 1
      const y = d.getFullYear()
      years[y] = (years[y] || 0) + 1
    }

    const now = new Date()
    const monthsArr = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      monthsArr.push({
        label: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
        count: months[key] || 0,
      })
    }
    const mMax = Math.max(...monthsArr.map(m => m.count), 1)

    const yearsArr = Object.entries(years)
      .map(([year, count]) => ({ label: year, count }))
      .sort((a, b) => a.label.localeCompare(b.label))
    const yMax = Math.max(...yearsArr.map(y => y.count), 1)

    return { monthlyData: monthsArr, yearlyData: yearsArr, maxMonthly: mMax, maxYearly: yMax }
  }, [loanHistory])

  const topBooks = useMemo(() => {
    const map = {}
    for (const b of loanHistory) {
      if (!b.judul) continue
      const key = b.judul
      if (!map[key]) map[key] = { judul: key, count: 0 }
      map[key].count++
    }
    return Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
  }, [loanHistory])

  const hasChartData = monthlyData.some(m => m.count > 0) || yearlyData.length > 0

  return (
    <div className="profil-page-wrapper">
      <section className="borrower-section-card">
        <div className="section-heading">
          <p>Profil</p>
          <h3>Informasi Akun Peminjam</h3>
        </div>

        <div className="profile-header-card">
          <div className="profile-avatar">
            {currentUser?.nama?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="profile-headline">
            <strong>{currentUser?.nama || '-'}</strong>
            <small>{currentUser?.email || '-'}</small>
            <span className="profile-badge">Anggota Perpustakaan</span>
          </div>
        </div>

        <div className="profile-stats-grid">
          {stats.map((stat) => (
            <article key={stat.label} className="profile-stat-card">
              <strong>{stat.value}</strong>
              <small>{stat.label}</small>
            </article>
          ))}
        </div>

        <div className="profile-info-grid">
          {profileInfo.map((item) => (
            <article key={item.label} className="profile-info-item">
              <small>{item.label}</small>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="borrower-section-card">
        <div className="section-heading">
          <p>Pengaturan</p>
          <h3>Update Nama Lengkap</h3>
        </div>
        <form onSubmit={handleUpdateNama} style={{ padding: '0 0 4px' }}>
          <div className="borrower-input-group">
            <label>Nama Lengkap</label>
            <div className="borrower-input-wrap">
              <input
                type="text"
                className="borrower-input"
                value={profilNama}
                onChange={(e) => setProfilNama(e.target.value)}
                required
                disabled={isUpdatingNama}
                placeholder="Nama lengkap"
              />
            </div>
          </div>
          {profilNamaMsg && (
            <div className={`borrower-msg borrower-msg--${profilNamaTone}`}>
              {profilNamaMsg}
            </div>
          )}
          <button type="submit" className="borrower-btn borrower-btn--primary" disabled={isUpdatingNama}>
            {isUpdatingNama ? 'Menyimpan...' : 'Simpan Nama'}
          </button>
        </form>
      </section>

      <section className="borrower-section-card">
        <div className="section-heading">
          <p>Pengaturan</p>
          <h3>Update Email</h3>
        </div>
        <form onSubmit={handleUpdateEmail} style={{ padding: '0 0 4px' }}>
          <div className="borrower-input-group">
            <label>Alamat Email</label>
            <div className="borrower-input-wrap">
              <input
                type="email"
                className="borrower-input"
                value={profilEmail}
                onChange={(e) => setProfilEmail(e.target.value)}
                required
                disabled={isUpdatingEmail}
                placeholder="nama@email.com"
              />
            </div>
          </div>
          {profilEmailMsg && (
            <div className={`borrower-msg borrower-msg--${profilEmailTone}`}>
              {profilEmailMsg}
            </div>
          )}
          <button type="submit" className="borrower-btn borrower-btn--primary" disabled={isUpdatingEmail}>
            {isUpdatingEmail ? 'Menyimpan...' : 'Simpan Email'}
          </button>
        </form>
      </section>

      <section className="borrower-section-card">
        <div className="section-heading">
          <p>Pengaturan</p>
          <h3>Ganti Password</h3>
        </div>
        <form onSubmit={handleChangePassword} style={{ padding: '0 0 4px' }}>
          <div className="borrower-input-group">
            <label>Password Saat Ini</label>
            <div className="borrower-input-wrap">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                className="borrower-input"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm(p => ({ ...p, current: e.target.value }))}
                required
                disabled={isUpdatingPassword}
                autoComplete="current-password"
                placeholder="Masukkan password saat ini"
              />
              <button type="button" className="borrower-input-toggle" onClick={() => toggleShow('current')} tabIndex={-1}>
                {showPasswords.current ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
          <div className="borrower-input-group">
            <label>Password Baru</label>
            <div className="borrower-input-wrap">
              <input
                type={showPasswords.baru ? 'text' : 'password'}
                className="borrower-input"
                value={passwordForm.baru}
                onChange={(e) => setPasswordForm(p => ({ ...p, baru: e.target.value }))}
                required
                disabled={isUpdatingPassword}
                autoComplete="new-password"
                placeholder="Minimal 6 karakter"
              />
              <button type="button" className="borrower-input-toggle" onClick={() => toggleShow('baru')} tabIndex={-1}>
                {showPasswords.baru ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
          <div className="borrower-input-group">
            <label>Konfirmasi Password Baru</label>
            <div className="borrower-input-wrap">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                className="borrower-input"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
                required
                disabled={isUpdatingPassword}
                autoComplete="new-password"
                placeholder="Ketik ulang password baru"
              />
              <button type="button" className="borrower-input-toggle" onClick={() => toggleShow('confirm')} tabIndex={-1}>
                {showPasswords.confirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
          {profilPasswordMsg && (
            <div className={`borrower-msg borrower-msg--${profilPasswordTone}`}>
              {profilPasswordMsg}
            </div>
          )}
          <button type="submit" className="borrower-btn borrower-btn--primary" disabled={isUpdatingPassword}>
            {isUpdatingPassword ? 'Menyimpan...' : 'Ubah Password'}
          </button>
        </form>
      </section>

      <KartuAnggotaSection currentUser={currentUser} />

      <RequestBukuSection currentUser={currentUser} />

      {hasChartData && (
        <section className="borrower-section-card">
          <div className="profile-charts">
            <div className="section-heading">
              <p>Statistik</p>
              <h3>Riwayat Peminjaman</h3>
            </div>

            <div className="profile-chart-group">
              <h5 className="profile-chart-title">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="3" x2="9" y2="9"/></svg>
                Per Bulan
              </h5>
              <div className="profile-chart-bars">
                {monthlyData.map((m) => (
                  <div key={m.label} className="profile-chart-row">
                    <span className="profile-chart-label">{m.label}</span>
                    <div className="profile-chart-track">
                      <div
                        className="profile-chart-bar"
                        style={{ width: `${(m.count / maxMonthly) * 100}%` }}
                      >
                        {m.count > 0 && <span className="profile-chart-val">{m.count}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {yearlyData.length > 1 && (
              <div className="profile-chart-group">
                <h5 className="profile-chart-title">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Per Tahun
                </h5>
                <div className="profile-chart-bars">
                  {yearlyData.map((y) => (
                    <div key={y.label} className="profile-chart-row">
                      <span className="profile-chart-label">{y.label}</span>
                      <div className="profile-chart-track">
                        <div
                          className="profile-chart-bar profile-chart-bar--year"
                          style={{ width: `${(y.count / maxYearly) * 100}%` }}
                        >
                          {y.count > 0 && <span className="profile-chart-val">{y.count}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {topBooks.length > 0 && (
              <div className="profile-chart-group">
                <h5 className="profile-chart-title">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                  Buku Favorit
                </h5>
                <div className="profile-top-books">
                  {topBooks.map((book, idx) => (
                    <div key={book.judul} className="profile-top-book">
                      <span className="profile-top-rank">{idx + 1}</span>
                      <div className="profile-top-book-body">
                        <strong>{book.judul}</strong>
                        <small>{book.count}x dipinjam</small>
                      </div>
                      <span className="profile-top-count">{book.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

export default ProfilSection