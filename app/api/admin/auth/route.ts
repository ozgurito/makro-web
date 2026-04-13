import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// In-memory rate limiter: IP → { count, resetAt }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 60_000 // 1 minute
const MAX_ATTEMPTS = 5

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  entry.count++
  if (entry.count > MAX_ATTEMPTS) return true
  return false
}

export async function POST(req: Request) {
  // Get client IP from headers (works on Vercel)
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Çok fazla deneme. 1 dakika sonra tekrar deneyin.' },
      { status: 429 }
    )
  }

  const { password } = await req.json()

  if (!password || typeof password !== 'string') {
    return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
  }

  if (password === process.env.ADMIN_SECRET) {
    const cookieStore = await cookies()
    // Cookie'ye secret'ın kendisi değil, sabit "authenticated" değeri yazılır.
    // Gerçek doğrulama yukarıda server-side yapıldı.
    cookieStore.set('admin-auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 gün
      path: '/',
    })
    console.log(`[ADMIN] Başarılı giriş — IP: ${ip}`)
    return NextResponse.json({ success: true })
  }

  // Yanlış şifrede gecikme — brute-force'u yavaşlatır
  console.warn(`[ADMIN] Başarısız giriş denemesi — IP: ${ip}`)
  await new Promise((resolve) => setTimeout(resolve, 1500))
  return NextResponse.json({ error: 'Hatalı şifre' }, { status: 401 })
}

