import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function checkAuth() {
  const cookieStore = await cookies()
  return cookieStore.get('admin-auth')?.value === 'authenticated'
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: 'asc' },
  })
  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const body = await req.json()
  const { name, description, imageUrl, sortOrder, isActive, seoTitle, seoDescription } = body

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Kategori adı zorunludur' }, { status: 400 })
  }

  let baseSlug = slugify(name)
  let slug = baseSlug
  let counter = 1
  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`
  }

  try {
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        description: description || null,
        imageUrl: imageUrl || null,
        sortOrder: sortOrder ? Number(sortOrder) : 0,
        isActive: isActive !== false,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
      },
    })
    return NextResponse.json({ success: true, category })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Kategori oluşturulamadı' }, { status: 500 })
  }
}
