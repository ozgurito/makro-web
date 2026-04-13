'use client'

import { useState, useMemo } from 'react'
import ProductGrid from './ProductGrid'
import type { ProductCardProduct } from './ProductCard'

const COLOR_OPTIONS = [
  { name: 'Siyah',   hex: '#1A1A1A' },
  { name: 'Gri',     hex: '#808080' },
  { name: 'Lacivert',hex: '#1B2A6B' },
  { name: 'Kırmızı', hex: '#C0392B' },
  { name: 'Beyaz',   hex: '#F5F5F5' },
  { name: 'Mavi',    hex: '#1B4F9E' },
]

type Props = { products: ProductCardProduct[] }

export default function CategoryProductsClient({ products }: Props) {
  const [activeColor, setActiveColor] = useState<string | null>(null)
  const [activePrint, setActivePrint]  = useState<'dtf' | 'nakis' | null>(null)

  // Sadece bu kategoride gerçekten olan renkleri göster
  const availableColors = useMemo(() => {
    const hexSet = new Set(products.flatMap((p) => p.colors.map((c) => c.colorHex)))
    return COLOR_OPTIONS.filter((c) => hexSet.has(c.hex))
  }, [products])

  const hasDTF     = products.some((p) => p.hasPrintOption)
  const hasNakis   = products.some((p) => p.hasEmbroideryOption)

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (activeColor && !p.colors.some((c) => c.colorHex === activeColor)) return false
      if (activePrint === 'dtf'   && !p.hasPrintOption)       return false
      if (activePrint === 'nakis' && !p.hasEmbroideryOption)  return false
      return true
    })
  }, [products, activeColor, activePrint])

  const hasFilters = activeColor || activePrint

  function clearAll() {
    setActiveColor(null)
    setActivePrint(null)
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 10, fontWeight: 700, color: '#9CA3AF',
    letterSpacing: '.1em', textTransform: 'uppercase',
    marginBottom: 6, display: 'block',
  }

  return (
    <div>
      {/* ─── Filtre Çubuğu ─────────────────────────────────── */}
      <div style={{
        background: 'white',
        border: '1px solid #E8ECF0',
        borderRadius: 16,
        padding: '18px 24px',
        marginBottom: 32,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 24,
        alignItems: 'flex-end',
        boxShadow: '0 2px 12px rgba(15,34,64,0.05)',
      }}>

        {/* Renk */}
        {availableColors.length > 0 && (
          <div>
            <span style={labelStyle}>Renk</span>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {availableColors.map((c) => {
                const active = activeColor === c.hex
                return (
                  <button
                    key={c.hex}
                    onClick={() => setActiveColor(active ? null : c.hex)}
                    title={c.name}
                    style={{
                      width: 28, height: 28, borderRadius: '50%',
                      backgroundColor: c.hex,
                      cursor: 'pointer',
                      transition: 'box-shadow .15s, transform .15s',
                      transform: active ? 'scale(1.15)' : 'scale(1)',
                      boxShadow: active
                        ? '0 0 0 2px white, 0 0 0 4px #F57C28'
                        : c.hex === '#F5F5F5'
                          ? '0 0 0 1px #e5e7eb'
                          : '0 0 0 1px rgba(0,0,0,0.12)',
                      border: 'none',
                    }}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* Dikey ayraç */}
        {availableColors.length > 0 && (hasDTF || hasNakis) && (
          <div style={{ width: 1, height: 40, background: '#E8ECF0', alignSelf: 'center', flexShrink: 0 }} />
        )}

        {/* Baskı */}
        {(hasDTF || hasNakis) && (
          <div>
            <span style={labelStyle}>Baskı & Nakış</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {hasDTF && (
                <button
                  onClick={() => setActivePrint(activePrint === 'dtf' ? null : 'dtf')}
                  style={{
                    fontSize: 12, fontWeight: 600,
                    padding: '6px 14px', borderRadius: 20,
                    border: '1.5px solid',
                    borderColor: activePrint === 'dtf' ? '#F57C28' : '#E8ECF0',
                    background: activePrint === 'dtf' ? '#FFF4EC' : 'white',
                    color: activePrint === 'dtf' ? '#F57C28' : '#6B7280',
                    cursor: 'pointer', transition: 'all .15s',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  DTF Baskı
                </button>
              )}
              {hasNakis && (
                <button
                  onClick={() => setActivePrint(activePrint === 'nakis' ? null : 'nakis')}
                  style={{
                    fontSize: 12, fontWeight: 600,
                    padding: '6px 14px', borderRadius: 20,
                    border: '1.5px solid',
                    borderColor: activePrint === 'nakis' ? '#0F2240' : '#E8ECF0',
                    background: activePrint === 'nakis' ? '#EEF2FF' : 'white',
                    color: activePrint === 'nakis' ? '#0F2240' : '#6B7280',
                    cursor: 'pointer', transition: 'all .15s',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                  Nakış
                </button>
              )}
            </div>
          </div>
        )}

        {/* Sağa yaslı: sonuç sayısı + temizle */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 13, color: '#6B7280' }}>
            <strong style={{ color: '#0F2240', fontWeight: 800 }}>{filtered.length}</strong>
            <span style={{ marginLeft: 4 }}>ürün</span>
          </span>
          {hasFilters && (
            <button
              onClick={clearAll}
              style={{
                fontSize: 12, fontWeight: 700,
                color: '#9CA3AF', background: '#F7F8FA',
                border: '1px solid #E8ECF0',
                borderRadius: 20, padding: '5px 12px',
                cursor: 'pointer', transition: 'all .15s',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
              Temizle
            </button>
          )}
        </div>
      </div>

      {/* ─── Ürün Grid ─────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <ProductGrid products={filtered} columns={3} />
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.3 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0F2240" strokeWidth="1.5" style={{ margin: '0 auto' }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: 15, marginBottom: 16 }}>
            Seçili filtreyle eşleşen ürün bulunamadı.
          </p>
          <button
            onClick={clearAll}
            style={{
              background: '#0F2240', color: 'white', border: 'none',
              borderRadius: 10, padding: '10px 24px',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}
          >
            Filtreleri Temizle
          </button>
        </div>
      )}
    </div>
  )
}
