import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

async function checkAuth() {
  const cookieStore = await cookies()
  return cookieStore.get('admin-auth')?.value === 'authenticated'
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const { name, description, imageUrl, sortOrder, isActive, seoTitle, seoDescription } = body

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Kategori adı zorunludur' }, { status: 400 })
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description || null,
        imageUrl: imageUrl || null,
        sortOrder: sortOrder ? Number(sortOrder) : 0,
        isActive: Boolean(isActive),
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
      },
    })
    return NextResponse.json({ success: true, category })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Güncellenemedi' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const { id } = await params

  // Bağlı ürün varsa silme
  const productCount = await prisma.product.count({ where: { categoryId: id } })
  if (productCount > 0) {
    return NextResponse.json(
      { error: `Bu kategoriye bağlı ${productCount} ürün var. Önce ürünleri taşıyın veya silin.` },
      { status: 409 }
    )
  }

  try {
    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Silinemedi' }, { status: 500 })
  }
}
