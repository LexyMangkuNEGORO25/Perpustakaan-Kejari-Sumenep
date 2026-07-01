import { useRef, useState } from 'react'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const MAX_SIZE = 5 * 1024 * 1024

function KtpUpload({ value, onChange }) {
  const inputRef = useRef(null)
  const [status, setStatus] = useState(value ? 'success' : 'idle')
  const [errorMsg, setErrorMsg] = useState('')

  const validate = (file) => {
    if (!ALLOWED_TYPES.includes(file.type))
      return 'Format file tidak didukung. Gunakan format JPG, JPEG, atau PNG.'
    if (file.size > MAX_SIZE)
      return 'Ukuran file melebihi 5MB. Pilih file yang lebih kecil.'
    return null
  }

  const handleClick = () => {
    if (status === 'idle' || status === 'error')
      inputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validationError = validate(file)
    if (validationError) {
      setStatus('error')
      setErrorMsg(validationError)
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    setStatus('uploading')
    setErrorMsg('')

    const reader = new FileReader()
    reader.onload = (ev) => {
      setTimeout(() => {
        setStatus('success')
        onChange(ev.target.result)
      }, 400)
    }
    reader.onerror = () => {
      setStatus('error')
      setErrorMsg('Gagal membaca file. Silakan coba lagi.')
    }
    reader.readAsDataURL(file)
  }

  const handleReplace = () => {
    inputRef.current?.click()
  }

  const handleRemove = () => {
    setStatus('idle')
    setErrorMsg('')
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleRetry = () => {
    setStatus('idle')
    setErrorMsg('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="ktp-upload">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {status === 'idle' && (
        <div className="ktp-upload-zone" onClick={handleClick}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span className="ktp-upload-title">Upload Foto KTP</span>
        </div>
      )}

      {status === 'uploading' && (
        <div className="ktp-upload-zone ktp-upload-zone--uploading">
          <div className="ktp-upload-spinner" />
          <span className="ktp-upload-title">Mengunggah...</span>
        </div>
      )}

      {status === 'success' && (
        <div className="ktp-upload-zone ktp-upload-zone--success">
          {value && (
            <div className="ktp-upload-preview">
              <img src={value} alt="Preview KTP" />
            </div>
          )}
          <button type="button" className="ktp-upload-replace" onClick={handleReplace}>Ganti Foto</button>
        </div>
      )}

      {status === 'error' && (
        <div className="ktp-upload-zone ktp-upload-zone--error" onClick={handleRetry}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <span className="ktp-upload-title" style={{ color: '#c0392b' }}>{errorMsg}</span>
        </div>
      )}
    </div>
  )
}

export default KtpUpload
