import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import ProductGrid from '@/components/products/ProductGrid'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true },
  })
  return categories.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.category.findFirst({ where: { slug, isActive: true } })
  if (!category) return {}
  return {
    title: category.seoTitle ?? category.name,
    description: category.seoDescription ?? category.description ?? undefined,
  }
}

export default async function KategoriPage({ params }: Props) {
  const { slug } = await params

  const category = await prisma.category.findFirst({
    where: { slug, isActive: true },
    include: {
      products: {
        where: { isActive: true },
        include: { category: true, colors: true, sizes: true, features: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  if (!category) notFound()

  return (
    <>
      <div className="relative overflow-hidden" style={{ backgroundColor: '#0F2240', minHeight: '220px' }}>
        {/* Category image as blurred background */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src={`/kategoriler/${slug}.jpg`}
            alt={category.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #0F2240 40%, transparent 100%)' }} />

        <div className="relative max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="flex-1">
            <nav className="text-white/50 text-sm mb-3">
              <Link href="/" className="hover:text-white">Anasayfa</Link>
              {' › '}
              <Link href="/kategoriler" className="hover:text-white">Kategoriler</Link>
              {' › '}
              <span className="text-white">{category.name}</span>
            </nav>
            <h1
              className="text-white"
              style={{ fontFamily: 'var(--font-heading)', fontSize: '48px', fontWeight: 800 }}
            >
              {category.name}
            </h1>
            {category.description && (
              <p className="text-white/60 mt-2 max-w-lg">{category.description}</p>
            )}
            <p className="text-white/40 text-sm mt-2">{category.products.length} ürün</p>
          </div>

          {/* Category image — right side */}
          <div className="hidden md:block flex-shrink-0 rounded-2xl overflow-hidden" style={{ width: '320px', height: '180px' }}>
            <Image
              src={`/kategoriler/${slug}.jpg`}
              alt={category.name}
              width={320}
              height={180}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {category.products.length > 0 ? (
          <ProductGrid products={category.products} columns={3} />
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">Bu kategoride henüz ürün bulunmuyor.</p>
            <Link
              href="/kategoriler"
              className="inline-block px-6 py-3 rounded-lg text-white font-bold text-sm"
              style={{ backgroundColor: '#0F2240' }}
            >
              ← Tüm Kategoriler
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
