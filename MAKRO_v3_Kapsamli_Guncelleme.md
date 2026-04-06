# MAKRO — Kapsamlı Güncelleme Promptu v3
# Görseller hazır, logo hazır, tüm sorunlar düzeltilecek

---

## ÖNCE: Görselleri Doğru Klasörlere Kopyala

```bash
# Bu komutları çalıştır (görseller.zip açıldıktan sonra):
mkdir -p public/slides public/products public/brand

# Slide görselleri (4 adet - hazır)
cp [zip_klasoru]/slides/slide1.png public/slides/slide1.png
cp [zip_klasoru]/slides/slide2.png public/slides/slide2.png
cp [zip_klasoru]/slides/slide3.png public/slides/slide3.png
cp [zip_klasoru]/slides/slide4.png public/slides/slide4.png

# Ürün görselleri (4 adet - hazır)
cp [zip_klasoru]/products/bisiklet-yaka-tisort-siyah.png public/products/bisiklet-yaka-tisort-siyah.png
cp [zip_klasoru]/products/kapsonlu-sweatshirt-siyah.png public/products/kapsonlu-sweatshirt-siyah.png
cp [zip_klasoru]/products/polar-ceket-siyah.png public/products/polar-ceket-siyah.png
cp [zip_klasoru]/products/reflektorlu-is-pantolonu-lacivert.png public/products/reflektorlu-is-pantolonu-lacivert.png

# Logo (preview__1_.webp — shield logosu)
cp [logo_dosyasi]/preview__1_.webp public/brand/logo.webp
```

---

## GÖREV 1 — Veritabanı: Ürün Görsellerini Güncelle + Yeni Alanlar Ekle

### 1A — Prisma Schema'ya Yeni Alanlar Ekle

`prisma/schema.prisma` — Product modeline ekle:
```
isNew        Boolean @default(false)   // Admin "En Yeni" işaretleyebilir
viewCount    Int @default(0)           // Otomatik sayaç — "En Popüler" için
```

`npx prisma db push` çalıştır.

### 1B — Seed Güncelle: Ürün Görsellerini Gerçek Dosyalara Bağla

`prisma/seed.ts` içinde ürün coverImageUrl'lerini güncelle:

```typescript
// Bisiklet Yaka Tişört
coverImageUrl: '/products/bisiklet-yaka-tisort-siyah.png',
isNew: true, isFeatured: true,

// Kapşonlu Sweatshirt  
coverImageUrl: '/products/kapsonlu-sweatshirt-siyah.png',
isFeatured: true,

// Polar Ceket
coverImageUrl: '/products/polar-ceket-siyah.png',
isFeatured: true, isNew: true,

// Reflektörlü İş Pantolonu
coverImageUrl: '/products/reflektorlu-is-pantolonu-lacivert.png',
isFeatured: true,
```

Diğer 6 ürün için coverImageUrl: null bırak (placeholder gösterilecek).

`npx prisma db seed` çalıştır (mevcut datayı temizleyip yeniden yükle).

---

## GÖREV 2 — Logo Güncelleme

Header'daki "M" text kutusu yerine gerçek logo görselini kullan.

`components/layout/Header.tsx` Logo bölümünü güncelle:

```tsx
<Link href="/" className="flex items-center gap-2 flex-shrink-0">
  <Image
    src="/brand/logo.webp"
    alt="Makro İş Elbiseleri"
    width={140}
    height={50}
    style={{ objectFit: 'contain', height: 44, width: 'auto' }}
    priority
  />
</Link>
```

Logo yüksekliği: 44px. Header'ın lacivert arka planında logo zaten beyaz/turuncu olduğu için mükemmel görünecek.

---

## GÖREV 3 — Renk Sistemi: Warm White

`app/globals.css` güncelle:

```css
:root {
  --page-bg: #FFF8F4;      /* Çok hafif sıcak beyaz — göz yormayan */
  --card-bg: #FFFFFF;
  --border: #EDE8E3;        /* Sıcak ton border */
  --orange: #F57C28;
  --navy: #0F2240;
}

body {
  background-color: var(--page-bg);
}
```

`tailwind.config.ts` ekle:
```ts
colors: {
  'page': '#FFF8F4',
  // mevcut renkler...
}
```

Tüm `bg-white` olan sayfa arka planlarını `bg-page` (veya inline `background: '#FFF8F4'`) yap.
Kartlar hala `bg-white` — bu kontrast doğru.
Sidebar: `bg-white border border-[#EDE8E3]`

