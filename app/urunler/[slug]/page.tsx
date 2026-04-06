import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductColorGallery from '@/components/products/ProductColorGallery'
import ProductTabs from '@/components/products/ProductTabs'
import ProductGrid from '@/components/products/ProductGrid'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  })
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
  })
  if (!product) return {}
  return {
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.shortDescription ?? undefined,
    openGraph: product.coverImageUrl
      ? { images: [product.coverImageUrl] }
      : undefined,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params

  // Görüntülenme sayısını artır (background, awaited değil)
  prisma.product.update({
    where: { slug },
    data: { viewCount: { increment: 1 } }
  }).catch(() => {}) // hata olursa sessizce geç

  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      category: true,
      colors: true,
      sizes: true,
      features: { orderBy: { sortOrder: 'asc' } },
      images: { orderBy: { sortOrder: 'asc' } },
    },
  })

  if (!product) notFound()

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      id: { not: product.id },
    },
    include: { category: true, colors: true, sizes: true, features: true },
    orderBy: { sortOrder: 'asc' },
    take: 4,
  })

  const waText = encodeURIComponent(
    `Merhaba, ${product.name} hakkında bilgi almak istiyorum.`
  )
  const waUrl = `https://wa.me/905418771635?text=${waText}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription ?? product.name,
    brand: { '@type': 'Brand', name: 'Makro İş Elbiseleri' },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'TRY',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-8 flex flex-wrap gap-1">
          <Link href="/" className="hover:text-gray-600">Anasayfa</Link>
          {' › '}
          <Link href="/urunler" className="hover:text-gray-600">Ürünler</Link>
          {' › '}
          <Link href={`/kategoriler/${product.category.slug}`} className="hover:text-gray-600">
            {product.category.name}
          </Link>
          {' › '}
          <span className="text-gray-700">{product.name}</span>
        </nav>

        {/* Main block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Left — Gallery + Renk Seçici */}
          <ProductColorGallery
            colors={product.colors}
            images={product.images}
            productName={product.name}
          />

          {/* Right — Info */}
          <div>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.fabricInfo && (
                <span
                  className="text-white text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#0F2240' }}
                >
                  {product.fabricInfo.split(' ').slice(0, 3).join(' ')}
                </span>
              )}
              {product.hasPrintOption && (
                <span
                  className="text-white text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#F57C28' }}
                >
                  DTF Baskı
                </span>
              )}
              {product.hasEmbroideryOption && (
                <span className="bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Nakış
                </span>
              )}
            </div>

            {/* Name */}
            <h1
              className="mb-1 leading-none"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '44px',
                fontWeight: 800,
                color: '#0F2240',
              }}
            >
              {product.name}
            </h1>
            {product.productCode && (
              <p className="text-sm text-gray-400 mb-4">Ürün Kodu: {product.productCode}</p>
            )}
            {product.shortDescription && (
              <p className="text-base text-gray-600 leading-relaxed mb-6">
                {product.shortDescription}
              </p>
            )}

            {/* Size selector */}
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                BEDEN
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.id}
                    className="w-12 h-12 border-2 border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:border-orange-400 transition-colors"
                  >
                    {s.sizeLabel}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400">
                Özel siparişlerde büyük bedenler imal edilmektedir.
              </p>
            </div>

            {/* Features */}
            {product.features.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                  ÖZELLİKLER
                </p>
                <ul className="space-y-2">
                  {product.features.map((f) => (
                    <li key={f.id} className="flex items-center gap-2">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#F57C28' }}
                      >
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-sm text-gray-700">{f.featureText}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Fabric info grid */}
            <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Kumaş', value: product.fabricInfo },
                { label: 'Gramaj', value: product.fabricWeight },
                { label: 'Yıkama', value: product.washingInstructions },
                {
                  label: 'Baskı',
                  value: product.hasPrintOption ? 'DTF Baskı ✓' : '—',
                },
              ].map(
                (item) =>
                  item.value && (
                    <div key={item.label}>
                      <div className="text-xs text-gray-400 font-semibold">{item.label}</div>
                      <div className="text-sm font-semibold text-gray-700">{item.value}</div>
                    </div>
                  )
              )}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3">
              <Link
                href={`/teklif-iste?urun=${encodeURIComponent(product.name)}`}
                className="w-full text-center font-bold py-3 rounded-lg text-white transition-colors"
                style={{ backgroundColor: '#F57C28' }}
              >
                📋 Teklif İste
              </Link>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center font-bold py-3 rounded-lg border-2 transition-colors"
                style={{ borderColor: '#25D366', color: '#25D366' }}
              >
                💬 WhatsApp&apos;tan Sor
              </a>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <ProductTabs product={product} />

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2
              className="mb-8"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '36px',
                fontWeight: 800,
                color: '#0F2240',
              }}
            >
              Benzer Ürünler
            </h2>
            <ProductGrid products={relatedProducts} columns={4} />
          </div>
        )}
      </div>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 p-4 flex gap-3">
        <Link
          href={`/teklif-iste?urun=${encodeURIComponent(product.name)}`}
          className="flex-1 text-center font-bold py-3 rounded-lg text-white text-sm"
          style={{ backgroundColor: '#F57C28' }}
        >
          📋 Teklif İste
        </Link>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center font-bold py-3 rounded-lg border-2 text-sm"
          style={{ borderColor: '#25D366', color: '#25D366' }}
        >
          💬 WhatsApp
        </a>
      </div>
    </>
  )
}
