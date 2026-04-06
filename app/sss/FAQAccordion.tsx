'use client'

import { useState } from 'react'

type FAQ = { q: string; a: string }

export default function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-xl overflow-hidden"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-gray-800 hover:bg-gray-50 transition-colors"
          >
            <span>{faq.q}</span>
            <span
              className="text-xl transition-transform duration-200 ml-4 flex-shrink-0"
              style={{
                transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                color: '#F57C28',
              }}
            >
              +
            </span>
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
              <div className="pt-3">{faq.a}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
