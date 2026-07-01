# Prompt Landing Page — Perpustakaan Kejaksaan Negeri Sumenep

**Copy paste seluruh isi di bawah ini ke Stitch AI.**
**Format output: JSON terstruktur yang siap dipetakan ke komponen React.**

---

```
Anda adalah copywriter digital spesialis government branding dan legal industry. 
Tugas Anda adalah menghasilkan konten landing page dalam format JSON.

─── KONTEKS ───
Nama platform    : Perpustakaan Hukum — Kejaksaan Negeri Sumenep
Institusi        : Kejaksaan Negeri Sumenep (Kejari Sumenep), Madura, Jawa Timur
Moto             : Pelayanan Prima — Keadilan Sejati
Jenis            : Perpustakaan hukum digital (portal peminjaman buku online)
Target audiens   : Jaksa, hakim, advokat, notaris, mahasiswa hukum, dan masyarakat umum
Nilai merek      : Profesional, terpercaya, modern, melayani, berintegritas
Palet warna      : Hijau premium (#1E5631, #4a7c59), Emas (#D4AF37), Krem (#F8F6F2)
Daerah           : Sumenep, Pulau Madura (nuansa lokal Madura: batik, kerapan sapi, keris)

─── STRUKTUR OUTPUT ───
Buat JSON dengan key-key berikut. Setiap value adalah objek atau array sesuai petunjuk.

{
  "hero": {
    "headline": { value: "string max 60 karakter", fontBesar: boolean },
    "subheadline": "string 10-20 karakter",
    "description": "string 20-40 karakter",
    "cta_primary": { text: "string", link: "/register" },
    "cta_secondary": { text: "string", link: "/login" }
  },

  "tentang": {
    "title": "string",
    "paragraph": "string 50-75 kata (ceritakan tentang perpustakaan digital ini, siapa pengelolanya, tujuannya)",
    "highlights": ["string", "string", "string"] (3 nilai unggulan)
  },

  "fitur": [
    {
      "title": "string (1-3 kata)",
      "description": "string 10-20 kata (jelaskan manfaatnya)",
      "icon_suggestion": "nama ikon atau kata kunci untuk ikon SVG"
    }
  ] (minimal 3 fitur, maksimal 5 fitur),

  "statistik": [
    { "angka": "string (bisa pakai +)", "label": "string singkat" }
  ] (3-4 item statistik yang relevan untuk perpustakaan),

  "cara_kerja": [
    { "step": number, "title": "string 2-4 kata", "description": "string 10-15 kata" }
  ] (3-4 langkah, dari daftar hingga pinjam buku),

  "faq": [
    { "question": "string", "answer": "string 20-40 kata" }
  ] (3-5 pertanyaan umum seputar pendaftaran, peminjaman, denda, dll),

  "testimoni": [
    { "name": "string (nama tokoh fiktif)", "role": "string (jabatan)", "quote": "string 15-25 kata" }
  ] (2-3 testimoni fiktif yang realistis),

  "meta": {
    "title": "string tag title (max 60 char)",
    "description": "string meta description (max 160 char)",
    "keywords": "string comma-separated"
  }
}

─── PANDUAN GAYA BAHASA ───
1. Gunakan bahasa Indonesia formal tetapi hangat (tidak kaku)
2. Tone: profesional, berwibawa, mengundang, dan mudah dipahami
3. Hindari kata-kata bombastis atau klise ("terbaik", "nomor satu", "revolusioner")
4. Gunakan kata yang mencerminkan integritas, pelayanan, dan keadilan
5. Sertakan nuansa lokal Sumenep/Madura jika relevan
6. Semua konten harus sopan dan sesuai dengan citra institusi pemerintah

─── CONTOH SEBAGIAN OUTPUT (hanya untuk referensi format) ───
{
  "hero": {
    "headline": { "value": "Perpustakaan Hukum Digital Kejari Sumenep", "fontBesar": true },
    "subheadline": "Pelayanan Prima — Keadilan Sejati",
    "description": "Akses koleksi hukum, pinjam buku, dan kelola akun dalam satu platform.",
    "cta_primary": { "text": "Ayo Mulai", "link": "/register" },
    "cta_secondary": { "text": "Sudah punya akun? Masuk", "link": "/login" }
  },
  "meta": {
    "title": "Perpustakaan Hukum Digital — Kejaksaan Negeri Sumenep",
    "description": "Portal perpustakaan hukum digital Kejari Sumenep. Akses koleksi buku hukum, ajukan peminjaman, dan kelola akun secara online.",
    "keywords": "perpustakaan hukum, kejaksaan sumenep, perpustakaan digital, buku hukum, peminjaman buku online, kejari sumenep"
  }
}
```
