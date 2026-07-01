import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

function KartuAnggotaSection({ currentUser }) {
  const [qrDataUrl, setQrDataUrl] = useState('')
  const qrCanvasRef = useRef(null)

  const memberNumber = currentUser?.id
    ? `AGT-${String(currentUser.id).padStart(4, '0')}`
    : '-'

  const memberSince = currentUser?.created_at
    ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        .format(new Date(currentUser.created_at))
    : '-'

  const validUntil = (() => {
    if (!currentUser?.created_at) return '-'
    const d = new Date(currentUser.created_at)
    d.setFullYear(d.getFullYear() + 1)
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
  })()

  useEffect(() => {
    if (!currentUser?.id) return
    QRCode.toDataURL(
      String(currentUser.id),
      {
        width: 140,
        margin: 1,
        color: { dark: '#263026', light: '#ffffff' },
      }
    ).then(setQrDataUrl).catch(() => {})
  }, [currentUser])

  const avatarLetter = currentUser?.nama?.charAt(0)?.toUpperCase() || 'U'

  return (
    <section className="borrower-section-card kartu-anggota-page">
      <div className="section-heading">
        <p>Kartu Anggota</p>
        <h3>Kartu Perpustakaan Digital</h3>
        <span className="section-subtitle">
          Tunjukkan kartu ini untuk meminjam buku di perpustakaan
        </span>
      </div>

      <div className="member-card">
        <div className="member-card-front">
          <div className="member-card-header">
            <div className="member-card-brand">
              <img className="member-card-logo" src="/kejaksaan-logo.png" alt="Logo" />
              <div className="member-card-brand-text">
                <span>Kejaksaan Negeri Sumenep</span>
                <strong>Pustaka Digital</strong>
              </div>
            </div>
            <span className="member-card-type">KARTU ANGGOTA</span>
          </div>

          <div className="member-card-body">
            <div className="member-card-photo">
              {avatarLetter}
            </div>
            <div className="member-card-identity">
              <strong className="member-card-name">{currentUser?.nama || '-'}</strong>
              <span className="member-card-number">{memberNumber}</span>
              <div className="member-card-meta">
                <span>Bergabung: {memberSince}</span>
                <span>Berlaku hingga: {validUntil}</span>
              </div>
            </div>
          </div>

          <div className="member-card-footer">
            <div className="member-card-qr-wrap">
              {qrDataUrl ? (
                <img className="member-card-qr" src={qrDataUrl} alt="QR Code" />
              ) : (
                <canvas ref={qrCanvasRef} className="member-card-qr" />
              )}
              <span className="member-card-qr-label">Scan untuk verifikasi</span>
            </div>
            <span className="member-card-status">AKTIF</span>
          </div>
        </div>
      </div>

      <div className="member-card-info">
        <article>
          <strong>Nomor Anggota</strong>
          <small>{memberNumber}</small>
        </article>
        <article>
          <strong>Nama Lengkap</strong>
          <small>{currentUser?.nama || '-'}</small>
        </article>
        <article>
          <strong>Email</strong>
          <small>{currentUser?.email || '-'}</small>
        </article>
        <article>
          <strong>Status</strong>
          <small className="status-aktif">Aktif</small>
        </article>
        <article>
          <strong>Bergabung Sejak</strong>
          <small>{memberSince}</small>
        </article>
        <article>
          <strong>Masa Berlaku</strong>
          <small>{validUntil}</small>
        </article>
      </div>
    </section>
  )
}

export default KartuAnggotaSection
