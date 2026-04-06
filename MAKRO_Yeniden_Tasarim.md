# MAKRO — Tam Yeniden Tasarım Promptu
# ismont.com.tr layout referansı alınarak, Makro'ya özel sade versiyon

## ÖNEMLİ OKUMA
Bu prompt mevcut siteyi TAMAMEN yeniden tasarlar.
Sadece veritabanı ve API routes korunur.
Tüm layout, header, anasayfa, ürün listeleme yeniden yazılır.

---

## GÖREV 1 — Yeni Header Yapısı (3 Katman)

`components/layout/Header.tsx` komple yeniden yaz.

### Katman 1 — Üst Bilgi Barı (bg-navy-mid, h-9)
```
Sol: ☎ 0541 877 16 35  |  📸 @makro.iselbisesi
Sağ: 🚚 Türkiye Geneli Toptan Teslimat  |  ✉ info@makro.com.tr
```
Font: 12px, text-white/65
Aralarında `|` ayraç

### Katman 2 — Ana Nav (bg-navy, h-16)
```
Sol: Logo (M kutusu + MAKRO yazısı)
Orta: Arama kutusu (tam genişlik, max-w-xl, rounded-full, bg-white/10, placeholder "Ürün veya kategori ara...")
Sağ: [WhatsApp] (yeşil) + [Teklif İste] (turuncu)
```

Arama kutusu:
- bg: rgba(255,255,255,0.1)
- border: 1px solid rgba(255,255,255,0.2)
- placeholder text: rgba(255,255,255,0.5)
- focus: bg-white, text-navy, border-orange
- Arama ikonuna tıklayınca /urunler?arama= sayfasına yönlendir

### Katman 3 — Kategori Nav (bg-orange, h-11)
```
👕 Tişört & Polo  |  🧥 Sweat & Kışlık  |  🧣 Polar & Eşofman  |  👖 İş Pantolonu  |  🎨 DTF Baskı  |  🪡 Nakış  |  📞 Toptan Satış
```
Font: 13px, font-bold, text-white
Her item: link → /kategoriler/[slug] veya ilgili sayfa
Hover: bg-orange-dark (darken %10)
Aktif kategori: underline veya bg-orange-dark

Mobile: Katman 3 gizle, hamburger menüde göster

