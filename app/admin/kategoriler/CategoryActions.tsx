'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CategoryActions({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`"${name}" kategorisini silmek istediğinize emin misiniz?`)) return
    setLoading(true)
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) {
      alert(data.error || 'Silinemedi')
    } else {
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href={`/admin/kategoriler/${id}/duzenle`}
        className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        style={{ color: '#0F2240' }}
      >
        Düzenle
      </a>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-3 py-1.5 text-xs font-bold rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        {loading ? '...' : 'Sil'}
      </button>
    </div>
  )
}
