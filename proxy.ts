import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login') &&
    !request.nextUrl.pathname.startsWith('/api/admin/auth')
  ) {
    const auth = request.cookies.get('admin-auth')?.value
    // Cookie'de secret'ın kendisi değil, "authenticated" sabit değeri aranır.
    // Auth endpoint bu değeri set etmekten sorumludur.
    if (auth !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
