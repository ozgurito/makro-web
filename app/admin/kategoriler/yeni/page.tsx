import CategoryForm from '../CategoryForm'

export default function YeniKategori() {
  return (
    <div>
      <div className="mb-6">
        <a href="/admin/kategoriler" className="text-sm text-gray-400 hover:text-gray-600">← Kategoriler</a>
        <h1 className="text-2xl font-bold mt-1" style={{ color: '#0F2240' }}>Yeni Kategori</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <CategoryForm />
      </div>
    </div>
  )
}
