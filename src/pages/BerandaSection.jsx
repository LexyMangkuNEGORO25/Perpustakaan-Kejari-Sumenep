import { useMemo } from 'react'
import BookCard from '../components/BookCard'

const rakIcons = {
  'Hukum Pidana': '<svg viewBox="0 0 40 40" fill="none" width="32" height="32"><rect x="8" y="18" width="24" height="18" rx="3" fill="#1E5631"/><rect x="11" y="21" width="18" height="3" rx="1.5" fill="rgba(255,255,255,0.25)"/><rect x="11" y="26" width="14" height="3" rx="1.5" fill="rgba(255,255,255,0.2)"/><rect x="11" y="31" width="10" height="3" rx="1.5" fill="rgba(255,255,255,0.15)"/><path d="M17 10 L20 6 L23 10 L20 14 Z" fill="#D4AF37" stroke="rgba(0,0,0,0.1)" stroke-width="0.5"/><path d="M20 14 L20 18" stroke="#1E5631" stroke-width="2.5" stroke-linecap="round"/><path d="M13 14 L27 14" stroke="#D4AF37" stroke-width="2" stroke-linecap="round"/></svg>',
  'Hukum Perdata': '<svg viewBox="0 0 40 40" fill="none" width="32" height="32"><rect x="6" y="6" width="28" height="20" rx="3" fill="#1E5631"/><rect x="9" y="10" width="22" height="2.5" rx="1.25" fill="rgba(255,255,255,0.25)"/><rect x="9" y="15" width="16" height="2.5" rx="1.25" fill="rgba(255,255,255,0.2)"/><rect x="9" y="20" width="12" height="2.5" rx="1.25" fill="rgba(255,255,255,0.15)"/><path d="M12 28 L12 34" stroke="#D4AF37" stroke-width="2.5" stroke-linecap="round"/><path d="M28 28 L28 34" stroke="#D4AF37" stroke-width="2.5" stroke-linecap="round"/><path d="M8 34 L32 34" stroke="#D4AF37" stroke-width="2.5" stroke-linecap="round"/></svg>',
  'Kriminologi': '<svg viewBox="0 0 40 40" fill="none" width="32" height="32"><circle cx="20" cy="18" r="10" stroke="#1E5631" stroke-width="2.5"/><circle cx="20" cy="18" r="4" fill="#1E5631" opacity="0.15"/><path d="M27 25 L34 32" stroke="#1E5631" stroke-width="2.5" stroke-linecap="round"/><circle cx="27" cy="25" r="1.5" fill="#D4AF37"/><path d="M16 18 L18 20 L22 16" stroke="#1E5631" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'Peraturan Kejaksaan': '<svg viewBox="0 0 40 40" fill="none" width="32" height="32"><rect x="10" y="6" width="20" height="28" rx="3" fill="#1E5631"/><rect x="13" y="10" width="14" height="3" rx="1.5" fill="rgba(255,255,255,0.25)"/><rect x="13" y="16" width="14" height="3" rx="1.5" fill="rgba(255,255,255,0.2)"/><rect x="13" y="22" width="10" height="3" rx="1.5" fill="rgba(255,255,255,0.15)"/><path d="M20 22 L20 34" stroke="#D4AF37" stroke-width="2" stroke-dasharray="3 2"/><path d="M6 34 L34 34" stroke="#D4AF37" stroke-width="2" stroke-linecap="round"/></svg>',
  'Administrasi': '<svg viewBox="0 0 40 40" fill="none" width="32" height="32"><path d="M10 8 L26 8 L32 14 L32 32 C32 33.1 31.1 34 30 34 L10 34 C8.9 34 8 33.1 8 32 L8 10 C8 8.9 8.9 8 10 8Z" fill="#1E5631"/><path d="M26 8 L26 14 L32 14" fill="#D4AF37" opacity="0.3"/><rect x="11" y="18" width="12" height="2.5" rx="1.25" fill="rgba(255,255,255,0.25)"/><rect x="11" y="23" width="16" height="2.5" rx="1.25" fill="rgba(255,255,255,0.2)"/><rect x="11" y="28" width="10" height="2.5" rx="1.25" fill="rgba(255,255,255,0.15)"/></svg>',
  'Buku Umum': '<svg viewBox="0 0 40 40" fill="none" width="32" height="32"><rect x="8" y="8" width="10" height="24" rx="2" fill="#1E5631"/><rect x="22" y="8" width="10" height="24" rx="2" fill="#D4AF37"/><path d="M18 10 C18 10 20 11.5 20 14 C20 16.5 18 18 18 18" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" fill="none"/><path d="M22 10 C22 10 20 11.5 20 14 C20 16.5 22 18 22 18" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" fill="none"/></svg>',
}

