'use client'

import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  if (!visible) return null

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const reject = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    setVisible(false)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-elevated px-6 py-4 flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-gray-600 flex-1">
          Bu site deneyiminizi geliştirmek için çerezleri kullanır.{' '}
          <a href="/kvkk" className="underline" style={{ color: '#F57C28' }}>
            Daha fazla bilgi
          </a>
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={reject}
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Reddet
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors"
            style={{ backgroundColor: '#F57C28' }}
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  )
}
