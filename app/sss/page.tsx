import type { Metadata } from 'next'
import FAQAccordion from './FAQAccordion'

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular | Makro İş Elbiseleri',
  description:
    'Kurumsal iş kıyafetleri hakkında merak ettiğiniz soruların cevapları.',
}

const faqs = [
  {
    q: 'Minimum sipariş adedi nedir?',
    a: 'DTF baskılı ürünlerde minimum 10 adet, nakışlı ürünlerde minimum 10 adet sipariş kabul edilmektedir. Baskısız ürünlerde daha düşük adetlerde sipariş alınabilir.',
  },
  {
    q: 'Teslimat süresi ne kadardır?',
    a: 'Baskısız ürünlerde 3-5 iş günü, DTF baskılı ürünlerde 7-10 iş günü, nakışlı ürünlerde 10-14 iş günü içinde teslimat yapılmaktadır. Büyük siparişlerde süre uzayabilir.',
  },
  {
    q: 'DTF baskı kalitesi nasıldır?',
    a: 'DTF (Direct to Film) baskı teknolojisi sayesinde yüksek çözünürlüklü, canlı renkli ve uzun ömürlü baskılar elde edilmektedir. Yıkamaya karşı dayanıklıdır ve solma yapmaz.',
  },
  {
    q: 'Hangi bedenlerde üretim yapılıyor?',
    a: 'Standart olarak S, M, L, XL bedenlerinde üretim yapılmaktadır. Özel siparişlerde XS, XXL ve daha büyük bedenler de imal edilebilmektedir.',
  },
  {
    q: 'Renk özelleştirme mümkün mü?',
    a: "Evet, standart renklerin yanı sıra firmanızın kurumsal rengine uygun özel renk üretimi yapılabilmektedir. Pantone veya RAL renk kodlarıyla sipariş verebilirsiniz.",
  },
  {
    q: 'Ödeme yöntemleri nelerdir?',
    a: 'Banka havalesi/EFT ve kredi kartı ile ödeme kabul edilmektedir. Kurumsal faturalı alışverişlerde vadeli ödeme seçeneği görüşülebilir.',
  },
  {
    q: 'Numune alabilir miyim?',
    a: 'Evet, üretim öncesinde onaylamanız için numune gönderilmektedir. Numune ücreti ödenir, ilk siparişte numune bedeli iade edilir.',
  },
  {
    q: 'Büyük beden seçenekleri var mı?',
    a: 'Standart ürünlerimiz S-XL aralığında üretilmektedir. XXL, XXXL ve daha büyük bedenler özel sipariş ile imal edilebilmektedir. Bunun için bizimle iletişime geçin.',
  },
]

export default function SSSPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ background: '#0F2240', padding: '40px 24px 68px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div className="max-w-3xl mx-auto" style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#FFA05A', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 12 }}>Yardım Merkezi</div>
          <h1 className="text-white" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,52px)', fontWeight: 800, margin: '0 0 10px 0' }}>
            Sıkça Sorulan Sorular
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, margin: 0 }}>
            Merak ettiğiniz soruların cevaplarını burada bulabilirsiniz.
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 44" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 44 }}>
            <path d="M0,44 C480,4 960,44 1440,22 L1440,44 L0,44 Z" fill="#FFFFFF"/>
          </svg>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <FAQAccordion faqs={faqs} />
      </div>
    </>
  )
}
