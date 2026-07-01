import { useState, useEffect, useRef } from 'react'

const navItems = [
  {
    id: 'beranda', label: 'Beranda',
    icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
  },
  {
    id: 'peminjaman', label: 'Peminjaman',
    icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"/></svg>'
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

export default function Navbar({
  currentUser,
  activeSection,
  onSectionChange,
  notifications,
  unreadNotifCount,
  onMarkRead,
  onMarkAllRead,
  activeLoanCount,
  onLogout,
}) {
  const [showMobileNav, setShowMobileNav] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showNotifDropdown, setShowNotifDropdown] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const notifBellRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  const avatarLetter = currentUser?.nama?.charAt(0)?.toUpperCase() || 'U'
  const nama = currentUser?.nama || 'User'

  const handleLogoutClick = () => {
    setShowNotifDropdown(false)
    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => {
    setShowLogoutConfirm(false)
    onLogout()
  }

  return (
    <>
      <header className={`nv${scrolled ? ' nv--scrolled' : ''}`}>
        <div className="nv-inner">
          <div className="nv-left">
            <div className="nv-brand">
              <div className="nv-logo-wrap">
                <img src="/kejaksaan-logo.png" alt="Logo" className="nv-logo" />
              </div>
              <div className="nv-brand-text">
                <span className="nv-brand-org">KEJAKSAAN NEGERI SUMENEP</span>
                <span className="nv-brand-title">Perpustakaan Hukum</span>
              </div>
            </div>
          </div>

          <div className="nv-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`nv-link${activeSection === item.id ? ' nv-link--active' : ''}`}
                onClick={() => onSectionChange(item.id)}
              >
                <span className="nv-link-icon" dangerouslySetInnerHTML={{ __html: item.icon }} />
                <span className="nv-link-label">{item.label}</span>
                {item.id === 'peminjaman' && activeLoanCount > 0 && (
                  <span className="nv-badge">{activeLoanCount}</span>
                )}
              </button>
            ))}
          </div>

          <div className="nv-right">
            <div className="nv-notif" ref={notifBellRef}>
              <button type="button" className="nv-icon-btn" onClick={() => setShowNotifDropdown(v => !v)} title="Notifikasi">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadNotifCount > 0 && <span className="nv-notif-badge">{unreadNotifCount > 99 ? '99+' : unreadNotifCount}</span>}
              </button>
              {showNotifDropdown && (
                <div className="nv-dropdown nv-dropdown--notif">
                  <div className="nv-dropdown-head">
                    <span>Notifikasi</span>
                    {unreadNotifCount > 0 && <button type="button" className="nv-dropdown-markall" onClick={onMarkAllRead}>Tandai dibaca</button>}
                  </div>
                  <div className="nv-dropdown-body">
                    {notifications.length === 0 ? (
                      <div className="nv-dropdown-empty">Belum ada notifikasi</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`nv-notif-item${!n.is_read ? ' nv-notif-item--unread' : ''}`} onClick={() => { if (!n.is_read) onMarkRead(n.id) }}>
                          <span className="nv-notif-dot" />
                          <div className="nv-notif-content">
                            <span className="nv-notif-msg">{n.title || n.message}</span>
                            <span className="nv-notif-time">{n.created_at || ''}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="nv-compact-profile">
              <div className="nv-avatar nv-avatar--sm">{avatarLetter}</div>
              <span className="nv-profile-name nv-profile-name--inline">{nama}</span>
              <span className="nv-role-badge">Anggota</span>
              <button type="button" className="nv-logout-btn" onClick={handleLogoutClick} title="Keluar">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Keluar</span>
              </button>
            </div>

            <button type="button" className="nv-hamburger" onClick={() => setShowMobileNav(v => !v)} aria-label="Buka navigasi">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <div className={`nv-overlay${showMobileNav ? ' nv-overlay--open' : ''}`} onClick={() => setShowMobileNav(false)} />
      <div className={`nv-drawer${showMobileNav ? ' nv-drawer--open' : ''}`}>
        <div className="nv-drawer-inner">
          <div className="nv-drawer-header">
            <button type="button" className="nv-drawer-close" onClick={() => setShowMobileNav(false)} aria-label="Tutup navigasi">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="nv-drawer-brand">
              <div className="nv-drawer-logo">
                <img src="/kejaksaan-logo.png" alt="Logo" />
              </div>
              <span className="nv-drawer-brand-name">Perpustakaan Hukum</span>
            </div>
          </div>
          <div className="nv-drawer-profile">
            <div className="nv-drawer-avatar">{avatarLetter}</div>
            <div className="nv-drawer-profile-info">
              <strong className="nv-drawer-name">{currentUser?.nama || 'User'}</strong>
              <span className="nv-drawer-email">{currentUser?.email?.length > 30 ? currentUser?.email?.substring(0, 27) + '...' : currentUser?.email || '-'}</span>
              <span className="nv-drawer-badge">Anggota</span>
            </div>
          </div>
          <div className="nv-drawer-divider" />
          <nav className="nv-drawer-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`nv-drawer-link${activeSection === item.id ? ' nv-drawer-link--active' : ''}`}
                onClick={() => { onSectionChange(item.id); setShowMobileNav(false) }}
              >
                <span className="nv-drawer-link-icon" dangerouslySetInnerHTML={{ __html: item.icon }} />
                <span className="nv-drawer-link-label">{item.label}</span>
                {item.id === 'peminjaman' && activeLoanCount > 0 && (
                  <span className="nv-drawer-badge">{activeLoanCount}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="nv-drawer-divider" />
          <div className="nv-drawer-footer">
            <button type="button" className="nv-drawer-logout-btn" onClick={() => { setShowMobileNav(false); handleLogoutClick() }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
            <div className="nv-drawer-version">
              <span>Perpustakaan Hukum</span>
              <span>Versi 1.0.0</span>
              <span>Copyright &copy; 2026</span>
            </div>
          </div>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="nv-confirm-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="nv-confirm-dialog" onClick={e => e.stopPropagation()}>
            <div className="nv-confirm-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#e53e3e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <h3 className="nv-confirm-title">Apakah Anda yakin ingin keluar?</h3>
            <div className="nv-confirm-actions">
              <button type="button" className="nv-confirm-btn nv-confirm-btn--cancel" onClick={() => setShowLogoutConfirm(false)}>Batal</button>
              <button type="button" className="nv-confirm-btn nv-confirm-btn--confirm" onClick={confirmLogout}>Keluar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
