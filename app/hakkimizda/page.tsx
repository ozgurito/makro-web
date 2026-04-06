import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Hakkımızda | Makro İş Elbiseleri',
  description:
    'Makro İş Elbiseleri hakkında bilgi edinin. Kurumsal iş kıyafetlerinde güvenilir çözüm ortağınız.',
}

export default function HakkimizdaPage() {
  return (
    <>
      {/* Hero */}
      <div style={{ backgroundColor: '#0F2240' }} className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="section-tag mb-4 inline-block">Kurumsal</span>
          <h1
            className="text-white"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 800 }}
          >
            Hakkımızda
          </h1>
          <p className="text-white/60 mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
            Kurumsal kimliğinizi yansıtan iş kıyafetleri üretiminde güvenilir çözüm ortağınız.
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose max-w-none text-gray-700 leading-relaxed text-base space-y-4">
          <p>
            Makro İş Elbiseleri olarak yıllar içinde kurumsal iş kıyafeti alanında sağlam bir
            deneyim biriktirdik. Firmalar için kimlik oluşturan, kaliteli kumaşlardan üretilmiş,
            markanıza değer katan giysiler sunmak temel hedefimizdir.
          </p>
          <p>
            Compak penye tişörtlerden polar cekete, polo yaka sweatshirtlerden reflektörlü iş
            pantolonya kadar geniş ürün yelpazemizle her sektörden kurumun ihtiyacını karşılıyoruz.
            DTF baskı ve nakış seçeneklerimizle firmanızın logosunu veya tasarımını ürünlere
            uygulayabiliyoruz.
          </p>
          <p>
            Toptan satış anlayışımız sayesinde küçük işletmelerden büyük kurumsal firmalara kadar
            uygun fiyatlarla hizmet vermekteyiz. Türkiye genelinde hızlı kargo teslimat
            seçeneklerimizle siparişleriniz zamanında elinize ulaşır.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-16">
          {[
            { icon: '🧵', title: 'Kaliteli Kumaş', desc: 'Compak penye, pike, polar ve kargo kumaş seçenekleri' },
            { icon: '🏭', title: 'Toptan Satış', desc: '10 adetten itibaren toptan fiyat avantajı' },
            { icon: '🎨', title: 'Özel Üretim', desc: 'DTF baskı ve nakış ile firmanıza özel tasarım' },
            { icon: '🚚', title: 'Hızlı Teslimat', desc: 'Türkiye geneli güvenilir kargo hizmeti' },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white border border-gray-200 rounded-[16px] p-5 text-center"
              style={{ boxShadow: '0 2px 12px rgba(15,34,64,.08)' }}
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <div
                className="font-bold mb-2"
                style={{ fontFamily: 'var(--font-heading)', color: '#0F2240', fontSize: '18px' }}
              >
                {f.title}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ backgroundColor: '#0F2240' }} className="py-12">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2
            className="text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', fontWeight: 800 }}
          >
            Hemen Teklif Alın
          </h2>
          <div className="flex justify-center gap-3 flex-wrap">
            <a
              href="https://wa.me/905418771635"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold px-6 py-3 rounded-lg text-white"
              style={{ backgroundColor: '#25D366' }}
            >
              💬 WhatsApp
            </a>
            <Link href="/teklif-iste" className="btn-primary">
              📋 Teklif İste
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
