'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()
  const timeoutRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length < 1) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }
    clearTimeout(timeoutRef.current)
    setLoading(true)
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`)
        const data = await res.json()
        setSuggestions(data.results || [])
        setShowDropdown(true)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }, 200)
    return () => clearTimeout(timeoutRef.current)
  }, [query])

  // Dışarı tıklanınca dropdown'ı kapat
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (slug: string) => {
    setShowDropdown(false)
    setQuery('')
    setIsFocused(false)
    router.push(`/urunler/${slug}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setShowDropdown(false)
      setIsFocused(false)
      router.push(`/urunler?arama=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: 600 }}>
      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true)
              if (query.length >= 1) setShowDropdown(true)
            }}
            onBlur={() => {
              // clickOutside handler kapatsın, onBlur timeout yerine
            }}
            placeholder="Ürün veya kategori ara..."
            style={{
              width: '100%',
              height: 40,
              padding: '0 44px 0 16px',
              borderRadius: 20,
              border: isFocused ? '1px solid #F57C28' : '1px solid rgba(255,255,255,0.25)',
              background: isFocused ? '#ffffff' : 'rgba(255,255,255,0.12)',
              color: isFocused ? '#0F2240' : 'white',
              fontSize: 14,
              outline: 'none',
              transition: 'all .2s ease',
            }}
          />
          {/* Placeholder rengi için style tag — CSS override */}
          <style>{`
            input::placeholder { color: rgba(255,255,255,0.5); }
            input:focus::placeholder { color: #9BA8B5; }
          `}</style>

          <button type="submit" style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: isFocused ? '#F57C28' : 'rgba(255,255,255,0.6)',
            fontSize: 16, display: 'flex', alignItems: 'center', transition: 'color .2s'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (suggestions.length > 0 || loading) && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0, right: 0,
          background: 'white',
          borderRadius: 14,
          boxShadow: '0 12px 40px rgba(15,34,64,0.18)',
          border: '1px solid #EDE8E3',
          overflow: 'hidden',
          zIndex: 9999,
          // Yukarıdan aşağı açılma animasyonu için
          animation: 'dropdownOpen .15s ease',
        }}>
          <style>{`
            @keyframes dropdownOpen {
              from { opacity: 0; transform: translateY(-6px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {loading ? (
            <div style={{ padding: '14px 16px', color: '#8896A4', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: '50%', border: '2px solid #F57C28', borderTopColor: 'transparent', animation: 'spin .6s linear infinite' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              Aranıyor...
            </div>
          ) : (
            <>
              {suggestions.map((item, idx) => (
                <div
                  key={item.slug}
                  onClick={() => handleSelect(item.slug)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 16px', cursor: 'pointer',
                    borderBottom: idx < suggestions.length - 1 ? '1px solid #F5F5F5' : 'none',
                    transition: 'background .1s'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FFF8F4')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                >
                  {item.coverImageUrl ? (
                    <img src={item.coverImageUrl} alt={item.name} style={{ width: 38, height: 38, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                  ) : (
                    <div style={{
                      width: 38, height: 38, background: 'linear-gradient(135deg, #EEF2F8, #F7F8FA)',
                      borderRadius: 8, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 18, flexShrink: 0
                    }}>
                      {item.category?.slug?.includes('tisort') ? '👕' : item.category?.slug?.includes('sweat') ? '🧥' : item.category?.slug?.includes('pantolon') ? '👖' : '🧣'}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F2240', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: '#8896A4', marginTop: 2 }}>{item.category?.name}</div>
                  </div>
                  <span style={{ fontSize: 12, color: '#F57C28', fontWeight: 700, flexShrink: 0 }}>→</span>
                </div>
              ))}

              <div style={{ padding: '10px 16px', background: '#FAFAFA', borderTop: '1px solid #F0F0F0' }}>
                <button
                  onClick={() => { setShowDropdown(false); router.push(`/urunler?arama=${encodeURIComponent(query)}`) }}
                  style={{ background: 'none', border: 'none', color: '#F57C28', fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  &quot;{query}&quot; için tüm sonuçları gör →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
