const statusLabels = {
  booking: 'Booking Aktif',
  dipinjam: 'Sedang Dipinjam',
  terlambat: 'Terlambat',
  menunggu_pembayaran: 'Menunggu Pembayaran',
  dikembalikan: 'Dikembalikan',
  dibatalkan: 'Dibatalkan',
}

const formatDate = (value, fallback = 'Belum tersedia') => {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return fallback
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

const getTimelineLabel = (borrow) => {
  if (borrow.status === 'booking') {
    return `Batas ambil: ${formatDate(borrow.batas_ambil)}`
  }
  if (borrow.status === 'dikembalikan') {
    return `Dikembalikan: ${formatDate(borrow.tanggal_dikembalikan)}`
  }
  if (borrow.tanggal_kembali) {
    return `Batas kembali: ${formatDate(borrow.tanggal_kembali)}`
  }
  return `Tanggal pinjam: ${formatDate(borrow.tanggal_pinjam)}`
}

function PeminjamanSection({ activeBorrows, isLoading }) {
  if (isLoading) {
    return (
      <section className="borrower-section-card">
        <div className="section-heading">
          <p>Peminjaman</p>
          <h3>Status Buku</h3>
        </div>
        <div className="skeleton-list">
          {[1,2,3].map(i => (
            <div key={i} className="skeleton-row">
              <div className="skeleton-line w-60" />
              <div className="skeleton-line w-30" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (activeBorrows.length === 0) {
    return (
      <section className="borrower-section-card">
        <div className="section-heading">
          <p>Peminjaman</p>
          <h3>Status Buku yang Sedang Diproses</h3>
        </div>
        <div className="empty-state">
          <div className="empty-icon">&#128218;</div>
          <strong>Belum ada peminjaman aktif.</strong>
          <small>Jelajahi katalog buku di beranda, temukan bacaan yang menarik, lalu ajukan peminjaman!</small>
        </div>
      </section>
    )
  }

  return (
    <section className="borrower-section-card">
      <div className="section-heading">
        <p>Peminjaman</p>
        <h3>Status Buku yang Sedang Diproses</h3>
        <span className="section-subtitle">
          {activeBorrows.length} peminjaman aktif
        </span>
      </div>

      <div className="borrow-list">
        {activeBorrows.map((borrow) => (
          <article key={borrow.id} className="borrow-card">
            <div className="borrow-card-left">
              <div className="borrow-card-avatar">
                {borrow.judul?.charAt(0) || 'B'}
              </div>
              <div className="borrow-card-info">
                <strong>{borrow.judul}</strong>
                <small>{getTimelineLabel(borrow)}</small>
                {borrow.status === 'terlambat' && (
                  <span className="borrow-warning">Melewati batas pengembalian</span>
                )}
                {borrow.status === 'menunggu_pembayaran' && (
                  <span className="borrow-warning">Menunggu pembayaran denda</span>
                )}
              </div>
            </div>
            <span className={`status-chip ${borrow.status}`}>
              {statusLabels[borrow.status] || borrow.status}
            </span>
          </article>
        ))}
      </div>
    </section>
  )
}

export default PeminjamanSection