---

## GÖREV 4 — Kategori Nav: Mega Menu (ismont Tarzı)

`components/layout/Header.tsx` — Kategori nav'ını mega menu'ye dönüştür.

'use client' direktifi şart.

State: `const [activeMenu, setActiveMenu] = useState<string | null>(null)`

Kategori bar yapısı:
```tsx
<div style={{ background: '#F57C28', position: 'relative', zIndex: 50 }}>
  <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex' }}>
    {categories.map(cat => (
      <div
        key={cat.slug}
        style={{ position: 'relative' }}
        onMouseEnter={() => setActiveMenu(cat.slug)}
        onMouseLeave={() => setActiveMenu(null)}
      >
        {/* Kategori butonu */}
        <Link href={`/kategoriler/${cat.slug}`} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '0 20px', height: 44,
          color: 'white', fontWeight: 700, fontSize: 13,
          textDecoration: 'none',
          background: activeMenu === cat.slug ? 'rgba(0,0,0,0.15)' : 'transparent',
          borderRight: '1px solid rgba(255,255,255,0.2)'
        }}>
          {cat.icon} {cat.name}
          <span style={{ fontSize: 10, opacity: 0.7 }}>▾</span>
        </Link>

        {/* Dropdown - sadece hover'da görünür */}
        {activeMenu === cat.slug && (
          <div style={{
            position: 'absolute', top: '100%', left: 0,
            background: 'white',
            minWidth: 280,
            boxShadow: '0 8px 32px rgba(15,34,64,0.18)',
            borderRadius: '0 0 12px 12px',
            border: '1px solid #EDE8E3',
            borderTop: '3px solid #F57C28',
            padding: '8px 0',
            zIndex: 100
          }}>
            {/* Kategori başlığı */}
            <div style={{
              padding: '12px 20px 8px',
              fontSize: 11, fontWeight: 800,
              color: '#F57C28', letterSpacing: '.08em',
              textTransform: 'uppercase', borderBottom: '1px solid #EDE8E3'
            }}>{cat.name}</div>

            {/* Ürün linkleri */}
            {cat.products?.map(product => (
              <Link key={product.slug} href={`/urunler/${product.slug}`} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 20px',
                color: '#1A202C', fontSize: 13, fontWeight: 500,
                textDecoration: 'none',
                transition: 'all .15s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FFF8F4'; e.currentTarget.style.color = '#F57C28' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1A202C' }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F57C28', flexShrink: 0 }} />
                {product.name}
              </Link>
            ))}

            {/* Alt link */}
            <div style={{ borderTop: '1px solid #EDE8E3', margin: '8px 0 0', padding: '10px 20px' }}>
              <Link href={`/kategoriler/${cat.slug}`} style={{
                fontSize: 12, fontWeight: 700, color: '#F57C28', textDecoration: 'none'
              }}>
                Tümünü Gör → ({cat._count?.products} ürün)
              </Link>
            </div>
          </div>
        )}
      </div>
    ))}

    {/* Sabit linkler */}
    <Link href="/kurumsal-cozumler" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 20px', height: 44, color: 'white', fontWeight: 700, fontSize: 13, textDecoration: 'none', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
      🎨 DTF Baskı
    </Link>
    <Link href="/iletisim" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 20px', height: 44, color: 'white', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
      📞 Toptan Satış
    </Link>
  </div>
</div>
```

Kategori datası için: Header'a `categories` prop geç veya fetch et.
Her kategorinin ürünlerini (isim + slug) fetch et dropdown için.

---

## GÖREV 5 — Arama: Autocomplete / Suggestions

`components/layout/SearchBar.tsx` — Yeni component oluştur (client):

```tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const router = useRouter()
  const timeoutRef = useRef<any>()

  useEffect(() => {
    if (query.length < 1) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }
    clearTimeout(timeoutRef.current)
    setLoading(true)
    timeoutRef.current = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`)
      const data = await res.json()
      setSuggestions(data.results || [])
      setShowDropdown(true)
      setLoading(false)
    }, 200) // 200ms debounce
  }, [query])

  const handleSelect = (slug: string) => {
    setShowDropdown(false)
    setQuery('')
    router.push(`/urunler/${slug}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setShowDropdown(false)
      router.push(`/urunler?arama=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div style={{ position: 'relative', flex: 1, maxWidth: 600 }}>
      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => query.length >= 1 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            placeholder="Ürün veya kategori ara..."
            style={{
              width: '100%', height: 40,
              padding: '0 44px 0 16px',
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white', fontSize: 14,
              outline: 'none', transition: 'all .2s'
            }}
            onMouseEnter={e => { (e.target as any).style.background = 'white'; (e.target as any).style.color = '#0F2240' }}
            onMouseLeave={e => { if (document.activeElement !== e.target) { (e.target as any).style.background = 'rgba(255,255,255,0.1)'; (e.target as any).style.color = 'white' }}}
          />
          <button type="submit" style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.7)', fontSize: 16
          }}>🔍</button>
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (suggestions.length > 0 || loading) && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: 'white', borderRadius: 12,
          boxShadow: '0 8px 32px rgba(15,34,64,.2)',
          border: '1px solid #EDE8E3',
          overflow: 'hidden', zIndex: 200
        }}>
          {loading && (
            <div style={{ padding: '12px 16px', color: '#8896A4', fontSize: 13 }}>Aranıyor...</div>
          )}
          {suggestions.map(item => (
            <div
              key={item.slug}
              onClick={() => handleSelect(item.slug)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 16px', cursor: 'pointer',
                borderBottom: '1px solid #F5F5F5',
                transition: 'background .1s'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#FFF8F4')}
              onMouseLeave={e => (e.currentTarget.style.background = 'white')}
            >
              {item.coverImageUrl ? (
                <img src={item.coverImageUrl} alt={item.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6 }} />
              ) : (
                <div style={{ width: 36, height: 36, background: '#F0F0F0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👕</div>
              )}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F2240' }}>{item.name}</div>
                <div style={{ fontSize: 11, color: '#8896A4' }}>{item.category?.name}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 11, color: '#F57C28', fontWeight: 600 }}>→</div>
            </div>
          ))}
          <div style={{ padding: '8px 16px', borderTop: '1px solid #F0F0F0' }}>
            <button onClick={() => router.push(`/urunler?arama=${encodeURIComponent(query)}`)}
              style={{ background: 'none', border: 'none', color: '#F57C28', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              "{query}" için tüm sonuçları gör →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

### Search API Route — app/api/search/route.ts:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || ''
  const limit = Number(req.nextUrl.searchParams.get('limit') || 6)

  if (!q || q.length < 1) {
    return NextResponse.json({ results: [] })
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { shortDescription: { contains: q, mode: 'insensitive' } },
        { fabricInfo: { contains: q, mode: 'insensitive' } },
        { productCode: { contains: q, mode: 'insensitive' } },
      ]
    },
    select: {
      name: true, slug: true, coverImageUrl: true,
      category: { select: { name: true } }
    },
    take: limit,
    orderBy: { sortOrder: 'asc' }
  })

  return NextResponse.json({ results: products })
}
```

Header'daki arama inputunu SearchBar component'iyle değiştir.

---

## GÖREV 6 — ProductCard: Hover Zoom + Detay Hover Menüsü

`components/products/ProductCard.tsx` güncelle — 'use client' olmalı.

### 6A — Hover Zoom:
```tsx
<div style={{ overflow: 'hidden', position: 'relative' }} className="group">
  <div className="transition-transform duration-500 ease-out group-hover:scale-110">
    <Image src={...} alt={...} />
  </div>
</div>
```

### 6B — Hover'da Açılan Detay Katmanı (ismont tarzı):
Kartın alt kısmına hover'da görünen bir overlay ekle:

```tsx
// Kart container'ına relative + group ekle
<div className="relative group overflow-hidden rounded-xl border ...">
  
  {/* Normal kart içeriği */}
  ...

  {/* Hover overlay — altta kayar yukarı */}
  <div style={{
    position: 'absolute', bottom: 0, left: 0, right: 0,
    background: 'linear-gradient(to top, rgba(15,34,64,0.95) 0%, rgba(15,34,64,0.7) 70%, transparent 100%)',
    padding: '20px 16px 16px',
    transform: 'translateY(100%)',
    transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
  }} className="group-hover:translate-y-0">
    
    {/* Özellikler */}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
      {product.features.slice(0, 3).map(f => (
        <span key={f.id} style={{
          background: 'rgba(245,124,40,0.2)', color: '#FFA05A',
          padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600
        }}>✓ {f.featureText}</span>
      ))}
    </div>

    {/* CTA butonları */}
    <div style={{ display: 'flex', gap: 8 }}>
      <Link href={`/urunler/${product.slug}`} style={{
        flex: 1, background: '#F57C28', color: 'white',
        padding: '8px 0', borderRadius: 7, textAlign: 'center',
        fontSize: 13, fontWeight: 700, textDecoration: 'none'
      }}>
        Detayı İncele →
      </Link>
      <a href={`https://wa.me/905418771635?text=${encodeURIComponent('Merhaba, ' + product.name + ' hakkında bilgi almak istiyorum.')}`}
        target="_blank" style={{
        background: '#25d366', color: 'white',
        padding: '8px 12px', borderRadius: 7,
        fontSize: 13, fontWeight: 700, textDecoration: 'none'
      }}>WA</a>
    </div>
  </div>
