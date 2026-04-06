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
      <div className="relative overflow-hidden" style={{ backgroundColor: '#0F2240', paddingBottom: 52 }}>
        {/* Blurred bg image */}
        <div className="absolute inset-0 opacity-15">
          <Image src={`/kategoriler/${slug}.jpg`} alt={category.name} fill className="object-cover" priority />
        </div>
        {/* Dot pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(15,34,64,0.95) 40%, rgba(15,34,64,0.6) 100%)' }} />

        <div className="relative max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="flex-1">
            <nav style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', marginBottom: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Link href="/" style={{ color: 'rgba(255,255,255,.45)', textDecoration: 'none' }}>Anasayfa</Link>
              <span>›</span>
              <Link href="/kategoriler" style={{ color: 'rgba(255,255,255,.45)', textDecoration: 'none' }}>Kategoriler</Link>
              <span>›</span>
              <span style={{ color: '#FFA05A' }}>{category.name}</span>
            </nav>
            <h1 className="text-white" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,52px)', fontWeight: 800, margin: '0 0 10px 0' }}>
              {category.name}
            </h1>
            {category.description && (
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 8, maxWidth: 480 }}>{category.description}</p>
            )}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(245,124,40,0.2)', border: '1px solid rgba(245,124,40,0.4)', color: '#FFA05A', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
              {category.products.length} ürün
            </div>
          </div>

          {/* Category image — right */}
          <div className="hidden md:block flex-shrink-0 rounded-2xl overflow-hidden" style={{ width: '300px', height: '170px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
            <Image src={`/kategoriler/${slug}.jpg`} alt={category.name} width={300} height={170} className="w-full h-full object-cover" priority />
          </div>
        </div>

        {/* Wave divider */}
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 44" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 44 }}>
            <path d="M0,44 C360,8 1080,44 1440,18 L1440,44 L0,44 Z" fill="#F9FAFB"/>
          </svg>
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
