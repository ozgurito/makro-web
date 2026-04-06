import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Üst bant (bg-orange, py-3) */}
      <div className="py-3 text-center" style={{ backgroundColor: '#F57C28' }}>
        <p className="text-white text-sm font-bold m-0">
          🚀 Türkiye'nin Kurumsal Kıyafet Markası — Toptan Satış İçin: 0541 877 16 35
        </p>
      </div>

      {/* Ana footer (bg-navy, py-12) */}
      <div className="py-12" style={{ backgroundColor: '#0F2240' }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Sütun 1 — Marka */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div style={{ width:36, height:36, background:'#F57C28', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontFamily:'var(--font-heading)', fontSize:20, fontWeight:800, color:'white', lineHeight:1 }}>M</span>
              </div>
              <div className="flex flex-col leading-none">
                <span style={{ fontFamily:'var(--font-heading)', fontSize:18, fontWeight:800, color:'white', letterSpacing:'0.03em' }}>MAKRO</span>
                <span style={{ fontSize:9, fontWeight:700, color:'#FFA05A', letterSpacing:'0.14em', textTransform:'uppercase', marginTop: 2 }}>İş Elbiseleri</span>
              </div>
            </Link>
            <p className="text-white/60 text-sm mb-4">
              Kurumsal iş kıyafetinde güvenilir çözüm ortağınız.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/makro.iselbisesi" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          {/* Sütun 2 — Ürünler */}
          <div>
            <h4 className="text-white/40 font-bold text-sm tracking-widest uppercase mb-4">Ürünler</h4>
            <ul className="space-y-3">
              <li><Link href="/kategoriler/tisort-polo" className="text-white/70 hover:text-white text-sm transition-colors">Tişört & Polo</Link></li>
              <li><Link href="/kategoriler/sweat-kislik" className="text-white/70 hover:text-white text-sm transition-colors">Sweat & Kışlık</Link></li>
              <li><Link href="/kategoriler/polar-esofman" className="text-white/70 hover:text-white text-sm transition-colors">Polar & Eşofman</Link></li>
              <li><Link href="/kategoriler/is-pantolonu" className="text-white/70 hover:text-white text-sm transition-colors">İş Pantolonu</Link></li>
              <li><Link href="/urunler" className="text-orange-400 font-semibold hover:text-orange-300 text-sm transition-colors mt-2 inline-block">Tüm Ürünler →</Link></li>
            </ul>
          </div>

          {/* Sütun 3 — Kurumsal */}
          <div>
            <h4 className="text-white/40 font-bold text-sm tracking-widest uppercase mb-4">Kurumsal</h4>
            <ul className="space-y-3">
              <li><Link href="/hakkimizda" className="text-white/70 hover:text-white text-sm transition-colors">Hakkımızda</Link></li>
              <li><Link href="/hakkimizda" className="text-white/70 hover:text-white text-sm transition-colors">Kurumsal Çözümler</Link></li>
              <li><Link href="/urunler?baski=dtf" className="text-white/70 hover:text-white text-sm transition-colors">DTF Baskı & Nakış</Link></li>
              <li><Link href="/sss" className="text-white/70 hover:text-white text-sm transition-colors">SSS</Link></li>
              <li><Link href="/iletisim" className="text-white/70 hover:text-white text-sm transition-colors">İletişim</Link></li>
            </ul>
          </div>

          {/* Sütun 4 — İletişim */}
          <div>
            <h4 className="text-white/40 font-bold text-sm tracking-widest uppercase mb-4">İletişim</h4>
            <ul className="space-y-3 text-sm text-white/70 mb-6">
              <li><a href="tel:05418771635" className="hover:text-white transition-colors block">📞 0541 877 16 35</a></li>
              <li><a href="https://wa.me/905418771635" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors block">💬 WhatsApp ile Yaz</a></li>
              <li><a href="https://instagram.com/makro.iselbisesi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors block">📸 @makro.iselbisesi</a></li>
              <li><span className="block opacity-80">📍 Türkiye Geneli Teslimat</span></li>
            </ul>
            <Link href="/teklif-iste" className="inline-block" style={{
                background: '#F57C28', color: 'white', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 700, transition: 'background 0.2s'
            }}>
              Teklif İste →
            </Link>
          </div>
        </div>
      </div>

      {/* Alt bant (border-t border-white/10, py-4) */}
      <div className="py-4" style={{ backgroundColor: '#0A1A32' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-white/40 m-0">
            © 2026 Makro İş Elbiseleri. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-4">
            <Link href="/kvkk" className="text-white/40 hover:text-white transition-colors">
              KVKK Aydınlatma Metni
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/gizlilik" className="text-white/40 hover:text-white transition-colors">
              Gizlilik Politikası
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
