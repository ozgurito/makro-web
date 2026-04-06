'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'

type Color = { id: string; colorName: string; colorHex: string }
type ProductImage = { id: string; imageUrl: string; altText: string | null; isCover: boolean }

type Props = {
  colors: Color[]
  images: ProductImage[]
  productName: string
}

export default function ProductColorGallery({ colors, images, productName }: Props) {
  const defaultImage = images.find((img) => img.isCover) ?? images[0]
  const [activeImage, setActiveImage] = useState<ProductImage | null>(defaultImage ?? null)
  const [activeColorId, setActiveColorId] = useState<string>(colors[0]?.id ?? '')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [showZoom, setShowZoom] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const zoomDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Klavye (lightbox)
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (!lightboxOpen) return
    if (e.key === 'Escape') setLightboxOpen(false)
    if (e.key === 'ArrowRight') setLightboxIndex(i => Math.min(i + 1, images.length - 1))
    if (e.key === 'ArrowLeft') setLightboxIndex(i => Math.max(i - 1, 0))
  }, [lightboxOpen, images.length])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  // Mouse pozisyonu takip (% cinsinden)
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    setZoomPos({ x, y })
  }

  function handleMouseEnter() {
    if (!activeImage) return
    // 400ms bekle — hızlı tıklamalarda zoom açılmasın
    zoomDelayRef.current = setTimeout(() => setShowZoom(true), 400)
  }

  function handleMouseLeave() {
    if (zoomDelayRef.current) clearTimeout(zoomDelayRef.current)
    setShowZoom(false)
  }

  // Tıklama: zoom delay'i iptal et, lightbox aç
  function handleClick() {
    if (zoomDelayRef.current) clearTimeout(zoomDelayRef.current)
    setShowZoom(false)
    if (!activeImage) return
    const idx = images.findIndex(img => img.id === activeImage.id)
    setLightboxIndex(idx >= 0 ? idx : 0)
    setLightboxOpen(true)
  }

  function colorToKey(name: string): string {
    return name.toLowerCase()
      .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
      .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
  }

  function getImageForColor(color: Color): ProductImage | null {
    const match = images.find(img =>
      img.altText?.toLowerCase().includes(color.colorName.toLowerCase()) ||
      img.imageUrl.toLowerCase().includes(colorToKey(color.colorName))
    )
    return match ?? images[0] ?? null
  }

  function handleColorClick(color: Color) {
    setActiveColorId(color.id)
    const img = getImageForColor(color)
    if (img) setActiveImage(img)
  }

  const activeColor = colors.find(c => c.id === activeColorId)
  const lightboxImage = images[lightboxIndex]

  return (
    <>
      <div>
        {/* Ana görsel */}
        <div
          ref={containerRef}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative aspect-square rounded-2xl overflow-hidden mb-3"
          style={{
            backgroundColor: '#F3F4F6',
            cursor: activeImage ? 'zoom-in' : 'default',
            userSelect: 'none',
          }}
        >
          {activeImage ? (
            <>
              {/* Görsel — pointer-events none, tıklama container'a gider */}
              <div
                style={{
                  position: 'absolute', inset: 0,
                  pointerEvents: 'none',
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: showZoom ? 'scale(2.2)' : 'scale(1)',
                  transition: showZoom
                    ? 'transform 0.08s linear'
                    : 'transform 0.25s ease',
                  willChange: 'transform',
                }}
              >
                <Image
                  src={activeImage.imageUrl}
                  alt={activeImage.altText ?? productName}
                  fill
                  style={{ objectFit: 'cover', pointerEvents: 'none' }}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  draggable={false}
                />
              </div>

              {/* Tam ekran hint — sadece zoom yokken */}
              {!showZoom && (
                <div
                  className="absolute bottom-3 right-3 pointer-events-none"
                  style={{
                    background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
                    color: 'white', fontSize: 11, fontWeight: 700,
                    padding: '5px 10px', borderRadius: 20,
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                  </svg>
                  Tam ekran
                </div>
              )}

              {/* Zoom aktifken: crosshair göstergesi */}
              {showZoom && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: `${zoomPos.x}%`,
                    top: `${zoomPos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 60, height: 60,
                    border: '2px solid rgba(255,255,255,0.7)',
                    borderRadius: '50%',
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
                  }}
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ backgroundColor: '#0F2240' }}>
              <span className="text-white/20 font-black leading-none select-none" style={{ fontFamily: 'var(--font-heading)', fontSize: '120px' }}>M</span>
              <span className="text-white/40 font-bold text-sm uppercase tracking-widest px-6 text-center">LOGONUZ BURDA OLSUN</span>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img) => {
              const isActive = img.id === activeImage?.id
              return (
                <button
                  key={img.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveImage(img)
                    const matchColor = colors.find(c =>
                      img.altText?.toLowerCase().includes(c.colorName.toLowerCase()) ||
                      img.imageUrl.toLowerCase().includes(colorToKey(c.colorName))
                    )
                    if (matchColor) setActiveColorId(matchColor.id)
                  }}
                  className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all hover:scale-105"
                  style={{ borderColor: isActive ? '#F57C28' : '#e5e7eb' }}
                >
                  <Image src={img.imageUrl} alt={img.altText ?? productName} fill className="object-cover" sizes="64px" />
                </button>
              )
            })}
          </div>
        )}

        {/* Renk seçici */}
        {colors.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
              RENK
              {activeColor && <span className="ml-2 text-gray-600 normal-case font-normal">— {activeColor.colorName}</span>}
            </p>
            <div className="flex flex-wrap gap-3">
              {colors.map((c) => (
                <button
                  key={c.id}
                  onClick={(e) => { e.stopPropagation(); handleColorClick(c) }}
                  title={c.colorName}
                  className="w-9 h-9 rounded-full transition-all hover:scale-110"
                  style={{
                    backgroundColor: c.colorHex,
                    outline: c.colorHex === '#F5F5F5' ? '1px solid #e5e7eb' : undefined,
                    boxShadow: activeColorId === c.id ? '0 0 0 3px #F57C28' : '0 0 0 2px #e5e7eb',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && lightboxImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)' }}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'absolute', top: 20, right: 20, zIndex: 10,
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
              color: 'white', fontSize: 22, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>

          {images.length > 1 && lightboxIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i - 1) }}
              style={{
                position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
                width: 48, height: 48, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
                color: 'white', fontSize: 24, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >‹</button>
          )}

          {images.length > 1 && lightboxIndex < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i + 1) }}
              style={{
                position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
                width: 48, height: 48, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
                color: 'white', fontSize: 24, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >›</button>
          )}

          <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', width: '100%', height: '100%' }}>
            <Image
              src={lightboxImage.imageUrl}
              alt={lightboxImage.altText ?? productName}
              fill
              style={{ objectFit: 'contain' }}
              sizes="90vw"
              priority
            />
          </div>

          {images.length > 1 && (
            <div style={{
              position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(255,255,255,0.15)', color: 'white',
              padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
            }}>
              {lightboxIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  )
}
