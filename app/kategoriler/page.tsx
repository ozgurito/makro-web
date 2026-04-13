import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Ürün Kategorileri | Makro İş Elbiseleri',
  description: 'Tişört & Polo, Sweat & Kışlık, Polar & Eşofman, İş Pantolonu — kurumsal iş kıyafeti kategorileri.',
}

const categoryFabrics: Record<string, string> = {
  'tisort-polo': 'Compak Penye / Pike kumaş',
  'sweat-kislik': '3 İplik Şardonlu kumaş',
  'polar-esofman': 'PET Polar / Şardonlu kumaş',
  'is-pantolonu': '%65 Polyester Kargo kumaş',
}

export default async function KategorilerPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <>
      {/* Header */}
      <div style={{ background: '#0F2240', padding: '36px 24px 68px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div className="max-w-7xl mx-auto" style={{ position: 'relative' }}>
          <nav style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', marginBottom: 12, display: 'flex', gap: 6 }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,.45)', textDecoration: 'none' }}>Anasayfa</Link>
            <span>›</span>
            <span style={{ color: '#FFA05A' }}>Kategoriler</span>
          </nav>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#FFA05A', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 10 }}>Koleksiyon</div>
          <h1 className="text-white" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,52px)', fontWeight: 800, margin: '0 0 10px 0' }}>
            Ürün Kategorileri
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, margin: 0 }}>
            Kurumsal iş kıyafetlerimizi kategorilere göre inceleyin.
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 44" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 44 }}>
            <path d="M0,44 C480,4 960,44 1440,22 L1440,44 L0,44 Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </div>

      {/* Category Grid — anasayfa stiliyle aynı dark overlay kartlar */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {(() => {
          const catMeta: Record<string, { img: string; sub: string }> = {
            'tisort-polo':   { img: '/products/bisiklet-yaka-tisort-siyah.png',        sub: 'Compak penye, pike & pique kumaş' },
            'sweat-kislik':  { img: '/products/kapsonlu-sweatshirt-siyah.png',         sub: 'Sweatshirt, kapşonlu & hırka'      },
            'polar-esofman': { img: '/products/polar-ceket-siyah.png',                 sub: 'Polar ceket & eşofman takımı'      },
            'is-pantolonu':  { img: '/products/reflektorlu-is-pantolonu-lacivert.png', sub: 'Kargo, reflektörlü & dayanıklı'   },
          }
          return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {categories.map((cat) => {
                const meta = catMeta[cat.slug] ?? { img: `/kategoriler/${cat.slug}.jpg`, sub: categoryFabrics[cat.slug] ?? 'Kurumsal koleksiyon' }
                return (
                  <Link
                    key={cat.id}
                    href={`/kategoriler/${cat.slug}`}
                    className="group hover:-translate-y-2 transition-transform duration-300"
                    style={{
                      display: 'block', position: 'relative',
                      borderRadius: 16, overflow: 'hidden',
                      height: 320, textDecoration: 'none',
                      boxShadow: '0 4px 20px rgba(15,34,64,0.12)',
                      background: '#0F2240',
                    }}
                  >
                    <Image
                      src={meta.img}
                      alt={cat.name}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'top center', transition: 'transform .5s ease' }}
                      className="group-hover:scale-110"
                    />
                    {/* Gradient overlay */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,20,40,0.92) 0%, rgba(10,20,40,0.4) 55%, rgba(10,20,40,0.05) 100%)' }} />
                    {/* Ürün sayısı */}
                    <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(245,124,40,0.9)', backdropFilter: 'blur(4px)', color: 'white', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 20, letterSpacing: '.04em' }}>
                      {cat._count.products} ürün
                    </div>
                    {/* İçerik */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 22px' }}>
                      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 900, color: 'white', margin: '0 0 5px 0', lineHeight: 1, letterSpacing: '-0.01em' }}>{cat.name}</h2>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', margin: '0 0 14px 0', fontWeight: 500 }}>{meta.sub}</p>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F57C28', color: 'white', fontSize: 12, fontWeight: 800, padding: '6px 14px', borderRadius: 20, letterSpacing: '.04em', textTransform: 'uppercase' }}>
                        Koleksiyonu Keşfet →
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )
        })()}
      </div>
    </>
  )
}
