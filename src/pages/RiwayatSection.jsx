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
  if (borrow.status === 'dikembalikan') {
    return `Dikembalikan: ${formatDate(borrow.tanggal_dikembalikan)}`
  }
  return `Dipinjam: ${formatDate(borrow.tanggal_pinjam || borrow.tanggal_booking)}`
}

function RiwayatSection({ loanHistory, isLoading }) {
  if (isLoading) {
    return (
      <section className="borrower-section-card">
        <div className="section-heading">
          <p>Riwayat</p>
          <h3>Riwayat Peminjaman</h3>
        </div>
        <div className="skeleton-list">
          {[1,2,3,4].map(i => (
            <div key={i} className="skeleton-row">
              <div className="skeleton-line w-70" />
              <div className="skeleton-line w-40" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (loanHistory.length === 0) {
    return (
      <section className="borrower-section-card">
        <div className="section-heading">
          <p>Riwayat</p>
          <h3>Riwayat Peminjaman Buku</h3>
        </div>
        <div className="empty-state">
          <div className="empty-icon">&#128203;</div>
          <strong>Riwayat peminjaman masih kosong.</strong>
          <small>Setiap buku yang sudah kamu pinjam dan kembalikan akan tercatat di sini.</small>
        </div>
      </section>
    )
  }

  return (
    <section className="borrower-section-card">
      <div className="section-heading">
        <p>Riwayat</p>
        <h3>Riwayat Peminjaman Buku</h3>
        <span className="section-subtitle">
          {loanHistory.length} transaksi tersimpan
        </span>
      </div>

      <div className="history-timeline">
        {loanHistory.map((borrow) => (
          <article key={borrow.id} className="history-item">
            <div className="history-dot" />
            <div className="history-content">
              <div className="history-header">
                <strong>{borrow.judul}</strong>
                <span className={`status-chip ${borrow.status}`}>
                  {statusLabels[borrow.status] || borrow.status}
                </span>
              </div>
              <small>{getTimelineLabel(borrow)}</small>
              {borrow.status === 'dikembalikan' && borrow.tanggal_dikembalikan ? (
                <small className="history-ok">Selesai tepat waktu</small>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default RiwayatSection
