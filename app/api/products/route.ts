import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const category = searchParams.get('category')
  const color = searchParams.get('color')
  const fabric = searchParams.get('fabric')
  const print = searchParams.get('print')
  const featured = searchParams.get('featured')
  const search = searchParams.get('search')
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '12'))

  const where: Record<string, unknown> = { isActive: true }

  if (category) {
    where.category = { slug: category }
  }

  if (color) {
    where.colors = { some: { colorHex: color, isAvailable: true } }
  }

  if (fabric) {
    where.fabricInfo = { contains: fabric, mode: 'insensitive' }
  }

  if (print === 'dtf') {
    where.hasPrintOption = true
  } else if (print === 'nakis') {
    where.hasEmbroideryOption = true
  }

  if (featured === 'true') {
    where.isFeatured = true
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { shortDescription: { contains: search, mode: 'insensitive' } },
      { productCode: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        colors: true,
        sizes: true,
        features: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { sortOrder: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({
    products,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  })
}
