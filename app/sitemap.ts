import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://makroiselbisesi.com.tr'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/urunler`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/kategoriler`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/hakkimizda`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/iletisim`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/teklif-iste`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/sss`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/kvkk`, lastModified: new Date(), priority: 0.3 },
  ]

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      prisma.category.findMany({ where: { isActive: true }, select: { slug: true, createdAt: true } }),
    ])

    const productPages: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${baseUrl}/urunler/${p.slug}`,
      lastModified: p.updatedAt,
      priority: 0.8,
    }))

    const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${baseUrl}/kategoriler/${c.slug}`,
      lastModified: c.createdAt,
      priority: 0.7,
    }))

    return [...staticPages, ...productPages, ...categoryPages]
  } catch (err) {
    console.error('[sitemap] DB hatası, sadece statik sayfalar döndürülüyor:', err)
    return staticPages
  }
}
