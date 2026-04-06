import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'İletişim | Makro İş Elbiseleri',
  description: 'Makro İş Elbiseleri ile iletişime geçin. 0541 877 16 35',
}

export default function IletisimPage() {
  return (
    <>
      {/* Hero */}
      <div style={{ background: '#0F2240', padding: '40px 24px 68px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#FFA05A', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 12 }}>Bize Ulaşın</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px,5vw,52px)', fontWeight: 800, color: 'white', margin: '0 0 10px 0' }}>İletişim</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, margin: 0 }}>Sorularınız için formu doldurun veya doğrudan bizimle iletişime geçin.</p>
        </div>
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 44" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 44 }}>
            <path d="M0,44 C480,4 960,44 1440,22 L1440,44 L0,44 Z" fill="#FFFFFF"/>
          </svg>
        </div>
      </div>

    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left */}
        <div>
          <div className="space-y-3 mb-8">
            {[
              { svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57C28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.91 6.91l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, label: '0541 877 16 35', href: 'tel:05418771635' },
              { svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, label: 'WhatsApp ile Yaz', href: 'https://wa.me/905418771635' },
              { svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>, label: '@makro.iselbisesi', href: 'https://instagram.com/makro.iselbisesi' },
              { svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57C28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label: 'info@makro.com.tr', href: 'mailto:info@makro.com.tr' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-4 border border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-colors"
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: '#F7F8FA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.svg}
                </div>
                <span className="font-semibold text-gray-700">{item.label}</span>
              </a>
            ))}
          </div>

          {/* Map embed */}
          <div className="rounded-2xl overflow-hidden border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d195752.20559963163!2d27.017757950000003!3d38.4192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bbd862a762cacd%3A0x628cbba1a59ce8fe!2zxLB6bWly!5e0!3m2!1str!2str!4v1700000000000"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Konum haritası"
            />
          </div>
        </div>

        {/* Right — Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-card">
          <h2
            className="mb-6"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '28px',
              fontWeight: 700,
              color: '#0F2240',
            }}
          >
            Mesaj Gönder
          </h2>
          <ContactForm />
        </div>
      </div>
    </div>
    </>
  )
}
