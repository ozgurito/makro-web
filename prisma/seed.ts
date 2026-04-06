import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const STANDARD_COLORS = [
  { colorName: 'Siyah', colorHex: '#1A1A1A' },
  { colorName: 'Gri', colorHex: '#808080' },
  { colorName: 'Lacivert', colorHex: '#1B2A6B' },
  { colorName: 'Kırmızı', colorHex: '#C0392B' },
  { colorName: 'Beyaz', colorHex: '#F5F5F5' },
]

const STANDARD_SIZES = ['S', 'M', 'L', 'XL']

async function main() {
  console.log('🌱 Seeding database...')

  // Delete existing data
  await prisma.productFeature.deleteMany()
  await prisma.productColor.deleteMany()
  await prisma.productSize.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Tişört & Polo',
        slug: 'tisort-polo',
        sortOrder: 1,
        seoTitle: 'Kurumsal Tişört & Polo | Makro İş Elbiseleri',
        seoDescription:
          'DTF baskı ve nakış seçeneğiyle bisiklet yaka ve polo yaka tişört modelleri. Toptan satış.',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sweat & Kışlık',
        slug: 'sweat-kislik',
        sortOrder: 2,
        seoTitle: 'Kurumsal Sweatshirt & Kışlık | Makro İş Elbiseleri',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Polar & Eşofman',
        slug: 'polar-esofman',
        sortOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: 'İş Pantolonu',
        slug: 'is-pantolonu',
        sortOrder: 4,
        seoTitle: 'Reflektörlü İş Pantolonu | Makro İş Elbiseleri',
      },
    }),
  ])

  const catMap: Record<string, string> = {}
  for (const cat of categories) {
    catMap[cat.slug] = cat.id
  }

  // Helper to create a product
  async function createProduct(data: {
    categorySlug: string
    name: string
    slug: string
    productCode: string
    shortDescription?: string
    fabricInfo: string
    fabricWeight?: string
    washingInstructions?: string
    hasPrintOption?: boolean
    hasEmbroideryOption?: boolean
    isFeatured?: boolean
    features: string[]
    colors?: { colorName: string; colorHex: string }[]
    seoTitle?: string
    seoDescription?: string
    sortOrder?: number
    coverImageUrl?: string
    isNew?: boolean
  }) {
    const colors = data.colors ?? STANDARD_COLORS
    await prisma.product.create({
      data: {
        categoryId: catMap[data.categorySlug],
        name: data.name,
        slug: data.slug,
        productCode: data.productCode,
        shortDescription: data.shortDescription,
        fabricInfo: data.fabricInfo,
        fabricWeight: data.fabricWeight,
        washingInstructions: data.washingInstructions,
        hasPrintOption: data.hasPrintOption ?? false,
        hasEmbroideryOption: data.hasEmbroideryOption ?? false,
        isFeatured: data.isFeatured ?? false,
        isNew: data.isNew ?? false,
        coverImageUrl: data.coverImageUrl ?? null,
        sortOrder: data.sortOrder ?? 0,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        colors: {
          create: colors.map((c) => ({ ...c })),
        },
        sizes: {
          create: STANDARD_SIZES.map((s) => ({ sizeLabel: s })),
        },
        features: {
          create: data.features.map((f, i) => ({
            featureText: f,
            sortOrder: i,
          })),
        },
      },
    })
  }

  await createProduct({
    categorySlug: 'tisort-polo',
    name: 'Bisiklet Yaka Tişört',
    slug: 'bisiklet-yaka-tisort',
    productCode: 'MKR-TS-BSK-001',
    shortDescription:
      'Compak penye kumaştan imal, DTF baskı ile firmaya özel logo uygulanabilir.',
    fabricInfo: '%100 Compak Penye',
    fabricWeight: '180–200 gr/m²',
    washingInstructions: "30°C'de ters çevirilerek yıkama. Ağartıcı kullanmayınız.",
    hasPrintOption: true,
    isFeatured: true,
    isNew: true,
    coverImageUrl: '/products/bisiklet-yaka-tisort-siyah.png',
    sortOrder: 1,
    features: [
      'Compak penye kumaş yapısı',
      'DTF baskı teknolojisi',
      'Nefes alabilen hafif kumaş',
      'Bisiklet yaka rahat kesim',
      'Firmaya özel tasarım yapılabilir',
    ],
    seoTitle: 'Bisiklet Yaka Tişört Toptan | DTF Baskılı Kurumsal Tişört - Makro',
    seoDescription:
      'Compak penye bisiklet yaka tişört, S-XL beden, 5 renk seçeneği. Toptan fiyat için 0541 877 16 35.',
  })

  await createProduct({
    categorySlug: 'tisort-polo',
    name: 'Polo Yaka Tişört',
    slug: 'polo-yaka-tisort',
    productCode: 'MKR-TS-PLO-001',
    shortDescription:
      'Pike kumaştan imal, DTF baskı ve nakış seçeneğiyle kurumsal kullanıma uygun.',
    fabricInfo: '%100 Pike (Piqué)',
    fabricWeight: '220–240 gr/m²',
    hasPrintOption: true,
    hasEmbroideryOption: true,
    isFeatured: true,
    sortOrder: 2,
    features: [
      'Pike kumaştan imal',
      'DTF baskı + nakış seçeneği',
      'Polo yaka kurumsal görünüm',
      'Dayanıklı uzun ömürlü kumaş',
      'Firmaya özel tasarım',
    ],
    seoTitle: 'Polo Yaka Tişört Toptan | Nakışlı Kurumsal Polo - Makro',
  })

  await createProduct({
    categorySlug: 'sweat-kislik',
    name: 'Bisiklet Yaka Sweatshirt',
    slug: 'bisiklet-yaka-sweatshirt',
    productCode: 'MKR-SW-BSK-001',
    fabricInfo: '%100 3 İplik Şardonlu Compak Penye',
    fabricWeight: '280–300 gr/m²',
    hasPrintOption: true,
    sortOrder: 3,
    features: [
      '3 iplik şardonlu compak penye',
      'DTF baskı teknolojisi',
      'Kalın sıcak tutan yapı',
      'Bisiklet yaka rahat kalıp',
      'Firmaya özel baskı ve tasarım',
    ],
  })

  await createProduct({
    categorySlug: 'sweat-kislik',
    name: 'Polo Yaka Sweatshirt',
    slug: 'polo-yaka-sweatshirt',
    productCode: 'MKR-SW-PLO-001',
    fabricInfo: '%100 3 İplik Şardonlu Compak Penye',
    fabricWeight: '320–340 gr/m²',
    hasPrintOption: true,
    sortOrder: 4,
    features: [
      '3 iplik şardonlu compak penye',
      'DTF baskı teknolojisi',
      'Polo yaka kurumsal görünüm',
      'Kalın sıcak dayanıklı kumaş',
      'Firmaya özel tasarım',
    ],
  })

  await createProduct({
    categorySlug: 'sweat-kislik',
    name: 'Kapşonlu Sweatshirt',
    slug: 'kapsonly-sweatshirt',
    productCode: 'MKR-SW-KPS-001',
    fabricInfo: '%100 3 İplik Şardonlu Compak Penye',
    fabricWeight: '300–320 gr/m²',
    hasPrintOption: true,
    isFeatured: true,
    coverImageUrl: '/products/kapsonlu-sweatshirt-siyah.png',
    sortOrder: 5,
    features: [
      '3 iplik şardonlu compak penye',
      'DTF baskı teknolojisi',
      'Kapşonlu soğuğa karşı koruma',
      'Kanguru cep pratik tasarım',
      'Firmaya özel baskı',
    ],
  })

  await createProduct({
    categorySlug: 'sweat-kislik',
    name: 'Yarım Zip Sweatshirt',
    slug: 'yarim-zip-sweatshirt',
    productCode: 'MKR-SW-YZP-001',
    fabricInfo: '%100 3 İplik Şardonlu Compak Penye',
    fabricWeight: '300–320 gr/m²',
    hasPrintOption: true,
    sortOrder: 6,
    features: [
      '3 iplik şardonlu compak penye',
      'Yarım fermuarlı dik yaka',
      'DTF baskı teknolojisi',
      'Rahat şık kurumsal görünüm',
      'Firmaya özel tasarım',
    ],
  })

  await createProduct({
    categorySlug: 'sweat-kislik',
    name: 'Fermuarlı Kapşonlu Hırka',
    slug: 'fermurali-kapsonly-hirka',
    productCode: 'MKR-SW-FKH-001',
    fabricInfo: '%100 3 İplik Şardonlu Compak Penye',
    fabricWeight: '300–320 gr/m²',
    hasPrintOption: true,
    sortOrder: 7,
    features: [
      'Tam fermuarlı kapşonlu tasarım',
      'Kanguru cep çift taraf cep',
      'DTF baskı teknolojisi',
      'Dört mevsim kullanıma uygun',
      'Firmaya özel tasarım',
    ],
  })

  await createProduct({
    categorySlug: 'polar-esofman',
    name: 'Polar Ceket',
    slug: 'polar-ceket',
    productCode: 'MKR-PL-CKT-001',
    shortDescription:
      'PET polar kumaştan üretilmektedir. Tam fermuarlı tasarımıyla kurumsal sahada tercih edilir.',
    fabricInfo: 'Polietilen Tereftalat (PET) Polar',
    washingInstructions: '30°C makine yıkama.',
    hasPrintOption: true,
    isFeatured: true,
    isNew: true,
    coverImageUrl: '/products/polar-ceket-siyah.png',
    sortOrder: 8,
    features: [
      'PET polar kumaş',
      'Rüzgara ve soğuğa dayanıklı',
      'Tam fermuarlı şık tasarım',
      'Firmaya özel logo baskı',
      'Çok cepli pratik kullanım',
      'Hafif ve sıcak tutan yapı',
    ],
  })

  await createProduct({
    categorySlug: 'polar-esofman',
    name: 'Eşofman Takımı',
    slug: 'esofman-takimi',
    productCode: 'MKR-ES-TKM-001',
    shortDescription:
      '3 iplik şardonlu kumaştan, üst ve alt komple takım olarak sunulmaktadır.',
    fabricInfo: '%100 3 İplik Şardonlu Compak Penye',
    fabricWeight: '280–300 gr/m²',
    hasPrintOption: true,
    sortOrder: 9,
    features: [
      'Üst + alt takım komple set',
      '3 iplik şardonlu compak penye',
      'DTF baskı teknolojisi',
      'Rahat kesim hareket özgürlüğü',
      'Firmaya özel tasarım',
    ],
  })

  await createProduct({
    categorySlug: 'is-pantolonu',
    name: 'Reflektörlü İş Pantolonu',
    slug: 'reflektorlu-is-pantolonu',
    productCode: 'MKR-PN-RFL-001',
    shortDescription:
      'Dayanıklı kargo kumaşından imal. Reflektör şeritleri ile güvenlik standartlarını karşılar.',
    fabricInfo: '%65 Polyester / %35 Pamuk Kargo',
    washingInstructions: '40°C makine yıkama.',
    hasPrintOption: true,
    isFeatured: true,
    coverImageUrl: '/products/reflektorlu-is-pantolonu-lacivert.png',
    sortOrder: 10,
    colors: [
      { colorName: 'Lacivert', colorHex: '#1B2A6B' },
      { colorName: 'Gri', colorHex: '#808080' },
    ],
    features: [
      'Dayanıklı kargo tipi kumaş',
      'Reflektör şeritli güvenlik tasarımı',
      'Çok cepli pratik kullanım',
      'Firmaya özel logo baskı',
      'Elastik bel hareket konforu',
      'Kurumsal saha kullanımına uygun',
    ],
    seoTitle:
      'Reflektörlü İş Pantolonu | Kargo Cepli Kurumsal Pantolon - Makro',
  })

  console.log('✅ Seed completed: 4 categories, 10 products')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