Logo (Katman 2'de):
```tsx
<Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
  <div style={{ width:38, height:38, background:'#F57C28', borderRadius:8,
    display:'flex', alignItems:'center', justifyContent:'center' }}>
    <span style={{ fontFamily:'Barlow Condensed,sans-serif',
      fontSize:22, fontWeight:800, color:'white', lineHeight:1 }}>M</span>
  </div>
  <div>
    <div style={{ fontFamily:'Barlow Condensed,sans-serif',
      fontSize:20, fontWeight:800, color:'white', letterSpacing:'0.03em' }}>MAKRO</div>
    <div style={{ fontSize:9, fontWeight:700, color:'#FFA05A',
      letterSpacing:'0.14em', textTransform:'uppercase' }}>İş Elbiseleri</div>
  </div>
</Link>
```

---

## GÖREV 2 — Anasayfa Hero: Tam Genişlik Slider

`app/page.tsx` hero bölümünü tamamen yeniden yaz.

**İsmont benzeri tam genişlik slider — sadece anasayfada.**

`npm install swiper` (zaten kuruluysa geç)

### Slider Özellikleri:
- Genişlik: %100 (viewport tam genişlik)
- Yükseklik: 580px desktop / 380px mobile
- Effect: crossfade veya slide
- Autoplay: 4000ms, loop: true
- Pagination: beyaz nokta göstergeleri (altta ortalı)
- Navigation: sol/sağ ok butonları (yarı saydam beyaz daire)

### Her Slide Yapısı:
```
[Tam genişlik arka plan görseli veya gradient]
  └── İçerik overlay (sol taraf, diagonal veya düz)
       ├── Küçük etiket (turuncu pill)
       ├── Büyük başlık (Barlow Condensed, 64px, beyaz+turuncu)
       ├── Alt başlık (16px, beyaz/70)
       └── CTA buton (turuncu)
```

### 4 Slide İçeriği:

**Slide 1:**
```
bg: linear-gradient(135deg, #0F2240 0%, #1A3A6E 50%, #0F2240 100%)
overlay-image: /slides/slide1.jpg (eğer varsa, object-cover sağ taraf)
Etiket: "🏭 2026 Koleksiyonu"
Başlık: "Kurumsal Gücün\n<orange>Üniiforması</orange>"
Alt: "Compak penye, pike ve polar kumaştan kurumsal iş kıyafetleri"
CTA: "Koleksiyonu Keşfet →" → /urunler
```

**Slide 2:**
```
bg: linear-gradient(135deg, #1A2B4A, #243F6A)
Etiket: "🎨 DTF Baskı & Nakış"
Başlık: "Firmanızın Logosu\n<orange>Her Üründe</orange>"
Alt: "DTF baskı ve nakış teknolojisiyle kurumsal kimliğinizi yansıtın"
CTA: "Teklif İste →" → /teklif-iste
```

**Slide 3:**
```
bg: linear-gradient(135deg, #0F2240, #1E3D5C)
Etiket: "🚚 Toptan Satış"
Başlık: "Türkiye Geneline\n<orange>Hızlı Teslimat</orange>"
Alt: "Minimum sipariş bilgisi ve özel fiyat için hemen iletişime geçin"
CTA: "WhatsApp ile Yaz →" → wa.me/905418771635
```

**Slide 4:**
```
bg: linear-gradient(135deg, #243F6A, #0F2240)
Etiket: "👔 Tüm Sezonlar"
Başlık: "Yazdan Kışa\n<orange>Kurumsal Çözüm</orange>"
Alt: "Tişörtten polar cekete, her mevsim için iş kıyafeti çözümleri"
CTA: "Kategorileri Gör →" → /kategoriler
```

### Görsel yoksa (placeholder):
Her slide'da büyük product mockup görseli yok ise:
- Sağ tarafa büyük semitransparent ürün emoji (128px, opacity .15)
- Veya "LOGONUZ BURDA OLSUN" benzeri katalog mockup stili

### Slider Kodu Yapısı:
```tsx
'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

const slides = [
  { tag:'...', title:'...', titleOrange:'...', subtitle:'...', cta:'...', href:'...' },
  // ...
]

export default function HeroSlider() {
  return (
    <section style={{ width:'100%', height:580, position:'relative', overflow:'hidden' }}>
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        pagination={{ clickable: true }}
        navigation={{
          prevEl: '.hero-prev',
          nextEl: '.hero-next',
        }}
        style={{ width:'100%', height:'100%' }}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div style={{
              width:'100%', height:'100%',
              background: slide.bg,
              display:'flex', alignItems:'center',
              padding: '0 80px',
              position:'relative', overflow:'hidden'
            }}>
              {/* Dekoratif desen */}
              <div style={{
                position:'absolute', inset:0, opacity:.04,
                backgroundImage:'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
                backgroundSize:'30px 30px'
              }} />
              
              {/* Sol içerik */}
              <div style={{ maxWidth:560, position:'relative', zIndex:1 }}>
                <div style={{
                  display:'inline-block',
                  background:'rgba(245,124,40,.25)',
                  border:'1px solid rgba(245,124,40,.5)',
                  color:'#FFA05A', padding:'6px 16px',
                  borderRadius:20, fontSize:12, fontWeight:700,
                  letterSpacing:'.08em', textTransform:'uppercase',
                  marginBottom:20
                }}>{slide.tag}</div>
                
                <h2 style={{
                  fontFamily:'Barlow Condensed,sans-serif',
                  fontSize:64, fontWeight:800,
                  color:'white', lineHeight:.95,
                  marginBottom:20
                }}>
                  {slide.title}<br/>
                  <span style={{ color:'#F57C28' }}>{slide.titleOrange}</span>
                </h2>
                
                <p style={{
                  fontSize:17, color:'rgba(255,255,255,.7)',
                  lineHeight:1.6, marginBottom:32, maxWidth:440
                }}>{slide.subtitle}</p>
                
                <a href={slide.href} style={{
                  display:'inline-block',
                  background:'#F57C28', color:'white',
                  padding:'14px 28px', borderRadius:8,
                  fontSize:15, fontWeight:700,
                  textDecoration:'none',
                  transition:'background .2s'
                }}>{slide.cta}</a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Navigation okları */}
      <button className="hero-prev" style={{
        position:'absolute', left:20, top:'50%', transform:'translateY(-50%)',
        zIndex:10, width:44, height:44, borderRadius:'50%',
        background:'rgba(255,255,255,.15)', border:'1px solid rgba(255,255,255,.3)',
        color:'white', fontSize:18, cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center'
      }}>‹</button>
      <button className="hero-next" style={{
        position:'absolute', right:20, top:'50%', transform:'translateY(-50%)',
        zIndex:10, width:44, height:44, borderRadius:'50%',
        background:'rgba(255,255,255,.15)', border:'1px solid rgba(255,255,255,.3)',
        color:'white', fontSize:18, cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center'
      }}>›</button>
    </section>
  )
}
```

Hero slider'ı `app/page.tsx`'te Header'ın hemen altına, diğer section'ların üstüne koy.
Header sticky olduğu için slider header'ın altından başlar.

---

## GÖREV 3 — Anasayfa Genel Layout Yeniden Düzenleme

Hero slider'dan sonra sıra:

```
[HeroSlider] ← tam genişlik, 580px
[TrustBar]   ← bg-gray-50, 4 özellik
[CategoryGrid] ← bg-white, 4 kart, 2 sütun
[FeaturedProducts] ← bg-gray-50, 4 ürün grid
[CorporateBand] ← bg-navy, CTA
```

### TrustBar (bg-gray-50, border-y border-gray-200, py-4):
4 item yatay, her biri: icon + bold text + küçük açıklama
Max-width: 1280px, merkezi
```
🏭 Toptan Satış | Kurumsal anlaşma ile uygun fiyat
🎨 Logo Baskı & Nakış | DTF ve nakış teknolojisi
🚚 Hızlı Teslimat | Türkiye geneline güvenli kargo
✏️ Özel Tasarım | Renk, kumaş, beden özelleştirme
```

### CategoryGrid (py-16, bg-white):
Başlık: section-tag + H2
4 kart grid (4-col desktop, 2-col mobile):
- Kart yüksekliği 200px
- Üst %60: gradient bg + emoji (büyük, centered)
- Alt %40: kategori adı + ürün sayısı + "İncele →" link

### FeaturedProducts (py-16, bg-gray-50):
Başlık: "Öne Çıkan Ürünler"
ProductGrid: 4-col, isFeatured=true ürünler
Alt: ghost buton "Tüm Ürünleri Gör →"

### CorporateBand (bg-navy, py-16):
Sol: H2 + subtitle
Sağ: [WhatsApp] + [Teklif İste]

---

## GÖREV 4 — Sayfa Genel Arka Plan Düzeltmesi

Tüm public sayfalarda:
- Sayfa arka planı: `#F7F8FA` (hafif warm gray, beyaz değil)
- Card arka planı: `#FFFFFF`
- Section alternating: `#FFFFFF` ve `#F7F8FA`
- Border rengi: `#E8ECF0` (keskin değil, yumuşak)

`app/globals.css`'e ekle:
```css
body {
  background-color: #F7F8FA;
}
.bg-page { background-color: #F7F8FA; }
.bg-card { background-color: #FFFFFF; }
.border-soft { border-color: #E8ECF0; }
```

---

## GÖREV 5 — Ürün Listeleme Sayfa Header'ı Düzeltme

`app/urunler/page.tsx` — Sayfa başlık bölümünü düzelt:

```tsx
{/* Sayfa başlığı — navy bg, compact */}
<div style={{ background:'#0F2240', padding:'32px 0 28px' }}>
  <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px' }}>
    {/* Breadcrumb */}
    <div style={{ fontSize:13, color:'rgba(255,255,255,.45)', marginBottom:10, display:'flex', gap:8 }}>
      <a href="/" style={{ color:'rgba(255,255,255,.45)', textDecoration:'none' }}>Anasayfa</a>
      <span>›</span>
      <span style={{ color:'#FFA05A' }}>Ürünler</span>
    </div>
    <h1 style={{
      fontFamily:'Barlow Condensed,sans-serif',
      fontSize:42, fontWeight:800, color:'white', margin:0
    }}>Ürün Koleksiyonu 2026</h1>
    <p style={{ fontSize:15, color:'rgba(255,255,255,.55)', marginTop:8 }}>
      DTF baskı ve nakış seçeneğiyle kurumsal kıyafet koleksiyonumuz
    </p>
  </div>
</div>
```

Sidebar ve product grid: `bg-page (#F7F8FA)` üzerinde

---

## GÖREV 6 — Kayan Ticker Banner (Sadece Anasayfa Dışında)

`app/layout.tsx`'te Header'ın hemen üstüne TickerBanner ekle.
Anasayfada hero slider zaten var, ticker anasayfada da görünebilir (üstte, ince).

`components/shared/TickerBanner.tsx`:
```tsx
'use client'
export default function TickerBanner() {
  const content = '🚚 Türkiye Geneli Toptan Teslimat  •  🎨 DTF Baskı & Nakış  •  ✏️ Firmaya Özel Tasarım  •  📦 Minimum Sipariş Bilgi: 0541 877 16 35  •  🏭 Kurumsal Anlaşma  •  🚀 Hızlı Üretim  •  '
  
  return (
    <div style={{
      background: '#F57C28',
      height: 34,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center'
    }}>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: ticker 30s linear infinite;
          white-space: nowrap;
          display: flex;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="ticker-track">
        <span style={{ fontSize:12, fontWeight:600, color:'white', letterSpacing:'.02em' }}>
          {content}{content}
        </span>
      </div>
    </div>
  )
}
```

Layout sırası:
```tsx
<TickerBanner />   {/* turuncu kayan band */}
<Header />         {/* 3 katmanlı nav */}
<main>{children}</main>
<Footer />
<WhatsAppFloat />
```

---

## GÖREV 7 — Footer Güncelleme

`components/layout/Footer.tsx` — ismont benzeri daha kompakt ve bilgi yoğun:

**Üst bant (bg-orange, py-3):**
```
"🚀 Türkiye'nin Kurumsal Kıyafet Markası — Toptan Satış İçin: 0541 877 16 35"
```
Beyaz metin, ortalı, 14px bold

**Ana footer (bg-navy, py-12):**
4 sütun grid:

Sütun 1 — Marka:
Logo + "Kurumsal iş kıyafetinde güvenilir çözüm ortağınız." + sosyal ikonlar

Sütun 2 — Ürünler:
Tişört & Polo | Sweat & Kışlık | Polar & Eşofman | İş Pantolonu | Tüm Ürünler

Sütun 3 — Kurumsal:
Hakkımızda | Kurumsal Çözümler | DTF Baskı & Nakış | SSS | İletişim

Sütun 4 — İletişim:
📞 0541 877 16 35
💬 WhatsApp ile Yaz
📸 @makro.iselbisesi
📍 Türkiye Geneli Teslimat
[Teklif İste →] turuncu buton

**Alt bant (border-t border-white/10, py-4):**
"© 2026 Makro İş Elbiseleri" | KVKK | Gizlilik Politikası

---

## GÖREV 8 — Build & Kontrol

```bash
npm run build
```

Hata varsa düzelt. Özellikle:
- Swiper 'use client' gerektiriyor — HeroSlider client component olmalı
- TickerBanner 'use client' olmalı
- Header 3 katmanlı yapı — usePathname için 'use client' şart

TypeScript kontrolü:
```bash
npx tsc --noEmit
```

---

## SONUÇ — Site Yapısı

```
[Turuncu Ticker Banner — kayan metin, 34px]
[Header Katman 1 — üst bilgi bar, 36px, navy-mid]  
[Header Katman 2 — logo + arama + butonlar, 64px, navy]
[Header Katman 3 — kategori nav, 44px, orange]
──────────────────────────────────────
[ANASAYFA: HeroSlider — tam genişlik, 580px]
[TrustBar — 4 özellik]
[Kategori Grid — 4 kart]
[Öne Çıkan Ürünler — 4 ürün]
[CTA Band — navy]
──────────────────────────────────────
[ÜRÜNLER: Sayfa Header (navy, compact)]
[Sol Sidebar + Ürün Grid (bg #F7F8FA)]
──────────────────────────────────────
[Footer üst bant — orange]
[Footer ana — navy, 4 sütun]
[Footer alt — copyright]
[WhatsApp Floating Button]
```

Bu yapı ismont'un 3 katmanlı nav + tam genişlik hero yaklaşımını alır,
sepet/üyelik/kargo olmadan Makro'ya özgü sade ve profesyonel bir site sunar.
