import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API, { resolveBackendFile } from '../api'
import ReadingIllustration from '../components/ReadingIllustration'
import { KerapanSapi, Keris, BatikCorner } from '../components/MaduraOrnaments'
import ScrollReveal from '../components/ScrollReveal'

function LandingPage() {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [totalBooks, setTotalBooks] = useState(0)

  useEffect(() => {
    const user = (() => { try { return JSON.parse(localStorage.getItem('currentUser') || 'null') } catch { return null } })()
    if (user) {
      navigate(user.role === 'peminjam' ? '/peminjam/dashboard' : '/admin/dashboard', { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    API.get('/books', { params: { role: 'publik' } })
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setTotalBooks(res.data.length)
          setBooks(res.data.slice(0, 12))
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    requestAnimationFrame(() => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    })

    return () => observer.disconnect()
  }, [books])

  const features = [
    {
      icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      title: 'Akses 24 Jam',
      desc: 'Cari dan pinjam buku kapan saja, di mana saja lewat portal digital.',
    },
    {
      icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
      title: 'Katalog Digital',
      desc: 'Jelajahi koleksi lengkap dengan informasi detail dan status ketersediaan.',
    },
    {
      icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      title: 'Tracking Real-Time',
      desc: 'Pantau status peminjaman, jatuh tempo, dan histori secara langsung.',
    },
  ]

  return (
    <div className="landing-page">
      <div className="landing-bg-decor">
        <div className="landing-blob landing-blob-1" />
        <div className="landing-blob landing-blob-2" />
        <div className="landing-blob landing-blob-3" />
        <div className="landing-batik-bg" />
      </div>

      <header className="landing-navbar">
        <div className="landing-navbar-inner">
          <div className="landing-brand">
            <img className="landing-logo" src="/kejaksaan-logo.png" alt="Logo Kejaksaan RI" />
            <div className="landing-brand-text">
              <span className="landing-brand-org">Kejaksaan Negeri Sumenep</span>
              <h1 className="landing-brand-title">Perpustakaan Hukum</h1>
            </div>
          </div>
          <div className="landing-nav-actions">
            <Link to="/login" className="landing-btn-outline">Masuk</Link>
            <Link to="/register" className="landing-btn-primary">Daftar</Link>
          </div>
        </div>
      </header>

      <main className="landing-hero">
        <div className="landing-hero-keris">
          <Keris width={32} height={140} />
        </div>
        <div className="landing-hero-inner">
          <div className="landing-hero-copy">
            <span className="landing-badge">Perpustakaan Digital Kejari Sumenep — Madura</span>
            <h2 className="landing-hero-title">
              Perpustakaan
              <br />
              Kejaksaan Negeri Sumenep
            </h2>
            <p className="landing-hero-sub">
              Pelayanan Prima — Keadilan Sejati
            </p>
            <p className="landing-hero-desc">
              Portal perpustakaan hukum digital pertama di Kejaksaan Negeri Sumenep.
              Akses koleksi, ajukan peminjaman, dan kelola akun — semuanya dalam satu
              platform terpadu.
            </p>

            <div className="landing-cta-row">
              <Link to="/register" className="landing-cta-btn">
                Ayo Mulai!
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link to="/login" className="landing-cta-link">
                Sudah punya akun? Masuk di sini
              </Link>
            </div>

            <div className="landing-stats">
              <div className="landing-stat-item">
                <strong>{totalBooks || 92}+</strong>
                <span>Koleksi Buku</span>
              </div>
              <div className="landing-stat-item">
                <strong>7+</strong>
                <span>Anggota Aktif</span>
              </div>
              <div className="landing-stat-item">
                <strong>12</strong>
                <span>Rak Kategori</span>
              </div>
            </div>
          </div>

          <div className="landing-hero-visual">
            <div className="landing-illustration-frame">
              <ReadingIllustration />
            </div>
          </div>
        </div>
      </main>

        <section className="landing-books">
          <BatikCorner className="landing-batik-corner landing-batik-corner--tl" />
          <BatikCorner className="landing-batik-corner landing-batik-corner--tr" />
        <div className="landing-books-inner">
          <div className="landing-section-header reveal">
            <KerapanSapi width={200} height={80} className="landing-ornament-kerapan" />
            <span className="landing-badge">Koleksi</span>
            <h3>Buku Terbaru</h3>
            <p>
              Jelajahi koleksi buku terbaru yang tersedia di Perpustakaan Hukum
              Kejaksaan Negeri Sumenep.
            </p>
          </div>

          {books.length > 0 ? (
            <div className="landing-book-grid">
              {books.map((book, i) => (
                <ScrollReveal key={book.id} delay={i * 0.06} distance={30} duration={0.5}>
                  <BookCard book={book} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <p className="landing-books-empty">Memuat koleksi buku...</p>
          )}
        </div>
      </section>

      <section className="landing-features">
        <BatikCorner className="landing-batik-corner landing-batik-corner--tl" />
        <BatikCorner className="landing-batik-corner landing-batik-corner--tr" />
        <div className="landing-features-inner">
          <div className="landing-section-header reveal">
            <span className="landing-badge">Layanan Kami</span>
            <h3>Kenapa Harus Perpustakaan Digital?</h3>
          </div>
          <div className="landing-features-grid">
            {features.map((f, i) => (
              <div key={f.title} className="landing-feature-card reveal" style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="landing-feature-icon" dangerouslySetInnerHTML={{ __html: f.icon }} />
                <div className="landing-feature-text">
                  <strong>{f.title}</strong>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="landing-footer reveal">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <img className="landing-footer-logo" src="/kejaksaan-logo.png" alt="Logo" />
            <div>
              <strong>Perpustakaan Kejaksaan Negeri Sumenep</strong>
              <small>Jl. Raya Sumenep – Kalianget Km. 5, Sumenep, Jawa Timur</small>
            </div>
          </div>
          <div className="landing-footer-copy">
            <span>&copy; {new Date().getFullYear()} Kejari Sumenep</span>
            <span>Sistem Informasi Perpustakaan</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function BookCard({ book }) {
  return (
    <div className="landing-book-card">
      <div className="landing-book-cover">
        {book.cover_buku ? (
          <img
            src={resolveBackendFile(book.cover_buku) + (book.updated_at ? `?v=${book.updated_at}` : '')}
            alt={book.judul}
            loading="lazy"
          />
        ) : (
          <div className="landing-book-placeholder">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
        )}
        {Number(book.stok) <= 0 && (
          <span className="landing-book-badge habis">Stok Habis</span>
        )}
      </div>
      <div className="landing-book-info">
        <strong className="landing-book-title">{book.judul}</strong>
        <span className="landing-book-author">
          {book.penulis && book.penulis.length > 35
            ? book.penulis.slice(0, 35) + '\u2026'
            : book.penulis || '-'}
        </span>
        <span className={`landing-book-stok${Number(book.stok) <= 0 ? ' habis' : ''}`}>
          {Number(book.stok) > 0 ? `Tersedia ${book.stok}` : 'Stok Habis'}
        </span>
      </div>
    </div>
  )
}

export default LandingPage