</div>
```

---

## GÖREV 7 — Ürün Detay: Görsel Zoom (Trendyol Tarzı)

`components/products/ProductGallery.tsx` güncelle — 'use client' olmalı.

### 7A — Hover Zoom (Mouse takibi):
```tsx
const [zoomStyle, setZoomStyle] = useState({ display: 'none' })
const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100
  setZoomPos({ x, y })
}

// Ana görsel container:
<div
  style={{ position: 'relative', cursor: 'zoom-in', overflow: 'hidden' }}
  onMouseMove={handleMouseMove}
  onMouseEnter={() => setZoomStyle({ display: 'block' })}
  onMouseLeave={() => setZoomStyle({ display: 'none' })}
>
  <Image src={mainImage} ... />
  
  {/* Zoom lens overlay */}
  <div style={{
    ...zoomStyle,
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage: `url(${mainImage})`,
    backgroundSize: '250%',
    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
    backgroundRepeat: 'no-repeat',
  }} />
</div>
```

### 7B — Tıklamada Full Ekran Lightbox:
```tsx
const [lightboxOpen, setLightboxOpen] = useState(false)

// Ana görsele onClick ekle:
onClick={() => setLightboxOpen(true)}

// Lightbox modal:
{lightboxOpen && (
  <div
    style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}
    onClick={() => setLightboxOpen(false)}
  >
    <button onClick={() => setLightboxOpen(false)} style={{
      position: 'absolute', top: 20, right: 20,
      background: 'rgba(255,255,255,.1)', border: 'none',
      color: 'white', width: 44, height: 44, borderRadius: '50%',
      fontSize: 20, cursor: 'pointer'
    }}>×</button>
    <img
      src={mainImage}
      alt="Ürün görseli"
      style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 8 }}
      onClick={e => e.stopPropagation()}
    />
  </div>
)}
```

---

## GÖREV 8 — Filtreleme Düzeltmesi

`app/urunler/page.tsx` — Filtreleme sistemini baştan yaz. Sorun genellikle server-side params'ta.

```typescript
// URL params'ı doğru oku:
export default async function UrunlerPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const kategori = typeof searchParams.kategori === 'string' ? searchParams.kategori : undefined
  const renk = typeof searchParams.renk === 'string' ? searchParams.renk : undefined
  const kumaş = typeof searchParams.kumaş === 'string' ? searchParams.kumaş : undefined
  const baskı = typeof searchParams.baskı === 'string' ? searchParams.baskı : undefined
  const arama = typeof searchParams.arama === 'string' ? searchParams.arama : undefined
  const sayfa = Number(searchParams.sayfa) || 1
  
  // Prisma where clause:
  const where: any = { isActive: true }
  
  if (kategori) {
    where.category = { slug: kategori }
  }
  if (arama) {
    where.OR = [
      { name: { contains: arama, mode: 'insensitive' } },
      { shortDescription: { contains: arama, mode: 'insensitive' } },
    ]
  }
  if (kumaş) {
    where.fabricInfo = { contains: kumaş, mode: 'insensitive' }
  }
  if (baskı === 'dtf') {
    where.hasPrintOption = true
  }
  if (baskı === 'nakis') {
    where.hasEmbroideryOption = true
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, colors: true, sizes: true, features: { take: 3 } },
      orderBy: { sortOrder: 'asc' },
      skip: (sayfa - 1) * 12,
      take: 12
    }),
    prisma.product.count({ where })
  ])
  // ...
}
```

FilterSidebar'ı 'use client' yap, URL params'ı `useRouter` + `useSearchParams` ile yönet:

```tsx
'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function FilterSidebar({ categories }: { categories: any[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('sayfa') // filtre değişince 1. sayfaya dön
    router.push(`/urunler?${params.toString()}`)
  }

  const currentKategori = searchParams.get('kategori')
  
  return (
    // ... filter UI with updateFilter calls
  )
}
```

---

## GÖREV 9 — Anasayfa: En Yeniler + En Popülerler Bölümleri

`app/page.tsx` — FeaturedProducts'tan sonra iki yeni section ekle:

```typescript
// Server side fetch:
const newProducts = await prisma.product.findMany({
  where: { isActive: true, isNew: true },
  include: { category: true, colors: true, sizes: true, features: { take: 2 } },
  orderBy: { createdAt: 'desc' },
  take: 4
})

