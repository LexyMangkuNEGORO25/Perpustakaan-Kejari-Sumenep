import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API, { BACKEND_URL } from '../api'
import BerandaSection from './BerandaSection'
import PeminjamanSection from './PeminjamanSection'
import RiwayatSection from './RiwayatSection'
import ProfilSection from './ProfilSection'
import Footer from '../components/Footer'
import BookCard from '../components/BookCard'
import BookDetailModal from '../components/BookDetailModal'

const navItems = [
  {
    id: 'beranda', label: 'Beranda',
    icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
  },
  {
    id: 'peminjaman', label: 'Peminjaman',
    icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg>'
  },
  {
    id: 'riwayat', label: 'Riwayat',
    icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
  },
  {
    id: 'profil', label: 'Profil',
    icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
  },
]

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('currentUser') || 'null')
  } catch {
    return null
  }
}

function DashboardPeminjam() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('beranda')
  const [currentUser] = useState(readStoredUser)
  const [recommendedBooks, setRecommendedBooks] = useState([])
  const [allBooks, setAllBooks] = useState([])
  const [activeBorrows, setActiveBorrows] = useState([])
  const [loanHistory, setLoanHistory] = useState([])
  const [racks, setRacks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardMessage, setDashboardMessage] = useState('')
  const [messageTone, setMessageTone] = useState('info')
  const [bookingBookId, setBookingBookId] = useState(null)
  const navRef = useRef(null)
  const [indicatorStyle, setIndicatorStyle] = useState({})
  const [showMobileNav, setShowMobileNav] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [categoryView, setCategoryView] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [showNotifDropdown, setShowNotifDropdown] = useState(false)
  const notifBellRef = useRef(null)
  const [userBorrows, setUserBorrows] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const loadDashboardData = useCallback(async () => {
    if (!currentUser?.id) return

    try {
      setIsLoading(true)
      const role = 'publik'

      const [recommendedResponse, allBooksResponse, activeResponse, historyResponse, racksResponse] = await Promise.all([
        API.get('/books/recommended', { params: { role } }),
        API.get('/books', { params: { role } }),
        API.get('/borrows/active', { params: { user_id: currentUser.id } }),
        API.get(`/borrows/user-borrows/${currentUser.id}`),
        API.get('/books/rak/all'),
      ])

      setRecommendedBooks(Array.isArray(recommendedResponse.data) ? recommendedResponse.data : [])
      setAllBooks(Array.isArray(allBooksResponse.data) ? allBooksResponse.data : [])
      setRacks(Array.isArray(racksResponse.data) ? racksResponse.data : [])
      setActiveBorrows(Array.isArray(activeResponse.data) ? activeResponse.data : [])
      setUserBorrows(Array.isArray(historyResponse.data) ? historyResponse.data : [])
      setLoanHistory(
        (Array.isArray(historyResponse.data) ? historyResponse.data : [])
          .filter(b => ['dikembalikan', 'dibatalkan'].includes(b.status) || Boolean(b.tanggal_dikembalikan))
      )
    } catch {
      setDashboardMessage('Data dashboard belum berhasil dimuat.')
      setMessageTone('error')
    } finally {
      setIsLoading(false)
    }
  }, [currentUser])

  const fetchNotifications = useCallback(async () => {
    if (!currentUser?.id) return
    try {
      const res = await fetch(`${BACKEND_URL}/api/notifications/user/${currentUser.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      const json = await res.json()
      setNotifications(Array.isArray(json.data) ? json.data : [])
    } catch { /* ignore */ }
  }, [currentUser])

  const unreadNotifCount = notifications.filter(n => !n.is_read).length

  const handleMarkRead = async (id) => {
    try {
      await fetch(`${BACKEND_URL}/api/notifications/read/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    } catch { /* ignore */ }
  }

  const handleMarkAllRead = async () => {
    if (!currentUser?.id) return
    try {
      await fetch(`${BACKEND_URL}/api/notifications/read-all/${currentUser.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    } catch { /* ignore */ }
  }

  // polling notifikasi
  useEffect(() => {
    if (!currentUser?.id) return
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [currentUser, fetchNotifications])

  // polling + refresh data buku saat tab aktif
  useEffect(() => {
    if (!currentUser?.id) return

    const interval = setInterval(() => loadDashboardData(), 60000)

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadDashboardData()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [currentUser, loadDashboardData])

  // tutup dropdown saat klik di luar
  useEffect(() => {
    if (!showNotifDropdown) return
    const handler = (e) => {
      if (notifBellRef.current && !notifBellRef.current.contains(e.target)) {
        setShowNotifDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showNotifDropdown])

  useEffect(() => {
    if (!currentUser) { navigate('/login'); return }
    if (currentUser.role && currentUser.role !== 'peminjam') { navigate('/admin/dashboard'); return }
    const t = setTimeout(() => loadDashboardData(), 0)
    return () => clearTimeout(t)
  }, [currentUser, loadDashboardData, navigate])

  useEffect(() => {
    if (!navRef.current) return
    const activeBtn = navRef.current.querySelector(`[data-nav="${activeSection}"]`)
    if (activeBtn) {
      const navRect = navRef.current.getBoundingClientRect()
      const btnRect = activeBtn.getBoundingClientRect()
      setIndicatorStyle({
        width: btnRect.width,
        transform: `translateX(${btnRect.left - navRect.left}px)`,
      })
    }
  }, [activeSection])

  const activeLoanCount = useMemo(() =>
    activeBorrows.filter(b => ['booking', 'dipinjam', 'terlambat', 'menunggu_pembayaran'].includes(b.status)).length,
    [activeBorrows]
  )

  const overdueCount = useMemo(() =>
    activeBorrows.filter(b => b.status === 'terlambat').length,
    [activeBorrows]
  )

  const completedCount = useMemo(() =>
    loanHistory.filter(b => b.status === 'dikembalikan' || Boolean(b.tanggal_dikembalikan)).length,
    [loanHistory]
  )

  const pendingCount = useMemo(() =>
    activeBorrows.filter(b => b.status === 'booking').length,
    [activeBorrows]
  )

  const totalDenda = useMemo(() => {
    return activeBorrows
      .filter(b => b.status === 'terlambat' || b.status === 'menunggu_pembayaran')
      .reduce((sum, b) => sum + (Number(b.denda) || 0), 0)
  }, [activeBorrows])

  const memberSince = useMemo(() => {
    if (!currentUser?.created_at) return '-'
    try { return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(currentUser.created_at)) }
    catch { return '-' }
  }, [currentUser])

  const totalBooks = allBooks.length

  const booksByRak = useMemo(() => {
    const map = {}
    for (const book of allBooks) {
      const rak = book.nama_rak || 'Lainnya'
      if (!map[rak]) map[rak] = []
      map[rak].push(book)
    }
    return map
  }, [allBooks])

  const nearestDueDate = useMemo(() => {
    const sorted = [...activeBorrows]
      .filter(b => b.tanggal_kembali || b.batas_ambil)
      .sort((a, b) => new Date(a.tanggal_kembali || a.batas_ambil) - new Date(b.tanggal_kembali || b.batas_ambil))
    return sorted[0] ? formatDate(sorted[0].tanggal_kembali || sorted[0].batas_ambil) : 'Belum ada'
  }, [activeBorrows])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('token')
    navigate('/login')
  }

  const handleBooking = async (bookId) => {
    if (!currentUser?.id) { navigate('/login'); return }
    try {
      setBookingBookId(bookId)
      setDashboardMessage('Mengajukan booking buku...')
      setMessageTone('info')
      const response = await API.post('/borrows/booking', { user_id: currentUser.id, book_id: bookId })
      if (!response.data?.success) {
        setDashboardMessage(response.data?.message || 'Booking buku belum berhasil.')
        setMessageTone('error')
        return
      }
      setDashboardMessage('Booking buku berhasil!')
      setMessageTone('success')
      setActiveSection('peminjaman')
      await loadDashboardData()
    } catch (error) {
      setDashboardMessage(error.response?.data?.message || 'Booking buku gagal.')
      setMessageTone('error')
    } finally {
      setBookingBookId(null)
    }
  }

  const handleCategorySelect = (name) => {
    setCategoryView(name)
  }

  const handleCategoryBack = () => {
    setCategoryView(null)
  }

  const handleShowDetail = (book) => {
    setSelectedBook(book)
    setShowDetailModal(true)
  }

  const handleCloseDetail = () => {
    setShowDetailModal(false)
    setSelectedBook(null)
  }

  const categoryBooks = categoryView ? (booksByRak[categoryView] || []) : []

  const avatarLetter = currentUser?.nama?.charAt(0)?.toUpperCase() || 'U'
  const namaDepan = currentUser?.nama?.split(' ')[0] || 'Peminjam'

  return (
    <div className="borrower-page">
      <header className={`borrower-navbar${scrolled ? ' borrower-navbar--scrolled' : ''}`}>
        <div className="borrower-navbar-inner">
          <div className="borrower-navbar-left">
            <div className="borrower-navbar-logo">
              <img src="/kejaksaan-logo.png" alt="Logo Kejaksaan RI" />
            </div>
            <div className="borrower-navbar-text">
              <span className="borrower-navbar-sub">Kejaksaan Negeri Sumenep</span>
              <h1 className="borrower-navbar-title">Perpustakaan Hukum</h1>
            </div>
          </div>

          <nav ref={navRef} className={`borrower-navbar-nav${showMobileNav ? ' open' : ''}`}>
            <div className="borrower-navbar-indicator" style={indicatorStyle} />
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                data-nav={item.id}
                className={activeSection === item.id ? 'active' : ''}
                onClick={() => { setActiveSection(item.id); setShowMobileNav(false) }}
              >
                <span className="navbar-nav-icon" dangerouslySetInnerHTML={{ __html: item.icon }} />
                <span>{item.label}</span>
                {item.id === 'peminjaman' && activeLoanCount > 0 && (
                  <span className="navbar-nav-badge">{activeLoanCount}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="borrower-navbar-right">
            <button
              type="button"
              className="borrower-navbar-hamburger"
              onClick={() => setShowMobileNav(v => !v)}
              aria-label="Buka navigasi"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div className="borrower-navbar-user">
              <div className="borrower-navbar-avatar">{avatarLetter}</div>
              <div className="borrower-navbar-userinfo">
                <strong>{currentUser?.nama || 'User'}</strong>
                <small>{namaDepan} — Anggota</small>
              </div>
            </div>

            <div className="notif-bell-wrap" ref={notifBellRef}>
              <button type="button" className="notif-bell" onClick={() => setShowNotifDropdown(v => !v)} title="Notifikasi">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                {unreadNotifCount > 0 && <span className="notif-badge">{unreadNotifCount > 99 ? '99+' : unreadNotifCount}</span>}
              </button>
              {showNotifDropdown && (
                <div className="notif-dropdown">
                  <div className="notif-dropdown-head">
                    <span>Notifikasi</span>
                    {unreadNotifCount > 0 && <button type="button" className="notif-mark-all" onClick={handleMarkAllRead}>Tandai semua dibaca</button>}
                  </div>
                  <div className="notif-dropdown-body">
                    {notifications.length === 0 ? (
                      <div className="notif-empty">Belum ada notifikasi</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`notif-item${!n.is_read ? ' unread' : ''}`} onClick={() => { if (!n.is_read) handleMarkRead(n.id) }}>
                          <span className="notif-dot" />
                          <div className="notif-content">
                            <span className="notif-msg">{n.title || n.message}</span>
                            <span className="notif-time">{n.created_at || ''}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button type="button" className="borrower-navbar-logout" onClick={handleLogout} title="Keluar">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Keluar</span>
            </button>
          </div>
        </div>
        <div className="borrower-navbar-gold" />
      </header>

      <main className="borrower-main-content">
        <section className="borrower-hero">
          <div className="borrower-hero-bg">
            <div className="borrower-hero-pattern" />
            <div className="borrower-hero-batik" />
          </div>
          <div className="borrower-hero-gold-accent" />
          <div className="borrower-hero-content">
            <div className="borrower-hero-top">
              <div className="borrower-hero-greeting">
                <span className="borrower-hero-eyebrow">Portal Anggota Perpustakaan Hukum</span>
                <h2>
                  Halo, {namaDepan}
                  <span className="borrower-hero-wave">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 11l2-2.5a2 2 0 0 1 3.5 1.5"/>
                      <path d="M10.5 13l2-3a2 2 0 0 1 3.5 1.5"/>
                      <path d="M14 14.5l1.5-2.5a2 2 0 0 1 3.5 1.5"/>
                      <path d="M17 17l-1-1.5a2 2 0 0 1 3.5 1.5"/>
                      <path d="M11 20c-2.5 0-4.5-1-6.5-2.5A5 5 0 0 1 3 12.5V6a2 2 0 0 1 4 0"/>
                      <path d="M7 6v6"/>
                      <path d="M10.5 6v4"/>
                      <path d="M14 6v3"/>
                      <path d="M17.5 7.5V11"/>
                    </svg>
                  </span>
                </h2>
                <p className="borrower-hero-desc">
                  Selamat datang di Portal Anggota Perpustakaan Hukum Kejaksaan Negeri Sumenep. Akses koleksi hukum, jurnal, dan referensi digital.
                </p>
              </div>
              <div className="borrower-hero-chips">
                <span className="borrower-hero-chip">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Anggota sejak {memberSince}
                </span>
                <span className="borrower-hero-chip">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    <line x1="8" y1="7" x2="16" y2="7" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                  {totalBooks} buku tersedia
                </span>
              </div>
            </div>

            <div className="borrower-hero-stats">
              <article className="borrower-stat-card">
                <div className="borrower-stat-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    <line x1="8" y1="7" x2="16" y2="7" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>
                <div className="borrower-stat-body">
                  <span className="borrower-stat-value">{totalBooks}</span>
                  <span className="borrower-stat-label">Koleksi Buku</span>
                </div>
              </article>
              <article className="borrower-stat-card">
                <div className="borrower-stat-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div className="borrower-stat-body">
                  <span className="borrower-stat-value">{activeLoanCount}</span>
                  <span className="borrower-stat-label">Sedang Dipinjam</span>
                </div>
              </article>
              <article className="borrower-stat-card">
                <div className="borrower-stat-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="borrower-stat-body">
                  <span className="borrower-stat-value">{pendingCount}</span>
                  <span className="borrower-stat-label">Menunggu Persetujuan</span>
                </div>
              </article>
              <article className="borrower-stat-card">
                <div className="borrower-stat-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="borrower-stat-body">
                  <span className="borrower-stat-value">Aktif</span>
                  <span className="borrower-stat-label">Status Keanggotaan</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <div className="borrower-layout">
          <div className="borrower-main">
            {dashboardMessage && (
              <div className={`dashboard-feedback ${messageTone}`}>{dashboardMessage}</div>
            )}

            {activeSection === 'beranda' && !categoryView && (
              <BerandaSection
                allBooks={allBooks}
                recommendedBooks={recommendedBooks}
                racks={racks}
                isLoading={isLoading}
                bookingBookId={bookingBookId}
                onBooking={handleBooking}
                onCategorySelect={handleCategorySelect}
                onShowDetail={handleShowDetail}
              />
            )}

            {activeSection === 'beranda' && categoryView && (
              <section className="beranda-category-view">
                <div className="beranda-section-head">
                  <button type="button" className="beranda-back-btn" onClick={handleCategoryBack}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Kembali
                  </button>
                </div>
                <div className="beranda-section-head" style={{ marginTop: '16px' }}>
                  <span className="beranda-section-eyebrow">Kategori</span>
                  <h3 className="beranda-section-title">{categoryView}</h3>
                  <span className="beranda-section-count">{categoryBooks.length} buku</span>
                </div>
                {categoryBooks.length > 0 ? (
                  <div className="beranda-book-grid">
                    {categoryBooks.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        bookingBookId={bookingBookId}
                        onBooking={handleBooking}
                        onShowDetail={handleShowDetail}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="beranda-empty">
                    <div className="beranda-empty-icon">
                      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#1E5631" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </div>
                    <strong>Belum ada buku di kategori ini</strong>
                    <small>Kategori akan terisi setelah admin menambahkan koleksi buku.</small>
                  </div>
                )}
              </section>
            )}
            {activeSection === 'peminjaman' && (
              <PeminjamanSection
                activeBorrows={activeBorrows}
                isLoading={isLoading}
              />
            )}
            {activeSection === 'riwayat' && (
              <RiwayatSection
                loanHistory={loanHistory}
                isLoading={isLoading}
              />
            )}
            {activeSection === 'profil' && (
              <ProfilSection
                currentUser={currentUser}
                activeBorrows={activeBorrows}
                loanHistory={loanHistory}
              />
            )}
          </div>

          <aside className="borrower-side">
            <div className="borrower-side-card">
              <div className="borrower-side-card-head">
                <div className="borrower-side-avatar">
                  {avatarLetter}
                </div>
                <div className="borrower-side-user">
                  <strong>{currentUser?.nama || 'User'}</strong>
                  <span className="borrower-side-badge">Anggota Aktif</span>
                </div>
              </div>
              <div className="borrower-side-card-body">
                <div className="borrower-side-row">
                  <span className="borrower-side-label">Nomor Anggota</span>
                  <span className="borrower-side-value">AGT-{String(currentUser?.id || 0).padStart(4, '0')}</span>
                </div>
                <div className="borrower-side-divider" />
                <div className="borrower-side-row">
                  <span className="borrower-side-label">Buku Dipinjam</span>
                  <span className="borrower-side-value">{activeLoanCount} buku</span>
                </div>
                <div className="borrower-side-row">
                  <span className="borrower-side-label">Riwayat</span>
                  <span className="borrower-side-value">{completedCount} transaksi</span>
                </div>
                {totalDenda > 0 && (
                  <div className="borrower-side-row borrower-side-row--danger">
                    <span className="borrower-side-label">Denda Aktif</span>
                    <span className="borrower-side-value">Rp{totalDenda.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="borrower-side-divider" />
                <div className="borrower-side-progress">
                  <div className="borrower-side-progress-head">
                    <span>Status Membership</span>
                    <span className="borrower-side-progress-tier">Gold</span>
                  </div>
                  <div className="borrower-side-progress-track">
                    <div className="borrower-side-progress-fill" style={{ width: '75%' }} />
                  </div>
                  <span className="borrower-side-progress-label">Anggota Aktif — {memberSince}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {showDetailModal && (
        <BookDetailModal
          book={selectedBook}
          onClose={handleCloseDetail}
          onBooking={handleBooking}
          bookingBookId={bookingBookId}
        />
      )}

      <Footer />
    </div>
  )
}

function formatDate(value, fallback = 'Belum tersedia') {
  if (!value) return fallback
  try {
    return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(value))
  } catch { return fallback }
}

export default DashboardPeminjam
