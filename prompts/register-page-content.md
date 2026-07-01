# Prompt Halaman Register — Perpustakaan Kejaksaan Negeri Sumenep

**Copy paste seluruh isi di bawah ini ke Stitch AI.**
**Format output: JSON terstruktur yang siap dipetakan ke komponen React.**

```

Anda adalah copywriter digital spesialis government branding dan UI/UX copy.
Tugas Anda adalah menghasilkan konten untuk halaman Registrasi/Pendaftaran dalam format JSON.

─── KONTEKS ───
Nama platform    : Perpustakaan Hukum — Kejaksaan Negeri Sumenep
Institusi        : Kejaksaan Negeri Sumenep (Kejari Sumenep), Madura
Moto             : Pelayanan Prima — Keadilan Sejati
Target audiens   : Jaksa, hakim, advokat, mahasiswa hukum, masyarakat umum
Nilai merek      : Profesional, terpercaya, modern, melayani, inklusif
Palet warna      : Hijau premium (#1E5631), Emas (#D4AF37), Krem (#F8F6F2)
Tone             : Formal hangat, resmi namun ramah, mengundang

─── STRUKTUR HALAMAN REGISTER (2 panel) ───

Panel Kiri (Panel Merek / Brand Panel):
  - Logo instansi
  - Nama platform
  - Sub judul (nama institusi)
  - Tagline singkat (1 kalimat manfaat mendaftar)
  - Ilustrasi dekoratif (buku/rak buku)

Panel Kanan (Form Register):
  - Judul form
  - Subtitle form (ajakan mendaftar)
  - Label + placeholder untuk Nama Lengkap
  - Label + placeholder untuk Email
  - Label + placeholder untuk Alamat (textarea)
  - Label + placeholder untuk Password
  - Instruksi untuk foto wajah + foto KTP
  - Tombol submit (text + loading state)
  - Footer link "Sudah punya akun? Masuk"

─── SPESIFIKASI OUTPUT ───
Buat JSON dengan struktur berikut:

{
  "brand_panel": {
    "platform_name": "string (nama platform, max 25 char)",
    "institution_name": "string (nama institusi)",
    "tagline": "string 10-20 kata (menggambarkan manfaat menjadi anggota)",
    "illustration_alt": "string (alt text untuk ilustrasi)"
  },

  "form": {
    "title": "string 1-3 kata",
    "subtitle": "string 5-10 kata (ajakan mendaftar)",
    "fields": {
      "nama_lengkap": { "label": "string", "placeholder": "string" },
      "email": { "label": "string", "placeholder": "string" },
      "alamat": { "label": "string", "placeholder": "string" },
      "password": { "label": "string", "placeholder": "string (sertakan petunjuk minimal karakter)" }
    },
    "photo_face": {
      "label": "string",
      "button_text_default": "string (tombol ambil foto)",
      "button_text_change": "string (tombol ganti foto)",
      "button_text_capture": "string (tombol ambil)",
      "button_text_cancel": "string (tombol batal/foto ulang)"
    },
    "photo_ktp": {
      "label": "string",
      "hint": "string (petunjuk upload KTP, format & ukuran)"
    },
    "submit_text_default": "string (tombol tanpa loading)",
    "submit_text_loading": "string (tombol saat loading)"
  },

  "footer": {
    "question": "string (kalimat tanya, misal 'Sudah punya akun?')",
    "action_text": "string (aksi, misal 'Masuk ke portal')",
    "action_link": "/login"
  },

  "meta": {
    "title": "string tag title (max 60 char)",
    "description": "string meta description (max 160 char)",
    "keywords": "string comma-separated"
  }
}

─── PANDUAN GAYA BAHASA ───
1. Bahasa Indonesia formal hangat (resmi tetapi ramah)
2. Gunakan kata kerja positif yang mengajak ("Bergabung", "Daftar", "Jadi anggota")
3. Untuk instruksi foto: jelas, sopan, informatif (tanpa terkesan menakutkan)
4. Placeholder form: singkat dan representatif
5. Sesuaikan dengan citra institusi pemerintah yang profesional namun terbuka

─── CONTOH SEBAGIAN OUTPUT ───
{
  "brand_panel": {
    "platform_name": "Perpustakaan Hukum",
    "institution_name": "Kejaksaan Negeri Sumenep",
    "tagline": "Akses koleksi hukum, jurnal, dan referensi secara digital di mana saja.",
    "illustration_alt": "Ilustrasi rak buku hukum"
  },
  "form": {
    "title": "Daftar Anggota",
    "subtitle": "Lengkapi data diri untuk membuat akun baru",
    "submit_text_default": "Daftar Sekarang",
    "submit_text_loading": "Memproses..."
  },
  "photo_face": {
    "label": "Foto Wajah",
    "button_text_default": "Ambil Foto Wajah",
    "button_text_change": "Ubah Foto",
    "button_text_capture": "Ambil Foto",
    "button_text_cancel": "Batal"
  }
}
```