const popularProducts = await prisma.product.findMany({
  where: { isActive: true },
  include: { category: true, colors: true, sizes: true, features: { take: 2 } },
  orderBy: { viewCount: 'desc' },
  take: 4
})
```

Section tasarımı:
```tsx
{/* EN YENİLER */}
<section style={{ padding: '64px 24px', background: '#FFFFFF' }}>
  <div style={{ maxWidth: 1280, margin: '0 auto' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
      <div>
        <span style={{ /* section-tag */ }}>🆕 En Yeniler</span>
        <h2 style={{ fontFamily: 'Barlow Condensed', fontSize: 36, fontWeight: 800, color: '#0F2240' }}>
          Yeni Gelen Modeller
        </h2>
      </div>
      <Link href="/urunler" style={{ color: '#F57C28', fontWeight: 700, fontSize: 14 }}>
        Tümünü Gör →
      </Link>
    </div>
    <ProductGrid products={newProducts} columns={4} />
  </div>
</section>

{/* EN POPÜLERLERs */}
<section style={{ padding: '64px 24px', background: '#FFF8F4' }}>
  {/* benzer yapı, title "Çok İncelenenler" */}
</section>
```

### viewCount Otomatik Artırma:
`app/urunler/[slug]/page.tsx` başına ekle:
```typescript
// Görüntülenme sayısını artır (background, awaited değil)
prisma.product.update({
  where: { slug: params.slug },
  data: { viewCount: { increment: 1 } }
}).catch(() => {}) // hata olursa sessizce geç
```

---

## GÖREV 10 — Admin Panel: Basit Ürün Yönetimi

`app/admin/` klasörü oluştur. NextAuth OLMADAN, basit şifre koruması:

### 10A — Middleware: app/middleware.ts
```typescript
import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const auth = req.cookies.get('admin-auth')?.value
    if (auth !== process.env.ADMIN_SECRET) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }
```

`.env.local`'a ekle: `ADMIN_SECRET="makro2026admin"`

### 10B — Login Sayfası: app/admin/login/page.tsx
```tsx
'use client'
// Form: şifre input + submit
// POST /api/admin/auth → cookie set → redirect /admin
```

### 10C — API: app/api/admin/auth/route.ts
```typescript
import { cookies } from 'next/headers'
export async function POST(req: Request) {
  const { password } = await req.json()
  if (password === process.env.ADMIN_SECRET) {
    cookies().set('admin-auth', process.env.ADMIN_SECRET!, {
      httpOnly: true, secure: true, maxAge: 60 * 60 * 24 * 7 // 7 gün
    })
    return Response.json({ success: true })
  }
  return Response.json({ error: 'Hatalı şifre' }, { status: 401 })
}
```

### 10D — Admin Dashboard: app/admin/page.tsx
```tsx
// Stats kartları:
// Toplam Ürün | Aktif Ürün | Toplam Form | Yeni Form

// Hızlı işlemler tablosu:
// Ürünleri listele, her ürün için:
// isFeatured toggle | isNew toggle | isActive toggle | Görsel yükle

// Form/Teklif listesi:
// Son 10 form, tarih + isim + durum
```

### 10E — Admin: app/admin/urunler/page.tsx
Ürün listesi tablosu:
- Ürün adı + görsel
- İsFeatured checkbox (PATCH /api/admin/products/[id] ile güncelle)
- IsNew checkbox
- IsActive toggle
- "Görsel Yükle" butonu → input[type=file] → POST /api/admin/upload

### 10F — Admin: app/api/admin/products/[id]/route.ts
```typescript
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  // auth cookie kontrol
  const data = await req.json()
  // sadece izin verilen alanlar: isFeatured, isNew, isActive, coverImageUrl, sortOrder
  const updated = await prisma.product.update({
    where: { id: params.id },
    data: { ...allowedFields(data) }
  })
  return Response.json(updated)
}
```

### 10G — Admin: app/api/admin/upload/route.ts
```typescript
export async function POST(req: Request) {
  // multipart form data parse
  // Dosyayı public/products/ klasörüne kaydet
  // Dosya adı: timestamp + original name
  // Return: { url: '/products/filename.png' }
}
```

### Admin Sidebar Tasarımı:
```
Sol sidebar (240px, navy bg):
  🏠 Dashboard
  👕 Ürünler
  📋 Teklifler  
  📬 Formlar
  🚪 Çıkış
