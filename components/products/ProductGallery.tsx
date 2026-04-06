'use client'

import { useState } from 'react'
import Image from 'next/image'

type Props = {
  images: { imageUrl: string; altText: string | null; isCover: boolean }[]
  productName: string
  selectedColorHex?: string
}

export default function ProductGallery({ images, productName }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const mainImage = images[selectedIdx]
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' })
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  return (
    <div>
      {/* Main image */}
      <div
        className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden cursor-zoom-in mb-3"
        style={{ backgroundColor: '#F3F4F6' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setZoomStyle({ display: 'block' })}
        onMouseLeave={() => setZoomStyle({ display: 'none' })}
        onClick={() => { if(mainImage) setLightboxOpen(true) }}
      >
        {mainImage ? (
          <>
            <Image
              src={mainImage.imageUrl}
              alt={mainImage.altText ?? productName}
              fill
              className="object-cover"
              priority
            />
            <div style={{
              ...zoomStyle,
              position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
              backgroundImage: `url(${mainImage.imageUrl})`,
              backgroundSize: '250%',
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
              backgroundRepeat: 'no-repeat',
            }} />
          </>
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ backgroundColor: '#0F2240' }}
          >
            <span
              className="text-white/20 font-black leading-none select-none"
              style={{ fontFamily: 'var(--font-heading)', fontSize: '120px' }}
            >
              M
            </span>
            <span
              className="text-white/40 font-bold text-sm uppercase tracking-widest px-6 text-center"
            >
              LOGONUZ BURDA OLSUN
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors"
              style={{
                borderColor: idx === selectedIdx ? '#F57C28' : '#e5e7eb',
              }}
            >
              <Image
                src={img.imageUrl}
                alt={img.altText ?? productName}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && mainImage && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onClick={() => setLightboxOpen(false)}
        >
          <button onClick={() => setLightboxOpen(false)} style={{
            position: 'absolute', top: 20, right: 20,
            background: 'rgba(255,255,255,.1)', border: 'none',
            color: 'white', width: 44, height: 44, borderRadius: '50%',
            fontSize: 20, cursor: 'pointer', zIndex: 1001
          }}>×</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mainImage.imageUrl}
            alt="Büyük Görsel"
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 8 }}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
