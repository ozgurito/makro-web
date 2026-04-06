# MAKRO İş Elbiseleri — Claude Code Prompt Seti (Sade Versiyon)
**Stack: Next.js 14 · Tailwind CSS · Supabase · Prisma · Resend · Vercel/Antigravity**

---

## GİRİŞ — Ne İnşa Ediyoruz?

Kurumsal iş kıyafeti markası için **ürün vitrin sitesi**.

- Ziyaretçi ürünlere baksın → teklif istesin veya WhatsApp'tan yazsın
- Admin Supabase Studio üzerinden ürün ekler/çıkarır (ayrı panel yok)
- Basit, hızlı, bakımı kolay

**Olmayacak:** Sepet, ödeme, üyelik, stok, audit log, banner sistemi, medya kütüphanesi, rol yönetimi.

**Toplam sayfa sayısı:** 8 public sayfa + basit admin ürün formu.

---

---

# PROMPT 1 — Proje Kurulumu

```
Create a Next.js 14 project called "makro-web" for a Turkish corporate workwear catalog site.

STACK:
- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Prisma ORM
- Supabase (PostgreSQL + Storage)
- Resend (email)
- Zod + react-hook-form
- next/image

COMMANDS:
npx create-next-app@latest makro-web --typescript --tailwind --app --import-alias="@/*"
cd makro-web
npm install prisma @prisma/client
npm install resend
npm install zod @hookform/resolvers react-hook-form
npm install clsx tailwind-merge
npm install sharp
npx prisma init

FOLDER STRUCTURE:
makro-web/
├── app/
│   ├── layout.tsx              ← root layout
│   ├── page.tsx                ← homepage
│   ├── urunler/
│   │   ├── page.tsx            ← product listing
│   │   └── [slug]/page.tsx     ← product detail
│   ├── kategoriler/
│   │   └── [slug]/page.tsx     ← category listing
│   ├── teklif-iste/page.tsx
│   ├── iletisim/page.tsx
│   ├── hakkimizda/page.tsx
│   ├── sss/page.tsx
│   └── kvkk/page.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   └── FilterSidebar.tsx
│   └── shared/
│       ├── WhatsAppFloat.tsx
│       └── CookieConsent.tsx
├── lib/
│   ├── prisma.ts
│   ├── supabase.ts
│   └── utils.ts
└── prisma/
    ├── schema.prisma
    └── seed.ts

CREATE lib/prisma.ts:
import { PrismaClient } from '@prisma/client'
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
export default prisma

CREATE lib/utils.ts with cn() helper (clsx + tailwind-merge).

CREATE .env.local with placeholders:
DATABASE_URL=""
DIRECT_URL=""
RESEND_API_KEY=""
ADMIN_EMAIL="info@makro.com.tr"
NEXT_PUBLIC_WHATSAPP="905418771635"
NEXT_PUBLIC_PHONE="05418771635"
NEXT_PUBLIC_INSTAGRAM="makro.iselbisesi"
NEXT_PUBLIC_SITE_URL="https://makroiselbisesi.com.tr"
```

---

# PROMPT 2 — Tailwind + Marka Sistemi

```
Configure the complete Makro brand design system in makro-web.

UPDATE tailwind.config.ts — extend with:

colors:
  navy:
    DEFAULT: '#0F2240'
    mid: '#1A3358'
    light: '#243F6A'
  orange:
    DEFAULT: '#F57C28'
    dark: '#D96718'
    light: '#FFA05A'

fontFamily:
  heading: ['Barlow Condensed', 'sans-serif']
  body: ['Nunito Sans', 'sans-serif']

borderRadius:
  card: '16px'
  btn: '8px'

boxShadow:
  card: '0 2px 12px rgba(15,34,64,.08)'
  elevated: '0 8px 32px rgba(15,34,64,.14)'
  cta: '0 6px 20px rgba(245,124,40,.35)'

UPDATE app/layout.tsx:
- Import Barlow Condensed (weights: 600, 700, 800) and Nunito Sans (weights: 300, 400, 600, 700) from next/font/google
- Apply font variables to html element
- Set metadata: title default "Makro İş Elbiseleri", description

UPDATE app/globals.css:
- CSS custom properties matching Tailwind tokens
- Base: body uses font-body, headings use font-heading
- Utility: .btn-primary (orange bg, white text, hover dark), .btn-outline (transparent, white border), .section-tag (orange pill badge small)
- Smooth scroll on html
```

---

# PROMPT 3 — Veritabanı (Prisma Schema + Seed)

