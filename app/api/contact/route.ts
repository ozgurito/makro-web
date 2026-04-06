import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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
          <p>Talebiniz alındı. En kısa sürede <a href="tel:05418771635" style="color:#F57C28">0541 877 16 35</a> numaralı hattan sizi arayacağız.</p>
          <p style="color:#6b7280">Makro İş Elbiseleri Ekibi</p>
        </div>
      </div>
    `

    await Promise.allSettled([
      resend.emails.send({
        from: 'Makro İş Elbiseleri <noreply@makroiselbisesi.com.tr>',
        to: process.env.ADMIN_EMAIL!,
        subject,
        html: adminHtml,
        replyTo: data.email,
      }),
      resend.emails.send({
        from: 'Makro İş Elbiseleri <noreply@makroiselbisesi.com.tr>',
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
