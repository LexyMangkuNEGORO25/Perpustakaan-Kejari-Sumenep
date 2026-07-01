# Prompt Halaman Login — Perpustakaan Kejaksaan Negeri Sumenep

**Copy paste seluruh isi di bawah ini ke Stitch AI.**
**Format output: JSON terstruktur yang siap dipetakan ke komponen React.**

```

Anda adalah copywriter digital spesialis government branding dan UI/UX copy.
Tugas Anda adalah menghasilkan konten untuk halaman Login dalam format JSON.

─── KONTEKS ───
Nama platform    : Perpustakaan Hukum — Kejaksaan Negeri Sumenep
Institusi        : Kejaksaan Negeri Sumenep (Kejari Sumenep), Madura
Moto             : Pelayanan Prima — Keadilan Sejati
Target audiens   : Jaksa, hakim, advokat, mahasiswa hukum, masyarakat umum
Nilai merek      : Profesional, terpercaya, modern, melayani
Palet warna      : Hijau premium (#1E5631), Emas (#D4AF37), Krem (#F8F6F2)
Tone             : Formal hangat, resmi namun ramah, mengundang

─── STRUKTUR HALAMAN LOGIN (2 panel) ───

Panel Kiri (Panel Merek / Brand Panel):
  - Logo instansi
  - Nama platform
  - Sub judul (nama institusi)
  - Tagline singkat (1 kalimat)
  - Ilustrasi dekoratif (buku/rak buku)

Panel Kanan (Form Login):
  - Judul form
  - Subtitle form
  - Label + placeholder untuk input Email
  - Label + placeholder untuk input Kata Sandi
  - Opsi "Ingat saya" (text)
  - Link "Lupa sandi?" (text)
  - Tombol submit (text + loading state)
  - Link footer "Belum punya akun? Daftar anggota"

─── SPESIFIKASI OUTPUT ───
Buat JSON dengan struktur berikut:

{
  "brand_panel": {
    "platform_name": "string (nama platform, max 25 char)",
    "institution_name": "string (nama institusi)",
    "tagline": "string 10-20 kata (menggambarkan manfaat login & akses perpustakaan)",
    "illustration_alt": "string (alt text untuk ilustrasi)"
  },

  "form": {
    "title": "string 1-3 kata",
    "subtitle": "string 5-10 kata (ajakan untuk login)",
    "email_label": "string",
    "email_placeholder": "string",
    "password_label": "string",
    "password_placeholder": "string",
    "remember_me": "string",
    "forgot_password": "string",
    "submit_text_default": "string (tombol tanpa loading)",
    "submit_text_loading": "string (tombol saat loading)",
    "submit_text_success": "string (tombol setelah berhasil)"
  },

  "footer": {
    "question": "string (kalimat tanya, misal 'Belum punya akun?')",
    "action_text": "string (aksi, misal 'Daftar anggota')",
    "action_link": "/register"
  },

  "meta": {
    "title": "string tag title (max 60 char)",
    "description": "string meta description (max 160 char)",
    "keywords": "string comma-separated"
  }
}

─── PANDUAN GAYA BAHASA ───
1. Bahasa Indonesia formal hangat (resmi tetapi tidak kaku)
2. Gunakan kata kerja aktif yang menginspirasi ("Akses", "Masuk", "Kelola")
3. Hindari kata-kata terlalu teknis; ramah untuk semua kalangan
4. Sesuaikan dengan citra institusi pemerintah yang profesional
5. Untuk placeholder form: singkat, jelas, memberi contoh

─── CONTOH SEBAGIAN OUTPUT ───
{
  "brand_panel": {
    "platform_name": "Perpustakaan Hukum",
    "institution_name": "Kejaksaan Negeri Sumenep",
    "tagline": "Akses koleksi hukum, jurnal, dan referensi secara digital di mana saja.",
    "illustration_alt": "Ilustrasi rak buku hukum"
  },
  "form": {
    "title": "Masuk",
    "subtitle": "Gunakan email dan kata sandi terdaftar",
    "submit_text_default": "Masuk ke Dashboard",
    "submit_text_loading": "Memproses...",
    "submit_text_success": "Berhasil!"
  }
}
```
