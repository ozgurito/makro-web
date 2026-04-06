import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

// Renk bilgileri (görsel adı → renk bilgisi)
const COLOR_MAP: Record<string, { name: string; hex: string }> = {
  siyah:   { name: 'Siyah',    hex: '#1A1A1A' },
  beyaz:   { name: 'Beyaz',    hex: '#F5F5F5' },
  gri:     { name: 'Gri',      hex: '#808080' },
  kirmizi: { name: 'Kırmızı',  hex: '#C0392B' },
  mavi:    { name: 'Mavi',     hex: '#1B4F9E' },
  sari:    { name: 'Sarı',     hex: '#E8B800' },
  lacivert:{ name: 'Lacivert', hex: '#1B2A6B' },
}

// Her ürün için: slug → { klasör adı, renk listesi, cover rengi }
const PRODUCTS: Record<string, {
  folder: string
  colors: string[]   // görsel dosya adları (renksiz)
  cover: string      // cover için kullanılacak görsel
}> = {
  'bisiklet-yaka-tisort': {
    folder: 'bisiklet-yaka-tisort',
    colors: ['siyah', 'beyaz', 'gri', 'kirmizi', 'mavi', 'sari'],
    cover: 'siyah',
  },
  'polo-yaka-tisort': {
    folder: 'polo-yaka-tisort',
    colors: ['siyah', 'beyaz', 'gri', 'kirmizi', 'mavi', 'sari'],
    cover: 'siyah',
  },
  'bisiklet-yaka-sweatshirt': {
    folder: 'bisiklet-yaka-sweatshirt',
    colors: ['siyah', 'beyaz', 'gri', 'kirmizi', 'mavi', 'sari'],
    cover: 'siyah',
  },
  'polo-yaka-sweatshirt': {
    folder: 'polo-yaka-sweatshirt',
    colors: ['siyah', 'beyaz', 'gri', 'kirmizi', 'mavi', 'sari'],
    cover: 'siyah',
  },
  'kapsonly-sweatshirt': {
    folder: 'kapsonly-sweatshirt',
    colors: ['siyah', 'beyaz', 'gri', 'kirmizi', 'mavi', 'sari'],
    cover: 'siyah',
  },
  'yarim-zip-sweatshirt': {
    folder: 'yarim-zip-sweatshirt',
    colors: ['siyah', 'beyaz'],
    cover: 'siyah',
  },
  'fermurali-kapsonly-hirka': {
    folder: 'fermurali-kapsonly-hirka',
    colors: ['siyah', 'beyaz'],
    cover: 'siyah',
  },
  'polar-ceket': {
    folder: 'polar-ceket',
    colors: ['siyah', 'beyaz', 'gri', 'kirmizi', 'mavi', 'sari'],
    cover: 'siyah',
  },
  'esofman-takimi': {
    folder: 'esofman-takimi',
    colors: ['siyah', 'beyaz', 'gri', 'kirmizi', 'mavi', 'sari'],
    cover: 'siyah',
  },
  'reflektorlu-is-pantolonu': {
    folder: 'reflektorlu-is-pantolonu',
    colors: ['lacivert', 'gri'],
    cover: 'lacivert',
  },
}

async function main() {
  console.log('🖼️  Görseller ve renkler güncelleniyor...')

  for (const [slug, config] of Object.entries(PRODUCTS)) {
    const product = await prisma.product.findUnique({ where: { slug } })
    if (!product) {
      console.warn(`⚠️  Ürün bulunamadı: ${slug}`)
      continue
    }

    const coverUrl = `/urunler/${config.folder}/${config.cover}.png`

    // coverImageUrl güncelle
    await prisma.product.update({
      where: { slug },
      data: { coverImageUrl: coverUrl },
    })

    // Mevcut renkleri ve görselleri temizle
    await prisma.productColor.deleteMany({ where: { productId: product.id } })
    await prisma.productImage.deleteMany({ where: { productId: product.id } })

    // Renkleri ve görselleri yeniden oluştur
    for (let i = 0; i < config.colors.length; i++) {
      const colorKey = config.colors[i]
      const colorInfo = COLOR_MAP[colorKey]
      const imageUrl = `/urunler/${config.folder}/${colorKey}.png`
      const isCover = colorKey === config.cover

      await prisma.productColor.create({
        data: {
          productId: product.id,
          colorName: colorInfo.name,
          colorHex: colorInfo.hex,
          isAvailable: true,
        },
      })

      await prisma.productImage.create({
        data: {
          productId: product.id,
          imageUrl,
          altText: `${product.name} - ${colorInfo.name}`,
          sortOrder: i,
          isCover,
        },
      })
    }

    console.log(`✅ ${product.name} → ${config.colors.length} renk, cover: ${coverUrl}`)
  }

  console.log('\n🎉 Tüm güncellemeler tamamlandı!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