function BerandaSection({ allBooks, recommendedBooks, racks, isLoading, bookingBookId, onBooking, onCategorySelect, onShowDetail }) {
  const rakList = useMemo(() => {
    const names = new Set(allBooks.map(b => b.nama_rak).filter(Boolean))
    return [...names].sort()
  }, [allBooks])

  const popularBooks = recommendedBooks.slice(0, 6)

  const newBookIds = useMemo(() => {
    const ids = new Set()
    for (const book of allBooks) {
      if (ids.size >= 6) break
      if (!popularBooks.some(p => p.id === book.id)) {
        ids.add(book.id)
      }
    }
    return ids
  }, [allBooks, popularBooks])

  const recommendedToRead = useMemo(() => {
    const excludeIds = new Set([...popularBooks.map(b => b.id), ...allBooks.filter(b => newBookIds.has(b.id)).map(b => b.id)])
    const sorted = [...allBooks]
      .filter(b => !excludeIds.has(b.id) && Number(b.stok) > 0)
      .sort((a, b) => (b.total_dipinjam || 0) - (a.total_dipinjam || 0))
    return sorted.slice(0, 6)
  }, [allBooks, popularBooks, newBookIds])

  const totalBooks = allBooks.length

  const rackCategories = racks.length > 0 ? racks : null

  if (isLoading) {
    return (
      <section className="beranda-section">
        <div className="beranda-section-head">
          <span className="beranda-section-eyebrow">Katalog</span>
          <h3 className="beranda-section-title">Koleksi Buku</h3>
        </div>
        <div className="beranda-loading-grid">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="beranda-skeleton-card">
              <div className="beranda-skeleton-cover" />
              <div className="beranda-skeleton-line" style={{ width: '75%' }} />
              <div className="beranda-skeleton-line" style={{ width: '50%' }} />
              <div className="beranda-skeleton-line" style={{ width: '60%' }} />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (allBooks.length === 0) {
    return (
      <section className="beranda-section">
        <div className="beranda-section-head">
          <span className="beranda-section-eyebrow">Katalog</span>
          <h3 className="beranda-section-title">Koleksi Buku</h3>
        </div>
        <div className="beranda-empty">
          <div className="beranda-empty-icon">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#1E5631" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <line x1="8" y1="7" x2="16" y2="7" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </div>
          <strong>Katalog buku masih kosong</strong>
          <small>Tenang, admin sedang menyiapkan koleksi terbaik untukmu. Cek kembali nanti!</small>
        </div>
      </section>
    )
  }

  return (
    <section className="beranda-section">
      <div className="beranda-section-head">
        <span className="beranda-section-eyebrow">Katalog</span>
        <h3 className="beranda-section-title">Koleksi Buku</h3>
        <span className="beranda-section-count">{totalBooks} buku &middot; {rakList.length} kategori</span>
      </div>

      {popularBooks.length > 0 && (
        <>
          <div className="beranda-section-subhead">
            <span className="beranda-section-badge beranda-section-badge--gold">Paling Populer</span>
            <span className="beranda-section-desc">Buku yang paling sering dipinjam</span>
          </div>
          <div className="beranda-book-grid">
            {popularBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                bookingBookId={bookingBookId}
                onBooking={onBooking}
                onShowDetail={onShowDetail}
                variant="popular"
              />
            ))}
          </div>
        </>
      )}

      {newBookIds.size > 0 && (
        <>
          <div className="beranda-section-subhead">
            <span className="beranda-section-badge beranda-section-badge--green">Baru Ditambahkan</span>
            <span className="beranda-section-desc">Koleksi terbaru di perpustakaan</span>
          </div>
          <div className="beranda-book-grid">
            {allBooks.filter(b => newBookIds.has(b.id)).map((book) => (
              <BookCard
                key={book.id}
                book={book}
                bookingBookId={bookingBookId}
                onBooking={onBooking}
                onShowDetail={onShowDetail}
                variant="new"
              />
            ))}
          </div>
        </>
      )}

      {recommendedToRead.length > 0 && (
        <>
          <div className="beranda-section-subhead">
            <span className="beranda-section-badge beranda-section-badge--gold">Rekomendasi untukmu</span>
            <span className="beranda-section-desc">Buku pilihan yang wajib kamu baca</span>
          </div>
          <div className="beranda-book-grid">
            {recommendedToRead.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                bookingBookId={bookingBookId}
                onBooking={onBooking}
                onShowDetail={onShowDetail}
                variant="recommend"
              />
            ))}
          </div>
        </>
      )}

      <div className="beranda-section-subhead">
        <span className="beranda-section-badge beranda-section-badge--outline">Jelajahi Kategori</span>
        <span className="beranda-section-desc">Pilih kategori untuk melihat koleksi buku</span>
      </div>

      <div className="beranda-rak-grid">
        {(rackCategories || rakList).map(item => {
          const name = item.nama_rak || item
          const count = item.nama_rak
            ? allBooks.filter(b => (b.nama_rak || 'Lainnya') === item.nama_rak).length
            : allBooks.filter(b => (b.nama_rak || 'Lainnya') === item).length
          return (
            <button
              key={name}
              type="button"
              className="beranda-rak-card"
              onClick={() => onCategorySelect(name)}
            >
              <span className="beranda-rak-icon" dangerouslySetInnerHTML={{ __html: rakIcons[name] || rakIcons['Buku Umum'] }} />
              <strong className="beranda-rak-name">{name}</strong>
              <span className="beranda-rak-count">{count} buku</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default BerandaSection
