import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductAdminActions from './ProductAdminActions'

export default async function AdminUrunler() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#0F2240' }}>Ürün Yönetimi</h1>
        <Link
          href="/admin/urunler/yeni"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#F57C28' }}
        >
          + Yeni Ürün
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          <div className="text-4xl mb-3">📦</div>
          <p className="font-semibold">Henüz ürün eklenmemiş.</p>
          <Link href="/admin/urunler/yeni" className="inline-block mt-4 text-sm font-bold" style={{ color: '#F57C28' }}>
            İlk ürünü ekle →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Görsel / Ad</th>
                <th className="px-6 py-4 font-semibold">Kategori</th>
                <th className="px-6 py-4 font-semibold">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        {p.coverImageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.coverImageUrl} className="w-full h-full object-cover" alt="" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">{p.name}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">{p.productCode}</div>
                        {!p.isActive && (
                          <span className="text-xs text-red-400 font-bold">Pasif</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-semibold">{p.category?.name}</td>
                  <td className="px-6 py-4">
                    <ProductAdminActions product={p} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
