'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SearchBar from '@/components/layout/SearchBar'

const catLinks = [
  { href: '/kategoriler/tisort-polo', label: 'Tişört & Polo' },
  { href: '/kategoriler/sweat-kislik', label: 'Sweat & Kışlık' },
  { href: '/kategoriler/polar-esofman', label: 'Polar & Eşofman' },
  { href: '/kategoriler/is-pantolonu', label: 'İş Pantolonu' },
]

const catImages: Record<string, string> = {
  'tisort-polo':   '/products/bisiklet-yaka-tisort-siyah.png',
  'sweat-kislik':  '/products/kapsonlu-sweatshirt-siyah.png',
  'polar-esofman': '/products/polar-ceket-siyah.png',
  'is-pantolonu':  '/products/reflektorlu-is-pantolonu-lacivert.png',
}

// Küçük kategori ikonu — mega-menu sol panel + mobil menü
function CatIcon({ slug }: { slug: string }) {
  const paths: Record<string, ReactNode> = {
    'tisort-polo':   <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />,
    'sweat-kislik':  <><path d="M2 12h20M2 7h20M2 17h20"/><rect x="1" y="3" width="22" height="18" rx="2"/></>,
    'polar-esofman': <><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6v6l4 2"/></>,
    'is-pantolonu':  <path d="M6 2h12l1 8H5L6 2zM5 10v10a1 1 0 0 0 1 1h4l1-5 1 5h4a1 1 0 0 0 1-1V10H5z" />,
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ flexShrink: 0 }}>
      {paths[slug] ?? <circle cx="12" cy="12" r="10"/>}
    </svg>
  )
}

export default function Header({ categories = [] }: { categories?: any[] }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [logoError, setLogoError] = useState(false)

  return (
    <header className="flex flex-col">
      {/* Katman 1 — Üst Bilgi Barı */}
      <div className="h-9 flex items-center justify-between px-4 lg:px-8 text-[12px] text-white/65" style={{ backgroundColor: '#1A3358' }}>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.83a16 16 0 0 0 6.29 6.29l1.62-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            0541 877 16 35
          </span>
          <span>|</span>
          <a href="https://instagram.com/makro.iselbisesi" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            @makro.iselbisesi
          </a>
          <span className="text-white/20">|</span>
          <Link href="/admin" className="hover:text-white transition-colors opacity-40 hover:opacity-100 flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Admin
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/hakkimizda" className="hover:text-white transition-colors">Hakkımızda</Link>
          <span className="text-white/20">|</span>
          <Link href="/sss" className="hover:text-white transition-colors">SSS</Link>
          <span className="text-white/20">|</span>
          <Link href="/iletisim" className="hover:text-white transition-colors">İletişim</Link>
          <span className="text-white/20">|</span>
          <span className="flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="m16 8 5 3-5 3V8zM1 21h14"/></svg>
            Türkiye Geneli Teslimat
          </span>
          <span className="text-white/20">|</span>
          <a href="mailto:info@makro.com.tr" className="hover:text-white transition-colors flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            info@makro.com.tr
          </a>
        </div>
      </div>

      {/* Katman 2 — Ana Nav */}
      <div className="h-20 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 shadow-md" style={{ backgroundColor: '#0F2240' }}>
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center flex-shrink-0">
            <div style={{ height: 72, display: 'flex', alignItems: 'center' }}>
              <Image
                src="/brand/logo-transparent.png"
                alt="Makro İş Elbiseleri Logo"
                width={320}
                height={72}
                style={{ objectFit: 'contain', width: 'auto', height: '72px' }}
                priority
              />
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

              {/* Mega-menu dropdown */}
              {activeMenu === cat.slug && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0,
                  background: 'white',
                  width: 420,
                  boxShadow: '0 16px 48px rgba(15,34,64,0.2)',
                  borderRadius: '0 0 16px 16px',
                  borderTop: '3px solid #F57C28',
                  overflow: 'hidden',
                  zIndex: 100,
                  display: 'flex',
                }}>
                  {/* Sol — Kategori görseli */}
                  <div style={{ width: 160, flexShrink: 0, position: 'relative', background: '#0F2240' }}>
                    {catImages[cat.slug] && (
                      <Image
                        src={catImages[cat.slug]}
                        alt={cat.name}
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'top center', opacity: 0.85 }}
                        sizes="160px"
                      />
                    )}
                    {/* Overlay */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,20,40,0.9) 0%, rgba(10,20,40,0.3) 100%)' }} />
                    {/* Kategori adı */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 14px 16px' }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: '#FFA05A', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <CatIcon slug={cat.slug} /> Kategori
                      </div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 900, color: 'white', lineHeight: 1.2 }}>
                        {cat.name}
                      </div>
                      <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: '#FFA05A' }}>
                        {cat._count?.products || 0} ürün
                      </div>
                    </div>
                  </div>

                  {/* Sağ — Ürün listesi */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '10px 16px 6px', fontSize: 10, fontWeight: 800, color: '#9CA3AF', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                      Ürünler
                    </div>
                    <div style={{ flex: 1 }}>
                      {cat.products?.map((product: any) => (
                        <Link key={product.slug} href={`/urunler/${product.slug}`} style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '9px 16px',
                          color: '#1A202C', fontSize: 13, fontWeight: 600,
                          textDecoration: 'none', transition: 'all .12s',
                          borderBottom: '1px solid #F7F8FA',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#FFF8F4'; e.currentTarget.style.color = '#F57C28'; e.currentTarget.style.paddingLeft = '20px' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1A202C'; e.currentTarget.style.paddingLeft = '16px' }}
                        >
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#F57C28', flexShrink: 0 }} />
                          {product.name}
                        </Link>
                      ))}
                    </div>
                    {/* Alt CTA */}
                    <Link href={`/kategoriler/${cat.slug}`} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: '#F7F8FA',
                      borderTop: '1px solid #EDE8E3',
                      fontSize: 12, fontWeight: 800, color: '#0F2240',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FFF4EC'; e.currentTarget.style.color = '#F57C28' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#F7F8FA'; e.currentTarget.style.color = '#0F2240' }}
                    >
                      Tüm Koleksiyonu Gör
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            )
          })}

          {/* Sabit linkler */}
          <Link href="/urunler?baski=dtf" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 20px', height: 44, color: 'white', fontWeight: 700, fontSize: 13, textDecoration: 'none', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Tüm Ürünler
          </Link>
          <Link href="https://wa.me/905418771635" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 20px', height: 44, color: 'white', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.83a16 16 0 0 0 6.29 6.29l1.62-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Toptan Satış
          </Link>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div style={{ backgroundColor: '#1A3358' }} className="md:hidden fixed top-[116px] left-0 right-0 bottom-0 z-40 overflow-y-auto px-4 py-6">
          <div className="w-full mb-6 relative">
            <SearchBar />
          </div>

          <div className="flex flex-col gap-2 mb-6">
            {catLinks.map((link) => {
              const slug = link.href.split('/').pop() || ''
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-md text-sm font-semibold text-white/90 hover:bg-white/10 flex items-center gap-2"
                >
                  <CatIcon slug={slug} /> {link.label}
                </Link>
              )
            })}
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
