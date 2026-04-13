import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import ProductGrid from '@/components/products/ProductGrid'
import HeroSlider from '@/components/home/HeroSlider'

export const metadata: Metadata = {
  title: 'Makro İş Elbiseleri | Kurumsal Gücün Üniiforması — Toptan Kurumsal Kıyafet',
  description:
    'Compak penye, pike ve polar kumaştan tişört, sweatshirt, polar ceket. DTF baskı ve nakış. Toptan satış, Türkiye geneli teslimat. 0541 877 16 35',
}

// Tutarlı section başlık bileşeni (inline)
function SectionHeader({ tag, title, subtitle }: { tag: string; title: string; subtitle?: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 40 }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: '#F57C28',
        letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 10
      }}>{tag}</div>
      <h2 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(28px, 4vw, 42px)',
        fontWeight: 800, color: '#0F2240', margin: '0 0 10px 0'
      }}>{title}</h2>
      {subtitle && <p style={{ color: '#6B7A8D', fontSize: 15, margin: 0 }}>{subtitle}</p>}
    </div>
  )
}

async function getHomeData() {
  const [featuredProducts, allActiveProducts, categories, newProducts, popularProducts] = await Promise.all([
    prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: { category: true, colors: true, sizes: true, features: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true, colors: true, sizes: true, features: true },
      orderBy: { sortOrder: 'asc' },
      take: 4,
    }),
    prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: { where: { isActive: true } } } } },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.product.findMany({
      where: { isActive: true, isNew: true },
      include: { category: true, colors: true, sizes: true, features: true },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true, colors: true, sizes: true, features: true },
      orderBy: { viewCount: 'desc' },
      take: 4,
    }),
  ])
  return { featuredProducts, allActiveProducts, categories, newProducts, popularProducts }
}

