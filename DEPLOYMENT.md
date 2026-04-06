# Makro İş Elbiseleri — Deploy Rehberi

## ADIM 1 — Supabase Kurulumu

1. supabase.com → New Project → Region: EU West 1 (Ireland)
2. Settings → Database → Connection Pooling
   - `DATABASE_URL`: Transaction mode (port 6543) + `?pgbouncer=true`
   - `DIRECT_URL`: Direct connection (port 5432)

## ADIM 2 — Vercel / Antigravity Deploy

1. Projeyi GitHub'a push et
2. Antigravity veya Vercel → Import repo → `makro-web`
3. Environment Variables:
   ```
   DATABASE_URL=...
   DIRECT_URL=...
   RESEND_API_KEY=...
   ADMIN_EMAIL=info@makro.com.tr
   NEXT_PUBLIC_WHATSAPP=905418771635
   NEXT_PUBLIC_PHONE=05418771635
   NEXT_PUBLIC_INSTAGRAM=makro.iselbisesi
   NEXT_PUBLIC_SITE_URL=https://makroiselbisesi.com.tr
   ```
4. Build command: `npm run build`
5. Deploy

## ADIM 3 — Veritabanı Migration

```bash
npx prisma db push
npx prisma db seed
```

## ADIM 4 — Admin (Supabase Studio)

- supabase.com → Table Editor
- `Product`, `Category`, `ProductColor`, `ProductSize`, `ProductFeature`, `ProductImage` tablolarından ürün ekle/düzenle
- `ContactSubmission` tablosundan teklif taleplerini görüntüle
- **Ayrı bir admin panel gerekmez**

## ADIM 5 — Domain

1. DNS: `CNAME` → Vercel/Antigravity URL
2. SSL otomatik aktif olur

---

## Checklist

- [ ] `.env` değerleri girildi
- [ ] `npx prisma db push` çalıştırıldı
- [ ] `npx prisma db seed` çalıştırıldı (10 ürün yüklendi)
- [ ] Teklif formu test edildi (e-mail geliyor mu?)
- [ ] WhatsApp linki test edildi
- [ ] Mobil görünüm kontrol edildi
- [ ] Lighthouse score > 90 kontrol edildi
- [ ] robots.txt /api/ bloke ediyor
