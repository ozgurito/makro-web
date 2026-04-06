import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  const [totalProducts, activeProducts, totalForms] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.contactSubmission.count(),
  ])

  const recentForms = await prisma.contactSubmission.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#0F2240' }}>Dashboard</h1>
      
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm font-bold text-gray-400 mb-1 tracking-widest uppercase">Toplam Ürün</div>
          <div className="text-3xl font-black text-gray-800">{totalProducts}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm font-bold text-gray-400 mb-1 tracking-widest uppercase">Aktif Ürün</div>
          <div className="text-3xl font-black text-green-600">{activeProducts}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm font-bold text-gray-400 mb-1 tracking-widest uppercase">Toplam Form</div>
          <div className="text-3xl font-black text-orange-500">{totalForms}</div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4" style={{ color: '#0F2240' }}>Son Gelen Formlar</h2>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Tarih</th>
              <th className="px-6 py-3 font-semibold">İsim / Firma</th>
              <th className="px-6 py-3 font-semibold">İletişim</th>
              <th className="px-6 py-3 font-semibold">Tür</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentForms.map(form => (
              <tr key={form.id}>
                <td className="px-6 py-4">{form.createdAt.toLocaleDateString('tr-TR')}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {form.fullName}
                  {form.companyName && <span className="block text-xs font-normal text-gray-400">{form.companyName}</span>}
                </td>
                <td className="px-6 py-4 text-xs text-gray-600">
                  <div>{form.phone}</div>
                  <div>{form.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold uppercase">
                    {form.type}
                  </span>
                </td>
              </tr>
            ))}
            {recentForms.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">Henüz hiç form doldurulmamış.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
