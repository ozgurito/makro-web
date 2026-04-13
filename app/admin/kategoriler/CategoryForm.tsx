'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type CategoryData = {
  id?: string
  name: string
  description: string
  imageUrl: string
  sortOrder: number
  isActive: boolean
  seoTitle: string
  seoDescription: string
}

export default function CategoryForm({ initial }: { initial?: Partial<CategoryData> }) {
  const router = useRouter()
  const isEdit = Boolean(initial?.id)

  const [form, setForm] = useState<CategoryData>({
    id: initial?.id,
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    imageUrl: initial?.imageUrl ?? '',
    sortOrder: initial?.sortOrder ?? 0,
    isActive: initial?.isActive ?? true,
    seoTitle: initial?.seoTitle ?? '',
    seoDescription: initial?.seoDescription ?? '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field: keyof CategoryData, value: CategoryData[typeof field]) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const url = isEdit ? `/api/admin/categories/${form.id}` : '/api/admin/categories'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Bir hata oluştu')
      return
    }

    router.push('/admin/kategoriler')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Ad */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Kategori Adı *</label>
        <input
          type="text"
          value={form.name}
          onChange={e => set('name', e.target.value)}
          required
          placeholder="örn. Tişört & Polo"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Açıklama */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Açıklama</label>
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          rows={3}
          placeholder="Kısa kategori açıklaması"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Görsel URL */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Görsel URL</label>
        <input
          type="text"
          value={form.imageUrl}
          onChange={e => set('imageUrl', e.target.value)}
          placeholder="/kategoriler/tisort-polo.jpg"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Sıra + Durum */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-bold text-gray-700 mb-1">Sıra</label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={e => set('sortOrder', Number(e.target.value))}
            min={0}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div className="flex items-end pb-0.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={e => set('isActive', e.target.checked)}
              className="w-4 h-4 accent-orange-500"
            />
            <span className="text-sm font-bold text-gray-700">Aktif</span>
          </label>
        </div>
      </div>

      {/* SEO */}
      <div className="border border-gray-200 rounded-xl p-4 space-y-4">
        <div className="text-xs font-bold text-gray-400 tracking-widest uppercase">SEO (İsteğe Bağlı)</div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">SEO Başlık</label>
          <input
            type="text"
            value={form.seoTitle}
            onChange={e => set('seoTitle', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">SEO Açıklama</label>
          <textarea
            value={form.seoDescription}
            onChange={e => set('seoDescription', e.target.value)}
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-60 transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#F57C28' }}
        >
          {loading ? 'Kaydediliyor...' : isEdit ? 'Güncelle' : 'Kategori Oluştur'}
        </button>
        <a href="/admin/kategoriler" className="text-sm font-semibold text-gray-500 hover:text-gray-700">
          İptal
        </a>
      </div>
    </form>
  )
}
