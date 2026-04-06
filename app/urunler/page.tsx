import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductGrid from '@/components/products/ProductGrid'
import FilterSidebar from '@/components/products/FilterSidebar'

export const metadata: Metadata = {
  title: 'Kurumsal İş Kıyafetleri | Tüm Ürünler - Makro İş Elbiseleri',
  description:
    'Bisiklet yaka tişört, polo, sweatshirt, kapüşonlu, polar ceket ve iş pantolonu. DTF baskı, nakış, özel renk. Toptan fiyat için 0541 877 16 35.',
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

async function ProductsContent({ searchParams }: { searchParams: Awaited<SearchParams> }) {
  const kategori =
    typeof searchParams.kategori === 'string' ? searchParams.kategori : undefined
  const renk =
    typeof searchParams.renk === 'string' ? searchParams.renk : undefined
  const kumaş =
    typeof searchParams['kumaş'] === 'string' ? searchParams['kumaş'] : undefined
  const baskı =
    typeof searchParams['baskı'] === 'string' ? searchParams['baskı'] : undefined
  const arama =
    typeof searchParams.arama === 'string' ? searchParams.arama : undefined
  const sayfa = parseInt(
    typeof searchParams.sayfa === 'string' ? searchParams.sayfa : '1'
  )
  const page = isNaN(sayfa) ? 1 : Math.max(1, sayfa)
  const limit = 12

  const where: Record<string, unknown> = { isActive: true }

  if (kategori) where.category = { slug: kategori }
  if (renk) where.colors = { some: { colorHex: renk, isAvailable: true } }
  if (kumaş) where.fabricInfo = { contains: kumaş, mode: 'insensitive' }
  if (baskı === 'dtf') where.hasPrintOption = true
  if (baskı === 'nakis') where.hasEmbroideryOption = true
  if (arama) {
    where.OR = [
      { name: { contains: arama, mode: 'insensitive' } },
      { shortDescription: { contains: arama, mode: 'insensitive' } },
      { productCode: { contains: arama, mode: 'insensitive' } },
    ]
  }

  const [products, total, categories, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, colors: true, sizes: true, features: true },
      orderBy: { sortOrder: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: { where: { isActive: true } } } } },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.product.count({ where: { isActive: true } }),
  ])

  const totalPages = Math.ceil(total / limit)

  const activeFilters: { label: string; removeKey: string }[] = []
  if (kategori) {
    const cat = categories.find((c) => c.slug === kategori)
    if (cat) activeFilters.push({ label: cat.name, removeKey: 'kategori' })
  }
  if (renk) activeFilters.push({ label: `Renk: ${renk}`, removeKey: 'renk' })
  if (kumaş) activeFilters.push({ label: kumaş, removeKey: 'kumaş' })
  if (baskı) activeFilters.push({ label: baskı === 'dtf' ? 'DTF Baskı' : 'Nakış', removeKey: 'baskı' })
  if (arama) activeFilters.push({ label: `"${arama}"`, removeKey: 'arama' })

  const removeFilter = (key: string) => {
    const params = new URLSearchParams()
    if (kategori && key !== 'kategori') params.set('kategori', kategori)
    if (renk && key !== 'renk') params.set('renk', renk)
    if (kumaş && key !== 'kumaş') params.set('kumaş', kumaş)
    if (baskı && key !== 'baskı') params.set('baskı', baskı)
    if (arama && key !== 'arama') params.set('arama', arama)
    return `/urunler?${params.toString()}`
  }

  return (
    <div className="grid gap-8" style={{ gridTemplateColumns: '260px 1fr' }}>
      {/* Sidebar */}
      <div className="hidden md:block">
        <FilterSidebar categories={categories} totalProducts={totalProducts} />
      </div>

      {/* Main */}
      <div>
        {/* Search bar */}
        <form method="GET" action="/urunler" className="mb-6">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              name="arama"
              defaultValue={arama}
              placeholder="Ürün ara..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-orange-400 text-sm"
            />
            {/* Preserve other params */}
            {kategori && <input type="hidden" name="kategori" value={kategori} />}
            {renk && <input type="hidden" name="renk" value={renk} />}
            {kumaş && <input type="hidden" name="kumaş" value={kumaş} />}
            {baskı && <input type="hidden" name="baskı" value={baskı} />}
          </div>
        </form>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            <span className="font-bold text-gray-800">{total}</span> ürün listeleniyor
          </p>
        </div>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map((f) => (
              <Link
                key={f.removeKey}
                href={removeFilter(f.removeKey)}
                className="flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-xs font-semibold hover:bg-orange-100 transition-colors"
              >
                {f.label} ×
              </Link>
            ))}
          </div>
        )}

        {/* Products */}
        <ProductGrid products={products} columns={3} />

        {/* Empty state */}
        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">Ürün bulunamadı.</p>
            <Link href="/urunler" className="text-sm font-semibold" style={{ color: '#F57C28' }}>
              Filtreleri temizle
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const params = new URLSearchParams()
              if (kategori) params.set('kategori', kategori)
              if (renk) params.set('renk', renk)
              if (kumaş) params.set('kumaş', kumaş)
              if (baskı) params.set('baskı', baskı)
              if (arama) params.set('arama', arama)
              params.set('sayfa', String(p))

              return (
                <Link
                  key={p}
                  href={`/urunler?${params.toString()}`}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border-2 text-sm font-bold transition-colors"
                  style={
                    p === page
                      ? { backgroundColor: '#0F2240', color: 'white', borderColor: '#0F2240' }
                      : { borderColor: '#e5e7eb', color: '#374151' }
                  }
                >
                  {p}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default async function UrunlerPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams

  return (
    <>
      {/* Page header */}
      <div style={{ background: '#0F2240', padding: '32px 0 28px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          {/* Breadcrumb */}
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', marginBottom: 10, display: 'flex', gap: 8 }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,.45)', textDecoration: 'none' }}>Anasayfa</Link>
            <span>›</span>
            <span style={{ color: '#FFA05A' }}>Ürünler</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 42, fontWeight: 800, color: 'white', margin: 0
          }}>Ürün Koleksiyonu 2026</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.55)', marginTop: 8 }}>
            DTF baskı ve nakış seçeneğiyle kurumsal kıyafet koleksiyonumuz
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <Suspense fallback={<div className="py-20 text-center text-gray-400">Yükleniyor...</div>}>
          <ProductsContent searchParams={sp} />
        </Suspense>
      </div>
    </>
  )
}