```
Create the complete database schema and seed for Makro İş Elbiseleri.

=== SCHEMA (prisma/schema.prisma) ===

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

MODEL: Category
- id String @id @default(cuid())
- name String
- slug String @unique
- description String?
- imageUrl String?
- sortOrder Int @default(0)
- isActive Boolean @default(true)
- seoTitle String?
- seoDescription String?
- products Product[]
- createdAt DateTime @default(now())

MODEL: Product
- id String @id @default(cuid())
- categoryId String
- category Category @relation(...)
- name String
- slug String @unique
- productCode String?
- shortDescription String?
- longDescription String? @db.Text
- coverImageUrl String?
- fabricInfo String?       ("Örn: %100 Compak Penye")
- fabricWeight String?     ("Örn: 180-200 gr/m²")
- washingInstructions String?
- hasPrintOption Boolean @default(false)
- hasEmbroideryOption Boolean @default(false)
- isFeatured Boolean @default(false)
- isActive Boolean @default(true)
- sortOrder Int @default(0)
- seoTitle String?
- seoDescription String?
- colors ProductColor[]
- sizes ProductSize[]
- features ProductFeature[]
- images ProductImage[]
- createdAt DateTime @default(now())
- updatedAt DateTime @updatedAt
@@index([categoryId, isActive, isFeatured])

MODEL: ProductColor
- id, productId, colorName, colorHex, isAvailable Boolean @default(true)

MODEL: ProductSize
- id, productId, sizeLabel, isAvailable Boolean @default(true)

MODEL: ProductFeature
- id, productId, featureText, sortOrder Int @default(0)

MODEL: ProductImage
- id, productId, imageUrl, altText String?, sortOrder Int @default(0), isCover Boolean @default(false)

MODEL: ContactSubmission
- id String @id @default(cuid())
- fullName String
- companyName String?
- email String
- phone String
- message String @db.Text
- type String @default("contact")   // "contact" | "quote"
- status String @default("new")     // "new" | "read"
- createdAt DateTime @default(now())

(No audit log, no banners, no admin users, no site content — keeping it simple)

Run: npx prisma generate

=== SEED (prisma/seed.ts) ===

Seed all 4 categories and all 10 products with COMPLETE data:

CATEGORIES:
1. name:"Tişört & Polo" slug:"tisort-polo" sortOrder:1
   seoTitle:"Kurumsal Tişört & Polo | Makro İş Elbiseleri"
   seoDescription:"DTF baskı ve nakış seçeneğiyle bisiklet yaka ve polo yaka tişört modelleri. Toptan satış."

2. name:"Sweat & Kışlık" slug:"sweat-kislik" sortOrder:2
   seoTitle:"Kurumsal Sweatshirt & Kışlık | Makro İş Elbiseleri"

3. name:"Polar & Eşofman" slug:"polar-esofman" sortOrder:3

4. name:"İş Pantolonu" slug:"is-pantolonu" sortOrder:4
   seoTitle:"Reflektörlü İş Pantolonu | Makro İş Elbiseleri"

STANDARD COLORS (used by products 1-9):
[{colorName:"Siyah",colorHex:"#1A1A1A"},{colorName:"Gri",colorHex:"#808080"},
{colorName:"Lacivert",colorHex:"#1B2A6B"},{colorName:"Kırmızı",colorHex:"#C0392B"},
{colorName:"Beyaz",colorHex:"#F5F5F5"}]

STANDARD SIZES (used by all): ["S","M","L","XL"]

PRODUCTS:

1. Bisiklet Yaka Tişört
slug:"bisiklet-yaka-tisort" productCode:"MKR-TS-BSK-001" categorySlug:"tisort-polo"
shortDescription:"Compak penye kumaştan imal, DTF baskı ile firmaya özel logo uygulanabilir."
fabricInfo:"%100 Compak Penye" fabricWeight:"180–200 gr/m²"
washingInstructions:"30°C'de ters çevirilerek yıkama. Ağartıcı kullanmayınız."
hasPrintOption:true isFeatured:true
features:["Compak penye kumaş yapısı","DTF baskı teknolojisi","Nefes alabilen hafif kumaş","Bisiklet yaka rahat kesim","Firmaya özel tasarım yapılabilir"]
seoTitle:"Bisiklet Yaka Tişört Toptan | DTF Baskılı Kurumsal Tişört - Makro"
seoDescription:"Compak penye bisiklet yaka tişört, S-XL beden, 5 renk seçeneği. Toptan fiyat için 0541 877 16 35."

2. Polo Yaka Tişört
slug:"polo-yaka-tisort" productCode:"MKR-TS-PLO-001" categorySlug:"tisort-polo"
shortDescription:"Pike kumaştan imal, DTF baskı ve nakış seçeneğiyle kurumsal kullanıma uygun."
fabricInfo:"%100 Pike (Piqué)" fabricWeight:"220–240 gr/m²"
hasPrintOption:true hasEmbroideryOption:true isFeatured:true
features:["Pike kumaştan imal","DTF baskı + nakış seçeneği","Polo yaka kurumsal görünüm","Dayanıklı uzun ömürlü kumaş","Firmaya özel tasarım"]
seoTitle:"Polo Yaka Tişört Toptan | Nakışlı Kurumsal Polo - Makro"

3. Bisiklet Yaka Sweatshirt
slug:"bisiklet-yaka-sweatshirt" productCode:"MKR-SW-BSK-001" categorySlug:"sweat-kislik"
fabricInfo:"%100 3 İplik Şardonlu Compak Penye" fabricWeight:"280–300 gr/m²"
hasPrintOption:true
features:["3 iplik şardonlu compak penye","DTF baskı teknolojisi","Kalın sıcak tutan yapı","Bisiklet yaka rahat kalıp","Firmaya özel baskı ve tasarım"]

4. Polo Yaka Sweatshirt
slug:"polo-yaka-sweatshirt" productCode:"MKR-SW-PLO-001" categorySlug:"sweat-kislik"
fabricInfo:"%100 3 İplik Şardonlu Compak Penye" fabricWeight:"320–340 gr/m²"
hasPrintOption:true
features:["3 iplik şardonlu compak penye","DTF baskı teknolojisi","Polo yaka kurumsal görünüm","Kalın sıcak dayanıklı kumaş","Firmaya özel tasarım"]

5. Kapşonlu Sweatshirt
slug:"kapsonly-sweatshirt" productCode:"MKR-SW-KPS-001" categorySlug:"sweat-kislik"
fabricInfo:"%100 3 İplik Şardonlu Compak Penye" fabricWeight:"300–320 gr/m²"
hasPrintOption:true isFeatured:true
features:["3 iplik şardonlu compak penye","DTF baskı teknolojisi","Kapşonlu soğuğa karşı koruma","Kanguru cep pratik tasarım","Firmaya özel baskı"]

6. Yarım Zip Sweatshirt
slug:"yarim-zip-sweatshirt" productCode:"MKR-SW-YZP-001" categorySlug:"sweat-kislik"
fabricInfo:"%100 3 İplik Şardonlu Compak Penye" fabricWeight:"300–320 gr/m²"
hasPrintOption:true
features:["3 iplik şardonlu compak penye","Yarım fermuarlı dik yaka","DTF baskı teknolojisi","Rahat şık kurumsal görünüm","Firmaya özel tasarım"]

7. Fermuarlı Kapşonlu Hırka
slug:"fermurali-kapsonly-hirka" productCode:"MKR-SW-FKH-001" categorySlug:"sweat-kislik"
fabricInfo:"%100 3 İplik Şardonlu Compak Penye" fabricWeight:"300–320 gr/m²"
hasPrintOption:true
features:["Tam fermuarlı kapşonlu tasarım","Kanguru cep çift taraf cep","DTF baskı teknolojisi","Dört mevsim kullanıma uygun","Firmaya özel tasarım"]

8. Polar Ceket
slug:"polar-ceket" productCode:"MKR-PL-CKT-001" categorySlug:"polar-esofman"
shortDescription:"PET polar kumaştan üretilmektedir. Tam fermuarlı tasarımıyla kurumsal sahada tercih edilir."
fabricInfo:"Polietilen Tereftalat (PET) Polar"
washingInstructions:"30°C makine yıkama."
hasPrintOption:true isFeatured:true
features:["PET polar kumaş","Rüzgara ve soğuğa dayanıklı","Tam fermuarlı şık tasarım","Firmaya özel logo baskı","Çok cepli pratik kullanım","Hafif ve sıcak tutan yapı"]

9. Eşofman Takımı
slug:"esofman-takimi" productCode:"MKR-ES-TKM-001" categorySlug:"polar-esofman"
shortDescription:"3 iplik şardonlu kumaştan, üst ve alt komple takım olarak sunulmaktadır."
fabricInfo:"%100 3 İplik Şardonlu Compak Penye" fabricWeight:"280–300 gr/m²"
hasPrintOption:true
features:["Üst + alt takım komple set","3 iplik şardonlu compak penye","DTF baskı teknolojisi","Rahat kesim hareket özgürlüğü","Firmaya özel tasarım"]

10. Reflektörlü İş Pantolonu
slug:"reflektorlu-is-pantolonu" productCode:"MKR-PN-RFL-001" categorySlug:"is-pantolonu"
shortDescription:"Dayanıklı kargo kumaşından imal. Reflektör şeritleri ile güvenlik standartlarını karşılar."
fabricInfo:"%65 Polyester / %35 Pamuk Kargo"
washingInstructions:"40°C makine yıkama."
hasPrintOption:true isFeatured:true
colors:[{colorName:"Lacivert",colorHex:"#1B2A6B"},{colorName:"Gri",colorHex:"#808080"}]
features:["Dayanıklı kargo tipi kumaş","Reflektör şeritli güvenlik tasarımı","Çok cepli pratik kullanım","Firmaya özel logo baskı","Elastik bel hareket konforu","Kurumsal saha kullanımına uygun"]
seoTitle:"Reflektörlü İş Pantolonu | Kargo Cepli Kurumsal Pantolon - Makro"

After seed file: add to package.json → "prisma": {"seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"}
Run: npx prisma db push && npx prisma db seed
```

