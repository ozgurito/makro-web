import type { Metadata } from 'next'
import { Suspense } from 'react'
import QuoteForm from './QuoteForm'

export const metadata: Metadata = {
  title: 'Teklif İste | Makro İş Elbiseleri',
  description:
    'Kurumsal iş kıyafetleri için ücretsiz fiyat teklifi alın. 24 saat içinde uzman ekibimiz sizi arasın.',
}

export default function TeklifIstePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left — Info */}
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
            Ücretsiz Fiyat Teklifi
          </h1>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Formu doldurun, 24 saat içinde uzman ekibimiz sizi arasın.
          </p>

          {/* Step indicators */}
          <div className="space-y-4 mb-10">
            {[
              { num: '1', label: 'Formu Doldur', desc: 'İhtiyaçlarınızı belirtin' },
              { num: '2', label: '24 Saat İçinde Dönüş', desc: 'Ekibimiz sizi arar' },
              { num: '3', label: 'Özel Fiyat Teklifi', desc: 'Size özel fiyat alın' },
            ].map((step) => (
              <div key={step.num} className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-black"
                  style={{ backgroundColor: '#F57C28', fontFamily: 'var(--font-heading)', fontSize: '18px' }}
                >
                  {step.num}
                </div>
                <div>
                  <div className="font-bold text-gray-800">{step.label}</div>
                  <div className="text-sm text-gray-500">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact boxes */}
          <div className="space-y-3">
            {[
              {
                icon: '📞',
                label: '0541 877 16 35',
                href: 'tel:05418771635',
              },
              {
                icon: '💬',
                label: 'WhatsApp ile Yaz',
                href: 'https://wa.me/905418771635',
              },
              {
                icon: '📸',
                label: '@makro.iselbisesi',
                href: 'https://instagram.com/makro.iselbisesi',
              },
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

          <p className="text-xs text-gray-400 mt-6">
            🔒 Bilgileriniz KVKK kapsamında korunur.
          </p>
        </div>

        {/* Right — Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-card">
          <Suspense>
            <QuoteForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
