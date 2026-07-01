import { useState, useMemo } from 'react'
import { resolveBackendFile } from '../api'

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
)
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
)
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
)
const EditIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
)
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
)
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
)
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
)
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
)
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
)

const getBookStatus = (book) => {
  const stok = Number(book.stok)
  if (stok <= 0) return { label: 'Stok Habis', type: 'danger' }
  if (Number(book.total_dipinjam) > 0) return { label: 'Dipinjam', type: 'warning' }
  return { label: 'Tersedia', type: 'success' }
}

function AdminManageBooks({
  books,
  racks,
  searchTerm,
  setSearchTerm,
  isLoadingBooks,
  filteredBooks,
  loadBookToForm,
  handleDeleteBook,
  setActiveMenu,
  onEditBook,
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filterKategori, setFilterKategori] = useState('all')
  const [filterRak, setFilterRak] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('default')

  const stats = useMemo(() => {
    const total = books.length
    const kosong = books.filter(b => Number(b.stok) <= 0).length
    const dipinjam = books.filter(b => Number(b.total_dipinjam) > 0).length
    return { total, kosong, dipinjam }
  }, [books])

  const filtered = useMemo(() => {
    let result = filteredBooks
    if (filterKategori !== 'all') {
      result = result.filter(b => {
        const rak = (b.nama_rak || '').toLowerCase()
        return rak.includes(filterKategori.toLowerCase())
      })
    }
    if (filterRak !== 'all') {
      result = result.filter(b => String(b.rak_id) === filterRak)
    }
    if (filterStatus !== 'all') {
      result = result.filter(b => {
        const s = getBookStatus(b).type
        if (filterStatus === 'available') return s === 'success'
        if (filterStatus === 'borrowed') return s === 'warning'
        if (filterStatus === 'empty') return s === 'danger'
        return true
      })
    }
    if (sortBy === 'judul-asc') {
      result = [...result].sort((a, b) => (a.judul || '').localeCompare(b.judul || ''))
    } else if (sortBy === 'judul-desc') {
      result = [...result].sort((a, b) => (b.judul || '').localeCompare(a.judul || ''))
    } else if (sortBy === 'stok-asc') {
      result = [...result].sort((a, b) => Number(a.stok) - Number(b.stok))
    } else if (sortBy === 'stok-desc') {
      result = [...result].sort((a, b) => Number(b.stok) - Number(a.stok))
    } else if (sortBy === 'baru') {
      result = [...result].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    } else if (sortBy === 'lama') {
      result = [...result].sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0))
    }
    return result
  }, [filteredBooks, filterKategori, filterRak, filterStatus, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * rowsPerPage
  const pageBooks = filtered.slice(startIndex, startIndex + rowsPerPage)

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const getPageNumbers = () => {
    const pages = []
    const delta = 2
    const left = Math.max(2, safePage - delta)
    const right = Math.min(totalPages - 1, safePage + delta)
    pages.push(1)
    if (left > 2) pages.push('...')
    for (let i = left; i <= right; i++) pages.push(i)
    if (right < totalPages - 1) pages.push('...')
    if (totalPages > 1) pages.push(totalPages)
    return pages
  }

  const handleEdit = (book) => {
    loadBookToForm(book)
    onEditBook?.()
  }

  const handleDetail = (book) => {
    loadBookToForm(book)
  }

  const formatDate = (val) => {
    if (!val) return '-'
    try {
      return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(val))
    } catch { return '-' }
  }

  return (
    <div className="amb-wrapper">
      <div className="amb-header">
        <div className="amb-header-left">
          <div className="amb-header-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </div>
          <div>
            <h2 className="amb-header-title">Cari & Kelola Buku</h2>
            <p className="amb-header-sub">Kelola seluruh koleksi perpustakaan hukum secara efisien</p>
          </div>
        </div>
        <div className="amb-header-right">
          <span className="amb-total-badge">{stats.total} buku</span>
          <button className="amb-btn amb-btn--gold" onClick={() => setActiveMenu('tambah-buku')}>
            <PlusIcon /> Tambah Buku
          </button>
        </div>
      </div>

      <div className="amb-stats">
        <div className="amb-stat-card">
          <div className="amb-stat-icon amb-stat-icon--emerald">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <div className="amb-stat-body">
            <span className="amb-stat-value">{stats.total}</span>
            <span className="amb-stat-label">Total Buku</span>
          </div>
        </div>
        <div className="amb-stat-card">
          <div className="amb-stat-icon amb-stat-icon--gold">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div className="amb-stat-body">
            <span className="amb-stat-value">{stats.dipinjam}</span>
            <span className="amb-stat-label">Dipinjam</span>
          </div>
        </div>
        <div className="amb-stat-card">
          <div className="amb-stat-icon amb-stat-icon--danger">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </div>
          <div className="amb-stat-body">
            <span className="amb-stat-value">{stats.kosong}</span>
            <span className="amb-stat-label">Kosong</span>
          </div>
        </div>
        <div className="amb-stat-card">
          <div className="amb-stat-icon amb-stat-icon--emerald">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div className="amb-stat-body">
            <span className="amb-stat-value">{stats.total - stats.kosong}</span>
            <span className="amb-stat-label">Tersedia</span>
          </div>
        </div>
      </div>

      <div className="amb-toolbar">
        <div className="amb-search-wrap">
          <span className="amb-search-icon"><SearchIcon /></span>
          <input
            type="text"
            className="amb-search-input"
            placeholder="Cari judul, barcode, penulis, ISBN..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
          />
          {searchTerm && (
            <button className="amb-search-clear" onClick={() => setSearchTerm('')}>
              <CloseIcon />
            </button>
          )}
        </div>
        <div className="amb-filters">
          <select className="amb-select" value={filterKategori} onChange={(e) => { setFilterKategori(e.target.value); setCurrentPage(1) }}>
            <option value="all">Kategori</option>
            {racks.map(r => (
              <option key={r.id} value={r.nama_rak}>{r.nama_rak} ({r.tipe_rak})</option>
            ))}
          </select>
          <select className="amb-select" value={filterRak} onChange={(e) => { setFilterRak(e.target.value); setCurrentPage(1) }}>
            <option value="all">Rak</option>
            {racks.map(r => (
              <option key={r.id} value={String(r.id)}>{r.nama_rak}</option>
            ))}
          </select>
          <select className="amb-select" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1) }}>
            <option value="all">Status</option>
            <option value="available">Tersedia</option>
            <option value="borrowed">Dipinjam</option>
            <option value="empty">Stok Habis</option>
          </select>
          <select className="amb-select amb-sort" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1) }}>
            <option value="default">Urutkan</option>
            <option value="judul-asc">Judul A-Z</option>
            <option value="judul-desc">Judul Z-A</option>
            <option value="stok-desc">Stok Terbanyak</option>
            <option value="stok-asc">Stok Tersedikit</option>
            <option value="baru">Terbaru</option>
            <option value="lama">Terlama</option>
          </select>
        </div>
      </div>

      <div className="amb-table-wrap">
        {isLoadingBooks ? (
          <div className="amb-loading">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="amb-skeleton-row" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="amb-skeleton-cover" />
                <div className="amb-skeleton-line w-25" />
                <div className="amb-skeleton-line w-15" />
                <div className="amb-skeleton-line w-12" />
                <div className="amb-skeleton-line w-10" />
                <div className="amb-skeleton-line w-8" />
                <div className="amb-skeleton-line w-12" />
                <div className="amb-skeleton-line w-10" />
                <div className="amb-skeleton-line w-10" />
                <div className="amb-skeleton-line w-10" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="amb-empty">
            <div className="amb-empty-illustration">
              <svg viewBox="0 0 120 100" width="120" height="100" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4">
                <rect x="10" y="20" width="100" height="60" rx="4" />
                <rect x="18" y="28" width="84" height="4" rx="2" />
                <rect x="18" y="38" width="60" height="4" rx="2" />
                <rect x="18" y="48" width="45" height="4" rx="2" />
                <rect x="18" y="58" width="30" height="4" rx="2" />
                <rect x="18" y="68" width="50" height="4" rx="2" />
                <rect x="45" y="38" width="12" height="34" rx="2" fill="currentColor" opacity="0.1" />
                <path d="M48 46l6-4 6 4v8H48z" fill="currentColor" opacity="0.15" />
              </svg>
            </div>
            <h3 className="amb-empty-title">Belum ada buku ditemukan</h3>
            <p className="amb-empty-desc">Coba ubah kata kunci pencarian atau tambah buku baru</p>
            <button className="amb-btn amb-btn--gold" onClick={() => setActiveMenu('tambah-buku')}>
              <PlusIcon /> Tambah Buku
            </button>
          </div>
        ) : (
          <div className="amb-table-scroll">
            <table className="amb-table">
              <thead>
                <tr>
                  <th className="amb-th-cover">Cover</th>
                  <th className="amb-th-title">Judul Buku</th>
                  <th className="amb-th-author">Penulis</th>
                  <th className="amb-th-cat">Kategori</th>
                  <th className="amb-th-rack">Rak</th>
                  <th className="amb-th-stock">Stok</th>
                  <th className="amb-th-status">Status</th>
                  <th className="amb-th-barcode">Barcode</th>
                  <th className="amb-th-tanggal">Ditambahkan</th>
                  <th className="amb-th-actions">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pageBooks.map((book, idx) => {
                  const status = getBookStatus(book)
                  return (
                    <tr key={book.id} className="amb-row" style={{ animationDelay: `${idx * 0.03}s` }}>
                      <td className="amb-td-cover">
                        <div className="amb-cover">
                          {book.cover_buku ? (
                            <img src={resolveBackendFile(book.cover_buku) + (book.updated_at ? `?v=${book.updated_at}` : '')} alt="" />
                          ) : (
                            <span className="amb-cover-fallback">{book.judul?.charAt(0) || 'B'}</span>
                          )}
                        </div>
                      </td>
                      <td className="amb-td-title">
                        <div className="amb-title-main">{book.judul}</div>
                        <div className="amb-title-meta">
                          <span>{book.barcode}</span>
                          {book.penerbit && <><span className="amb-dot">•</span><span>{book.penerbit}</span></>}
                        </div>
                      </td>
                      <td className="amb-td-author">
                        <span className="amb-author-text">{book.penulis || '-'}</span>
                      </td>
                      <td className="amb-td-cat">
                        <span className="amb-cat-badge">{book.nama_rak || '-'}</span>
                      </td>
                      <td className="amb-td-rack">
                        <span className="amb-rack-text">{book.nama_rak || '-'}</span>
                      </td>
                      <td className="amb-td-stock">
                        <span className={`amb-stock-text${Number(book.stok) <= 0 ? ' amb-stock-empty' : ''}`}>{book.stok}</span>
                      </td>
                      <td className="amb-td-status">
                        <span className={`amb-status-badge amb-status-badge--${status.type}`}>
                          {status.type === 'success' && <CheckIcon />}
                          {status.type === 'warning' && <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
                          {status.type === 'danger' && <CloseIcon />}
                          {status.label}
                        </span>
                      </td>
                      <td className="amb-td-barcode">
                        <span className="amb-barcode-text">{book.barcode || '-'}</span>
                      </td>
                      <td className="amb-td-tanggal">
                        <span className="amb-tanggal-text">{formatDate(book.created_at)}</span>
                      </td>
                      <td className="amb-td-actions">
                        <button className="amb-action-btn amb-action-btn--edit" data-tip="Edit" onClick={() => handleEdit(book)}>
                          <EditIcon />
                        </button>
                        <button className="amb-action-btn amb-action-btn--view" data-tip="Detail" onClick={() => handleDetail(book)}>
                          <EyeIcon />
                        </button>
                        <button className="amb-action-btn amb-action-btn--delete" data-tip="Hapus" onClick={() => handleDeleteBook(book)}>
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!isLoadingBooks && filtered.length > 0 && (
        <div className="amb-pagination">
          <div className="amb-pagination-info">
            <span>Menampilkan {startIndex + 1}–{Math.min(startIndex + rowsPerPage, filtered.length)} dari {filtered.length} buku</span>
            <div className="amb-rows-select">
              <span>Baris per halaman</span>
              <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1) }}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className="amb-pagination-pages">
            <button className="amb-page-btn" disabled={safePage === 1} onClick={() => goToPage(safePage - 1)}>
              <ChevronLeft /> <span>Sebelumnya</span>
            </button>
            {getPageNumbers().map((page, idx) =>
              page === '...' ? (
                <span key={`ellipsis-${idx}`} className="amb-page-ellipsis">...</span>
              ) : (
                <button
                  key={page}
                  className={`amb-page-btn amb-page-num${safePage === page ? ' active' : ''}`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              )
            )}
            <button className="amb-page-btn" disabled={safePage === totalPages} onClick={() => goToPage(safePage + 1)}>
              <span>Selanjutnya</span> <ChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminManageBooks
