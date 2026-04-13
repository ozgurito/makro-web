import type { Metadata } from 'next'
import { Barlow_Condensed, Nunito_Sans } from 'next/font/google'
import { unstable_cache } from 'next/cache'
import './globals.css'
import { prisma } from '@/lib/prisma'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import TickerBanner from '@/components/shared/TickerBanner'
import WhatsAppFloat from '@/components/shared/WhatsAppFloat'
import CookieConsent from '@/components/shared/CookieConsent'

const barlowCondensed = Barlow_Condensed({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
})

const nunitoSans = Nunito_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Makro İş Elbiseleri',
    template: '%s | Makro İş Elbiseleri',
  },
  description:
    'Kurumsal iş kıyafetlerinde güvenilir çözüm ortağınız. Tişört, sweatshirt, polar ceket ve iş pantolonu. DTF baskı ve nakış. Toptan satış, Türkiye geneli teslimat.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://makroiselbisesi.com.tr'
  ),
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Makro İş Elbiseleri',
    title: 'Makro İş Elbiseleri — Kurumsal İş Kıyafetleri',
    description:
      'Kurumsal iş kıyafetlerinde güvenilir çözüm ortağınız. DTF baskı ve nakış. Toptan satış, Türkiye geneli teslimat.',
    images: [
      {
        url: '/logo.webp',
        width: 800,
        height: 600,
        alt: 'Makro İş Elbiseleri Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Makro İş Elbiseleri',
    description: 'Kurumsal iş kıyafetlerinde güvenilir çözüm ortağınız.',
    images: ['/logo.webp'],
  },
}

const getNavCategories = unstable_cache(
  () => prisma.category.findMany({
    where: { isActive: true },
    include: { _count: { select: { products: true } }, products: { select: { name: true, slug: true }, take: 10 } },
    orderBy: { sortOrder: 'asc' },
  }),
  ['nav-categories'],
  { revalidate: 60 }
)

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const categories = await getNavCategories().catch(() => [])

  return (
    <html
      lang="tr"
      className={`${barlowCondensed.variable} ${nunitoSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <TickerBanner />
        <Header categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <CookieConsent />
      </body>
    </html>
  )
}
