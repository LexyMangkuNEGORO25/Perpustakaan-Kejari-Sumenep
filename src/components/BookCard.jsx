import { resolveBackendFile } from '../api'

function BookCard({ book, bookingBookId, onBooking, onShowDetail, variant }) {
  const isBooking = bookingBookId === book.id
  const stokHabis = Number(book.stok) <= 0

  return (
    <article
      className={`beranda-book-card ${variant ? `beranda-book-card--${variant}` : ''}`}
      onClick={() => onShowDetail?.(book)}
      onKeyDown={(e) => { if (e.key === 'Enter') onShowDetail?.(book) }}
      tabIndex={0}
      role="button"
      aria-label={`Detail ${book.judul}`}
    >
      <div className="beranda-book-cover">
        {book.cover_buku ? (
          <div className="beranda-book-cover-img">
            <img src={resolveBackendFile(book.cover_buku) + (book.updated_at ? `?v=${book.updated_at}` : '')} alt={`Cover ${book.judul}`} loading="lazy" />
          </div>
        ) : (
          <div className="beranda-book-cover-placeholder">
            <span>{book.judul?.charAt(0) || 'B'}</span>
          </div>
        )}
        <div className="beranda-book-badges">
          {stokHabis && <span className="beranda-badge beranda-badge--empty">Stok Habis</span>}
          {variant === 'popular' && <span className="beranda-badge beranda-badge--populer">Populer</span>}
          {variant === 'new' && <span className="beranda-badge beranda-badge--baru">Baru</span>}
          {variant === 'recommend' && <span className="beranda-badge beranda-badge--rekomendasi">Rekomendasi</span>}
        </div>
        <div className="beranda-book-cover-shine" />
      </div>
      <div className="beranda-book-body">
        <span className="beranda-book-kategori">{book.nama_rak || 'Koleksi Umum'}</span>
        <strong className="beranda-book-judul">{book.judul}</strong>
        <span className="beranda-book-penulis">{book.penulis || 'Penulis belum tersedia'}</span>
        <div className="beranda-book-meta">
          <span className="beranda-book-stok">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            Stok: {book.stok}
          </span>
          {book.tahun_terbit && (
            <span className="beranda-book-tahun">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {book.tahun_terbit}
            </span>
          )}
        </div>
        <div className="beranda-book-action">
          <button
            type="button"
            className="beranda-book-btn"
            disabled={isBooking || stokHabis}
            onClick={() => onBooking(book.id)}
          >
            {stokHabis ? 'Stok Habis' : isBooking ? (
              <span className="beranda-book-btn-loading">
                <span className="beranda-book-spinner" />
                Memproses...
              </span>
            ) : 'Pinjam Buku'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default BookCard
