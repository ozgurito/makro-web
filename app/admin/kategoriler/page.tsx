import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import CategoryActions from './CategoryActions'

export default async function AdminKategoriler() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#0F2240' }}>Kategori Yönetimi</h1>
        <Link
          href="/admin/kategoriler/yeni"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#F57C28' }}
        >
          + Yeni Kategori
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Ad</th>
              <th className="px-6 py-4 font-semibold">Slug</th>
              <th className="px-6 py-4 font-semibold">Ürün</th>
              <th className="px-6 py-4 font-semibold">Sıra</th>
              <th className="px-6 py-4 font-semibold">Durum</th>
              <th className="px-6 py-4 font-semibold">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map(cat => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-800">{cat.name}</td>
                <td className="px-6 py-4 text-gray-400 font-mono text-xs">{cat.slug}</td>
                <td className="px-6 py-4 text-gray-600">{cat._count.products}</td>
                <td className="px-6 py-4 text-gray-600">{cat.sortOrder}</td>
                <td className="px-6 py-4">
                  {cat.isActive ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Aktif</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-500">Pasif</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <CategoryActions id={cat.id} name={cat.name} />
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Henüz kategori eklenmemiş.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
