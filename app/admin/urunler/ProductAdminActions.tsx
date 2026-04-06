'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProductAdminActions({ product }: { product: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const toggleStatus = async (field: string, val: boolean) => {
    setLoading(true)
    await fetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: val }),
    })
    setLoading(false)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm(`"${product.name}" ürününü silmek istediğinizden emin misiniz?`)) return
    setDeleting(true)
    const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' })
    setDeleting(false)
    if (res.ok) {
      router.refresh()
    } else {
      alert('Silme işlemi başarısız.')
    }
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Toggle checkboxes */}
      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-gray-600">
        <input
          disabled={loading}
          type="checkbox"
          checked={product.isActive}
          onChange={e => toggleStatus('isActive', e.target.checked)}
          className="accent-orange-500 w-4 h-4"
        />
        Aktif
      </label>
      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-gray-600">
        <input
          disabled={loading}
          type="checkbox"
          checked={product.isFeatured}
          onChange={e => toggleStatus('isFeatured', e.target.checked)}
          className="accent-orange-500 w-4 h-4"
        />
        Popüler
      </label>
      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-gray-600">
        <input
          disabled={loading}
          type="checkbox"
          checked={product.isNew}
          onChange={e => toggleStatus('isNew', e.target.checked)}
          className="accent-orange-500 w-4 h-4"
        />
        Yeni
      </label>

      {/* Divider */}
      <span className="text-gray-200 select-none">|</span>

      {/* Edit */}
      <a
        href={`/admin/urunler/${product.id}/duzenle`}
        className="text-xs font-bold px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
      >
        ✏️ Düzenle
      </a>

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-xs font-bold px-3 py-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        {deleting ? '...' : '🗑 Sil'}
      </button>
    </div>
  )
}