---

# PROMPT 4 — API Routes

```
Create all API route handlers for makro-web. Keep them minimal and focused.

1. app/api/products/route.ts — GET
Query params: category, color, fabric, print, featured, search, page(default 1), limit(default 12)
- Fetch from Prisma, filter isActive:true always
- Include: category, colors, sizes, features (not images — too heavy for listing)
- Return: { products, total, totalPages, currentPage }

2. app/api/products/[slug]/route.ts — GET single by slug
- Include ALL relations
- 404 if not found or not active

3. app/api/categories/route.ts — GET
- All active categories with _count: { products } where isActive:true
- Ordered by sortOrder

4. app/api/contact/route.ts — POST
Body: { fullName, email, phone, companyName?, message, type: "contact"|"quote", productInterests?, quantityEstimate?, printOption?, specialNotes?, website? }

Validation with Zod.
Honeypot: if body.website has value → return { success: true } silently (spam bot).
Save to ContactSubmission table.

Send email via Resend to ADMIN_EMAIL:
Subject: "Yeni [Teklif Talebi / İletişim Formu] - [companyName || fullName]"
HTML body: simple table with all fields, Makro brand colors (#0F2240 header, #F57C28 accent)

Send confirmation to user email:
Subject: "Talebiniz Alındı - Makro İş Elbiseleri"
Body: "Merhaba [fullName], talebiniz alındı. En kısa sürede 0541 877 16 35 numaralı hattan sizi arayacağız."

Error handling: try/catch, return appropriate status codes.
```

