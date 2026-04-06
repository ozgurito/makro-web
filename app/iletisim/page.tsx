import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'İletişim | Makro İş Elbiseleri',
  description: 'Makro İş Elbiseleri ile iletişime geçin. 0541 877 16 35',
}

export default function IletisimPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left */}
        <div>
          <h1
            className="mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(36px, 5vw, 52px)',
              fontWeight: 800,
              color: '#0F2240',
            }}
          >
            İletişim
          </h1>
          <p className="text-gray-600 mb-8">
            Sorularınız için formu doldurun veya doğrudan bizimle iletişime geçin.
          </p>

          <div className="space-y-3 mb-8">
            {[
              { icon: '📞', label: '0541 877 16 35', href: 'tel:05418771635' },
              { icon: '💬', label: 'WhatsApp ile Yaz', href: 'https://wa.me/905418771635' },
              { icon: '📸', label: '@makro.iselbisesi', href: 'https://instagram.com/makro.iselbisesi' },
              { icon: '📧', label: 'info@makro.com.tr', href: 'mailto:info@makro.com.tr' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-4 border border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-colors"
              >
                <span className="text-2xl">{item.icon}</span>
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
  )
}
