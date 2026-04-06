import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6"
      style={{ backgroundColor: '#0F2240' }}
    >
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{ backgroundColor: '#F57C28' }}
      >
        <span
          className="text-white font-black text-4xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          M
        </span>
      </div>
      <h1
        className="text-white mb-2"
        style={{ fontFamily: 'var(--font-heading)', fontSize: '72px', fontWeight: 800, lineHeight: 1 }}
      >
        404
      </h1>
      <p className="text-white/60 text-lg mb-8">Aradığınız sayfa bulunamadı.</p>
      <Link
        href="/urunler"
        className="btn-primary"
      >
        Ürünlere Dön →
      </Link>
    </div>
  )
}