---

# PROMPT 5 — Header & Footer

```
Create layout components for makro-web.

CREATE components/layout/Header.tsx:

STRUCTURE (top to bottom):
1. Top strip (bg-navy-mid, py-1.5, text-center, text-xs text-white/60):
   "Türkiye geneli toptan teslimat  ·  0541 877 16 35  ·  @makro.iselbisesi"

2. Main navbar (bg-navy, h-16, sticky top-0 z-50, shadow):
   - LEFT: Logo
     Orange square (42px, rounded-lg, bg-orange): "M" in Barlow Condensed 800 white
     Text: "MAKRO" in Barlow Condensed 800 white 22px + "İş Elbiseleri" in orange 10px uppercase tracking-widest
   - CENTER: Nav links (hidden on mobile)
     Anasayfa / Ürünler / Kategoriler / Hakkımızda / İletişim
     Each: text-white/80 hover:text-white hover:bg-white/10, px-3 py-2 rounded-md text-sm font-semibold
     Active page: text-orange-light
   - RIGHT: 
     WhatsApp button (bg-[#25d366], text-white, text-sm font-bold, px-4 py-2 rounded-md)
     "Teklif İste" button (bg-orange, text-white, text-sm font-bold, px-4 py-2 rounded-md)
   - MOBILE: hamburger icon → slide-down drawer with nav links + CTA buttons

Use Next.js Link. Use usePathname() for active state. 'use client' directive.

CREATE components/layout/Footer.tsx:

STRUCTURE:
- bg-navy, text-white, pt-12 pb-6
- 4-column grid (2-col on mobile):
  Col 1: Logo + "Kurumsal iş kıyafetlerinde güvenilir çözüm ortağınız." + Instagram link
  Col 2: Ürünler — links to each category slug
  Col 3: Kurumsal — Hakkımızda, İletişim, Teklif İste, SSS
  Col 4: İletişim — phone, whatsapp link, instagram, "Türkiye geneli toptan gönderim"
- Bottom bar: border-t border-white/10, "© 2026 Makro İş Elbiseleri" + KVKK link

CREATE app/layout.tsx:
- Import Header, Footer
- Font variables
- Wrap children between Header and Footer
- Add WhatsAppFloat component (see later prompt)

CREATE components/shared/WhatsAppFloat.tsx:
- Fixed bottom-right (bottom-6 right-6, z-50)
- Circle button 58px, bg-[#25d366], shadow-lg
- WhatsApp SVG icon (white, 28px)
- Opens https://wa.me/905418771635 in new tab
- Subtle pulse ring animation (CSS only)
- 'use client' with useState to hide on scroll up (optional)
```

---

# PROMPT 6 — Anasayfa