```

---

## GÖREV 11 — Slide Görselleri Hero'ya Bağla

`app/page.tsx` — HeroSlider'daki slide'ların backgroundImage'larını gerçek görsellerle güncelle:

```typescript
const slides = [
  {
    bg: '#0F2240',
    image: '/slides/slide1.png',  // polo tişörtlü işçi
    tag: '🏭 2026 Koleksiyonu',
    title: 'Kurumsal Gücün',
    titleOrange: 'Üniiforması',
    subtitle: 'Compak penye, pike ve polar kumaştan kurumsal iş kıyafetleri.',
    cta: 'Koleksiyonu Keşfet →',
    href: '/urunler'
  },
  {
    bg: '#1A2B4A',
    image: '/slides/slide2.png',
    tag: '🎨 DTF Baskı & Nakış',
    title: 'Firmanızın Logosu',
    titleOrange: 'Her Üründe',
    subtitle: 'DTF baskı ve nakış ile kurumsal kimliğinizi yansıtın.',
    cta: 'Teklif İste →',
    href: '/teklif-iste'
  },
  {
    bg: '#0F2240',
    image: '/slides/slide3.png',
    tag: '🚚 Toptan Satış',
    title: 'Türkiye Geneline',
    titleOrange: 'Hızlı Teslimat',
    subtitle: 'Minimum sipariş bilgisi için hemen iletişime geçin.',
    cta: 'WhatsApp ile Yaz →',
    href: 'https://wa.me/905418771635'
  },
  {
    bg: '#243F6A',
    image: '/slides/slide4.png',
    tag: '👔 Tüm Sezonlar',
    title: 'Yazdan Kışa',
    titleOrange: 'Kurumsal Çözüm',
    subtitle: 'Tişörtten polar cekete her mevsim iş kıyafeti çözümleri.',
    cta: 'Kategorileri Gör →',
    href: '/kategoriler'
  }
]
```

Her SwiperSlide'da:
```tsx
<SwiperSlide>
  <div style={{ position: 'relative', width: '100%', height: '100%', background: slide.bg }}>
    {/* Arka plan görseli - sağ tarafta */}
    <Image
      src={slide.image}
      alt={slide.title}
      fill
      style={{ objectFit: 'cover', objectPosition: 'right center', opacity: 0.45 }}
      priority={index === 0}
    />
    {/* Sol gradient overlay (metin okunabilirliği için) */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(to right, rgba(15,34,64,0.95) 40%, rgba(15,34,64,0.3) 70%, transparent 100%)'
    }} />
    {/* Metin içeriği */}
    <div style={{ position: 'relative', zIndex: 1, ... }}>
      {/* başlık, cta vb */}
    </div>
  </div>
</SwiperSlide>
```

---

## GÖREV 12 — Veritabanı: Ürün Görsellerini Güncelle (Supabase)

Seed çalıştıktan sonra Supabase Studio'dan manuel kontrol et:
- products tablosu → coverImageUrl sütunu
- 4 ürünün görseli set edilmiş olmalı
- Diğer 6 ürün için null (placeholder gösterir)

Supabase Studio URL: proje dashboard → Table Editor → products tablosu

---

## GÖREV 13 — Build & Final Kontrol

```bash
npx tsc --noEmit  # TypeScript hata kontrolü
npm run build     # Build kontrolü
npm run dev       # Test
```

Kontrol listesi:
- [ ] Logo hero'da görünüyor
- [ ] Slider 4 slide'la dönüyor, görseller var
- [ ] Kategori nav'da hover'da dropdown açılıyor
- [ ] Arama kutusuna harf yazınca öneriler geliyor
- [ ] Ürün kartı hover'da zoom + alt panel açılıyor
- [ ] Ürün detayda görsel hover'da zoom, tıkla tam ekran
- [ ] Filtreler çalışıyor (kategori, kumaş, baskı)
- [ ] /admin/login çalışıyor
- [ ] Admin'de ürün toggle'ları çalışıyor
- [ ] Sayfa arka planı #FFF8F4 (hafif warm)
```
