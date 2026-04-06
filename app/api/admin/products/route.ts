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
  const auth = cookieStore.get('admin-auth')?.value
  return auth === process.env.ADMIN_SECRET
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const body = await req.json()
  const {
    name, categoryId, productCode, shortDescription, longDescription,
    coverImageUrl, fabricInfo, fabricWeight, washingInstructions,
    hasPrintOption, hasEmbroideryOption, isFeatured, isNew, isActive,
    sortOrder, colors, sizes, features, galleryImages,
  } = body

  if (!name || !categoryId) {
    return NextResponse.json({ error: 'Ad ve kategori zorunludur' }, { status: 400 })
  }

  // Generate unique slug
  let baseSlug = slugify(name)
  let slug = baseSlug
  let counter = 1
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        categoryId,
        productCode: productCode || null,
        shortDescription: shortDescription || null,
        longDescription: longDescription || null,
        coverImageUrl: coverImageUrl || null,
        fabricInfo: fabricInfo || null,
        fabricWeight: fabricWeight ? Number(fabricWeight) : null,
        washingInstructions: washingInstructions || null,
        hasPrintOption: Boolean(hasPrintOption),
        hasEmbroideryOption: Boolean(hasEmbroideryOption),
        isFeatured: Boolean(isFeatured),
        isNew: Boolean(isNew),
        isActive: isActive !== false,
        sortOrder: sortOrder ? Number(sortOrder) : 0,
        colors: colors?.length
          ? { create: colors.map((c: any) => ({ colorName: c.name, colorHex: c.hex, isAvailable: true })) }
          : undefined,
        sizes: sizes?.length
          ? { create: sizes.map((s: string) => ({ sizeLabel: s, isAvailable: true })) }
          : undefined,
        features: features?.length
          ? { create: features.map((f: string, i: number) => ({ featureText: f, sortOrder: i })) }
          : undefined,
        images: galleryImages?.length
          ? { create: galleryImages.map((img: any, i: number) => ({ imageUrl: img.url, altText: img.altText || null, isCover: Boolean(img.isCover), sortOrder: i })) }
          : undefined,
      },
    })
    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error('Product create error:', error)
    return NextResponse.json({ error: error.message || 'Ürün oluşturulamadı' }, { status: 500 })
  }
}
