import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductForm from '../../ProductForm'

export default async function UrunDuzenle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { colors: true, sizes: true, features: true, images: true },
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
  ])

  if (!product) notFound()

  const initial = {
    id: product.id,
    name: product.name,
    categoryId: product.categoryId,
    productCode: product.productCode ?? '',
    shortDescription: product.shortDescription ?? '',
    longDescription: product.longDescription ?? '',
    coverImageUrl: product.coverImageUrl ?? '',
    fabricInfo: product.fabricInfo ?? '',
    fabricWeight: product.fabricWeight?.toString() ?? '',
    washingInstructions: product.washingInstructions ?? '',
    hasPrintOption: product.hasPrintOption,
    hasEmbroideryOption: product.hasEmbroideryOption,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
    isActive: product.isActive,
    sortOrder: product.sortOrder.toString(),
    colors: product.colors.map(c => ({ name: c.colorName, hex: c.colorHex ?? '' })),
    sizes: product.sizes.map(s => s.sizeLabel),
    features: product.features
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(f => f.featureText),
    galleryImages: product.images
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(img => ({ url: img.imageUrl, altText: img.altText ?? '', isCover: img.isCover })),
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <a href="/admin/urunler" className="text-sm text-gray-400 hover:text-gray-700">← Ürünler</a>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold" style={{ color: '#0F2240' }}>Düzenle: {product.name}</h1>
      </div>
      <ProductForm categories={categories} initial={initial} />
    </div>
  )
}
