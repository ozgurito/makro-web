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
      <div style={{ backgroundColor: '#0F2240' }} className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="text-white/50 text-sm mb-3">
            <Link href="/" className="hover:text-white">Anasayfa</Link>
            {' › '}
            <span className="text-white">Kategoriler</span>
          </nav>
          <h1
            className="text-white"
            style={{ fontFamily: 'var(--font-heading)', fontSize: '48px', fontWeight: 800 }}
          >
            Ürün Kategorileri
          </h1>
          <p className="text-white/60 mt-2">
            Kurumsal iş kıyafetlerimizi kategorilere göre inceleyin.
          </p>
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
