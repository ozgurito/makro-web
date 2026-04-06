import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const cookieStore = await cookies()
  cookieStore.delete('admin-auth')
  
  const url = new URL('/admin/login?logout=1', req.url)
  return NextResponse.redirect(url)
}