```
Create the homepage at app/page.tsx for Makro İş Elbiseleri.

SERVER COMPONENT — fetch directly from Prisma:
const featuredProducts = await prisma.product.findMany({ where: { isFeatured:true, isActive:true }, include: { category:true, colors:true, sizes:true, features:true }, orderBy: { sortOrder:'asc' } })
const categories = await prisma.category.findMany({ where:{isActive:true}, include:{ _count:{ select:{ products:{ where:{isActive:true} } } } }, orderBy:{ sortOrder:'asc' } })

SECTIONS:

1. HERO (min-h-[88vh], bg gradient navy → navy-mid, relative overflow-hidden):
   - Subtle diagonal grid pattern (CSS background-image, low opacity)
   - Two large blurred orange circles (position absolute, opacity .05, decoration only)
   - Content grid (desktop: 2-col, mobile: 1-col):
     LEFT:
       - Pill badge: "🏭 2026 Koleksiyon"
       - H1 (Barlow Condensed 800, 72px desktop/48px mobile, white, line-height 0.95):
         "Kurumsal" / "Gücün" / "Üniiforması" — last word in orange
       - Subtitle (18px, white/70, max-w-md): brand value text
       - Button row: [Ürünleri Keşfet →] orange filled + [Teklif İste] white outline
       - Stats row (border-t border-white/10, mt-12 pt-8, flex gap-8):
         500+ Mutlu Firma | 10 Ürün Modeli | 5 Renk Seçeneği
         Each: number in Barlow Condensed orange 36px + label in white/50 13px
     RIGHT (hidden mobile):
       4 clickable cards (category cards), each:
       bg-white/7 border border-white/12 rounded-2xl p-5
       Icon + category name + fabric hint text
       Hover: bg-white/10 translateX(4px)
       Link to /kategoriler/[slug]

2. TRUST BAR (bg-gray-50, border-b):
   4 items center-justified (wrap on mobile):
   🏭 Toptan Satış | 🎨 Logo Baskı & Nakış | 🚚 Hızlı Teslimat | ✏️ Özel Tasarım
   Each: icon + bold label + small description

3. KATEGORİ GRID (py-20, bg-gray-50):
   Section header: tag "Ürün Kategorileri" + H2 "Tüm İhtiyacınıza Uygun Kıyafet"
   4 cards (2-col mobile, 4-col desktop):
   Each card: colored gradient top area (200px, emoji centered), category name, product count, "Görüntüle →"
   Hover: border-orange, -translateY-1, shadow-elevated

4. ÖNE ÇIKAN ÜRÜNLER (py-20, bg-white):
   Section header: "En Çok Tercih Edilen Modeller"
   ProductGrid with featuredProducts (4-col desktop, 2 tablet, 1 mobile)
   Ghost button below: "Tüm Ürünleri Görüntüle →" → /urunler

5. CTA BAND (bg-navy, py-16):
   Left text: H2 "Firmanız için Özel Fiyat Teklifi Alın" + subtitle
   Right: WhatsApp button + [Teklif Formu] orange button
   Full width, max-w-7xl centered

METADATA:
title: "Makro İş Elbiseleri | Kurumsal Gücün Üniiforması — Toptan Kurumsal Kıyafet"
description: "Compak penye, pike ve polar kumaştan tişört, sweatshirt, polar ceket. DTF baskı ve nakış. Toptan satış, Türkiye geneli teslimat. 0541 877 16 35"
```

---

# PROMPT 7 — Ürün Listeleme Sayfası

```
Create app/urunler/page.tsx — product listing with sidebar filters.

PAGE ARCHITECTURE:
- SERVER COMPONENT reads URL search params for filtering
- URL params: ?kategori=slug&renk=hex&kumaş=fabric&baskı=dtf|nakis&arama=text&sayfa=1

FETCH data server-side with filters applied in Prisma query.

LAYOUT (max-w-7xl mx-auto, px-6, py-10):
Page header (bg-navy, py-12): breadcrumb + H1 "Ürün Koleksiyonu 2026" + subtitle

Main: CSS grid, 260px sidebar + 1fr content, gap-8
On mobile: sidebar hidden behind "Filtreler" button (sheet/modal)

=== SIDEBAR (components/products/FilterSidebar.tsx) — CLIENT COMPONENT ===

Sticky (top-24). White bg, border, rounded-card.

Each filter group: title (uppercase, tracking-wide, 12px, gray-500) + content + collapse toggle

GROUP 1 — Kategoriler (radio behavior):
Link buttons to ?kategori=slug
Show product count per category
"Tüm Ürünler (10)" selected by default

GROUP 2 — Renk:
Circular swatch buttons (28px), border-2 transparent → border-orange when selected
Siyah #1A1A1A / Gri #808080 / Lacivert #1B2A6B / Kırmızı #C0392B / Beyaz #F5F5F5
Clicking updates ?renk= URL param

GROUP 3 — Kumaş:
Checkboxes:
Compak Penye / Pike (Piqué) / 3 İplik Şardonlu / PET Polar / Polyester Kargo

GROUP 4 — Baskı:
[ ] DTF Baskı  [ ] Nakış

GROUP 5 — Beden:
S M L XL button grid

"Filtreleri Temizle" link at bottom (href="/urunler")

=== MAIN CONTENT ===

Search bar (full width, rounded-full, search icon, placeholder "Ürün ara...")
→ Updates ?arama= param on submit (form GET)

Toolbar: "[X] ürün listeleniyor" + sort select (Varsayılan / A–Z)

Active filter chips: show current filters as removable pills
Each chip: filter label + × button that removes that param

Product grid: 3 columns desktop, 2 tablet, 1 mobile
Use ProductCard component

Empty state: "Ürün bulunamadı" with clear filters link

Pagination: if totalPages > 1, show page numbers

METADATA:
title: "Kurumsal İş Kıyafetleri | Tüm Ürünler - Makro İş Elbiseleri"
description: "Bisiklet yaka tişört, polo, sweatshirt, kapüşonlu, polar ceket ve iş pantolonu. DTF baskı, nakış, özel renk. Toptan fiyat için 0541 877 16 35."
```

