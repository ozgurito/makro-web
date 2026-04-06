import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

async function checkAuth() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin-auth')?.value
  return auth === process.env.ADMIN_SECRET
}

// PATCH — quick toggle (isActive / isFeatured / isNew)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const data: any = {}
  if (typeof body.isActive === 'boolean') data.isActive = body.isActive
  if (typeof body.isFeatured === 'boolean') data.isFeatured = body.isFeatured
  if (typeof body.isNew === 'boolean') data.isNew = body.isNew
  try {
    const updated = await prisma.product.update({ where: { id }, data })
    return NextResponse.json({ success: true, updated })
  } catch {
    return NextResponse.json({ error: 'Güncelleme başarısız' }, { status: 500 })
  }
}

// PUT — full product update
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
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

  try {
    // Delete existing relations and recreate
    await prisma.$transaction([
      prisma.productColor.deleteMany({ where: { productId: id } }),
      prisma.productSize.deleteMany({ where: { productId: id } }),
      prisma.productFeature.deleteMany({ where: { productId: id } }),
      prisma.productImage.deleteMany({ where: { productId: id } }),
    ])

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
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
    console.error('Product update error:', error)
    return NextResponse.json({ error: error.message || 'Güncelleme başarısız' }, { status: 500 })
  }
}

// DELETE — remove product
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    // Delete relations first
    await prisma.$transaction([
      prisma.productColor.deleteMany({ where: { productId: id } }),
      prisma.productSize.deleteMany({ where: { productId: id } }),
      prisma.productFeature.deleteMany({ where: { productId: id } }),
      prisma.productImage.deleteMany({ where: { productId: id } }),
    ])
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Product delete error:', error)
    return NextResponse.json({ error: error.message || 'Silme başarısız' }, { status: 500 })
  }
}
