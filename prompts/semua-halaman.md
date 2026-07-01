# Prompt Semua Halaman — Perpustakaan Digital Kejaksaan Negeri Sumenep

**Copy paste seluruh isi di bawah ini ke Stitch AI.**
**Output: SATU file JSON dengan 5 key utama — setiap level siap dipetakan ke komponen React.**

---

```
Anda adalah copywriter digital senior spesialis government branding, legal industry, dan UI/UX copy. Tugas Anda adalah menghasilkan konten untuk 5 halaman aplikasi perpustakaan digital dalam SATU objek JSON.

─── KONTEKS GLOBAL ───
Nama platform    : Perpustakaan Hukum — Kejaksaan Negeri Sumenep
Nama pendek      : Pustaka Digital Kejari Sumenep
Institusi        : Kejaksaan Negeri Sumenep (Kejari Sumenep), Madura, Jawa Timur
Moto             : Pelayanan Prima — Keadilan Sejati
Jenis            : Perpustakaan hukum digital (portal peminjaman buku online)
Target audiens   : Jaksa, hakim, advokat, notaris, mahasiswa hukum, masyarakat umum
Nilai merek      : Profesional, terpercaya, modern, melayani, berintegritas, inklusif
Palet warna      : Hijau premium (#1E5631, #4a7c59), Emas (#D4AF37), Krem (#F8F6F2)
Daerah           : Sumenep, Pulau Madura (nuansa lokal: batik, kerapan sapi, keris)
Tone bahasa      : Formal hangat — resmi, berwibawa, namun ramah dan mengundang. Tidak kaku.
Larangan         : Hindari kata klise ("terbaik", "nomor satu", "revolusioner", "terhebat")
Role audiens     : { admin: "petugas perpustakaan", peminjam: "anggota perpustakaan (jaksa/umum)" }

─── FORMAT OUTPUT ───
{ "landing_page": { ... }, "login_page": { ... }, "register_page": { ... }, "dashboard_admin": { ... }, "dashboard_peminjam": { ... } }

================================================================================
# 1. LANDING PAGE (publik)
================================================================================
─── OUTPUT STRUCTURE ───
{
  "hero": {
    "headline": { "value": "string max 60 karakter", "fontBesar": boolean },
    "subheadline": "string 10-20 karakter (moto instansi)",
    "description": "string 20-40 karakter (value proposition)",
    "badge": "string (label kecil di atas headline, max 40 char)",
    "cta_primary": { "text": "string 2-3 kata", "link": "/register" },
    "cta_secondary": { "text": "string (kalimat ajakan)", "link": "/login" }
  },
  "tentang": {
    "title": "string",
    "paragraph": "string 50-75 kata (ceritakan perpustakaan digital ini, pengelola, tujuan, manfaat)",
    "highlights": ["string", "string", "string"] (3 nilai unggulan, masing-masing 1-3 kata)
  },
  "fitur": [
    { "title": "string 1-3 kata", "description": "string 10-20 kata", "icon_suggestion": "string (kata kunci ikon SVG)" }
  ] (3-5 fitur, seperti akses 24 jam, katalog digital, tracking real-time, notifikasi, dll),
  "statistik": [
    { "angka": "string (bisa pakai +)", "label": "string singkat" }
  ] (3-4 item seperti koleksi buku, anggota aktif, rak kategori, peminjaman),
  "cara_kerja": [
    { "step": number, "title": "string 2-4 kata", "description": "string 10-15 kata" }
  ] (3-4 langkah: daftar akun → verifikasi → cari buku → booking/pinjam),
  "koleksi": {
    "badge": "string",
    "title": "string (judul section buku terbaru)",
    "description": "string 10-20 kata"
  },
  "faq": [
    { "question": "string", "answer": "string 20-40 kata" }
  ] (3-5 pertanyaan: cara daftar, cara pinjam, denda, durasi, siapa saja yang bisa),
  "testimoni": [
    { "name": "string (nama tokoh fiktif)", "role": "string (jabatan di instansi hukum)", "quote": "string 15-25 kata" }
  ] (2-3 testimoni fiktif realistis),
  "footer": {
    "description": "string singkat tentang perpustakaan (15-25 kata)",
    "alamat": "string alamat lengkap Kejari Sumenep",
    "copyright": "string copyright"
  },
  "meta": {
    "title": "string tag title max 60 char",
    "description": "string meta description max 160 char",
    "keywords": "string comma-separated"
  }
}

================================================================================
# 2. LOGIN PAGE
================================================================================
─── OUTPUT STRUCTURE ───
{
  "brand_panel": {
    "platform_name": "string max 25 char",
    "institution_name": "string",
    "tagline": "string 10-20 kata manfaat login & akses perpustakaan",
    "illustration_alt": "string"
  },
  "form": {
    "title": "string 1-3 kata",
    "subtitle": "string 5-10 kata ajakan untuk login",
    "email_label": "string",
    "email_placeholder": "string",
    "password_label": "string",
    "password_placeholder": "string",
    "remember_me": "string (label checkbox ingat saya)",
    "forgot_password": "string (link lupa sandi)",
    "submit_text_default": "string tombol tanpa loading",
    "submit_text_loading": "string tombol saat loading",
    "submit_text_success": "string tombol setelah berhasil"
  },
  "footer": {
    "question": "string (Belum punya akun?)",
    "action_text": "string (Daftar anggota)",
    "action_link": "/register"
  },
  "meta": {
    "title": "string tag title max 60 char",
    "description": "string meta description max 160 char",
    "keywords": "string comma-separated"
  }
}

================================================================================
# 3. REGISTER PAGE
================================================================================
─── OUTPUT STRUCTURE ───
{
  "brand_panel": {
    "platform_name": "string max 25 char",
    "institution_name": "string",
    "tagline": "string 10-20 kata manfaat menjadi anggota perpustakaan digital",
    "illustration_alt": "string"
  },
  "form": {
    "title": "string 1-3 kata",
    "subtitle": "string 5-10 kata ajakan mendaftar",
    "fields": {
      "nama_lengkap": { "label": "string", "placeholder": "string" },
      "email": { "label": "string", "placeholder": "string contoh email" },
      "alamat": { "label": "string", "placeholder": "string" },
      "password": { "label": "string", "placeholder": "string dengan syarat min 8 karakter" }
    },
    "photo_face": {
      "label": "string (label foto wajah)",
      "instruction": "string (instruksi mengambil foto, 10-15 kata)",
      "button_text_default": "string (Ambil Foto Wajah)",
      "button_text_change": "string (Ubah Foto)",
      "button_text_capture": "string (Ambil Foto)",
      "button_text_cancel": "string (Batal)"
    },
    "photo_ktp": {
      "label": "string (label foto KTP)",
      "hint": "string (petunjuk format & ukuran file KTP)"
    },
    "submit_text_default": "string tombol daftar",
    "submit_text_loading": "string tombol saat loading"
  },
  "footer": {
    "question": "string (Sudah punya akun?)",
    "action_text": "string (Masuk ke portal)",
    "action_link": "/login"
  },
  "meta": {
    "title": "string tag title max 60 char",
    "description": "string meta description max 160 char",
    "keywords": "string comma-separated"
  }
}

================================================================================
# 4. DASHBOARD ADMIN
================================================================================
─── OUTPUT STRUCTURE ───
{
  "sidebar": {
    "sub": "string (Kejaksaan Negeri Sumenep)",
    "title": "string (Admin Pustaka)",
    "menus": [
      { "id": "beranda", "label": "string", "description": "string singkat" },
      { "id": "tambah-buku", "label": "string", "description": "string singkat" },
      { "id": "update-buku", "label": "string", "description": "string singkat" }
    ],
    "logout": "string"
  },
  "topbar": {
    "greeting": "string (Selamat datang, {nama})",
    "date_format": "indonesian locale"
  },
  "notifikasi": {
    "title": "string (Notifikasi)",
    "mark_all_read": "string (Tandai semua dibaca)",
    "empty": "string (Belum ada notifikasi)"
  },
  "beranda": {
    "kpi": [
      { "id": "books", "badge": "string", "label": "string", "footer_items": ["string","string"] },
      { "id": "members", "badge": "string", "label": "string", "footer_items": ["string"] },
      { "id": "active", "badge": "string", "label": "string", "footer_items": ["string","string"] },
      { "id": "trend", "badge": "string", "label": "string", "footer_items": ["string","string"] }
    ],
    "chart": {
      "monthly": {
        "title": "string",
        "badge": "string (6 bulan terakhir)"
      },
      "distribution": {
        "title": "string (Distribusi per Kategori)",
        "badge_label": "string (rak)",
        "empty": "string"
      }
    },
    "activity": {
      "title": "string (Aktivitas Terbaru)",
      "badge_label": "string (transaksi)",
      "empty": "string",
      "status_labels": {
        "dipinjam": "string",
        "terlambat": "string",
        "dikembalikan": "string",
        "booking": "string"
      }
    },
    "top_books": {
      "title": "string (Buku Paling Populer)",
      "badge_label": "string (Top ...)",
      "empty": "string"
    }
  },
  "tambah_buku": {
    "breadcrumb": ["string", "string", "string"],
    "stats": {
      "total_buku": { "label": "string" },
      "total_kategori": { "label": "string" },
      "hari_ini": { "label": "string" }
    },
    "card_header": {
      "tambah": { "title": "string", "description": "string" },
      "edit": { "title": "string", "description": "string" }
    },
    "form_sections": {
      "informasi_buku": "string",
      "detail_publikasi": "string",
      "sampul_buku": "string",
      "ringkasan_buku": "string"
    },
    "fields": {
      "judul": { "label": "string", "placeholder": "string" },
      "barcode": { "label": "string (ISBN)", "placeholder": "string" },
      "penulis": { "label": "string", "placeholder": "string" },
      "penerbit": { "label": "string", "placeholder": "string" },
      "tahun_terbit": { "label": "string", "placeholder": "string" },
      "stok": { "label": "string", "placeholder": "string" },
      "rak_id": { "label": "string", "placeholder": "string" },
      "deskripsi": { "placeholder": "string" }
    },
    "cover_upload": {
      "drag_text": "string (Seret gambar ke sini)",
      "click_text": "string (atau klik untuk memilih file)",
      "change_text": "string (Ganti Cover)",
      "button_text": "string (Pilih File)"
    },
    "tombol": {
      "kembali_batal": { "kembali": "string", "batal": "string" },
      "simpan_draft": "string",
      "submit": { "tambah": "string", "edit": "string", "loading": "string" }
    },
    "preview": {
      "penulis": "string",
      "tahun": "string",
      "rak": "string",
      "footer": "string"
    },
    "modal_rak": {
      "title": "string (Tambah Rak Baru)",
      "field_nama": { "label": "string", "placeholder": "string" },
      "field_tipe": { "label": "string", "placeholder": "string" },
      "tombol_batal": "string",
      "tombol_simpan": { "default": "string", "loading": "string" }
    },
    "notifikasi": {
      "disimpan": "string",
      "diupdate": "string",
      "validasi": "string",
      "sukses_tambah": "string",
      "sukses_update": "string"
    },
    "draft": {
      "saved": "string",
      "discard": "string"
    }
  },
  "update_buku": {
    "search_title": "string (Cari & Update Buku)",
    "search_placeholder": "string",
    "empty": {
      "title": "string",
      "description": "string"
    },
    "tombol_edit": "string",
    "tombol_hapus": "string",
    "confirm_hapus": "string (Yakin ingin menghapus {judul}? Data yang sudah dihapus tidak bisa dikembalikan.)",
    "toast_hapus_loading": "string",
    "toast_hapus_sukses": "string"
  },
  "meta": {
    "title": "string tag title max 60 char",
    "description": "string meta description max 160 char",
    "keywords": "string comma-separated"
  }
}

================================================================================
# 5. DASHBOARD PEMINJAM
================================================================================
─── OUTPUT STRUCTURE ───
{
  "navbar": {
    "sub": "string (Kejaksaan Negeri Sumenep)",
    "title": "string (Perpustakaan Hukum)",
    "nav_items": [
      { "id": "beranda", "label": "string" },
      { "id": "peminjaman", "label": "string" },
      { "id": "riwayat", "label": "string" },
      { "id": "profil", "label": "string" }
    ],
    "role_label": "string (Anggota)",
    "notifikasi": {
      "tooltip": "string (Notifikasi)",
      "title": "string (Notifikasi)",
      "mark_all_read": "string (Tandai semua dibaca)",
      "empty": "string (Belum ada notifikasi)"
    },
    "logout": "string (Keluar)"
  },
  "hero": {
    "eyebrow": "string (Portal Anggota Perpustakaan Hukum)",
    "greeting": "string (Halo, {nama})",
    "description": "string 15-25 kata",
    "chips": {
      "member_since": "string (Anggota sejak ...)",
      "books_available": "string (... buku tersedia)"
    },
    "stat_cards": [
      { "icon_suggestion": "string", "label": "string (Koleksi Buku)" },
      { "icon_suggestion": "string", "label": "string (Sedang Dipinjam)" },
      { "icon_suggestion": "string", "label": "string (Menunggu Persetujuan)" },
      { "icon_suggestion": "string", "label": "string (Status Keanggotaan)" }
    ]
  },
  "beranda": {
    "section_eyebrow": "string (Katalog)",
    "section_title": "string (Koleksi Buku)",
    "section_count_format": "{total} buku · {kategori} kategori",
    "subsections": {
      "popular": { "badge": "string (Paling Populer)", "desc": "string (Buku yang paling sering dipinjam)" },
      "new": { "badge": "string (Baru Ditambahkan)", "desc": "string (Koleksi terbaru di perpustakaan)" },
      "recommended": { "badge": "string (Rekomendasi untukmu)", "desc": "string (Buku pilihan yang wajib kamu baca)" },
      "categories": { "badge": "string (Jelajahi Kategori)", "desc": "string (Pilih kategori untuk melihat koleksi buku)" }
    },
    "loading_skeleton": true,
    "empty": {
      "title": "string (Katalog buku masih kosong)",
      "description": "string (Tenang, admin sedang menyiapkan koleksi terbaik untukmu. Cek kembali nanti!)"
    }
  },
  "peminjaman": {
    "status_labels": {
      "booking": "string (Booking Aktif)",
      "dipinjam": "string (Sedang Dipinjam)",
      "terlambat": "string (Terlambat)",
      "menunggu_pembayaran": "string (Menunggu Pembayaran)",
      "dikembalikan": "string (Dikembalikan)",
      "dibatalkan": "string (Dibatalkan)"
    },
    "timeline_labels": {
      "batas_ambil": "string (Batas ambil: {date})",
      "batas_kembali": "string (Batas kembali: {date})",
      "dikembalikan": "string (Dikembalikan: {date})"
    },
    "empty": {
      "title": "string",
      "description": "string"
    },
    "loading": "string"
  },
  "riwayat": {
    "status_labels": {
      "booking": "string",
      "dipinjam": "string",
      "terlambat": "string",
      "menunggu_pembayaran": "string",
      "dikembalikan": "string",
      "dibatalkan": "string"
    },
    "timeline_labels": {
      "dikembalikan": "string (Dikembalikan: {date})",
      "dipinjam": "string (Dipinjam: {date})"
    },
    "empty": {
      "title": "string",
      "description": "string"
    },
    "loading": "string"
  },
  "profil": {
    "section": {
      "eyebrow": "string (Profil)",
      "title": "string (Informasi Akun Peminjam)"
    },
    "badge": "string (Anggota Perpustakaan)",
    "info_fields": [
      { "label": "string (Nama Lengkap)", "key": "nama_lengkap" },
      { "label": "string (Email)", "key": "email" },
      { "label": "string (Status Akun)", "key": "status_akun" },
      { "label": "string (Nomor Anggota)", "key": "nomor_anggota" }
    ],
    "stats": [
      { "label": "string (Total Dipinjam)", "key": "total_dipinjam" },
      { "label": "string (Aktif)", "key": "aktif" },
      { "label": "string (Selesai)", "key": "selesai" },
      { "label": "string (Booking Aktif)", "key": "booking_aktif" }
    ],
    "kartu_anggota": {
      "eyebrow": "string (Kartu Anggota)",
      "title": "string (Kartu Perpustakaan Digital)",
      "description": "string (Tunjukkan kartu ini untuk meminjam buku di perpustakaan)",
      "brand": "string (Pustaka Digital)",
      "card_type": "string (KARTU ANGGOTA)",
      "fields": [
        { "label": "string (Nomor Anggota)", "key": "no_anggota" },
        { "label": "string (Nama Lengkap)", "key": "nama" },
        { "label": "string (Berlaku Hingga)", "key": "berlaku_hingga" }
      ]
    },
    "request_buku": {
      "eyebrow": "string (Request Buku)",
      "title": "string (Usulkan Buku Baru)",
      "description": "string (Tidak menemukan buku yang dicari? Usulkan koleksi baru kepada admin.)",
      "fields": {
        "judul": { "label": "string", "placeholder": "string" },
        "penulis": { "label": "string", "placeholder": "string" },
        "penerbit": { "label": "string", "placeholder": "string" },
        "tahun_terbit": { "label": "string", "placeholder": "string" },
        "alasan": { "label": "string", "placeholder": "string" },
        "rak_id": { "label": "string", "placeholder": "string" }
      },
      "submit_text_default": "string (Kirim Permintaan)",
      "submit_text_loading": "string (Mengirim...)",
      "toast_sukses": "string (Permintaan buku berhasil dikirim!)",
      "toast_validasi": "string (Judul dan Penulis harus diisi.)"
    },
    "chart": {
      "section_eyebrow": "string (Statistik)",
      "section_title": "string (Riwayat Peminjaman)",
      "monthly_title": "string (Per Bulan)",
      "yearly_title": "string (Per Tahun)",
      "favorite_title": "string (Buku Favorit)",
      "dipinjam_label": "string (x dipinjam)"
    }
  },
  "sidebar_profil": {
    "badge": "string (Anggota Aktif)",
    "rows": [
      { "label": "string (Nomor Anggota)", "key": "no_anggota" },
      { "label": "string (Buku Dipinjam)", "key": "buku_dipinjam" },
      { "label": "string (Riwayat)", "key": "riwayat" },
      { "label": "string (Denda Aktif)", "key": "denda_aktif" }
    ],
    "membership": {
      "label": "string (Status Membership)",
      "tier": "string (Gold)",
      "description": "string (Anggota Aktif — {date})"
    }
  },
  "detail_modal": {
    "tombol_booking": "string (Booking)",
    "tombol_booking_loading": "string (Memproses...)"
  },
  "meta": {
    "title": "string tag title max 60 char",
    "description": "string meta description max 160 char",
    "keywords": "string comma-separated"
  }
}

─── PANDUAN TAMBAHAN ───
1. Sertakan nuansa lokal Sumenep/Madura jika relevan (khusus landing page)
2. Landing page: tone kredibel, mengundang, cocok untuk institusi hukum pemerintah
3. Login/Register: gunakan kata kerja aktif yang menginspirasi (Akses, Masuk, Kelola, Bergabung)
4. Dashboard Admin: tone profesional, efisien, fokus pada produktivitas
5. Dashboard Peminjam: tone ramah, informatif, memudahkan
6. Status peminjaman: gunakan label yang jelas dan mudah dipahami semua kalangan
7. Placeholder form: singkat, jelas, memberi contoh nilai input
8. Semua konten harus sopan dan sesuai citra institusi pemerintah
```
