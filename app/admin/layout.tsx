import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto my-8 flex min-h-[75vh] border border-gray-200 rounded-[20px] overflow-hidden bg-white shadow-sm">
      <aside className="w-[240px] text-white flex flex-col shrink-0" style={{ backgroundColor: '#0F2240' }}>
        <div className="p-6 font-bold text-xl tracking-widest border-b border-white/10" style={{ fontFamily: 'var(--font-heading)' }}>
          MAKRO ADMIN
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1">
          <Link href="/admin" className="block px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm font-semibold">
            🏠 Dashboard
          </Link>
          <Link href="/admin/urunler" className="block px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm font-semibold">
            👕 Ürünler
          </Link>
          <Link href="/admin/urunler/yeni" className="block px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm font-semibold text-orange-300">
            + Yeni Ürün
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto bg-gray-50">{children}</main>
    </div>
  )
}