---

# PROMPT 8 — ProductCard Bileşeni

```
Create components/products/ProductCard.tsx

Props:
type ProductCardProps = {
  product: {
    id: string
    name: string
    slug: string
    shortDescription: string | null
    coverImageUrl: string | null
    fabricInfo: string | null
    hasPrintOption: boolean
    hasEmbroideryOption: boolean
    category: { name: string; slug: string }
    colors: { colorName: string; colorHex: string }[]
    sizes: { sizeLabel: string }[]
    features: { featureText: string }[]
  }
}

CARD DESIGN:
Container:
- bg-white, border border-gray-200, rounded-card (16px)
- Hover: border-orange shadow-elevated -translate-y-1
- Transition all 220ms
- Next.js Link wrapping entire card → /urunler/[slug]

IMAGE AREA (aspect-ratio 4/5 or fixed h-64):
- bg-gray-100
- next/image with object-cover, loading="lazy"
- If no coverImageUrl: centered placeholder with product initial letter in navy
- TOP LEFT badge: fabricInfo text (truncate to first 2 words) — bg-navy text-white text-xs px-2 py-1 rounded
- TOP RIGHT badges:
  if hasPrintOption: "DTF" — bg-orange text-white text-xs
  if hasEmbroideryOption: "Nakış" — bg-teal-600 text-white text-xs
- BOTTOM RIGHT: color dots row (max 5)
  Each dot: 16px circle, border-2 white, shadow-sm
  If more than 5 colors: "+N" text

INFO AREA (p-4):
- Category name: text-orange text-xs font-bold uppercase tracking-widest mb-1
- Product name: font-heading font-extrabold text-navy text-xl leading-tight mb-2
- Fabric info: text-xs text-gray-500 mb-3 (truncate)
- Divider: border-t border-gray-100
- Action row (mt-3 flex items-center justify-between):
  LEFT: "Detayı Gör" button (bg-navy text-white text-sm font-bold px-4 py-2 rounded-md hover:bg-orange transition)
  RIGHT: sizes text (text-xs text-gray-400) "S · M · L · XL"

CREATE components/products/ProductGrid.tsx:
Props: { products: ProductCardProps['product'][], columns?: 3 | 4 }
CSS grid, responsive, gap-5
Empty state if no products.
```

---

# PROMPT 9 — Ürün Detay Sayfası

