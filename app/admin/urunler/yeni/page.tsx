import { prisma } from '@/lib/prisma'
import ProductForm from '../ProductForm'

export default async function YeniUrun() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <a href="/admin/urunler" className="text-sm text-gray-400 hover:text-gray-700">← Ürünler</a>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold" style={{ color: '#0F2240' }}>Yeni Ürün</h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  )
}
