# 📿 Hat Sanatı Sergisi - Dijital Rehber

Fiziksel bir hat sanatı sergisi için dijital rehber web uygulaması. Ziyaretçiler sergideki QR kodları okutarak eserlerin detay bilgilerine mobil cihazlarından ulaşabilir.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Özellikler

- 🖼️ **Eser Galerisi** - Responsive masonry grid ile tüm eserleri görüntüleme
- 📱 **QR Kod Desteği** - Her eser için QR kod oluşturma, indirme ve yazdırma
- 🔢 **Dinamik İstatistikler** - Gerçek zamanlı eser ve hattat sayıları
- 🎨 **Modern İslami Minimalizm** - Ferah tasarım ve yumuşak animasyonlar
- 🔐 **Admin Paneli** - CRUD işlemleri ve drag-drop resim yükleme
- ☁️ **Cloudflare R2** - Production-ready cloud storage desteği

## 🛠 Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 14.2.35 (App Router) |
| Dil | TypeScript |
| Veritabanı | SQLite (dev) / PostgreSQL (prod) |
| ORM | Prisma 5.x |
| Styling | CSS Modules |
| Auth | iron-session |
| Image Processing | Sharp |
| Cloud Storage | Cloudflare R2 (opsiyonel) |

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Kurulum

```bash
# Repoyu klonla
git clone https://github.com/YOUR_USERNAME/hat-sanati-sergisi.git
cd hat-sanati-sergisi

# Bağımlılıkları yükle
npm install

# Environment dosyasını oluştur
cp .env.example .env
# .env dosyasını düzenle

# Veritabanını oluştur
npx prisma db push

# Geliştirme sunucusunu başlat
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacak.

## 📁 Proje Yapısı

```
├── src/
│   ├── app/
│   │   ├── page.tsx              # Ana sayfa
│   │   ├── gallery/              # Galeri sayfası
│   │   ├── artwork/[id]/         # Eser detay
│   │   ├── admin/                # Admin paneli
│   │   └── api/                  # API routes
│   ├── components/
│   │   └── admin/                # Admin bileşenleri
│   └── lib/
│       ├── prisma.ts             # DB client
│       ├── auth.ts               # Auth utilities
│       ├── image.ts              # Resim işleme
│       └── r2.ts                 # Cloudflare R2
├── prisma/
│   ├── schema.prisma             # SQLite (dev)
│   └── schema.postgresql.prisma  # PostgreSQL (prod)
└── public/
    └── uploads/                  # Yüklenen resimler
```

## ⚙️ Environment Değişkenleri

`.env.example` dosyasını `.env` olarak kopyalayın ve düzenleyin:

```env
# Veritabanı
DATABASE_URL="file:./dev.db"

# Admin Kimlik Bilgileri
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# Session (min 32 karakter)
SESSION_SECRET=your_secret_key_minimum_32_characters

# Uygulama URL'i
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cloudflare R2 (Opsiyonel)
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
```

## 🔐 Admin Paneli

`/admin` adresinden erişin.

> ⚠️ **Önemli**: Production'da varsayılan şifreyi mutlaka değiştirin!

## 🚂 Railway Deployment

1. Railway.app'te yeni proje oluştur
2. PostgreSQL servisi ekle
3. Environment değişkenlerini ayarla
4. `prisma/schema.prisma` dosyasında provider'ı `postgresql` olarak değiştir
5. Deploy et

```bash
# Production build
npm run build

# Migration
npx prisma migrate deploy
```

## 📱 Tasarım Sistemi

"Modern İslami Minimalizm" tasarım dili:

| Element | Değer |
|---------|-------|
| Ana Renk | Krem `#FDFBF7` |
| Vurgu | Koyu Kömür `#1A1A1A` |
| Accent | Mat Altın `#C5A572` |
| Başlık Fontu | Playfair Display |
| Gövde Fontu | Inter |
| Arapça Font | Noto Naskh Arabic |

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

<p align="center">
  Made with ❤️ for <strong>Hat Sanatı</strong>
</p>
