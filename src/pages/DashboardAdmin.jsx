import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API, { resolveBackendFile, BACKEND_URL } from '../api'
import AdminProfilSection from './AdminProfilSection'
import AdminManageBooks from './AdminManageBooks'

const menus = [
  { id: 'beranda', label: 'Beranda', icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>', description: 'Ringkasan statistik dan aktivitas perpustakaan.' },
  { id: 'tambah-buku', label: 'Tambah Buku', icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="12" y1="6" x2="12" y2="14"/><line x1="8" y1="10" x2="16" y2="10"/></svg>', description: 'Input koleksi baru ke katalog perpustakaan.' },
  { id: 'update-buku', label: 'Update Buku', icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="M15 5l4 4"/></svg>', description: 'Perbarui data buku yang sudah tersimpan.' },
  { id: 'profil', label: 'Profil', icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', description: 'Kelola informasi akun dan keamanan.' },
]

const initialBookForm = {
  judul: '', barcode: '', penulis: '', penerbit: '',
  tahun_terbit: '', stok: '', rak_id: '', deskripsi: '',
}

const readStoredUser = () => {
  try { return JSON.parse(localStorage.getItem('currentUser') || 'null') } catch { return null }
}

const clearBlobPreview = (previewSource) => {
  if (previewSource?.startsWith('blob:')) URL.revokeObjectURL(previewSource)
}

function useCounter(target, duration = 1200) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!target || typeof target !== 'number') { setCount(0); return }
    let start = 0
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

function DashboardAdmin() {
  const navigate = useNavigate()
  const [currentUser] = useState(readStoredUser)
  const currentUserRole = currentUser?.role || 'admin_web'

  useEffect(() => { if (!currentUser) navigate('/login') }, [currentUser, navigate])
  if (!currentUser) return null

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('adminDarkMode') === 'true')
  useEffect(() => { document.documentElement.setAttribute('data-admin-theme', darkMode ? 'dark' : 'light'); localStorage.setItem('adminDarkMode', darkMode) }, [darkMode])

  const [activeMenu, setActiveMenu] = useState(menus[0].id)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    const menu = menus.find(m => m.id === activeMenu)
    document.title = `Dashboard Admin${menu ? ` - ${menu.label}` : ''} | Perpustakaan Hukum`
  }, [activeMenu])
  const [bookForm, setBookForm] = useState(initialBookForm)
  const [coverFile, setCoverFile] = useState(null)
  const [coverFileName, setCoverFileName] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const [existingCoverPath, setExistingCoverPath] = useState('')
  const [editingBookId, setEditingBookId] = useState(null)
  const [books, setBooks] = useState([])
  const [racks, setRacks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoadingBooks, setIsLoadingBooks] = useState(true)
  const [isLoadingRacks, setIsLoadingRacks] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAddRakModal, setShowAddRakModal] = useState(false)
  const [newRakForm, setNewRakForm] = useState({ nama_rak: '', tipe_rak: '', deskripsi: '' })
  const [isAddingRak, setIsAddingRak] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [formMessageTone, setFormMessageTone] = useState('info')
  const [fieldErrors, setFieldErrors] = useState({})
  const formContainerRef = useRef(null)
  const judulInputRef = useRef(null)
  const [draftKey] = useState(() => 'addbook_draft')
  const [draftSaved, setDraftSaved] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showNotifDropdown, setShowNotifDropdown] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const notifBellRef = useRef(null)
  const [borrowStats, setBorrowStats] = useState({ aktif: 0, terlambat: 0 })
  const [totalMembers, setTotalMembers] = useState(0)
  const [allBorrows, setAllBorrows] = useState([])
  const [isLoadingBeranda, setIsLoadingBeranda] = useState(true)

  // STATE PROFIL
  const [profilNama, setProfilNama] = useState(currentUser?.nama || '')
  const [isUpdatingNama, setIsUpdatingNama] = useState(false)
  const [profilNamaMsg, setProfilNamaMsg] = useState('')
  const [profilNamaTone, setProfilNamaTone] = useState('info')

  const [profilEmail, setProfilEmail] = useState(currentUser?.email || '')
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false)
  const [profilEmailMsg, setProfilEmailMsg] = useState('')
  const [profilEmailTone, setProfilEmailTone] = useState('info')

  const [passwordForm, setPasswordForm] = useState({ current: '', baru: '', confirm: '' })
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [profilPasswordMsg, setProfilPasswordMsg] = useState('')
  const [profilPasswordTone, setProfilPasswordTone] = useState('info')

  // MENU AKTIF
  const currentMenu = menus.find((menu) => menu.id === activeMenu) || menus[0]

  // MENENTUKAN RAK YANG DIPILIH
  const selectedRack = useMemo(
    () => racks.find((rack) => String(rack.id) === String(bookForm.rak_id)),
    [racks, bookForm.rak_id]
  )

  // FILTER DATA BUKU
  const filteredBooks = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()

    if (!keyword) {
      return books
    }

    // Filter berdasarkan judul, penulis, barcode, atau rak
    return books.filter((book) =>
      [book.judul, book.penulis, book.barcode, book.nama_rak]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    )
  }, [books, searchTerm])

  // RESET FORM BUKU
  const resetBookForm = () => {
    clearBlobPreview(coverPreview)
    setBookForm(initialBookForm)
    setCoverFile(null)
    setCoverFileName('')
    setCoverPreview('')
    setExistingCoverPath('')
    setEditingBookId(null)
    setFieldErrors({})
    judulInputRef.current?.focus()
  }

  // MENGAMBIL DATA BUKU DARI API
  const fetchBooks = useCallback(async () => {
    try {
      setIsLoadingBooks(true)
      const response = await API.get('/books', {
        params: {
          role: currentUserRole,
        },
      })

      const bookList = Array.isArray(response.data) ? response.data : []
      setBooks(bookList)
      console.log('📚 Books from API:', bookList.map(b => ({ id: b.id, judul: b.judul, cover_buku: b.cover_buku })))
    } catch {
      setBooks([])
    } finally {
      setIsLoadingBooks(false)
    }
  }, [currentUserRole])

  // MENGAMBIL DATA RAK
  const fetchRacks = useCallback(async () => {
    try {
      setIsLoadingRacks(true)
      const response = await API.get('/books/rak/list')
      setRacks(Array.isArray(response.data) ? response.data : [])
    } catch {
      setRacks([])
    } finally {
      setIsLoadingRacks(false)
    }
  }, [])

  // MENGAMBIL STATS PEMINJAMAN
  const fetchBorrowStats = useCallback(async () => {
    try {
      const response = await API.get('/borrows/stats')
      if (response.data) {
        setBorrowStats({
          aktif: response.data.aktif ?? '—',
          terlambat: response.data.terlambat ?? '—',
        })
      }
    } catch {
      // biarkan default '—'
    }
  }, [])

  // MENGAMBIL JUMLAH ANGGOTA
  const fetchMembers = useCallback(async () => {
    try {
      const response = await API.get('/users/members')
      setTotalMembers(Array.isArray(response.data) ? response.data.length : '—')
    } catch {
      setTotalMembers('—')
    }
  }, [])

  // MENGAMBIL SEMUA PEMINJAMAN UNTUK CHART BULANAN
  const fetchAllBorrows = useCallback(async () => {
    try {
      setIsLoadingBeranda(true)
      const response = await API.get('/borrows/all')
      setAllBorrows(Array.isArray(response.data) ? response.data : [])
    } catch {
      setAllBorrows([])
    } finally {
      setIsLoadingBeranda(false)
    }
  }, [])

  const berandaData = useMemo(() => {
    const totalBuku = books.length
    const totalRak = racks.length
    const bukuTersedia = books.filter(b => Number(b.stok) > 0).length
    const bukuHabis = books.filter(b => Number(b.stok) <= 0).length
    const perRak = {}
    for (const b of books) {
      const rak = b.nama_rak || 'Lainnya'
      if (!perRak[rak]) perRak[rak] = 0
      perRak[rak]++
    }
    const rakEntries = Object.entries(perRak).sort((a, b) => b[1] - a[1])
    const maxRak = Math.max(...rakEntries.map(r => r[1]), 1)
    const topBooks = [...books].sort((a, b) => (b.total_dipinjam || 0) - (a.total_dipinjam || 0)).slice(0, 10)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    const monthMap = {}
    for (const b of allBorrows) {
      if (!b.tanggal_pinjam) continue
      const d = new Date(b.tanggal_pinjam)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      monthMap[key] = (monthMap[key] || 0) + 1
    }
    const now = new Date()
    const monthlyChart = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      monthlyChart.push({ label: `${monthNames[d.getMonth()]} ${d.getFullYear()}`, count: monthMap[key] || 0 })
    }
    const maxMonthly = Math.max(...monthlyChart.map(m => m.count), 1)
    const monthGrowth = monthlyChart.length >= 2
      ? monthlyChart[monthlyChart.length - 1].count - monthlyChart[monthlyChart.length - 2].count
      : 0
    const recentBorrows = [...allBorrows]
      .sort((a, b) => new Date(b.tanggal_pinjam || b.created_at) - new Date(a.tanggal_pinjam || a.created_at))
      .slice(0, 6)
    return { totalBuku, totalRak, bukuTersedia, bukuHabis, rakEntries, maxRak, topBooks, monthlyChart, maxMonthly, monthGrowth, recentBorrows }
  }, [books, racks, allBorrows])
  const { totalBuku, totalRak, bukuTersedia, bukuHabis, rakEntries, maxRak, topBooks, monthlyChart, maxMonthly, monthGrowth, recentBorrows } = berandaData
  const animTotalBuku = useCounter(totalBuku)
  const animTotalRak = useCounter(totalRak)
  const animTersedia = useCounter(bukuTersedia)
  const animMembers = useCounter(typeof totalMembers === 'number' ? totalMembers : 0)
  const animAktif = useCounter(borrowStats.aktif)
  const growthPercent = monthGrowth > 0 ? `+${monthGrowth}` : String(monthGrowth)
  const growthClass = monthGrowth >= 0 ? 'adm-growth--up' : 'adm-growth--down'

  // LOAD DATA SAAT COMPONENT MOUNT
  useEffect(() => {
    void fetchBooks()
    void fetchRacks()
    void fetchBorrowStats()
    void fetchMembers()
    void fetchAllBorrows()
  }, [fetchBooks, fetchRacks, fetchBorrowStats, fetchMembers, fetchAllBorrows])

  // RE-FETCH RACKS SAAT MASUK TAMBAH / UPDATE BUKU
  useEffect(() => {
    if (activeMenu === 'tambah-buku' || activeMenu === 'update-buku') {
      void fetchRacks()
    }
  }, [activeMenu, fetchRacks])

  // AUTO-DISMISS FORM MESSAGE (4 detik, semua tipe)
  useEffect(() => {
    if (!formMessage) return
    const timerId = window.setTimeout(() => { setFormMessage('') }, 4000)
    return () => window.clearTimeout(timerId)
  }, [formMessage])

  // MEMBERSIHKAN PREVIEW SAAT COMPONENT UNMOUNT
  useEffect(() => {
    return () => {
      clearBlobPreview(coverPreview)
    }
  }, [coverPreview])

  // AUTO-SAVE DRAFT
  useEffect(() => {
    if (activeMenu !== 'tambah-buku' && activeMenu !== 'update-buku') return
    const timer = setTimeout(() => {
      const hasData = Object.values(bookForm).some(v => v && String(v).trim())
      if (hasData || coverFile) {
        localStorage.setItem(draftKey, JSON.stringify({ bookForm, coverFileName }))
        setDraftSaved(true)
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [bookForm, coverFile, activeMenu, draftKey])

  // RESTORE DRAFT
  useEffect(() => {
    if (activeMenu !== 'tambah-buku') return
    try {
      const saved = localStorage.getItem(draftKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.bookForm && Object.values(parsed.bookForm).some(v => v && String(v).trim()) && !editingBookId) {
          setBookForm(parsed.bookForm)
          if (parsed.coverFileName) setCoverFileName(parsed.coverFileName)
        }
      }
    } catch { /* ignore */ }
  }, [activeMenu, draftKey, editingBookId])

  const handleSaveDraft = () => {
    localStorage.setItem(draftKey, JSON.stringify({ bookForm, coverFileName }))
    setDraftSaved(true)
    setTimeout(() => setDraftSaved(false), 2000)
  }

  const handleDiscardDraft = () => {
    localStorage.removeItem(draftKey)
    resetBookForm()
  }

  // HANDLE INPUT FORM
  const handleBookFieldChange = useCallback((event) => {
    const { name, value } = event.target

    setBookForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }, [])

  // HANDLE UPLOAD COVER BUKU
  const handleCoverChange = (event) => {
    const nextFile = event.target.files?.[0] || null

    clearBlobPreview(coverPreview)
    setCoverFileName(nextFile ? nextFile.name : '')

    if (nextFile) {
      setCoverFile(nextFile)
      setCoverPreview(URL.createObjectURL(nextFile))
    } else {
      setCoverFile(null)
      setCoverPreview(resolveBackendFile(existingCoverPath))
    }
  }

  // LOAD DATA BUKU KE FORM (EDIT)
  const loadBookToForm = (book) => {
    setBookForm({
      judul: book.judul || '',
      barcode: book.barcode || '',
      penulis: book.penulis || '',
      penerbit: book.penerbit || '',
      tahun_terbit: book.tahun_terbit ? String(book.tahun_terbit) : '',
      stok: book.stok ? String(book.stok) : '0',
      rak_id: book.rak_id ? String(book.rak_id) : '',
      deskripsi: book.deskripsi || '',
    })

    setCoverFile(null)
    setCoverFileName('')
    setExistingCoverPath(book.cover_buku || '')
    setCoverPreview(resolveBackendFile(book.cover_buku))
    setEditingBookId(book.id)

    setFormMessage('Data buku dimuat ke form. Ubah seperlunya lalu simpan.')
    setFormMessageTone('info')
  }

  // VALIDASI FORM SEBELUM SUBMIT
  const validateForm = () => {
    const errors = {}

    if (!bookForm.judul.trim()) errors.judul = 'Judul buku wajib diisi'
    if (!bookForm.barcode.trim()) errors.barcode = 'Barcode wajib diisi'
    if (!bookForm.penulis.trim()) errors.penulis = 'Penulis wajib diisi'
    if (!bookForm.stok) errors.stok = 'Stok wajib diisi'
    if (!bookForm.rak_id) errors.rak_id = 'Pilih rak buku'

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // SUBMIT DATA BUKU (TAMBAH / UPDATE)
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      setFormMessage('Lengkapi data yang masih kosong sebelum menyimpan.')
      setFormMessageTone('error')
      return
    }

    try {
      setIsSubmitting(true)
      setFormMessage(editingBookId ? 'Memperbarui data buku...' : 'Menyimpan data buku...')
      setFormMessageTone('info')

      let coverBase64 = ''
      if (coverFile) {
        coverBase64 = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target.result)
          reader.readAsDataURL(coverFile)
        })
      }

      const body = new URLSearchParams()
      body.append('judul', bookForm.judul)
      body.append('barcode', bookForm.barcode)
      body.append('penulis', bookForm.penulis)
      body.append('penerbit', bookForm.penerbit || '')
      body.append('tahun_terbit', bookForm.tahun_terbit ? String(Number(bookForm.tahun_terbit)) : '')
      body.append('stok', String(Number(bookForm.stok)))
      body.append('rak_id', String(Number(bookForm.rak_id)))
      body.append('deskripsi', bookForm.deskripsi || '')
      if (coverBase64) {
        body.append('cover_buku', coverBase64)
      }

      const token = localStorage.getItem('token')
      const baseUrl = BACKEND_URL + '/api/books'
      const url = editingBookId ? `${baseUrl}/${editingBookId}` : baseUrl

      const res = await fetch(url, {
        method: editingBookId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body,
      })
      const result = await res.json()

      // Jika gagal
      if (!result.success) {
        setFormMessage(result.message || 'Data buku belum berhasil disimpan.')
        setFormMessageTone('error')
        return
      }

      // Jika berhasil
      setFormMessage(
        editingBookId
          ? 'Data buku berhasil diperbarui.'
          : 'Buku berhasil ditambahkan dan langsung masuk ke katalog peminjam.'
      )
      setFormMessageTone('success')

      resetBookForm()
      await fetchBooks()
    } catch (error) {
      setFormMessage(error.response?.data?.message || 'Gagal menyimpan data buku.')
      setFormMessageTone('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // HAPUS BUKU
  const handleDeleteBook = async (book) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus buku "${book.judul}"?\nData yang sudah dihapus tidak bisa dikembalikan.`
    )

    if (!confirmed) return

    // Optimistic remove: hapus dari state lokal dulu biar UI langsung hilang
    setBooks((prev) => prev.filter((b) => b.id !== book.id))

    if (editingBookId === book.id) {
      resetBookForm()
    }

    try {
      setFormMessage(`Menghapus "${book.judul}"...`)
      setFormMessageTone('info')

      await API.delete(`/books/${book.id}`)

      setFormMessage(`Buku "${book.judul}" berhasil dihapus.`)
      setFormMessageTone('success')

      void fetchBooks()
    } catch (error) {
      // Rollback: fetch ulang data asli dari server
      setFormMessage(error.response?.data?.message || 'Gagal menghapus buku.')
      setFormMessageTone('error')
      void fetchBooks()
    }
  }

  // INISIAL USER
  const userInitials = (currentUser?.nama || 'Admin')
    .split(' ')
    .map(n => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AD'

  // LOGOUT ADMIN
  const confirmLogout = () => {
    setShowLogoutConfirm(false)
    localStorage.removeItem('currentUser')
    localStorage.removeItem('token')
    navigate('/login')
  }

  const fetchNotifications = useCallback(async () => {
    const userId = currentUser?.id
    console.log('🔔 ADMIN NOTIF DEBUG:', { userId, currentUser })
    if (!userId) return
    try {
      const url = `${BACKEND_URL}/api/notifications/admin?user_id=1`
      console.log('🔔 FETCHING:', url)
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      const json = await res.json()
      console.log('🔔 RESULT:', json)
      setNotifications(Array.isArray(json.data) ? json.data : [])
    } catch (e) {
      console.error('🔔 FETCH ERROR:', e)
    }
  }, [currentUser])

  const unreadNotifCount = notifications.filter(n => !n.is_read).length

  const handleMarkRead = async (id) => {
    try {
      await fetch(`${BACKEND_URL}/api/notifications/read/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    } catch { /* ignore */ }
  }

  const handleMarkAllRead = async () => {
    const userId = currentUser?.id
    if (!userId) return
    try {
      await fetch(`${BACKEND_URL}/api/notifications/read-all/1`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    } catch { /* ignore */ }
  }

  // generate + polling notifikasi
  useEffect(() => {
    if (!currentUser?.id) return
    const load = async () => {
      try {
        await fetch(`${BACKEND_URL}/api/notifications/generate-due-reminders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
      } catch { /* ignore */ }
      fetchNotifications()
    }
    load()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [currentUser, fetchNotifications])

  // tutup dropdown saat klik di luar
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

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  // DRAG-DROP COVER
  const [dragOver, setDragOver] = useState(false)
  const coverInputRef = useRef(null)
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const handleDragLeave = () => setDragOver(false)
  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      clearBlobPreview(coverPreview)
      setCoverFile(file)
      setCoverFileName(file.name)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const handleFieldChange = useCallback((e) => {
    const { name, value } = e.target
    handleBookFieldChange(e)
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }))
  }, [fieldErrors, handleBookFieldChange])

  const handleFieldChangeWithClear = useCallback((name) => (e) => {
    handleFieldChange(e)
  }, [handleFieldChange])

  const completionFields = ['judul', 'barcode', 'penulis', 'penerbit', 'tahun_terbit', 'stok', 'rak_id']
  const filledCount = completionFields.filter(f => bookForm[f] && String(bookForm[f]).trim()).length
  const completionPct = Math.min(Math.round((filledCount / completionFields.length) * 100), 100)

  // Komponen Field stabil — pakai useMemo agar tidak re-mount tiap render
  const Field = useMemo(() => function FormField({ name, label, type = 'text', required, options, isTextarea, isSelect, placeholder, min, max, icon, disabled, value, error, onChange, submitting, extraButton }) {
    const id = `af-${name}`
    const cls = ['afbc-field', error && 'afbc-field--error', isTextarea && 'afbc-field--textarea'].filter(Boolean).join(' ')
    const shared = { id, name, value: value || '', onChange, required, disabled: disabled || submitting }

    const renderLabel = () => (
      <label htmlFor={id} className="afbc-field-label">{label}{required && <span className="afbc-required">*</span>}</label>
    )

    if (isSelect) {
      return (
        <div className={cls}>
          {renderLabel()}
          <div className="afbc-field-wrap">
            {icon && <span className="afbc-field-icon">{icon}</span>}
            <select {...shared} className="afbc-field-input">
              <option value="">{placeholder || `Pilih ${label}`}</option>
              {options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {extraButton && (
              <button type="button" className="afbc-field-extra" onClick={extraButton.onClick} title={extraButton.title} disabled={submitting}>
                {extraButton.label}
              </button>
            )}
          </div>
          {error && <span className="afbc-field-err">{error}</span>}
        </div>
      )
    }

    if (isTextarea) {
      return (
        <div className={cls}>
          {renderLabel()}
          <div className="afbc-field-wrap">
            <textarea {...shared} className="afbc-field-input" placeholder="Tulis sinopsis buku..." rows={4} />
          </div>
          {error && <span className="afbc-field-err">{error}</span>}
        </div>
      )
    }

    return (
      <div className={cls}>
        {renderLabel()}
        <div className="afbc-field-wrap">
          {icon && <span className="afbc-field-icon">{icon}</span>}
          <input {...shared} type={type} className="afbc-field-input" placeholder=" " min={min} max={max} />
        </div>
        {error && <span className="afbc-field-err">{error}</span>}
      </div>
    )
  }, [])

  // TAMBAH RAK BARU
  const handleAddRak = async () => {
    if (!newRakForm.nama_rak.trim() || !newRakForm.tipe_rak.trim()) return
    try {
      setIsAddingRak(true)
      const payload = { nama_rak: newRakForm.nama_rak.trim(), tipe_rak: newRakForm.tipe_rak.trim() }
      if (newRakForm.deskripsi?.trim()) payload.deskripsi = newRakForm.deskripsi.trim()
      const response = await API.post('/books/rak', payload)
      if (response.data?.success) {
        await fetchRacks()
        const newRak = response.data.data
        if (newRak?.id) {
          setBookForm(prev => ({ ...prev, rak_id: String(newRak.id) }))
        }
        setShowAddRakModal(false)
        setNewRakForm({ nama_rak: '', tipe_rak: '', deskripsi: '' })
        setFormMessage('Rak berhasil ditambahkan.')
        setFormMessageTone('success')
        setTimeout(() => setFormMessage(''), 4000)
      }
    } catch {
      setFormMessage('Gagal menambahkan rak.')
      setFormMessageTone('error')
      setTimeout(() => setFormMessage(''), 4000)
    } finally {
      setIsAddingRak(false)
    }
  }

  const SectionCard = useMemo(() => ({ icon, title, desc, children, delay = 0 }) => (
    <div className="afbc-section-card" style={{ animationDelay: `${delay}s` }}>
      <div className="afbc-section-head">
        <span className="afbc-section-icon" dangerouslySetInnerHTML={{ __html: icon }} />
        <div className="afbc-section-head-text">
          <span className="afbc-section-title">{title}</span>
          {desc && <span className="afbc-section-desc">{desc}</span>}
        </div>
      </div>
      <div className="afbc-section-body">
        {children}
      </div>
    </div>
  ), [])

  const BookOpenIcon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
  const CalendarIcon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
  const ImageIcon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'
  const FileTextIcon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'

  const renderBookFormCard = useMemo(() => {
    const isEditing = !!editingBookId
    const btnLabel = isSubmitting ? 'Menyimpan...' : isEditing ? 'Perbarui Buku' : 'Simpan Buku'
    const berkasOptions = racks.map(r => ({ value: String(r.id), label: `${r.nama_rak} (${r.tipe_rak})` }))
    const descLength = bookForm.deskripsi?.length || 0

    return (
      <div className="afbc-wrapper">
        {/* BREADCRUMB */}
        <div className="afbc-breadcrumb">
          <button type="button" className="afbc-breadcrumb-link" onClick={() => setActiveMenu('beranda')}>Dashboard</button>
          <span className="afbc-breadcrumb-sep">/</span>
          <span className="afbc-breadcrumb-current">Tambah Buku</span>
        </div>

        {/* LAYOUT: FORM + SIDEBAR */}
        <div className="afbc-layout">
          <div className="afbc-main">
            {/* HEADER CARD */}
            <div className="afbc-card afbc-card--header">
              <div className="afbc-header-left">
                <div className="afbc-header-icon">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="12" y1="6" x2="12" y2="14"/><line x1="8" y1="10" x2="16" y2="10"/></svg>
                </div>
                <div className="afbc-header-text">
                  <h1 className="afbc-header-title">{isEditing ? 'Edit Buku' : 'Tambah Buku Baru'}</h1>
                  <p className="afbc-header-desc">{isEditing ? 'Perbarui informasi bibliografi dan inventaris buku.' : 'Lengkapi informasi buku yang akan ditambahkan ke perpustakaan.'}</p>
                </div>
              </div>
              <div className="afbc-header-right">
                <span className="afbc-header-badge">Admin</span>
              </div>
            </div>

            {formMessage && (
              <div className={`afbc-toast afbc-toast--${formMessageTone}`}>
                <span className="afbc-toast-icon" dangerouslySetInnerHTML={{
                  __html: formMessageTone === 'success'
                    ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
                    : formMessageTone === 'error'
                    ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
                    : '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
                }} />
                <span>{formMessage}</span>
              </div>
            )}

            <form id="afbc-form" onSubmit={handleSubmit} noValidate autoComplete="off">
              <SectionCard icon={BookOpenIcon} title="Informasi Buku" desc="Data bibliografi dasar buku" delay={0.05}>
                <div className="afbc-grid">
                  <Field name="judul" label="Judul Buku" required value={bookForm.judul} error={fieldErrors.judul} onChange={handleFieldChangeWithClear('judul')} submitting={isSubmitting} />
                  <Field name="barcode" label="ISBN / Barcode" required placeholder="978-602-xxxx" value={bookForm.barcode} error={fieldErrors.barcode} onChange={handleFieldChangeWithClear('barcode')} submitting={isSubmitting} />
                  <Field name="penulis" label="Penulis" required value={bookForm.penulis} error={fieldErrors.penulis} onChange={handleFieldChangeWithClear('penulis')} submitting={isSubmitting} />
                  <Field name="penerbit" label="Penerbit" value={bookForm.penerbit} error={fieldErrors.penerbit} onChange={handleFieldChangeWithClear('penerbit')} submitting={isSubmitting} />
                </div>
              </SectionCard>

              <SectionCard icon={CalendarIcon} title="Detail Publikasi" desc="Informasi terbit dan stok buku" delay={0.1}>
                <div className="afbc-grid">
                  <Field name="tahun_terbit" label="Tahun Terbit" type="number" min={1900} max={2100} value={bookForm.tahun_terbit} error={fieldErrors.tahun_terbit} onChange={handleFieldChangeWithClear('tahun_terbit')} submitting={isSubmitting} />
                  <Field name="stok" label="Jumlah Stok" type="number" min={0} required value={bookForm.stok} error={fieldErrors.stok} onChange={handleFieldChangeWithClear('stok')} submitting={isSubmitting} />
                  <div className="afbc-field-full">
                    <div className="afbc-rak-row">
                      <div className="afbc-rak-select">
                        <Field name="rak_id" label="Rak Buku" isSelect required options={berkasOptions} placeholder={isLoadingRacks ? 'Memuat...' : 'Pilih rak buku'} value={bookForm.rak_id} error={fieldErrors.rak_id} onChange={handleFieldChangeWithClear('rak_id')} submitting={isSubmitting} disabled={isLoadingRacks} />
                      </div>
                      <button type="button" className="afbc-rak-btn" onClick={() => setShowAddRakModal(true)} disabled={isSubmitting}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Tambah Rak
                      </button>
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard icon={ImageIcon} title="Sampul Buku" desc="Upload gambar sampul buku" delay={0.15}>
                <div
                  className={`afbc-cover-zone${dragOver ? ' afbc-cover-zone--drag' : ''}${coverPreview ? ' afbc-cover-zone--has' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => coverInputRef.current?.click()}
                >
                  {coverPreview ? (
                    <>
                      <img src={coverPreview} alt="Preview" className="afbc-cover-preview" />
                      <div className="afbc-cover-overlay">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                        <span>Ganti Cover</span>
                      </div>
                    </>
                  ) : (
                    <div className="afbc-cover-empty">
                      <div className="afbc-cover-empty-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      </div>
                      <span className="afbc-cover-empty-text">Seret gambar ke sini</span>
                      <span className="afbc-cover-empty-sub">atau klik untuk memilih file</span>
                      <button type="button" className="afbc-cover-empty-btn" onClick={(e) => { e.stopPropagation(); coverInputRef.current?.click() }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        Pilih File
                      </button>
                    </div>
                  )}
                </div>
                <input ref={coverInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="afbc-cover-hidden" onChange={handleCoverChange} />
              </SectionCard>

              <SectionCard icon={FileTextIcon} title="Informasi Tambahan" desc="Sinopsis atau deskripsi buku" delay={0.2}>
                <div className="afbc-field">
                  <label className="afbc-label">Sinopsis / Deskripsi</label>
                  <textarea
                    name="deskripsi"
                    className="afbc-textarea"
                    placeholder="Tulis sinopsis buku..."
                    value={bookForm.deskripsi || ''}
                    onChange={handleFieldChange}
                  />
                  <span className={`afbc-charcount${descLength >= 500 ? ' afbc-charcount--over' : ''}`}>{descLength} / 1000 karakter</span>
                </div>
              </SectionCard>
            </form>

            <div className="afbc-actions">
              <button type="button" className="afbc-btn afbc-btn--ghost" onClick={() => isEditing ? resetBookForm() : setActiveMenu('beranda')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                {isEditing ? 'Batal' : 'Kembali'}
              </button>
              <button type="button" className="afbc-btn afbc-btn--outline" onClick={handleSaveDraft}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                Simpan Draft
              </button>
              <button type="submit" form="afbc-form" className="afbc-btn afbc-btn--primary" disabled={isSubmitting}>
                {isSubmitting && <span className="afbc-spinner" />}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                {btnLabel}
              </button>
            </div>
          </div>

          <div className="afbc-sidebar">
            <div className="afbc-preview-card">
              <div className="afbc-preview-cover">
                {coverPreview ? (
                  <img src={coverPreview} alt="Preview" />
                ) : (
                  <span className="afbc-preview-placeholder">{(bookForm.judul || 'B').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="afbc-preview-body">
                <h3 className="afbc-preview-title">{bookForm.judul || 'Judul Buku'}</h3>
                <div className="afbc-preview-divider" />
                <div className="afbc-preview-row">
                  <span className="afbc-preview-label">Penulis</span>
                  <span className="afbc-preview-value">{bookForm.penulis || '—'}</span>
                </div>
                <div className="afbc-preview-divider" />
                <div className="afbc-preview-row">
                  <span className="afbc-preview-label">Tahun</span>
                  <span className="afbc-preview-value">{bookForm.tahun_terbit || '—'}</span>
                </div>
                <div className="afbc-preview-divider" />
                <div className="afbc-preview-row">
                  <span className="afbc-preview-label">Rak</span>
                  <span className="afbc-preview-value">{selectedRack?.nama_rak || '—'}</span>
                </div>
              </div>
              <div className="afbc-preview-footer">
                <span>Preview otomatis berubah</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── MODAL TAMBAH RAK ── */}
        {showAddRakModal && (
          <div className="premium-modal-overlay" onClick={() => setShowAddRakModal(false)}>
            <div className="premium-modal" onClick={e => e.stopPropagation()}>
              <div className="premium-modal-head">
                <div className="premium-modal-head-left">
                  <div className="premium-modal-head-icon">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                  </div>
                  <div>
                    <h3>Tambah Rak Baru</h3>
                    <p>Tambahkan kategori rak buku baru ke perpustakaan</p>
                  </div>
                </div>
                <button type="button" className="premium-modal-close" onClick={() => { setShowAddRakModal(false); setNewRakForm({ nama_rak: '', tipe_rak: '', deskripsi: '' }) }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div className="premium-modal-body">
                <div className="premium-modal-field">
                  <label className="premium-modal-label">Nama Rak <span className="required-star">*</span></label>
                  <input className="premium-modal-input" type="text" placeholder="Mis: Rak Hukum Pidana" value={newRakForm.nama_rak} onChange={e => setNewRakForm(p => ({ ...p, nama_rak: e.target.value }))} disabled={isAddingRak} autoFocus />
                </div>
                <div className="premium-modal-field">
                  <label className="premium-modal-label">Tipe / Kategori Rak <span className="required-star">*</span></label>
                  <div className="premium-modal-select-wrap">
                    <svg className="premium-modal-select-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    <select
                      className="premium-modal-select"
                      value={newRakForm.tipe_rak}
                      onChange={e => setNewRakForm(p => ({ ...p, tipe_rak: e.target.value }))}
                      disabled={isAddingRak}
                    >
                      <option value="">Pilih kategori...</option>
                      <option value="Lantai 1">Lantai 1</option>
                      <option value="Lantai 2">Lantai 2</option>
                      <option value="Lantai 3">Lantai 3</option>
                      <option value="Referensi">Referensi</option>
                      <option value="Digital">Digital</option>
                      <option value="Multimedia">Multimedia</option>
                    </select>
                  </div>
                </div>
                <div className="premium-modal-field">
                  <label className="premium-modal-label">Deskripsi (opsional)</label>
                  <input className="premium-modal-input" type="text" placeholder="Keterangan tambahan..." value={newRakForm.deskripsi || ''} onChange={e => setNewRakForm(p => ({ ...p, deskripsi: e.target.value }))} disabled={isAddingRak} />
                </div>
              </div>
              <div className="premium-modal-foot">
                <button type="button" className="premium-modal-btn premium-modal-btn--ghost" onClick={() => { setShowAddRakModal(false); setNewRakForm({ nama_rak: '', tipe_rak: '', deskripsi: '' }) }} disabled={isAddingRak}>Batal</button>
                <button type="button" className="premium-modal-btn premium-modal-btn--primary" onClick={handleAddRak} disabled={isAddingRak || !newRakForm.nama_rak.trim() || !newRakForm.tipe_rak.trim()}>
                  {isAddingRak ? (
                    <><span className="premium-modal-spinner" /> Menyimpan...</>
                  ) : (
                    <><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Tambah Rak</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }, [editingBookId, isSubmitting, bookForm.judul, bookForm.barcode, bookForm.penulis, bookForm.penerbit, bookForm.tahun_terbit, bookForm.stok, bookForm.rak_id, bookForm.deskripsi, fieldErrors, racks, isLoadingRacks, dragOver, coverPreview, formMessage, formMessageTone, handleFieldChangeWithClear, handleSubmit, handleSaveDraft, setActiveMenu, resetBookForm, coverInputRef, handleDragOver, handleDragLeave, handleDrop, handleCoverChange, setShowAddRakModal, isAddingRak, selectedRack])

  // RENDER HALAMAN BERANDA
  const renderBeranda = () => {
    return (
      <div className="adm-beranda">
        {/* ── KPI CARDS ── */}
        <div className="adm-kpi-grid">
          <article className="adm-kpi-card adm-kpi-card--books">
            <div className="adm-kpi-top">
              <div className="adm-kpi-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </div>
              <span className="adm-kpi-badge adm-kpi-badge--green">Koleksi</span>
            </div>
            <div className="adm-kpi-value">{isLoadingBeranda ? '...' : animTotalBuku}</div>
            <div className="adm-kpi-label">Total Buku</div>
            <div className="adm-kpi-footer">
              <span>{bukuTersedia} tersedia</span>
              <span className="adm-kpi-dot">&middot;</span>
              <span>{bukuHabis} habis</span>
            </div>
          </article>

          <article className="adm-kpi-card adm-kpi-card--members">
            <div className="adm-kpi-top">
              <div className="adm-kpi-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <span className="adm-kpi-badge adm-kpi-badge--blue">Anggota</span>
            </div>
            <div className="adm-kpi-value">{typeof totalMembers === 'number' ? animMembers : totalMembers}</div>
            <div className="adm-kpi-label">Total Anggota</div>
            <div className="adm-kpi-footer">
              <span>Aktif terdaftar</span>
            </div>
          </article>

          <article className="adm-kpi-card adm-kpi-card--active">
            <div className="adm-kpi-top">
              <div className="adm-kpi-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </div>
              <span className="adm-kpi-badge adm-kpi-badge--amber">Aktif</span>
            </div>
            <div className="adm-kpi-value">{animAktif}</div>
            <div className="adm-kpi-label">Peminjaman Aktif</div>
            <div className="adm-kpi-footer">
              <span>{borrowStats.terlambat} terlambat</span>
              <span className="adm-kpi-dot">&middot;</span>
              <span className={borrowStats.terlambat > 0 ? 'adm-text-danger' : ''}>perlu perhatian</span>
            </div>
          </article>

          <article className="adm-kpi-card adm-kpi-card--trend">
            <div className="adm-kpi-top">
              <div className="adm-kpi-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <span className="adm-kpi-badge adm-kpi-badge--purple">Tren</span>
            </div>
            <div className="adm-kpi-value">{monthlyChart[monthlyChart.length - 1]?.count || 0}</div>
            <div className="adm-kpi-label">Peminjaman Bulan Ini</div>
            <div className="adm-kpi-footer">
              <span className={growthClass}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points={monthGrowth >= 0 ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/></svg>
                {growthPercent}
              </span>
              <span className="adm-kpi-dot">&middot;</span>
              <span>vs bulan lalu</span>
            </div>
          </article>
        </div>

        {/* ── CHARTS ROW ── */}
        <div className="adm-charts-row">
          <section className="adm-card adm-card--chart">
            <div className="adm-card-head">
              <h5>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                Peminjaman Per Bulan
              </h5>
              <span className="adm-card-badge">6 bulan terakhir</span>
            </div>
            <div className="adm-chart-wrap">
              <svg viewBox="0 0 520 200" preserveAspectRatio="xMidYMid meet" className="adm-area-chart">
                <defs>
                  <linearGradient id="admAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2E7D5A" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#2E7D5A" stopOpacity="0.02"/>
                  </linearGradient>
                </defs>
                {(() => {
                  const w = 460, h = 150, padL = 40, padT = 10
                  const stepX = w / (monthlyChart.length - 1 || 1)
                  const max = Math.max(maxMonthly, 1)
                  const pts = monthlyChart.map((m, i) => ({
                    x: padL + i * stepX, y: padT + h - ((m.count / max) * h), count: m.count, label: m.label,
                  }))
                  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
                  const area = `${line} L${pts[pts.length - 1].x},${padT + h} L${padL},${padT + h} Z`
                  return (<>
                    {[0.25, 0.5, 0.75, 1].map(r => (
                      <line key={r} x1={padL} y1={padT + h - r * h} x2={padL + w} y2={padT + h - r * h} stroke="var(--adm-line)" strokeWidth="1" strokeDasharray="4 4"/>
                    ))}
                    <path d={area} fill="url(#admAreaGrad)"/>
                    <path d={line} fill="none" stroke="#2E7D5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    {pts.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#2E7D5A" strokeWidth="2.5"/>
                        <text x={p.x} y={p.y - 12} textAnchor="middle" fill="var(--adm-text)" fontSize="10" fontWeight="700">{p.count}</text>
                        <text x={p.x} y={padT + h + 18} textAnchor="middle" fill="var(--adm-muted)" fontSize="8" fontWeight="600">{p.label.split(' ')[0]}</text>
                      </g>
                    ))}
                  </>)
                })()}
              </svg>
            </div>
          </section>

          <section className="adm-card adm-card--chart">
            <div className="adm-card-head">
              <h5>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="3" x2="9" y2="9"/></svg>
                Distribusi per Kategori
              </h5>
              <span className="adm-card-badge">{rakEntries.length} rak</span>
            </div>
            <div className="adm-bar-list">
              {rakEntries.map(([rak, count]) => (
                <div key={rak} className="adm-bar-row" title={`${rak}: ${count} buku (${Math.round((count / Math.max(...rakEntries.map(r => r[1]), 1)) * 100)}%)`}>
                  <span className="adm-bar-label">{rak}</span>
                  <div className="adm-bar-track">
                    <div className="adm-bar-fill" style={{ width: `${(count / maxRak) * 100}%` }}>
                      <span className="adm-bar-val">{count}</span>
                    </div>
                  </div>
                </div>
              ))}
              {rakEntries.length === 0 && <div className="adm-empty">Belum ada data</div>}
            </div>
          </section>
        </div>

        {/* ── BOTTOM ROW: Recent Activity + Top Books ── */}
        <div className="adm-bottom-row">
          <section className="adm-card adm-card--activity">
            <div className="adm-card-head">
              <h5>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Aktivitas Terbaru
              </h5>
              <span className="adm-card-badge">{recentBorrows.length} transaksi</span>
            </div>
            <div className="adm-activity-list">
              {isLoadingBeranda ? (
                [1,2,3,4].map(i => <div key={i} className="adm-skeleton-row"><div className="adm-skeleton-dot"/><div className="adm-skeleton-line w-70"/></div>)
              ) : recentBorrows.length === 0 ? (
                <div className="adm-empty">Belum ada aktivitas</div>
              ) : (
                recentBorrows.map(b => (
                  <div key={b.id} className="adm-activity-item">
                    <div className="adm-activity-dot" />
                    <div className="adm-activity-body">
                      <strong>{b.judul || 'Buku'}</strong>
                      <span>{b.nama_lengkap || 'Anggota'} &middot; {b.tanggal_pinjam ? new Date(b.tanggal_pinjam).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}</span>
                    </div>
                    <span className={`adm-activity-status adm-activity-status--${b.status === 'dipinjam' ? 'active' : b.status === 'terlambat' ? 'late' : b.status === 'dikembalikan' ? 'done' : 'pending'}`}>
                      {b.status === 'dipinjam' ? 'Dipinjam' : b.status === 'terlambat' ? 'Terlambat' : b.status === 'dikembalikan' ? 'Kembali' : b.status === 'booking' ? 'Booking' : b.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="adm-card adm-card--topbooks">
            <div className="adm-card-head">
              <h5>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Buku Paling Populer
              </h5>
              <span className="adm-card-badge">Top {topBooks.length}</span>
            </div>
            <div className="adm-top-list">
              {topBooks.length === 0 ? (
                <div className="adm-empty">Belum ada data peminjaman</div>
              ) : (
                topBooks.slice(0, 8).map((book, idx) => {
                  const rankBadge = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null
                  return (
                    <div key={book.id} className="adm-top-item">
                      <span className={`adm-top-rank ${idx < 3 ? 'adm-top-rank--medal' : ''}`}>{rankBadge || idx + 1}</span>
                      <div className="adm-top-cover">
                        {book.cover_buku ? <img src={resolveBackendFile(book.cover_buku)} alt="" /> : <span>{book.judul?.charAt(0) || 'B'}</span>}
                      </div>
                      <div className="adm-top-body">
                        <strong>{book.judul}</strong>
                        <small>{book.penulis || '-'} &middot; {book.nama_rak || '-'}</small>
                      </div>
                      <span className="adm-top-count">{book.total_dipinjam || 0}<small>x</small></span>
                    </div>
                  )
                })
              )}
            </div>
          </section>
        </div>
      </div>
    )
  }

  // ── HANDLER PROFIL ──
  const handleUpdateEmail = async (e) => {
    e.preventDefault()
    try {
      setIsUpdatingEmail(true)
      setProfilEmailMsg('')
      const res = await API.put('/users/update-email', { user_id: currentUser.id, email: profilEmail.trim() })
      if (res.data?.success) {
        const updatedUser = { ...currentUser, email: profilEmail.trim() }
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
        setProfilEmailMsg('Email berhasil diperbarui.')
        setProfilEmailTone('success')
      } else {
        setProfilEmailMsg(res.data?.message || 'Gagal memperbarui email.')
        setProfilEmailTone('error')
      }
    } catch (err) {
      setProfilEmailMsg(err.response?.data?.message || 'Gagal memperbarui email.')
      setProfilEmailTone('error')
    } finally {
      setIsUpdatingEmail(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passwordForm.baru !== passwordForm.confirm) {
      setProfilPasswordMsg('Konfirmasi password baru tidak cocok.')
      setProfilPasswordTone('error')
      return
    }
    if (passwordForm.baru.length < 6) {
      setProfilPasswordMsg('Password baru minimal 6 karakter.')
      setProfilPasswordTone('error')
      return
    }
    try {
      setIsUpdatingPassword(true)
      setProfilPasswordMsg('')
      const res = await API.put('/users/update-password', {
        user_id: currentUser.id,
        password_lama: passwordForm.current,
        password_baru: passwordForm.baru,
      })
      if (res.data?.success) {
        setProfilPasswordMsg('Password berhasil diubah.')
        setProfilPasswordTone('success')
        setPasswordForm({ current: '', baru: '', confirm: '' })
      } else {
        setProfilPasswordMsg(res.data?.message || 'Gagal mengubah password.')
        setProfilPasswordTone('error')
      }
    } catch (err) {
      setProfilPasswordMsg(err.response?.data?.message || 'Gagal mengubah password.')
      setProfilPasswordTone('error')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleUpdateNama = async (e) => {
    e.preventDefault()
    try {
      setIsUpdatingNama(true)
      setProfilNamaMsg('')
      const res = await API.put('/users/update-nama', { user_id: currentUser.id, nama: profilNama.trim() })
      if (res.data?.success) {
        const updatedUser = { ...currentUser, nama: profilNama.trim() }
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
        setProfilNamaMsg('Nama berhasil diperbarui.')
        setProfilNamaTone('success')
      } else {
        setProfilNamaMsg(res.data?.message || 'Gagal memperbarui nama.')
        setProfilNamaTone('error')
      }
    } catch (err) {
      setProfilNamaMsg(err.response?.data?.message || 'Gagal memperbarui nama.')
      setProfilNamaTone('error')
    } finally {
      setIsUpdatingNama(false)
    }
  }

  const renderProfil = () => (
    <AdminProfilSection
      currentUser={currentUser}
      profilNama={profilNama}
      setProfilNama={setProfilNama}
      isUpdatingNama={isUpdatingNama}
      profilNamaMsg={profilNamaMsg}
      profilNamaTone={profilNamaTone}
      handleUpdateNama={handleUpdateNama}
      profilEmail={profilEmail}
      setProfilEmail={setProfilEmail}
      isUpdatingEmail={isUpdatingEmail}
      profilEmailMsg={profilEmailMsg}
      profilEmailTone={profilEmailTone}
      handleUpdateEmail={handleUpdateEmail}
      passwordForm={passwordForm}
      setPasswordForm={setPasswordForm}
      isUpdatingPassword={isUpdatingPassword}
      profilPasswordMsg={profilPasswordMsg}
      profilPasswordTone={profilPasswordTone}
      handleChangePassword={handleChangePassword}
    />
  )

  return (
    <div className={`adm-shell${darkMode ? ' adm-shell--dark' : ''}`}>
      {/* ── SIDEBAR ── */}
      <aside className={`adm-sidebar${showMobileMenu ? ' adm-sidebar--mobile-open' : ''}`}>
        <div className="adm-sidebar-brand">
          <div className="adm-sidebar-logo">
            <img src="/kejaksaan-logo.png" alt="Logo" />
          </div>
          <div className="adm-sidebar-text">
            <span className="adm-sidebar-sub">Kejaksaan Negeri Sumenep</span>
            <h1>Admin Pustaka</h1>
          </div>
        </div>

        <nav className="adm-sidebar-nav">
          {menus.map((menu) => (
            <button
              key={menu.id}
              type="button"
              className={`adm-sidebar-btn${activeMenu === menu.id ? ' active' : ''}`}
              onClick={() => { setActiveMenu(menu.id); setShowMobileMenu(false) }}
            >
              <span className="adm-sidebar-icon" dangerouslySetInnerHTML={{ __html: menu.icon }} />
              <div className="adm-sidebar-btn-text">
                <span>{menu.label}</span>
                <small>{menu.description}</small>
              </div>
            </button>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <button type="button" className="adm-sidebar-btn adm-sidebar-btn--logout" onClick={() => { setShowLogoutConfirm(true); setShowMobileMenu(false) }}>
            <span className="adm-sidebar-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* ── BACKDROP MOBILE ── */}
      <div className={`adm-sidebar-backdrop${showMobileMenu ? ' active' : ''}`} onClick={() => setShowMobileMenu(false)} />

      {/* ── MAIN CONTENT ── */}
      <section className="adm-main">
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <button type="button" className={`adm-hamburger${showMobileMenu ? ' active' : ''}`} onClick={() => setShowMobileMenu(v => !v)} aria-label="Buka navigasi">
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div className="adm-topbar-greeting">
              <span className="adm-topbar-hello">Selamat datang,</span>
              <strong>{currentUser?.nama || 'Admin'}</strong>
            </div>
            <span className="adm-topbar-date">{today}</span>
          </div>
          <div className="adm-topbar-right">
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
                    {unreadNotifCount > 0 && <button type="button" className="nv-dropdown-markall" onClick={handleMarkAllRead}>Tandai dibaca</button>}
                  </div>
                  <div className="nv-dropdown-body">
                    {notifications.length === 0 ? (
                      <div className="nv-dropdown-empty">Belum ada notifikasi</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`nv-notif-item${!n.is_read ? ' nv-notif-item--unread' : ''}`} onClick={() => { if (!n.is_read) handleMarkRead(n.id) }}>
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
            <button type="button" className="nv-icon-btn adm-theme-btn" onClick={() => setDarkMode(v => !v)} title="Toggle Dark Mode">
              {darkMode ? (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
            <div className="nv-compact-profile">
              <div className="nv-avatar nv-avatar--sm">{userInitials}</div>
              <span className="nv-profile-name nv-profile-name--inline">{currentUser?.nama || 'Admin'}</span>
              <span className="nv-role-badge nv-role-badge--admin">ADMIN</span>
              <button type="button" className="nv-logout-btn" onClick={() => setShowLogoutConfirm(true)} title="Keluar">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </header>

        <div className="adm-content">
          {formMessage && activeMenu !== 'tambah-buku' && (
            <div className={`addbook-toast addbook-toast--global addbook-toast--${formMessageTone}`}>
              <span className="addbook-toast-icon" dangerouslySetInnerHTML={{
                __html: formMessageTone === 'success'
                  ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
                  : formMessageTone === 'error'
                  ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
                  : '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
              }} />
              <span>{formMessage}</span>
            </div>
          )}
          {activeMenu === 'beranda' && renderBeranda()}
          {activeMenu === 'profil' && renderProfil()}
          {activeMenu === 'tambah-buku' && renderBookFormCard}
          {activeMenu === 'update-buku' && (
            <>
              {editingBookId && renderBookFormCard}
              <AdminManageBooks
                books={books}
                racks={racks}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isLoadingBooks={isLoadingBooks}
                filteredBooks={filteredBooks}
                loadBookToForm={loadBookToForm}
                handleDeleteBook={handleDeleteBook}
                setActiveMenu={setActiveMenu}
                onEditBook={() => setActiveMenu('tambah-buku')}
              />
            </>
          )}
        </div>
      </section>

      {/* ── QUICK ACTIONS ── */}
      <div className="adm-quick-actions">
        <button type="button" className="adm-qa-btn" onClick={() => { setActiveMenu('tambah-buku') }} title="Tambah Buku">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="12" y1="6" x2="12" y2="14"/><line x1="8" y1="10" x2="16" y2="10"/></svg>
        </button>
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
    </div>
  )
}

export default DashboardAdmin
