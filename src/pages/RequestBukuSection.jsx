import { useEffect, useState } from 'react'
import API from '../api'

const initialForm = { judul: '', penulis: '', penerbit: '', tahun_terbit: '', alasan: '', rak_id: '' }

function RequestBukuSection({ currentUser }) {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageTone, setMessageTone] = useState('info')
  const [racks, setRacks] = useState([])
  const [isLoadingRacks, setIsLoadingRacks] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchRacks = async () => {
      try {
        setIsLoadingRacks(true)
        const response = await API.get('/books/rak/all')
        if (!cancelled) {
          setRacks(Array.isArray(response.data) ? response.data : [])
        }
      } catch {
        if (!cancelled) setRacks([])
      } finally {
        if (!cancelled) setIsLoadingRacks(false)
      }
    }
    fetchRacks()
    return () => { cancelled = true }
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.judul.trim() || !form.penulis.trim()) {
      setMessage('Judul dan Penulis harus diisi.')
      setMessageTone('error')
      return
    }

    try {
      setLoading(true)
      setMessage('Mengirim permintaan...')
      setMessageTone('info')

      const response = await API.post('/book-requests', {
        user_id: currentUser?.id,
        judul: form.judul.trim(),
        penulis: form.penulis.trim(),
        penerbit: form.penerbit.trim(),
        tahun_terbit: form.tahun_terbit.trim(),
        alasan: form.alasan.trim(),
        rak_id: form.rak_id || undefined,
      })

      if (response.data?.success) {
        setMessage('Permintaan buku berhasil dikirim!')
        setMessageTone('success')
        setForm(initialForm)
      } else {
        setMessage(response.data?.message || 'Permintaan belum berhasil dikirim.')
        setMessageTone('error')
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Gagal mengirim permintaan.')
      setMessageTone('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="borrower-section-card request-buku-page">
      <div className="section-heading">
        <p>Request Buku</p>
        <h3>Usulkan Buku Baru</h3>
        <span className="section-subtitle">
          Punya rekomendasi buku? Ajukan permintaan untuk ditambahkan ke koleksi perpustakaan.
        </span>
      </div>

      <form className="request-form" onSubmit={handleSubmit}>
        <div className="request-form-grid">
          <div className="field-group">
            <label htmlFor="judul">Judul Buku <span className="required">*</span></label>
            <input
              id="judul"
              name="judul"
              type="text"
              placeholder="Masukkan judul buku"
              value={form.judul}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="penulis">Penulis <span className="required">*</span></label>
            <input
              id="penulis"
              name="penulis"
              type="text"
              placeholder="Nama penulis buku"
              value={form.penulis}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="penerbit">Penerbit</label>
            <input
              id="penerbit"
              name="penerbit"
              type="text"
              placeholder="Nama penerbit"
              value={form.penerbit}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label htmlFor="tahun_terbit">Tahun Terbit</label>
            <input
              id="tahun_terbit"
              name="tahun_terbit"
              type="number"
              placeholder="Contoh: 2024"
              min="1000"
              max="2100"
              value={form.tahun_terbit}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label htmlFor="rak_id">Kategori Rak</label>
            <select
              id="rak_id"
              name="rak_id"
              value={form.rak_id}
              onChange={handleChange}
              disabled={isLoadingRacks}
            >
              <option value="">
                {isLoadingRacks ? 'Memuat kategori...' : 'Pilih kategori rak'}
              </option>
              {racks.map((rack) => (
                <option key={rack.id} value={rack.id}>
                  {rack.nama_rak}{rack.tipe_rak ? ` (${rack.tipe_rak})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group wide">
            <label htmlFor="alasan">Alasan / Catatan</label>
            <textarea
              id="alasan"
              name="alasan"
              placeholder="Mengapa buku ini perlu ditambahkan? (opsional)"
              value={form.alasan}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Mengirim...' : 'Kirim Permintaan'}
        </button>

        {message && (
          <div className={`form-message ${messageTone}`}>{message}</div>
        )}
      </form>
    </section>
  )
}

export default RequestBukuSection
