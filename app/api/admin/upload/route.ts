import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const BUCKET = 'product-images'

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin-auth')?.value
  if (auth !== 'authenticated') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Sadece JPG, PNG, WebP ve GIF dosyaları yüklenebilir.' },
      { status: 415 }
    )
  }

  // Validate file size
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'Dosya boyutu 5MB\'ı geçemez.' },
      { status: 413 }
    )
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Build a safe unique filename
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const timestamp = Date.now()
  const random = Math.random().toString(36).slice(2, 8)
  const filename = `${timestamp}-${random}.${ext}`

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    console.error('Supabase upload error:', error)
    return NextResponse.json({ error: 'Dosya yüklenemedi: ' + error.message }, { status: 500 })
  }

  const { data: publicData } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(filename)

  return NextResponse.json({ url: publicData.publicUrl })
}
