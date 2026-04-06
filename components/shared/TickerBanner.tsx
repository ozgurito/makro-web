'use client'

export default function TickerBanner() {
  const content = '🚚 Türkiye Geneli Toptan Teslimat  •  🎨 DTF Baskı & Nakış  •  ✏️ Firmaya Özel Tasarım  •  📦 Minimum Sipariş Bilgi: 0541 877 16 35  •  🏭 Kurumsal Anlaşma  •  🚀 Hızlı Üretim  •  '
  
  return (
    <div style={{
      background: '#F57C28',
      height: 34,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center'
    }}>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: ticker 30s linear infinite;
          white-space: nowrap;
          display: flex;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="ticker-track">
        <span style={{ fontSize:12, fontWeight:600, color:'white', letterSpacing:'.02em' }}>
          {content}{content}{content}{content}
        </span>
      </div>
    </div>
  )
}
