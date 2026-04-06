import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || ''
  const limit = Number(req.nextUrl.searchParams.get('limit') || 6)

  if (!q || q.length < 1) {
    return NextResponse.json({ results: [] })
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { shortDescription: { contains: q, mode: 'insensitive' } },
        { fabricInfo: { contains: q, mode: 'insensitive' } },
        { productCode: { contains: q, mode: 'insensitive' } },
      ]
    },
    select: {
      name: true, slug: true, coverImageUrl: true,
      category: { select: { name: true } }
    },
    take: limit,
    orderBy: { sortOrder: 'asc' }
  })

  return NextResponse.json({ results: products })
}
