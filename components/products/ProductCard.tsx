'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export type ProductCardProduct = {
  id: string
  name: string
  slug: string
  shortDescription: string | null
  coverImageUrl: string | null
  fabricInfo: string | null
  hasPrintOption: boolean
  hasEmbroideryOption: boolean
  category: { name: string; slug: string }
  colors: { colorName: string; colorHex: string }[]
  sizes: { sizeLabel: string }[]
  features: { featureText: string }[]
}

export default function ProductCard({ product }: { product: ProductCardProduct }) {
  const router = useRouter()
  const fabricShort = product.fabricInfo
    ? product.fabricInfo.split(' ').slice(0, 2).join(' ')
    : null

  const visibleColors = product.colors.slice(0, 5)
  const extraColors = product.colors.length - 5

  return (
    <div
      onClick={() => router.push(`/urunler/${product.slug}`)}
      className="group block cursor-pointer bg-white border-2 border-gray-200 rounded-[16px] overflow-hidden transition-all duration-[220ms] hover:border-orange-400 hover:-translate-y-1"
      style={{ boxShadow: '0 2px 12px rgba(15,34,64,.08)' }}
    >
      {/* Image area */}
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110">
          {product.coverImageUrl ? (
            <Image
              src={product.coverImageUrl}
              alt={product.name}
              fill
              className="object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: '#0F2240' }}
            >
              <span
                className="text-white font-black opacity-20"
                style={{ fontFamily: 'var(--font-heading)', fontSize: '80px' }}
              >
                {product.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Fabric badge — top left */}
        {fabricShort && (
          <div className="absolute top-2 left-2">
            <span
              className="text-white text-xs font-semibold px-2 py-1 rounded"
              style={{ backgroundColor: '#0F2240' }}
            >
              {fabricShort}
            </span>
          </div>
        )}

        {/* Print / embroidery badges — top right */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {product.hasPrintOption && (
            <span
              className="text-white text-xs font-bold px-2 py-0.5 rounded"
              style={{ backgroundColor: '#F57C28' }}
            >
              DTF
            </span>
          )}
          {product.hasEmbroideryOption && (
            <span className="bg-teal-600 text-white text-xs font-bold px-2 py-0.5 rounded">
              Nakış
            </span>
          )}
        </div>

        {/* Color dots — bottom right */}
        {visibleColors.length > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-0.5 z-10 group-hover:opacity-0 transition-opacity">
            {visibleColors.map((c) => (
              <div
                key={c.colorHex}
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: c.colorHex }}
                title={c.colorName}
              />
            ))}
            {extraColors > 0 && (
              <span className="text-xs text-white font-bold ml-1">+{extraColors}</span>
            )}
          </div>
        )}

        {/* Hover overlay — altta kayar yukarı */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-[110%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-20"
          style={{
            background: 'linear-gradient(to top, rgba(15,34,64,0.95) 0%, rgba(15,34,64,0.7) 70%, transparent 100%)',
            padding: '20px 16px 16px',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px'
          }}
          onClick={(e) => e.stopPropagation()} /* Prevent triggering outer relative click twice if clicking here */
        >
          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {product.features.slice(0, 3).map(f => (
                <span key={f.featureText} style={{
                  background: 'rgba(245,124,40,0.2)', color: '#FFA05A',
                  padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600
                }}>✓ {f.featureText}</span>
              ))}
            </div>
          )}

          {/* CTA butonları */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={(e) => { e.stopPropagation(); router.push(`/urunler/${product.slug}`); }} style={{
              flex: 1, background: '#F57C28', color: 'white',
              padding: '8px 0', borderRadius: 7, textAlign: 'center',
              fontSize: 13, fontWeight: 700, textDecoration: 'none', border: 'none', cursor: 'pointer'
            }}>
              Detayı İncele →
            </button>
            <a href={`https://wa.me/905418771635?text=${encodeURIComponent('Merhaba, ' + product.name + ' hakkında bilgi almak istiyorum.')}`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              style={{
              background: '#25d366', color: 'white',
              padding: '8px 12px', borderRadius: 7,
              fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center'
            }}>WA</a>
          </div>
        </div>
      </div>

      {/* Info area */}
      <div className="p-4">
        <div
          className="text-xs font-bold uppercase tracking-widest mb-1"
          style={{ color: '#F57C28' }}
        >
          {product.category.name}
        </div>
        <h3
          className="font-extrabold text-xl leading-tight mb-2"
          style={{ fontFamily: 'var(--font-heading)', color: '#0F2240' }}
        >
          {product.name}
        </h3>
        {product.fabricInfo && (
          <p className="text-xs text-gray-500 mb-3 truncate">{product.fabricInfo}</p>
        )}

        <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
          <span
            className="text-sm font-bold text-white px-4 py-2 rounded-md transition-colors"
            style={{ backgroundColor: '#0F2240' }}
          >
            Detayı Gör
          </span>
          <span className="text-xs text-gray-400">
            {product.sizes.map((s) => s.sizeLabel).join(' · ')}
          </span>
        </div>
      </div>
    </div>
  )
}
