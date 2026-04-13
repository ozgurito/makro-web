'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import Link from 'next/link'

type Category = { id: string; name: string; slug: string; _count: { products: number } }

const COLOR_OPTIONS = [
  { name: 'Siyah',    hex: '#1A1A1A' },
  { name: 'Gri',      hex: '#808080' },
  { name: 'Lacivert', hex: '#1B2A6B' },
  { name: 'Kırmızı',  hex: '#C0392B' },
  { name: 'Beyaz',    hex: '#F5F5F5' },
  { name: 'Mavi',     hex: '#1B4F9E' },
]

const FABRIC_OPTIONS = [
  'Compak Penye',
  'Pike (Piqué)',
  '3 İplik Şardonlu',
  'PET Polar',
  'Polyester Kargo',
]

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL']

type Props = {
  categories: Category[]
  totalProducts: number
}

export default function FilterSidebar({ categories, totalProducts }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('kategori')
  const currentColor = searchParams.get('renk')
  const currentFabric = searchParams.get('kumaş')
  const currentPrint = searchParams.get('baskı')

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('sayfa')
      router.push(`/urunler?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <aside className="bg-white border border-gray-200 rounded-[16px] p-5 sticky top-24">
      {/* Kategoriler */}
      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Kategoriler
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => updateParam('kategori', null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              !currentCategory
                ? 'text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            style={!currentCategory ? { backgroundColor: '#0F2240' } : undefined}
          >
            Tüm Ürünler ({totalProducts})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam('kategori', cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentCategory === cat.slug
                  ? 'text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              style={
                currentCategory === cat.slug
                  ? { backgroundColor: '#0F2240' }
                  : undefined
              }
            >
              {cat.name} ({cat._count.products})
            </button>
          ))}
        </div>
      </div>

      {/* Renk */}
      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Renk
        </h4>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c.hex}
              onClick={() =>
                updateParam('renk', currentColor === c.hex ? null : c.hex)
              }
              title={c.name}
              className="w-7 h-7 rounded-full transition-all"
              style={{
                backgroundColor: c.hex,
                border:
                  currentColor === c.hex
                    ? '3px solid #F57C28'
                    : '2px solid #e5e7eb',
                outline: c.hex === '#F5F5F5' ? '1px solid #e5e7eb' : undefined,
              }}
            />
          ))}
        </div>
      </div>

      {/* Kumaş */}
      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Kumaş
        </h4>
        <div className="space-y-2">
          {FABRIC_OPTIONS.map((f) => (
            <label key={f} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentFabric === f}
                onChange={() =>
                  updateParam('kumaş', currentFabric === f ? null : f)
                }
                className="w-4 h-4 accent-orange-500"
              />
              <span className="text-sm text-gray-700">{f}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Baskı */}
      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Baskı
        </h4>
        <div className="space-y-2">
          {[
            { label: 'DTF Baskı', value: 'dtf' },
            { label: 'Nakış', value: 'nakis' },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentPrint === opt.value}
                onChange={() =>
                  updateParam('baskı', currentPrint === opt.value ? null : opt.value)
                }
                className="w-4 h-4 accent-orange-500"
              />
              <span className="text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Beden */}
      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Beden
        </h4>
        <div className="flex gap-2 flex-wrap">
          {SIZE_OPTIONS.map((s) => (
            <button
              key={s}
              className="w-12 h-12 border-2 border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:border-orange-400 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <Link
        href="/urunler"
        className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
      >
        Filtreleri Temizle ×
      </Link>
    </aside>
  )
}
