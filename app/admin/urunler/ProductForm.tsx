'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const SIZES_PRESET = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']

interface Category { id: string; name: string }
interface Color { name: string; hex: string }
interface GalleryImage { url: string; altText: string; isCover: boolean }

interface FormState {
  id?: string
  name: string
  categoryId: string
  productCode: string
  shortDescription: string
  longDescription: string
  coverImageUrl: string
  fabricInfo: string
  fabricWeight: string
  washingInstructions: string
  hasPrintOption: boolean
  hasEmbroideryOption: boolean
  isFeatured: boolean
  isNew: boolean
  isActive: boolean
  sortOrder: string
  colors: Color[]
  sizes: string[]
  features: string[]
  galleryImages: GalleryImage[]
}

const EMPTY: FormState = {
  name: '', categoryId: '', productCode: '', shortDescription: '',
  longDescription: '', coverImageUrl: '', fabricInfo: '', fabricWeight: '',
  washingInstructions: '', hasPrintOption: false, hasEmbroideryOption: false,
  isFeatured: false, isNew: false, isActive: true, sortOrder: '0',
  colors: [], sizes: [], features: [], galleryImages: [],
}

export default function ProductForm({
  categories,
  initial,
}: {
  categories: Category[]
  initial?: FormState
}) {
  const router = useRouter()
  const isEdit = Boolean(initial?.id)
  const [form, setForm] = useState<FormState>(initial ?? EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [error, setError] = useState('')
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000' })
  const [newFeature, setNewFeature] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const set = (field: keyof FormState, val: any) =>
    setForm(prev => ({ ...prev, [field]: val }))

  // Image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setUploading(false)
    if (!res.ok) { setError(data.error || 'Yükleme başarısız'); return }
    set('coverImageUrl', data.url)
  }

  // Gallery image upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setGalleryUploading(true)
    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok && data.url) {
        set('galleryImages', [...form.galleryImages, { url: data.url, altText: '', isCover: false }])
      }
    }
    setGalleryUploading(false)
    e.target.value = ''
  }

  // Color management
  const addColor = () => {
    if (!newColor.name.trim()) return
    set('colors', [...form.colors, { name: newColor.name.trim(), hex: newColor.hex }])
    setNewColor({ name: '', hex: '#000000' })
  }
  const removeColor = (i: number) =>
    set('colors', form.colors.filter((_, idx) => idx !== i))

  // Size management
  const toggleSize = (s: string) =>
    set('sizes', form.sizes.includes(s) ? form.sizes.filter(x => x !== s) : [...form.sizes, s])

  // Features management
  const addFeature = () => {
    if (!newFeature.trim()) return
    set('features', [...form.features, newFeature.trim()])
    setNewFeature('')
  }
  const removeFeature = (i: number) =>
    set('features', form.features.filter((_, idx) => idx !== i))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.categoryId) { setError('Ad ve kategori zorunludur'); return }
    setSaving(true)
    setError('')
    const url = isEdit ? `/api/admin/products/${form.id}` : '/api/admin/products'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { setError(data.error || 'İşlem başarısız'); return }
    router.push('/admin/urunler')
    router.refresh()
  }

  const inputStyle = {
    width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB',
    borderRadius: 8, fontSize: 14, outline: 'none', color: '#1F2937',
    background: 'white',
  }
  const labelStyle = { fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' as const, letterSpacing: '.05em', marginBottom: 4, display: 'block' }
  const sectionStyle = { background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 24, marginBottom: 20 }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '12px 16px', color: '#DC2626', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
        {/* Sol kolon */}
        <div>
          {/* Temel bilgiler */}
          <div style={sectionStyle}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0F2240', marginBottom: 16 }}>Temel Bilgiler</h2>
            <div style={{ display: 'grid', gap: 14 }}>
              <div>
                <label style={labelStyle}>Ürün Adı *</label>
                <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ör: Compak Penye Tişört" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Kategori *</label>
                  <select style={inputStyle} value={form.categoryId} onChange={e => set('categoryId', e.target.value)} required>
                    <option value="">Seçin...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Ürün Kodu</label>
                  <input style={inputStyle} value={form.productCode} onChange={e => set('productCode', e.target.value)} placeholder="Ör: MK-001" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Kısa Açıklama</label>
                <input style={inputStyle} value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} placeholder="Liste kartı için kısa tanım" />
              </div>
              <div>
                <label style={labelStyle}>Uzun Açıklama</label>
                <textarea
                  style={{ ...inputStyle, height: 120, resize: 'vertical' }}
                  value={form.longDescription}
                  onChange={e => set('longDescription', e.target.value)}
                  placeholder="Ürün detay sayfası için açıklama..."
                />
              </div>
            </div>
          </div>

          {/* Kumaş bilgileri */}
          <div style={sectionStyle}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0F2240', marginBottom: 16 }}>Kumaş Bilgileri</h2>
            <div style={{ display: 'grid', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Kumaş Türü</label>
                  <input style={inputStyle} value={form.fabricInfo} onChange={e => set('fabricInfo', e.target.value)} placeholder="Ör: %100 Pamuk Compak Penye" />
                </div>
                <div>
                  <label style={labelStyle}>Gramaj (g/m²)</label>
                  <input style={inputStyle} type="number" value={form.fabricWeight} onChange={e => set('fabricWeight', e.target.value)} placeholder="Ör: 180" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Yıkama Talimatları</label>
                <input style={inputStyle} value={form.washingInstructions} onChange={e => set('washingInstructions', e.target.value)} placeholder="Ör: 40°C makine yıkama" />
              </div>
            </div>
          </div>

          {/* Özellikler */}
          <div style={sectionStyle}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0F2240', marginBottom: 16 }}>Ürün Özellikleri</h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={newFeature}
                onChange={e => setNewFeature(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFeature() } }}
                placeholder="Ör: Çift dikiş kollar, Ribana yakalı..."
              />
              <button type="button" onClick={addFeature} style={{ padding: '8px 14px', background: '#F57C28', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                + Ekle
              </button>
            </div>
            {form.features.length > 0 && (
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {form.features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F9FAFB', borderRadius: 6, padding: '6px 12px' }}>
                    <span style={{ flex: 1, fontSize: 13 }}>{f}</span>
                    <button type="button" onClick={() => removeFeature(i)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: 700 }}>×</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Galeri Görselleri */}
          <div style={sectionStyle}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0F2240', marginBottom: 4 }}>Galeri Görselleri</h2>
            <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>
              Her görsel için altText yazın — renk adı yazarsanız (ör: "Lacivert") o renge tıklanınca bu görsel gösterilir.
            </p>

            {form.galleryImages.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                {form.galleryImages.map((img, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F9FAFB', borderRadius: 8, padding: 10, border: '1px solid #E5E7EB' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                    <div style={{ flex: 1, display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        style={{ ...inputStyle, flex: 1, fontSize: 12 }}
                        value={img.altText}
                        onChange={e => {
                          const updated = [...form.galleryImages]
                          updated[i] = { ...updated[i], altText: e.target.value }
                          set('galleryImages', updated)
                        }}
                        placeholder="Renk adı veya açıklama (ör: Lacivert, ön çekim)"
                      />
                      <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#374151', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={img.isCover}
                          onChange={e => {
                            const updated = form.galleryImages.map((g, idx) => ({ ...g, isCover: idx === i ? e.target.checked : false }))
                            set('galleryImages', updated)
                            if (e.target.checked) set('coverImageUrl', img.url)
                          }}
                          className="accent-orange-500"
                        />
                        Kapak
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => set('galleryImages', form.galleryImages.filter((_, idx) => idx !== i))}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: 700, fontSize: 18, padding: '0 4px' }}
                    >×</button>
                  </div>
                ))}
              </div>
            )}

            <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} style={{ display: 'none' }} />
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              style={{ width: '100%', padding: '9px 12px', border: '2px dashed #D1D5DB', borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#6B7280' }}
            >
              {galleryUploading ? '⏳ Yükleniyor...' : '+ Görsel Ekle (çoklu seçim yapabilirsin)'}
            </button>
          </div>

          {/* Renkler */}
          <div style={sectionStyle}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0F2240', marginBottom: 16 }}>Renkler</h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={newColor.name}
                onChange={e => setNewColor(p => ({ ...p, name: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addColor() } }}
                placeholder="Renk adı (Ör: Lacivert)"
              />
              <input
                type="color"
                value={newColor.hex}
                onChange={e => setNewColor(p => ({ ...p, hex: e.target.value }))}
                style={{ width: 44, height: 38, border: '1px solid #D1D5DB', borderRadius: 8, cursor: 'pointer', padding: 2 }}
              />
              <button type="button" onClick={addColor} style={{ padding: '8px 14px', background: '#F57C28', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                + Ekle
              </button>
            </div>
            {form.colors.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {form.colors.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F9FAFB', borderRadius: 20, padding: '4px 10px 4px 8px', border: '1px solid #E5E7EB' }}>
                    <span style={{ width: 16, height: 16, borderRadius: '50%', background: c.hex, border: '1px solid #ddd', flexShrink: 0 }} />
                    <span style={{ fontSize: 13 }}>{c.name}</span>
                    <button type="button" onClick={() => removeColor(i)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: 12, fontWeight: 700, padding: 0 }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bedenler */}
          <div style={sectionStyle}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0F2240', marginBottom: 16 }}>Bedenler</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SIZES_PRESET.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  style={{
                    padding: '6px 16px', borderRadius: 8, fontWeight: 700, fontSize: 13,
                    border: form.sizes.includes(s) ? '2px solid #F57C28' : '2px solid #E5E7EB',
                    background: form.sizes.includes(s) ? '#FFF8F4' : 'white',
                    color: form.sizes.includes(s) ? '#F57C28' : '#6B7280',
                    cursor: 'pointer', transition: 'all .15s',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sağ kolon */}
        <div>
          {/* Kapak görseli */}
          <div style={sectionStyle}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0F2240', marginBottom: 16 }}>Kapak Görseli</h2>
            {form.coverImageUrl ? (
              <div style={{ position: 'relative', marginBottom: 12 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.coverImageUrl} alt="kapak" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }} />
                <button
                  type="button"
                  onClick={() => set('coverImageUrl', '')}
                  style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}
                >
                  ×
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{ width: '100%', height: 160, border: '2px dashed #D1D5DB', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 8, marginBottom: 12 }}
              >
                <span style={{ fontSize: 32 }}>📷</span>
                <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 600 }}>
                  {uploading ? 'Yükleniyor...' : 'Görsel seç (JPG, PNG, WebP — max 5MB)'}
                </span>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            {!form.coverImageUrl && (
              <button type="button" onClick={() => fileInputRef.current?.click()} style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#374151' }}>
                {uploading ? '⏳ Yükleniyor...' : '📤 Görsel Yükle'}
              </button>
            )}
            {form.coverImageUrl && (
              <input style={{ ...inputStyle, marginTop: 8, fontSize: 11, color: '#9CA3AF' }} value={form.coverImageUrl} onChange={e => set('coverImageUrl', e.target.value)} placeholder="veya URL girin" />
            )}
          </div>

          {/* Durum ve seçenekler */}
          <div style={sectionStyle}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0F2240', marginBottom: 16 }}>Durum & Seçenekler</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {([
                ['isActive', 'Aktif (yayında)'],
                ['isFeatured', 'Öne çıkarılmış'],
                ['isNew', 'Yeni ürün'],
                ['hasPrintOption', 'DTF Baskı mevcut'],
                ['hasEmbroideryOption', 'Nakış mevcut'],
              ] as [keyof FormState, string][]).map(([field, label]) => (
                <label key={field} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(form[field])}
                    onChange={e => set(field, e.target.checked)}
                    className="accent-orange-500 w-4 h-4"
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</span>
                </label>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={labelStyle}>Sıralama</label>
              <input style={inputStyle} type="number" value={form.sortOrder} onChange={e => set('sortOrder', e.target.value)} />
            </div>
          </div>

          {/* Kaydet */}
          <button
            type="submit"
            disabled={saving || uploading}
            style={{
              width: '100%', padding: '13px', background: saving ? '#9CA3AF' : '#F57C28',
              color: 'white', border: 'none', borderRadius: 10, fontWeight: 800,
              fontSize: 15, cursor: saving ? 'not-allowed' : 'pointer', transition: 'background .2s',
            }}
          >
            {saving ? '⏳ Kaydediliyor...' : isEdit ? '✅ Güncelle' : '✅ Ürün Oluştur'}
          </button>
        </div>
      </div>
    </form>
  )
}