```
Create app/urunler/[slug]/page.tsx

SERVER COMPONENT. Fetch product by slug with all relations.
If not found or isActive:false → notFound()

generateStaticParams: fetch all active product slugs for SSG.
generateMetadata: dynamic from product.seoTitle, seoDescription, coverImageUrl.

=== LAYOUT (max-w-7xl mx-auto px-6 py-10) ===

BREADCRUMB (text-sm, text-gray-400):
Anasayfa › Ürünler › [category.name] › [product.name]

MAIN BLOCK (grid 2-col 1fr 1fr gap-16, stack on mobile):

LEFT — IMAGE GALLERY (client component: components/products/ProductGallery.tsx):
State: selectedColorHex (initially first color)
Main image: aspect-square, bg-gray-100, rounded-2xl, object-cover, cursor-zoom-in
If no image: show "LOGONUZ BURDA OLSUN" placeholder text (mimics catalog mockup style, navy bg, white text centered)
Thumbnail row: 80px squares, active = orange border-2
Clicking thumbnail changes main image

RIGHT — PRODUCT INFO:
Badges row: [fabric badge navy] [DTF Baskı badge orange] [Nakış badge if available]

H1 (font-heading, 44px, 800, navy, line-height 1.0): product.name
Product code (text-sm text-gray-400): product.productCode

Short description (text-base text-gray-600, leading-relaxed, mb-6)

--- RENK SEÇİMİ ---
Label: "RENK" (12px uppercase gray-500 tracking-widest, mb-3)
Color circles (36px, gap-3):
  - Circle with colorHex background
  - Selected: ring-2 ring-orange ring-offset-2
  - Color name shown below selected circle (text-xs text-gray-500)
  Clicking updates selectedColorHex state → updates gallery

--- BEDEN SEÇİMİ ---
Label: "BEDEN"
Size buttons (48x48px): default border-2 border-gray-200, selected border-orange bg-orange text-white
Note below: text-xs text-gray-400 "Özel siparişlerde büyük bedenler imal edilmektedir."

--- ÖZELLİKLER ---
Label: "ÖZELLİKLER"
List: each feature with orange checkmark circle (20px) + text-sm text-gray-700

--- KUMAŞ BİLGİSİ (bg-gray-50, rounded-xl, p-4) ---
2x2 grid:
  Kumaş: fabricInfo
  Gramaj: fabricWeight
  Yıkama: washingInstructions
  Baskı: hasPrintOption ? "DTF Baskı ✓" : "—"

--- CTA BUTTONS (mt-6, flex flex-col gap-3) ---
Primary: full-width orange button "📋 Teklif İste"
→ links to /teklif-iste?urun=[product.name]

Secondary: full-width green border/text button "WhatsApp'tan Sor"
→ opens wa.me/905418771635?text=Merhaba, [product.name] hakkında bilgi almak istiyorum.

Mobile: sticky bottom bar with both buttons

--- TABS (below main block) ---
3 tabs: Ürün Özellikleri | Kumaş & Bakım | Kurumsal Kullanım
Client component. Default first tab active.

--- İLGİLİ ÜRÜNLER ---
H2: "Benzer Ürünler"
4 ProductCards from same category, exclude current product

ADD Schema.org JSON-LD:
<script type="application/ld+json"> with @type:"Product", name, description, brand:{name:"Makro İş Elbiseleri"}, offers:{availability:"InStock"}
```

---

# PROMPT 10 — Teklif & İletişim Sayfaları

```
Create two form pages:

=== 1. app/teklif-iste/page.tsx ===

Layout: max-w-5xl mx-auto px-6 py-16, grid 2-col (info left, form right), gap-16

LEFT — INFO:
H1: "Ücretsiz Fiyat Teklifi"
Subtitle: "Formu doldurun, 24 saat içinde uzman ekibimiz sizi arasın."

Step indicators (vertical):
  1. Formu Doldur
  2. 24 Saat İçinde Dönüş
  3. Özel Fiyat Teklifi

Contact boxes (rounded-xl border p-4 flex gap-4):
  📞 0541 877 16 35
  💬 WhatsApp → wa.me/905418771635
  📸 @makro.iselbisesi

Guarantee note: "Bilgileriniz KVKK kapsamında korunur."

RIGHT — FORM (white, border, rounded-2xl, p-8):
CLIENT COMPONENT with react-hook-form + Zod.

Fields:
- Adı Soyadı * (text)
- Firma Adı * (text)
- Telefon * (tel)
- E-posta * (email)
- İlgilendiğiniz Ürünler (checkbox pills, 4 categories)
- Tahmini Adet * (select: 10-50 | 50-100 | 100-250 | 250-500 | 500+)
- Baskı İsteği (select: DTF Baskı | Nakış | İkisi de | Baskı Yok | Görüşelim)
- Özel Notlar (textarea)
- Honeypot: <input name="website" className="hidden" tabIndex={-1} aria-hidden="true" />

Submit: POST /api/contact with type:"quote"

States:
- Loading: button spinner + disabled
- Success: green checkmark + "Talebiniz alındı! En kısa sürede sizi arayacağız." + WhatsApp button
- Error: red message + retry

URL param: if ?urun= present, pre-fill a note in Özel Notlar field.

METADATA: title:"Teklif İste | Makro İş Elbiseleri"

=== 2. app/iletisim/page.tsx ===

Similar layout. Simpler form:
Adı Soyadı * | Telefon * | E-posta * | Firma (optional) | Mesajınız *
POST /api/contact with type:"contact"

Left side: contact info cards + small Google Maps embed (iframe static map of İzmir area).

METADATA: title:"İletişim | Makro İş Elbiseleri"
```

---

# PROMPT 11 — Diğer Sayfalar + SEO

