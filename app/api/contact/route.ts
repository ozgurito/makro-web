import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// In-memory rate limiter: IP → { count, resetAt }
const contactRateLimit = new Map<string, { count: number; resetAt: number }>()
const CONTACT_WINDOW_MS = 60_000 // 1 dakika
const CONTACT_MAX = 3 // dakikada maksimum 3 gönderim

function isContactRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = contactRateLimit.get(ip)
  if (!entry || now > entry.resetAt) {
    contactRateLimit.set(ip, { count: 1, resetAt: now + CONTACT_WINDOW_MS })
    return false
  }
  entry.count++
  return entry.count > CONTACT_MAX
}

const contactSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  companyName: z.string().optional(),
  message: z.string().min(5),
  type: z.enum(['contact', 'quote']),
  productInterests: z.array(z.string()).optional(),
  quantityEstimate: z.string().optional(),
  printOption: z.string().optional(),
  specialNotes: z.string().optional(),
  website: z.string().optional(), // honeypot
})

export async function POST(request: NextRequest) {
  try {
    // IP tabanlı rate limit
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      request.headers.get('x-real-ip') ??
      'unknown'

    if (isContactRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Çok fazla istek. Lütfen 1 dakika bekleyin.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Honeypot check
    if (body.website) {
      return NextResponse.json({ success: true })
    }

    const data = contactSchema.parse(body)

    await prisma.contactSubmission.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        message: [
          data.message,
          data.productInterests?.length
            ? `\nİlgilenilen ürünler: ${data.productInterests.join(', ')}`
            : '',
          data.quantityEstimate
            ? `\nTahmini adet: ${data.quantityEstimate}`
            : '',
          data.printOption ? `\nBaskı isteği: ${data.printOption}` : '',
          data.specialNotes ? `\nÖzel notlar: ${data.specialNotes}` : '',
        ]
          .filter(Boolean)
          .join(''),
        type: data.type,
        status: 'new',
      },
    })

    const isQuote = data.type === 'quote'
    const subject = isQuote
      ? `Yeni Teklif Talebi - ${data.companyName ?? data.fullName}`
      : `Yeni İletişim Formu - ${data.companyName ?? data.fullName}`

    const fromAddress =
      process.env.RESEND_FROM ?? 'Makro İş Elbiseleri <noreply@makroiselbisesi.com.tr>'
    const adminPhone = process.env.NEXT_PUBLIC_PHONE ?? '05418771635'
    const adminPhoneFormatted = adminPhone.replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4')

    const adminHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <div style="background:#0F2240;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="color:white;margin:0;font-size:20px">${subject}</h1>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#6b7280;width:140px">Ad Soyad</td><td style="padding:8px 0;font-weight:600">${data.fullName}</td></tr>
            ${data.companyName ? `<tr><td style="padding:8px 0;color:#6b7280">Firma</td><td style="padding:8px 0;font-weight:600">${data.companyName}</td></tr>` : ''}
            <tr><td style="padding:8px 0;color:#6b7280">Telefon</td><td style="padding:8px 0"><a href="tel:${data.phone}" style="color:#F57C28">${data.phone}</a></td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">E-posta</td><td style="padding:8px 0"><a href="mailto:${data.email}" style="color:#F57C28">${data.email}</a></td></tr>
            ${data.quantityEstimate ? `<tr><td style="padding:8px 0;color:#6b7280">Tahmini Adet</td><td style="padding:8px 0">${data.quantityEstimate}</td></tr>` : ''}
            ${data.printOption ? `<tr><td style="padding:8px 0;color:#6b7280">Baskı İsteği</td><td style="padding:8px 0">${data.printOption}</td></tr>` : ''}
            ${data.productInterests?.length ? `<tr><td style="padding:8px 0;color:#6b7280">İlgilenilen Ürünler</td><td style="padding:8px 0">${data.productInterests.join(', ')}</td></tr>` : ''}
          </table>
          <div style="margin-top:16px;padding:16px;background:#f9fafb;border-radius:8px">
            <p style="color:#6b7280;font-size:12px;margin:0 0 8px">Mesaj</p>
            <p style="margin:0">${data.message}</p>
            ${data.specialNotes ? `<p style="margin:8px 0 0;color:#6b7280">${data.specialNotes}</p>` : ''}
          </div>
        </div>
      </div>
    `

    const userHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <div style="background:#0F2240;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="color:white;margin:0;font-size:20px">Talebiniz Alındı</h1>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px">
          <p>Merhaba <strong>${data.fullName}</strong>,</p>
          <p>Talebiniz alındı. En kısa sürede <a href="tel:${adminPhone}" style="color:#F57C28">${adminPhoneFormatted}</a> numaralı hattan sizi arayacağız.</p>
          <p style="color:#6b7280">Makro İş Elbiseleri Ekibi</p>
        </div>
      </div>
    `

    await Promise.allSettled([
      resend.emails.send({
        from: fromAddress,
        to: process.env.ADMIN_EMAIL!,
        subject,
        html: adminHtml,
        replyTo: data.email,
      }),
      resend.emails.send({
        from: fromAddress,
        to: data.email,
        subject: 'Talebiniz Alındı - Makro İş Elbiseleri',
        html: userHtml,
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz form verisi', details: err.issues },
        { status: 400 }
      )
    }
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}


