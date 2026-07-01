import { useEffect, useRef } from 'react'
import { resolveBackendFile } from '../api'

function BookDetailModal({ book, onClose, onBooking, bookingBookId }) {
  const overlayRef = useRef(null)
  const stokHabis = Number(book?.stok) <= 0
  const isBooking = bookingBookId === book?.id

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  if (!book) return null

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div className="book-detail-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="book-detail-modal">
        <button type="button" className="book-detail-close" onClick={onClose} aria-label="Tutup">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="book-detail-layout">
          <div className="book-detail-cover">
            {book.cover_buku ? (
              <img
                src={resolveBackendFile(book.cover_buku) + (book.updated_at ? `?v=${book.updated_at}` : '')}
                alt={`Cover ${book.judul}`}
              />
            ) : (
              <div className="book-detail-cover-placeholder">
                <span>{book.judul?.charAt(0) || 'B'}</span>
              </div>
            )}
            <div className="book-detail-badges">
              {stokHabis && <span className="beranda-badge beranda-badge--empty">Stok Habis</span>}
            </div>
          </div>

          <div className="book-detail-info">
            <div className="book-detail-kategori">{book.nama_rak || 'Koleksi Umum'}</div>
            <h2 className="book-detail-judul">{book.judul}</h2>

            <div className="book-detail-details">
              {book.penulis && (
                <div className="book-detail-field">
                  <span className="book-detail-label">Penulis</span>
                  <span className="book-detail-value">{book.penulis}</span>
                </div>
              )}
              {book.penerbit && (
                <div className="book-detail-field">
                  <span className="book-detail-label">Penerbit</span>
                  <span className="book-detail-value">{book.penerbit}</span>
                </div>
              )}
              {book.tahun_terbit && (
                <div className="book-detail-field">
                  <span className="book-detail-label">Tahun Terbit</span>
                  <span className="book-detail-value">{book.tahun_terbit}</span>
                </div>
              )}
              {book.barcode && (
                <div className="book-detail-field">
                  <span className="book-detail-label">Barcode</span>
                  <span className="book-detail-value book-detail-barcode">{book.barcode}</span>
                </div>
              )}
              <div className="book-detail-field">
                <span className="book-detail-label">Stok</span>
                <span className="book-detail-value">{book.stok} {stokHabis ? '(Habis)' : 'tersedia'}</span>
              </div>
            </div>

            {book.deskripsi && (
              <div className="book-detail-deskripsi">
                <span className="book-detail-label">Deskripsi</span>
                <p>{book.deskripsi}</p>
              </div>
            )}

            <div className="book-detail-action">
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
        </div>
      </div>
    </div>
  )
}

export default BookDetailModal