```
Create remaining pages and SEO infrastructure:

1. app/kategoriler/[slug]/page.tsx:
- Fetch category by slug + its products (with relations)
- If not found → notFound()
- Show: category header (navy bg, name, description, product count) + breadcrumb
- Same ProductGrid as /urunler but pre-filtered, no sidebar (keep it simple — just the grid)
- Dynamic metadata from category.seoTitle/seoDescription
- generateStaticParams from all active category slugs

2. app/hakkimizda/page.tsx:
- Hero: navy bg "Hakkımızda" + subtitle
- Brand story (hardcoded text for now — can be edited in Supabase Studio later)
- 4 features grid: Kaliteli Kumaş | Toptan Satış | Özel Üretim | Hızlı Teslimat
- CTA band at bottom

3. app/sss/page.tsx:
- FAQ accordion (client component with useState)
- 8 hardcoded Q&As about: minimum sipariş, teslimat süresi, baskı kalitesi, beden seçimi, renk özelleştirme, ödeme, numune, büyük beden
- JSON-LD FAQPage schema

4. app/kvkk/page.tsx:
- Standard KVKK text, proper heading structure, max-w-3xl

5. app/sitemap.ts:
import { prisma } from '@/lib/prisma'
Generate sitemap with:
- Static pages: /, /urunler, /hakkimizda, /iletisim, /teklif-iste, /sss, /kvkk
- Dynamic: all active products (/urunler/[slug])
- Dynamic: all active categories (/kategoriler/[slug])

6. app/robots.ts:
Allow: /
Disallow: /api/
Sitemap: https://[NEXT_PUBLIC_SITE_URL]/sitemap.xml

7. app/not-found.tsx:
- Branded 404 — Makro logo, "Sayfa Bulunamadı", "Ürünlere Dön" button

8. components/shared/CookieConsent.tsx (client):
- Fixed bottom bar (not overlay)
- "Bu site çerezleri kullanır. Daha iyi deneyim için kabul edin."
- [Kabul Et] orange + [Reddet] gray
- Saves to localStorage, hides banner

9. UPDATE next.config.ts:
- images: { remotePatterns for Supabase storage URL }
- Security headers (X-Frame-Options, X-Content-Type-Options)
- compress: true

10. Run final checks:
npx tsc --noEmit
npm run build
```

---

# PROMPT 12 — Deploy Hazırlığı

```
Prepare makro-web for production deployment.

1. UPDATE package.json scripts:
"dev": "next dev",
"build": "prisma generate && next build",
"start": "next start",
"lint": "next lint",
"db:push": "prisma db push",
"db:seed": "npx ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts",
"postinstall": "prisma generate"

2. CREATE DEPLOYMENT.md with step-by-step:

STEP 1 — Supabase Kurulumu:
- supabase.com → New Project → Region: EU Central (Frankfurt)
- Settings → Database → Connection string kopyala
- DATABASE_URL: Transaction mode (port 6543)
- DIRECT_URL: Direct connection (port 5432)

STEP 2 — Vercel / Antigravity:
- Projeyi GitHub'a push et
- Antigravity/Vercel → Import repo
- Environment Variables gir (hepsi .env.local'daki)
- Build command: npm run build
- Deploy

STEP 3 — Database Migration:
npx prisma migrate deploy  (ya da db push — production için)
npx prisma db seed          (10 ürün, kategoriler seed edilir)

STEP 4 — Supabase Studio ile Admin:
- supabase.com → Table Editor
- Ürün ekle/çıkar/düzenle buradan yapılır
- ContactSubmission tablosundan teklif taleplerini görüntüle
- Ekstra admin panel yazmaya GEREK YOK

STEP 5 — Domain:
- DNS: CNAME → Antigravity/Vercel URL
- SSL otomatik aktif olur

3. CREATE .env.production.example:
DATABASE_URL="postgresql://postgres.[ref]:[pass]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[pass]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
RESEND_API_KEY="re_..."
ADMIN_EMAIL="info@makro.com.tr"
NEXT_PUBLIC_WHATSAPP="905418771635"
NEXT_PUBLIC_PHONE="05418771635"
NEXT_PUBLIC_INSTAGRAM="makro.iselbisesi"
NEXT_PUBLIC_SITE_URL="https://makroiselbisesi.com.tr"

4. Final checklist in README:
- [ ] .env.production değerleri girildi
- [ ] npx prisma db seed çalıştırıldı (10 ürün yüklendi)
- [ ] Teklif formu test edildi (email geliyor mu?)
- [ ] WhatsApp linki test edildi
- [ ] Mobil görünüm kontrol edildi
- [ ] Lighthouse score > 90 kontrol edildi
- [ ] robots.txt /api/ bloke ediyor
```

---

## ÖZET — Ne Var, Ne Yok

| VAR ✅ | YOK ❌ |
|---|---|
| 8 public sayfa | Sepet / ödeme |
| Ürün vitrini + filtreleme | Müşteri üyeliği |
| Teklif & iletişim formu | Stok yönetimi |
| Email bildirimi (Resend) | Audit log |
| WhatsApp entegrasyonu | Banner sistemi |
| SEO (sitemap, robots, schema) | Medya kütüphanesi |
| Supabase Studio = admin panel | Custom admin panel |
| Seed (10 ürün baştan hazır) | Rol sistemi |
| Responsive + mobile-first | Çoklu dil |

## Toplam: 12 Prompt → ~2 Hafta Geliştirme
```
Claude Code'a sırayla ver: 1 → 2 → 3 → 4 → 5 → ... → 12
Her prompttan sonra: npm run build ile kontrol et.
```
