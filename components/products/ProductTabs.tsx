'use client'

import { useState } from 'react'

type Product = {
  longDescription?: string | null
  fabricInfo?: string | null
  fabricWeight?: string | null
  washingInstructions?: string | null
  hasPrintOption: boolean
  hasEmbroideryOption: boolean
  features: { featureText: string }[]
}

export default function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState(0)

  const tabs = ['Ürün Özellikleri', 'Kumaş & Bakım', 'Kurumsal Kullanım']

  return (
    <div className="mt-16 border-t border-gray-100 pt-12">
      {/* Tab buttons */}
      <div className="flex gap-1 border-b border-gray-200 mb-8">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActive(i)}
            className="px-5 py-3 text-sm font-bold border-b-2 transition-colors"
            style={{
              borderBottomColor: active === i ? '#F57C28' : 'transparent',
              color: active === i ? '#F57C28' : '#6B7280',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {active === 0 && (
        <div>
          {product.longDescription && (
            <p className="text-gray-600 leading-relaxed mb-6">{product.longDescription}</p>
          )}
          <ul className="space-y-2">
            {product.features.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: '#F57C28' }}
                >
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-sm text-gray-700">{f.featureText}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {active === 1 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Kumaş', value: product.fabricInfo },
            { label: 'Gramaj', value: product.fabricWeight },
            { label: 'Yıkama', value: product.washingInstructions },
            {
              label: 'Baskı',
              value: product.hasPrintOption
                ? product.hasEmbroideryOption
                  ? 'DTF Baskı + Nakış'
                  : 'DTF Baskı ✓'
                : product.hasEmbroideryOption
                ? 'Nakış ✓'
                : '—',
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-gray-50 rounded-xl p-4"
            >
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">
                {item.label}
              </div>
              <div className="text-sm font-semibold text-gray-800">
                {item.value ?? '—'}
              </div>
            </div>
          ))}
        </div>
      )}

      {active === 2 && (
        <div className="prose max-w-none text-gray-600 text-sm leading-relaxed">
          <p>
            Makro İş Elbiseleri ürünleri kurumsal kimliğinizi güçlendirecek şekilde
            tasarlanmıştır. Ürünlerimiz hastane, fabrika, inşaat, güvenlik, temizlik ve
            hizmet sektörlerinde yaygın olarak kullanılmaktadır.
          </p>
          <ul className="mt-4 space-y-2">
            {[
              'Minimum 10 adet siparişten itibaren toptan fiyat uygulanır.',
              'Firmanıza özel DTF baskı veya nakış uygulaması yapılabilir.',
              'Kurumsal renk ve tasarım isteklerinize göre özel üretim yapılmaktadır.',
              'Büyük beden talepleri için lütfen bizimle iletişime geçin.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span style={{ color: '#F57C28' }}>→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
