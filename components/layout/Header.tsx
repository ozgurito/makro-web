'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import SearchBar from '@/components/layout/SearchBar'

const catLinks = [
  { href: '/kategoriler/tisort-polo', label: '👕 Tişört & Polo' },
  { href: '/kategoriler/sweat-kislik', label: '🧥 Sweat & Kışlık' },
  { href: '/kategoriler/polar-esofman', label: '🧣 Polar & Eşofman' },
  { href: '/kategoriler/is-pantolonu', label: '👖 İş Pantolonu' },
]

export default function Header({ categories = [] }: { categories?: any[] }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [logoError, setLogoError] = useState(false)

  return (
    <header className="flex flex-col">
      {/* Katman 1 — Üst Bilgi Barı */}
      <div className="h-9 flex items-center justify-between px-4 lg:px-8 text-[12px] text-white/65" style={{ backgroundColor: '#1A3358' }}>
        <div className="flex items-center gap-2">
          <span>☎ 0541 877 16 35</span>
          <span>|</span>
          <a href="https://instagram.com/makro.iselbisesi" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            📸 @makro.iselbisesi
          </a>
          <span className="text-white/20">|</span>
          <Link href="/admin" className="hover:text-white transition-colors opacity-40 hover:opacity-100">⚙ Admin</Link>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/hakkimizda" className="hover:text-white transition-colors">Hakkımızda</Link>
          <span className="text-white/20">|</span>
          <Link href="/sss" className="hover:text-white transition-colors">SSS</Link>
          <span className="text-white/20">|</span>
          <Link href="/iletisim" className="hover:text-white transition-colors">İletişim</Link>
          <span className="text-white/20">|</span>
          <span>🚚 Türkiye Geneli Teslimat</span>
          <span className="text-white/20">|</span>
          <a href="mailto:info@makro.com.tr" className="hover:text-white transition-colors">
            ✉ info@makro.com.tr
          </a>
        </div>
      </div>

      {/* Katman 2 — Ana Nav */}
      <div className="h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 shadow-md" style={{ backgroundColor: '#0F2240' }}>
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            {/* Logo ikonu — mix-blend-mode:screen ile siyah bg transparan görünür */}
            <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
              {!logoError ? (
                <Image
                  src="/brand/logo.webp"
                  alt="M"
                  width={44}
                  height={44}
                  style={{ objectFit: 'cover', mixBlendMode: 'screen', width: 44, height: 44 }}
                  priority
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div style={{
                  width: 44, height: 44, background: '#F57C28', borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 900, color: 'white' }}>M</span>
                </div>
              )}
            </div>
            {/* Yazı kısmı — her zaman göster */}
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 21, fontWeight: 800, color: 'white', letterSpacing: '0.04em', lineHeight: 1 }}>
                MAKRO
              </div>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#FFA05A', letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 2 }}>
                İş Elbiseleri
              </div>
            </div>
          </Link>
        </div>

        {/* Orta: Arama kutusu */}
        <div className="hidden md:flex flex-1 justify-center max-w-xl mx-4">
          <SearchBar />
        </div>

        {/* Sağ: Butonlar */}
        <div className="flex-1 flex justify-end items-center gap-2">
          <div className="hidden md:flex gap-2">
            <Link
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP ?? '905418771635'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-sm font-bold px-4 py-2 rounded-md transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#25D366' }}
            >
              WhatsApp
            </Link>
            <Link
              href="/teklif-iste"
              className="text-white text-sm font-bold px-4 py-2 rounded-md transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#F57C28' }}
            >
              Teklif İste
            </Link>
          </div>
          
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menüyü aç"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Katman 3 — Kategori Nav */}
      <div className="hidden md:block border-t border-white/10" style={{ backgroundColor: '#F57C28', position: 'relative', zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
          {categories?.map(cat => {
            const icon = cat.slug.includes('tisort') ? '👕' : cat.slug.includes('sweat') ? '🧥' : cat.slug.includes('pantolon') ? '👖' : '🧣';
            return (
            <div
              key={cat.slug}
              style={{ position: 'relative' }}
              onMouseEnter={() => setActiveMenu(cat.slug)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              {/* Kategori butonu */}
              <Link href={`/kategoriler/${cat.slug}`} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '0 20px', height: 44,
                color: 'white', fontWeight: 700, fontSize: 13,
                textDecoration: 'none',
                background: activeMenu === cat.slug ? 'rgba(0,0,0,0.15)' : 'transparent',
                borderRight: '1px solid rgba(255,255,255,0.2)'
              }}>
                {icon} {cat.name}
                <span style={{ fontSize: 10, opacity: 0.7 }}>▾</span>
              </Link>

              {/* Dropdown - sadece hover'da görünür */}
              {activeMenu === cat.slug && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0,
                  background: 'white',
                  minWidth: 280,
                  boxShadow: '0 8px 32px rgba(15,34,64,0.18)',
                  borderRadius: '0 0 12px 12px',
                  border: '1px solid #EDE8E3',
                  borderTop: '3px solid #F57C28',
                  padding: '8px 0',
                  zIndex: 100
                }}>
                  {/* Kategori başlığı */}
                  <div style={{
                    padding: '12px 20px 8px',
                    fontSize: 11, fontWeight: 800,
                    color: '#F57C28', letterSpacing: '.08em',
                    textTransform: 'uppercase', borderBottom: '1px solid #EDE8E3'
                  }}>{cat.name}</div>

                  {/* Ürün linkleri */}
                  {cat.products?.map((product: any) => (
                    <Link key={product.slug} href={`/urunler/${product.slug}`} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 20px',
                      color: '#1A202C', fontSize: 13, fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all .15s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FFF8F4'; e.currentTarget.style.color = '#F57C28' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1A202C' }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F57C28', flexShrink: 0 }} />
                      {product.name}
                    </Link>
                  ))}

                  {/* Alt link */}
                  <div style={{ borderTop: '1px solid #EDE8E3', margin: '8px 0 0', padding: '10px 20px' }}>
                    <Link href={`/kategoriler/${cat.slug}`} style={{
                      fontSize: 12, fontWeight: 700, color: '#F57C28', textDecoration: 'none'
                    }}>
                      Tümünü Gör → ({cat._count?.products || 0} ürün)
                    </Link>
                  </div>
                </div>
              )}
            </div>
            )
          })}

          {/* Sabit linkler */}
          <Link href="/urunler?baski=dtf" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 20px', height: 44, color: 'white', fontWeight: 700, fontSize: 13, textDecoration: 'none', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
            🎨 DTF Baskı & Nakış
          </Link>
          <Link href="https://wa.me/905418771635" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 20px', height: 44, color: 'white', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
            📞 Toptan Satış
          </Link>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div style={{ backgroundColor: '#1A3358' }} className="md:hidden fixed top-[100px] left-0 right-0 bottom-0 z-40 overflow-y-auto px-4 py-6">
          <div className="w-full mb-6 relative">
            <SearchBar />
          </div>

          <div className="flex flex-col gap-2 mb-6">
            {catLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-md text-sm font-semibold text-white/90 hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex gap-2">
            <Link
              href="https://wa.me/905418771635"
              target="_blank"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-white text-sm font-bold px-4 py-3 rounded-md text-center"
              style={{ backgroundColor: '#25D366' }}
            >
              WhatsApp
            </Link>
            <Link
              href="/teklif-iste"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-white text-sm font-bold px-4 py-3 rounded-md text-center"
              style={{ backgroundColor: '#F57C28' }}
            >
              Teklif İste
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
