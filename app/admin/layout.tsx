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
          <Link href="/admin" className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm font-semibold">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Dashboard
          </Link>
          <Link href="/admin/urunler" className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm font-semibold">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>
            Ürünler
          </Link>
          <Link href="/admin/urunler/yeni" className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm font-semibold text-orange-300">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Yeni Ürün
          </Link>
          <Link href="/admin/kategoriler" className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm font-semibold">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Kategoriler
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