export default async function HomePage() {
  const data = await getHomeData().catch((err) => {
    console.error('[HomePage] DB error:', err)
    return null
  })

  if (!data) {
    return (
      <>
        <HeroSlider />
        <section style={{ background: '#F7F8FA', padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: 520, margin: '0 auto' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔧</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 800, color: '#0F2240', marginBottom: 12 }}>
              Kısa Bir Bakım Molası
            </h2>
            <p style={{ color: '#6B7A8D', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
              Sistemimiz kısa süreli bir teknik güncelleme geçiriyor. Birkaç dakika sonra tekrar deneyin.
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP ?? '905418771635'}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#25D366', color: 'white',
                padding: '13px 28px', borderRadius: 8,
                fontWeight: 700, fontSize: 14, textDecoration: 'none',
              }}
            >
              WhatsApp ile İletişim
            </a>
          </div>
        </section>
      </>
    )
  }

  const { featuredProducts, allActiveProducts, categories, newProducts, popularProducts } = data

  // Featured az ise tüm aktif ürünleri göster
  const displayFeatured = featuredProducts.length >= 2 ? featuredProducts : allActiveProducts

  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO SLIDER — Dark, cinematic
      ════════════════════════════════════════════ */}
      <HeroSlider />

      {/* ═══════════════════════════════════════════
          TRUST BAR — White, SVG ikonlar, tek satır
      ════════════════════════════════════════════ */}
      <section style={{ background: '#FFFFFF', borderBottom: '1px solid #E8ECF0', padding: '18px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px 48px' }}>
            {[
              {
                svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F57C28" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
                label: 'Toptan Satış', desc: 'Kurumsal anlaşma ile uygun fiyat'
              },
              {
                svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F57C28" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>,
                label: 'Logo Baskı & Nakış', desc: 'DTF ve nakış teknolojisi'
              },
              {
                svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F57C28" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
                label: 'Hızlı Teslimat', desc: 'Türkiye geneline güvenli kargo'
              },
              {
                svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F57C28" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
                label: 'Özel Tasarım', desc: 'Renk, kumaş, beden özelleştirme'
              },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: 'rgba(245,124,40,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {item.svg}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#0F2240' }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: '#8896A4' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS BAND — Sosyal kanıt rakamları
      ════════════════════════════════════════════ */}
      <section style={{ background: '#0F2240', padding: '36px 24px 72px', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px 64px' }}>
            {[
              { number: '500+', label: 'Kurumsal Müşteri' },
              { number: '10.000+', label: 'Ürün Teslimi' },
              { number: '8 Yıl', label: 'Sektör Deneyimi' },
              { number: '81 İl', label: 'Türkiye Geneli Teslimat' },
            ].map((stat, idx) => (
              <div key={idx} style={{ textAlign: 'center', padding: '4px 0' }}>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(28px, 4vw, 40px)',
                  fontWeight: 900,
                  color: '#F57C28',
                  lineHeight: 1,
                  marginBottom: 6
                }}>{stat.number}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider → beyaz kategoriler */}
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 52" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 52 }}>
            <path d="M0,52 C360,8 720,52 1080,20 C1260,4 1380,36 1440,52 L1440,52 L0,52 Z" fill="#FFFFFF"/>
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          KATEGORİLER — Full-image cards with text overlay
      ════════════════════════════════════════════ */}
      <section style={{ background: '#FFFFFF', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Section header + "Tüm Kategoriler" CTA */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#F57C28', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 10 }}>Ürün Kategorileri</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#0F2240', margin: 0 }}>Kurumsal Giyim Koleksiyonu</h2>
            </div>
            <Link
              href="/kategoriler"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontSize: 14, fontWeight: 700, color: '#0F2240',
                border: '1.5px solid #E8ECF0', borderRadius: 10,
                padding: '10px 20px', textDecoration: 'none',
                background: 'white', transition: 'all .2s',
                whiteSpace: 'nowrap',
              }}
            >
              Tüm Kategoriler
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {/* Kategori görsel + açıklama eşleşmesi */}
          {(() => {
            const catMeta: Record<string, { img: string; sub: string }> = {
              'tisort-polo':   { img: '/products/bisiklet-yaka-tisort-siyah.png',         sub: 'Compak penye, pike & pique kumaş' },
              'sweat-kislik':  { img: '/products/kapsonlu-sweatshirt-siyah.png',          sub: 'Sweatshirt, kapşonlu & hırka'      },
              'polar-esofman': { img: '/products/polar-ceket-siyah.png',                  sub: 'Polar ceket & eşofman takımı'      },
              'is-pantolonu':  { img: '/products/reflektorlu-is-pantolonu-lacivert.png',  sub: 'Kargo, reflektörlü & dayanıklı'   },
            }
            return (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {categories.map((cat) => {
                  const meta = catMeta[cat.slug] ?? { img: cat.imageUrl || `/kategoriler/${cat.slug}.jpg`, sub: 'Kurumsal koleksiyon' }
                  return (
                    <Link
                      key={cat.id}
                      href={`/kategoriler/${cat.slug}`}
                      className="group hover:-translate-y-2 transition-transform duration-300"
                      style={{
                        display: 'block', position: 'relative',
                        borderRadius: 16, overflow: 'hidden',
                        height: 320,
                        textDecoration: 'none',
                        boxShadow: '0 4px 20px rgba(15,34,64,0.1)',
                        background: '#0F2240',
                      }}
                    >
                      {/* Arka plan görseli */}
                      <Image
                        src={meta.img}
                        alt={cat.name}
                        fill
                        style={{
                          objectFit: 'cover',
                          objectPosition: 'top center',
                          transition: 'transform .5s ease',
                        }}
                        className="group-hover:scale-110"
                      />

                      {/* Alt gradient — yazı okunabilirliği */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(10,20,40,0.92) 0%, rgba(10,20,40,0.45) 50%, rgba(10,20,40,0.05) 100%)',
                      }} />

                      {/* Üst köşe: ürün sayısı */}
                      <div style={{
                        position: 'absolute', top: 14, right: 14,
                        background: 'rgba(245,124,40,0.9)', backdropFilter: 'blur(4px)',
                        color: 'white', fontSize: 11, fontWeight: 800,
                        padding: '4px 10px', borderRadius: 20,
                        letterSpacing: '.04em',
                      }}>
                        {cat._count.products} ürün
                      </div>

                      {/* İçerik — alt kısım */}
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        padding: '20px 20px 22px',
                      }}>
                        {/* Kategori adı */}
                        <h3 style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: 26, fontWeight: 900,
                          color: 'white', margin: '0 0 5px 0',
                          lineHeight: 1,
                          letterSpacing: '-0.01em',
                        }}>{cat.name}</h3>

                        {/* Alt açıklama */}
                        <p style={{
                          fontSize: 12, color: 'rgba(255,255,255,0.65)',
                          margin: '0 0 14px 0', fontWeight: 500,
                        }}>{meta.sub}</p>

                        {/* CTA */}
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          background: '#F57C28',
                          color: 'white', fontSize: 12, fontWeight: 800,
                          padding: '6px 14px', borderRadius: 20,
                          letterSpacing: '.04em', textTransform: 'uppercase',
                          transition: 'background .2s',
                        }}>
                          Koleksiyonu Keşfet →
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )
          })()}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ÖNE ÇIKAN ÜRÜNLER — #F7F8FA subtle gray
      ════════════════════════════════════════════ */}
      <section style={{ background: '#F7F8FA', padding: '64px 24px', borderTop: '1px solid #E8ECF0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionHeader
            tag="Popüler"
            title="Öne Çıkan Ürünler"
            subtitle="Kurumsal müşterilerin en çok tercih ettiği modeller"
          />
          <ProductGrid products={displayFeatured} columns={4} />
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/urunler" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 36px', borderRadius: 8,
              background: '#F57C28', color: 'white',
              fontWeight: 700, fontSize: 14, textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(245,124,40,0.35)',
              transition: 'all .2s'
            }}>
              Tüm Ürünleri Gör →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          EN YENİLER — White, sadece veri varsa
      ════════════════════════════════════════════ */}
      {newProducts.length > 0 && (
        <section style={{ background: '#FFFFFF', padding: '64px 24px', borderTop: '1px solid #E8ECF0' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#F57C28', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                  🆕 En Yeniler
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 800, color: '#0F2240', margin: 0 }}>
                  Yeni Gelen Modeller
                </h2>
              </div>
              <Link href="/urunler" style={{ color: '#F57C28', fontWeight: 700, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Tümünü Gör →
              </Link>
            </div>
            <ProductGrid products={newProducts} columns={4} />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          EN POPÜLER — #F7F8FA subtle
      ════════════════════════════════════════════ */}
      <section style={{ background: '#F7F8FA', padding: '64px 24px', borderTop: '1px solid #E8ECF0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#F57C28', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                🔥 Çok İncelenenler
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 800, color: '#0F2240', margin: 0 }}>
                En Popüler Ürünler
              </h2>
            </div>
            <Link href="/urunler" style={{ color: '#F57C28', fontWeight: 700, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Tümünü Gör →
            </Link>
          </div>
          <ProductGrid products={popularProducts} columns={4} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA BAND — Navy, güçlü kapanış
      ════════════════════════════════════════════ */}
      <section style={{ background: '#0F2240', padding: '72px 24px', position: 'relative', overflow: 'hidden' }}>
        {/* Dot grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 32, position: 'relative' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#F57C28', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              Kurumsal Çözümler
            </div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(26px, 3.5vw, 44px)',
              fontWeight: 800, color: 'white', margin: '0 0 12px 0'
            }}>
              Firmanıza Özel<br />
              <span style={{ color: '#F57C28' }}>Logo & Baskı Çözümü</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.7, margin: 0, maxWidth: 480 }}>
              DTF baskı ve nakışla logonuzu tüm ürünlere taşıyın. Minimum sipariş ve fiyat için hemen iletişime geçin.
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP ?? '905418771635'}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#25D366', color: 'white',
                padding: '14px 24px', borderRadius: 8,
                fontWeight: 700, fontSize: 14, textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(37,211,102,0.3)'
              }}
            >
              💬 WhatsApp ile Yaz
            </a>
            <Link href="/teklif-iste" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#F57C28', color: 'white',
              padding: '14px 24px', borderRadius: 8,
              fontWeight: 700, fontSize: 14, textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(245,124,40,0.35)'
            }}>
              📋 Teklif İste
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
