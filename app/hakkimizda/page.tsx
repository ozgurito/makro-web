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
      <div style={{ background: '#0F2240', padding: '48px 24px 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div className="max-w-4xl mx-auto text-center" style={{ position: 'relative' }}>
          <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#FFA05A', letterSpacing: '.12em', textTransform: 'uppercase', background: 'rgba(245,124,40,0.15)', border: '1px solid rgba(245,124,40,0.3)', padding: '4px 14px', borderRadius: 20, marginBottom: 16 }}>
            Kurumsal
          </div>
          <h1 className="text-white" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 800, margin: '0 0 16px 0' }}>
            Hakkımızda
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 17, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Kurumsal kimliğinizi yansıtan iş kıyafetleri üretiminde güvenilir çözüm ortağınız.
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 44" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 44 }}>
            <path d="M0,44 C360,8 1080,44 1440,18 L1440,44 L0,44 Z" fill="#FFFFFF"/>
          </svg>
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
            {
              svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F57C28" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v12"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>,
              title: 'Kaliteli Kumaş', desc: 'Compak penye, pike, polar ve kargo kumaş seçenekleri'
            },
            {
              svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F57C28" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
              title: 'Toptan Satış', desc: '10 adetten itibaren toptan fiyat avantajı'
            },
            {
              svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F57C28" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
              title: 'Özel Üretim', desc: 'DTF baskı ve nakış ile firmanıza özel tasarım'
            },
            {
              svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F57C28" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
              title: 'Hızlı Teslimat', desc: 'Türkiye geneli güvenilir kargo hizmeti'
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white border border-gray-100 rounded-[16px] p-6 text-center"
              style={{ boxShadow: '0 4px 20px rgba(15,34,64,.07)' }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(245,124,40,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                {f.svg}
              </div>
              <div className="font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#0F2240', fontSize: '18px' }}>
                {f.title}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#0F2240', padding: '56px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div className="max-w-2xl mx-auto text-center" style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#FFA05A', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 12 }}>Hemen Başlayın</div>
          <h2 className="text-white mb-6" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, margin: '0 0 24px 0' }}>
            Firmanıza Özel Teklif Alın
          </h2>
          <div className="flex justify-center gap-3 flex-wrap">
            <a
              href="https://wa.me/905418771635"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#25D366', color: 'white', padding: '13px 24px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none', boxShadow: '0 4px 16px rgba(37,211,102,0.3)' }}
            >
              WhatsApp ile Yaz
            </a>
            <Link href="/teklif-iste" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F57C28', color: 'white', padding: '13px 24px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none', boxShadow: '0 4px 16px rgba(245,124,40,0.35)' }}>
              Teklif İste
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
