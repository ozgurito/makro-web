'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import Image from 'next/image'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

const slides = [
  {
    // Sol: lacivert koyu → sağ: şeffaf (fotoğraf görünsün)
    overlay: 'linear-gradient(to right, rgba(15,34,64,0.82) 35%, rgba(15,34,64,0.45) 65%, rgba(15,34,64,0.1) 100%)',
    image: '/slides/slide1.png',
    tag: '2026 Koleksiyonu',
    title: 'Kurumsal Gücün',
    titleOrange: 'Üniiforması',
    subtitle: 'Compak penye, pike ve polar kumaştan kurumsal iş kıyafetleri',
    cta: 'Koleksiyonu Keşfet →',
    href: '/urunler'
  },
  {
    overlay: 'linear-gradient(to right, rgba(15,34,64,0.82) 35%, rgba(15,34,64,0.45) 65%, rgba(15,34,64,0.1) 100%)',
    image: '/slides/slide2.png',
    tag: 'DTF Baskı & Nakış',
    title: 'Firmanızın Logosu',
    titleOrange: 'Her Üründe',
    subtitle: 'DTF baskı ve nakış teknolojisiyle kurumsal kimliğinizi yansıtın',
    cta: 'Teklif İste →',
    href: '/teklif-iste'
  },
  {
    overlay: 'linear-gradient(to right, rgba(15,34,64,0.82) 35%, rgba(15,34,64,0.45) 65%, rgba(15,34,64,0.1) 100%)',
    image: '/slides/slide3.png',
    tag: 'Toptan Satış',
    title: 'Türkiye Geneline',
    titleOrange: 'Hızlı Teslimat',
    subtitle: 'Minimum sipariş bilgisi ve özel fiyat için hemen iletişime geçin',
    cta: 'WhatsApp ile Yaz →',
    href: 'https://wa.me/905418771635'
  },
  {
    overlay: 'linear-gradient(to right, rgba(15,34,64,0.82) 35%, rgba(15,34,64,0.45) 65%, rgba(15,34,64,0.1) 100%)',
    image: '/slides/slide4.png',
    tag: 'Tüm Sezonlar',
    title: 'Yazdan Kışa',
    titleOrange: 'Kurumsal Çözüm',
    subtitle: 'Tişörtten polar cekete, her mevsim için iş kıyafeti çözümleri',
    cta: 'Kategorileri Gör →',
    href: '/kategoriler'
  }
]

export default function HeroSlider() {
  return (
    <section className="w-full relative overflow-hidden hero-section">
      <style>{`
        .hero-section { height: 440px; }
        @media (min-width: 768px)  { .hero-section { height: 520px; } }
        @media (min-width: 1024px) { .hero-section { height: 580px; } }
        .swiper-pagination-bullet { background: rgba(255,255,255,0.5) !important; opacity:1 !important; width:8px !important; height:8px !important; }
        .swiper-pagination-bullet-active { background: #F57C28 !important; width:24px !important; border-radius:4px !important; }
      `}</style>

      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        loop={true}
        pagination={{ clickable: true }}
        navigation={{ prevEl: '.hero-prev', nextEl: '.hero-next' }}
        className="w-full h-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="w-full h-full relative" style={{ background: '#0A1929' }}>

              {/* Arka plan görseli — kişi sağda görünsün */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                style={{ objectFit: 'cover', objectPosition: 'right center' }}
                priority={i === 0}
              />

              {/* Sol taraf gradient — metin okunabilirliği */}
              <div className="absolute inset-0" style={{ background: slide.overlay }} />

              {/* Hafif diagonal desen */}
              <div className="absolute inset-0" style={{
                opacity: 0.025,
                backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
                backgroundSize: '28px 28px'
              }} />

              {/* İçerik — sol taraf */}
              <div className="absolute inset-0 flex items-center px-6 lg:px-20">
                <div style={{ maxWidth: 520, position: 'relative', zIndex: 10 }}>

                  {/* Tag */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: 'rgba(245,124,40,0.2)',
                    border: '1px solid rgba(245,124,40,0.5)',
                    color: '#FFA05A', padding: '5px 14px',
                    borderRadius: 20, fontSize: 11, fontWeight: 700,
                    letterSpacing: '.1em', textTransform: 'uppercase',
                    marginBottom: 18
                  }}>
                    {slide.tag}
                  </div>

                  {/* Başlık */}
                  <h2 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(38px, 6vw, 66px)',
                    fontWeight: 800,
                    color: 'white',
                    lineHeight: 0.92,
                    marginBottom: 18,
                    letterSpacing: '-0.01em'
                  }}>
                    {slide.title}<br />
                    <span style={{ color: '#F57C28' }}>{slide.titleOrange}</span>
                  </h2>

                  {/* Alt başlık */}
                  <p style={{
                    fontSize: 16, color: 'rgba(255,255,255,0.72)',
                    lineHeight: 1.65, marginBottom: 32, maxWidth: 420
                  }}>
                    {slide.subtitle}
                  </p>

                  {/* CTA */}
                  <a href={slide.href} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: '#F57C28', color: 'white',
                    padding: '13px 26px', borderRadius: 8,
                    fontSize: 15, fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(245,124,40,0.4)',
                    transition: 'all .2s'
                  }}>
                    {slide.cta}
                  </a>
                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Nav okları */}
      <button className="hero-prev" style={{
        position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
        zIndex: 20, width: 42, height: 42, borderRadius: '50%',
        background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
        color: 'white', fontSize: 20, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background .2s'
      }}>‹</button>
      <button className="hero-next" style={{
        position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
        zIndex: 20, width: 42, height: 42, borderRadius: '50%',
        background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
        color: 'white', fontSize: 20, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background .2s'
      }}>›</button>
    </section>
  )
}
