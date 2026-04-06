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

export default async function HomePage() {
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

  // Featured az ise tüm aktif ürünleri göster
  const displayFeatured = featuredProducts.length >= 2 ? featuredProducts : allActiveProducts

  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO SLIDER — Dark, cinematic
      ════════════════════════════════════════════ */}
      <HeroSlider />

      {/* ═══════════════════════════════════════════
          TRUST BAR — White, ince, 4 özellik
      ════════════════════════════════════════════ */}
      <section style={{ background: '#FFFFFF', borderBottom: '1px solid #E8ECF0', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 40px' }}>
            {[
              { icon: '🏭', label: 'Toptan Satış', desc: 'Kurumsal anlaşma ile uygun fiyat' },
              { icon: '🎨', label: 'Logo Baskı & Nakış', desc: 'DTF ve nakış teknolojisi' },
              { icon: '🚚', label: 'Hızlı Teslimat', desc: 'Türkiye geneline güvenli kargo' },
              { icon: '✏️', label: 'Özel Tasarım', desc: 'Renk, kumaş, beden özelleştirme' },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
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
          KATEGORİLER — Full-image cards with text overlay
      ════════════════════════════════════════════ */}
      <section style={{ background: '#FFFFFF', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionHeader tag="Ürün Kategorileri" title="Kurumsal Giyim Koleksiyonu" />

          {/* Kategori görsel + açıklama eşleşmesi */}
          {(() => {
            const catMeta: Record<string, { img: string; sub: string }> = {
              'tisort-polo':   { img: '/products/bisiklet-yaka-tisort-siyah.png',         sub: 'Compak penye, pike & pique kumaş' },
              'sweat-kislik':  { img: '/products/kapsonlu-sweatshirt-siyah.png',          sub: 'Sweatshirt, kapşonlu & hırka'      },
              'polar-esofman': { img: '/products/polar-ceket-siyah.png',                  sub: 'Polar ceket & eşofman takımı'      },
              'is-pantolonu':  { img: '/products/reflektorlu-is-pantolonu-lacivert.png',  sub: 'Kargo, reflektörlü & dayanıklı'   },
            }
            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                {categories.map((cat) => {
                  const meta = catMeta[cat.slug] ?? { img: cat.imageUrl || `/kategoriler/${cat.slug}.jpg`, sub: 'Kurumsal koleksiyon' }
                  return (
                    <Link
                      key={cat.id}
                      href={`/kategoriler/${cat.slug}`}
                      className="group"
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
              padding: '12px 32px', borderRadius: 8,
              border: '2px solid #0F2240', color: '#0F2240',
              fontWeight: 700, fontSize: 14, textDecoration: 'none',
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
      <section style={{ background: '#0F2240', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
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
