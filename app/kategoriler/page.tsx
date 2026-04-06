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

      {/* Category Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/kategoriler/${cat.slug}`}
              className="group bg-white border-2 border-gray-200 rounded-2xl overflow-hidden transition-all duration-200 hover:border-orange-400 hover:-translate-y-1"
              style={{ boxShadow: '0 2px 12px rgba(15,34,64,.08)' }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={`/kategoriler/${cat.slug}.jpg`}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h2
                  className="font-extrabold text-xl mb-1"
                  style={{ fontFamily: 'var(--font-heading)', color: '#0F2240' }}
                >
                  {cat.name}
                </h2>
                {cat.description && (
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">{cat.description}</p>
                )}
                <p className="text-xs text-gray-400 mb-1">{categoryFabrics[cat.slug] ?? ''}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-400">{cat._count.products} ürün</span>
                  <span className="text-sm font-bold" style={{ color: '#F57C28' }}>
                    İncele →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
