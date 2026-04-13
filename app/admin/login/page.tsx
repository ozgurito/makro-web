'use client'
import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [shake, setShake] = useState(false)
  const [loggedOut, setLoggedOut] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('logout') === '1') {
      setLoggedOut(true)
      router.replace('/admin/login')
    }
  }, [searchParams, router])

  useEffect(() => {
    if (!success) return
    const t = setTimeout(() => {
      router.push('/admin')
      router.refresh()
    }, 1200)
    return () => clearTimeout(t)
  }, [success, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        setSuccess(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Hatalı şifre')
        setShake(true)
        setTimeout(() => setShake(false), 600)
        setPassword('')
      }
    } catch {
      setError('Bağlantı hatası, tekrar deneyin.')
      setShake(true)
      setTimeout(() => setShake(false), 600)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
        @keyframes successPop { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes progressBar { from{width:0%} to{width:100%} }
        .login-card { animation: fadeSlideUp .35s ease both; }
        .shake { animation: shake .5s ease; }
        .success-icon { animation: successPop .4s cubic-bezier(.34,1.56,.64,1) both; }
      `}</style>

      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', background: 'linear-gradient(135deg, #F7F8FA 0%, #EEF2F8 100%)' }}>
        <div className={`login-card${shake ? ' shake' : ''}`} style={{ width: '100%', maxWidth: 400, background: 'white', borderRadius: 24, boxShadow: '0 20px 60px rgba(15,34,64,0.12), 0 4px 16px rgba(15,34,64,0.06)', overflow: 'hidden' }}>

          <div style={{ background: 'linear-gradient(135deg, #0F2240 0%, #1A3358 100%)', padding: '32px 32px 28px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: '#F57C28', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(245,124,40,0.4)' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 900, color: 'white' }}>M</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 6 }}>Admin Paneli</div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, color: 'white', margin: 0 }}>Makro İş Elbiseleri</h1>
          </div>

          <div style={{ padding: '32px' }}>
            {loggedOut && !success && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#15803D' }}>Güvenli çıkış yapıldı</div>
                  <div style={{ fontSize: 11, color: '#22C55E' }}>Tekrar giriş yapabilirsiniz</div>
                </div>
              </div>
            )}

            {success ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div className="success-icon" style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #22C55E, #16A34A)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(34,197,94,0.35)' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div style={{ fontWeight: 800, fontSize: 18, color: '#0F2240', marginBottom: 6 }}>Giriş Başarılı!</div>
                <div style={{ fontSize: 13, color: '#8896A4' }}>Admin paneline yönlendiriliyorsunuz...</div>
                <div style={{ marginTop: 20, height: 3, borderRadius: 2, background: '#E5E7EB', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #22C55E, #16A34A)', animation: 'progressBar 1.1s ease-in-out forwards' }}/>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#6B7280', letterSpacing: '.05em', textTransform: 'uppercase', marginBottom: 8 }}>Yönetici Şifresi</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError('') }}
                      autoFocus
                      placeholder="••••••••••••"
                      required
                      style={{ width: '100%', height: 50, padding: '0 48px 0 16px', border: error ? '2px solid #EF4444' : '2px solid #E5E7EB', borderRadius: 12, fontSize: 16, outline: 'none', color: '#0F2240', transition: 'border-color .2s', boxSizing: 'border-box' }}
                      onFocus={e => { if (!error) e.target.style.borderColor = '#F57C28' }}
                      onBlur={e => { if (!error) e.target.style.borderColor = '#E5E7EB' }}
                    />
                    <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </span>
                  </div>
                </div>

                {error && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 20 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#DC2626' }}>{error}</span>
                  </div>
                )}

                <button type="submit" disabled={loading || !password} style={{ width: '100%', height: 50, background: loading ? '#6B7280' : 'linear-gradient(135deg, #0F2240 0%, #1A3358 100%)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: loading ? 'none' : '0 4px 16px rgba(15,34,64,0.25)' }}>
                  {loading ? (
                    <>
                      <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }}/>
                      Doğrulanıyor...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                      Giriş Yap
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {!success && (
            <div style={{ padding: '14px 32px 20px', borderTop: '1px solid #F3F4F6', textAlign: 'center', fontSize: 11, color: '#9CA3AF' }}>
              Makro İş Elbiseleri © 2026 — Yalnızca yetkili erişim
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default function AdminLogin() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
