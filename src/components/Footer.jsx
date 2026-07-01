function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-col footer-col-brand">
          <div className="footer-brand">
            <img className="footer-logo" src="/kejaksaan-logo.png" alt="Logo Kejaksaan RI" />
            <div>
              <strong>Perpustakaan Kejaksaan Negeri Sumenep</strong>
              <small>Jl. Raya Sumenep – Kalianget Km. 5, Sumenep, Jawa Timur</small>
            </div>
          </div>
          <p className="footer-desc">
            Portal perpustakaan hukum digital untuk mendukung tugas dan fungsi
            Kejaksaan Negeri Sumenep dalam mewujudkan layanan peradilan yang
            profesional, transparan, dan akuntabel.
          </p>
          <div className="footer-social">
            <a href="#" className="footer-social-link" aria-label="Email">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg>
            </a>
            <a href="#" className="footer-social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>
            </a>
            <a href="#" className="footer-social-link" aria-label="YouTube">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/><path d="M19.07 4.93A10 10 0 1 0 4.93 19.07 10 10 0 1 0 19.07 4.93Z"/></svg>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h5 className="footer-heading">Tentang Kami</h5>
          <ul className="footer-links">
            <li><a href="#">Profil Kejari Sumenep</a></li>
            <li><a href="#">Visi &amp; Misi</a></li>
            <li><a href="#">Struktur Organisasi</a></li>
            <li><a href="#">Tugas &amp; Fungsi</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5 className="footer-heading">Layanan</h5>
          <ul className="footer-links">
            <li><a href="#">Peminjaman Buku</a></li>
            <li><a href="#">Katalog Hukum</a></li>
            <li><a href="#">Pusat Informasi</a></li>
            <li><a href="#">Bantuan</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5 className="footer-heading">Kontak</h5>
          <ul className="footer-links footer-links--contact">
            <li>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Jl. Raya Sumenep – Kalianget Km. 5</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>
              <span>perpustakaan@kejari-sumenep.go.id</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.96 17.93A2 2 0 0 1 20 19.9h-1a16 16 0 0 1-16-16V2.96A2 2 0 0 1 5.07 1h2.86a1 1 0 0 1 .94.66l1.12 2.8a1 1 0 0 1-.24 1.07l-1.65 1.65a12 12 0 0 0 5.68 5.68l1.65-1.65a1 1 0 0 1 1.07-.24l2.8 1.12a1 1 0 0 1 .66.94v2.86z"/></svg>
              <span>(0328) 661234</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>&copy; {new Date().getFullYear()} Kejaksaan Negeri Sumenep</span>
          <span>Sistem Informasi Perpustakaan v1.0</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
