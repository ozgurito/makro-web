import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CategoryForm from '../../CategoryForm'

export default async function KategoriDuzenle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) notFound()

  return (
    <div>
      <div className="mb-6">
        <a href="/admin/kategoriler" className="text-sm text-gray-400 hover:text-gray-600">← Kategoriler</a>
        <h1 className="text-2xl font-bold mt-1" style={{ color: '#0F2240' }}>Kategori Düzenle</h1>
        <p className="text-sm text-gray-400 mt-0.5 font-mono">{category.slug}</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <CategoryForm
          initial={{
            id: category.id,
            name: category.name,
            description: category.description ?? '',
            imageUrl: category.imageUrl ?? '',
            sortOrder: category.sortOrder,
            isActive: category.isActive,
            seoTitle: category.seoTitle ?? '',
            seoDescription: category.seoDescription ?? '',
          }}
        />
      </div>
    </div>
  )
}
