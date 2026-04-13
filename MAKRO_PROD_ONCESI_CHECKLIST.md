# MAKRO Web — Prod Öncesi Yapılacaklar

Bu doküman, `ozgurito/makro-web` reposu için production öncesi son hazırlık listesidir.

Repo bulguları:
- Uygulama `Next.js 16.2.1`, `React 19.2.4`, `Prisma 7.6.0`, `Supabase`, `Resend` kullanıyor.
- Build komutu: `prisma generate && next build`
- Repoda `db:push` ve `db:seed` scriptleri mevcut.
- Deploy rehberinde production için `npx prisma db push` ve `npx prisma db seed` öneriliyor.
- `/admin` koruması şu an `admin-auth` cookie değerini `ADMIN_SECRET` ile karşılaştırıyor.

---

## 1) Ortam stratejisi

### Yapılacaklar
- [ ] Ayrı bir **staging** ortamı aç
- [ ] `staging` ile `production` için ayrı env değerleri kullan
- [ ] Canlıya çıkmadan önce tüm testleri staging üzerinde tamamla
- [ ] Mümkünse `preview` deploy’ları açık tut

### Önerilen domain yapısı
- Production: `makro...`
- WWW: `www.makro...`
- Staging: `staging.makro...`

### Neden önemli?
Staging olmadan yapılan ilk canlı deploy’da veritabanı, mail, form, cache, SEO ve admin akışı aynı anda risk altına girer.

---

## 2) Veritabanı ve Prisma stratejisi

### Şu anki durum
Repoda build sırasında `prisma generate` çalışıyor ve deploy rehberinde production için `npx prisma db push` öneriliyor.

### Production için önerilen karar
`db push` yerine migration tabanlı akış kullan:
- local: migration oluştur
- repo: migration dosyalarını commit et
- prod: `npx prisma migrate deploy`

### Yapılacaklar
- [ ] `prisma/migrations` klasörünü migration history ile oluştur
- [ ] Local ortamda `npx prisma migrate dev --name init` veya uygun isimlerle migration üret
- [ ] Migration dosyalarını repoya commit et
- [ ] Production deploy pipeline’ına `npx prisma migrate deploy` ekle
- [ ] `db push` komutunu production rehberinden çıkar
- [ ] Seed’i sadece kontrollü ilk yükleme için kullan
- [ ] Seed tekrar çalışırsa veri tekrar üretip üretmediğini kontrol et
- [ ] Ürün, kategori ve form tablolarında beklenen index’leri doğrula

### Minimum kontrol komutları
```bash
npx prisma validate
npx prisma generate
npx prisma migrate status
npx prisma migrate deploy
```

### Not
`db push` hızlı prototipleme için kullanışlıdır; production’da migration history, rollback planı ve denetlenebilir değişiklik akışı daha güvenlidir.

---

## 3) Supabase production hazırlığı

### Yapılacaklar
- [ ] Production için ayrı Supabase projesi kullan
- [ ] Local/staging/prod veritabanlarını ayır
- [ ] DB bağlantı bilgilerini sadece env üzerinden ver
- [ ] Backup planını netleştir
- [ ] Kritik tablolar için düzenli export al
- [ ] Mümkünse PITR (point-in-time recovery) aç
- [ ] Restore testi yap

### Kontrol edilmesi gereken tablolar
- `Product`
- `Category`
- `ProductColor`
- `ProductSize`
- `ProductFeature`
- `ProductImage`
- `ContactSubmission`

### Ek öneri
Eğer uygulama ileride tarayıcıdan doğrudan Supabase erişimi yapacaksa, RLS/policy tarafını ayrıca gözden geçir. Şimdiden server-side erişim ile public erişimi net ayır.

---

## 4) Environment variables ve secret yönetimi

### Yapılacaklar
- [ ] Production env değerlerini sadece hosting platformunda tut
- [ ] `.env.production.example` dosyasını gerçek secret içermeden bırak
- [ ] Tüm secret’ları yeniden gözden geçir
- [ ] Güçlü ve uzun `ADMIN_SECRET` üret
- [ ] Mail API key’lerini test ortamından ayır
- [ ] Veritabanı URL’lerini doğru ortama bağla
- [ ] Secret rotation planı yaz

### Kontrol listesi
- [ ] `DATABASE_URL`
- [ ] `DIRECT_URL` varsa doğrulandı
- [ ] `ADMIN_SECRET`
- [ ] `RESEND_API_KEY`
- [ ] Site base URL değeri varsa production domain ile güncellendi
- [ ] WhatsApp / contact / catalog link env’den geliyorsa doğrulandı

### Güvenlik notu
Public repo kullandığın için GitHub secret scanning ve push protection açılması çok faydalı olur.

---

## 5) Admin güvenliği

### Şu anki risk
`/admin` middleware’i cookie içindeki `admin-auth` değerini doğrudan `ADMIN_SECRET` ile kıyaslıyor. Bu yapı küçük ölçekte çalışsa da production’da tek başına zayıf kalır.

### Minimum sertleştirme
- [ ] Cookie `HttpOnly` olsun
- [ ] Cookie `Secure` olsun
- [ ] Cookie `SameSite=Lax` veya `Strict` olsun
- [ ] Cookie’ye makul `maxAge` ver
- [ ] Login endpoint’ine rate limit ekle
- [ ] Başarısız login denemelerini logla
- [ ] Admin URL’lerini robots’tan hariç tut
- [ ] Admin oturumunu doğrudan secret paylaşımı yerine imzalı session mantığına taşı

### Daha iyi çözüm
- Şifre girişinden sonra server tarafında imzalı session oluştur
- Secret’ı doğrudan cookie değeri olarak taşımaktan kaçın
- Mümkünse ikinci adım olarak basit 2FA veya IP allowlist düşün

---

## 6) Domain, DNS ve SSL

### Yapılacaklar
- [ ] Domain satın al
- [ ] Domaini Vercel’e bağla
- [ ] Apex domain ve `www` birlikte tanımla
- [ ] Tek canonical domain seç
- [ ] Diğer domain varyasyonlarını 301 ile canonical’a yönlendir
- [ ] SSL’in otomatik aktif olduğunu doğrula
- [ ] DNS propagation tamamlanana kadar kontrol et

### Önerilen yönlendirme
- `www.domain.com` → `domain.com`
veya
- `domain.com` → `www.domain.com`

Birini seç ve her yerde aynı alan adını kullan.

---

## 7) Mail teslimatı ve form akışı

Repoda `resend` bağımlılığı var; teklif/iletişim formlarının production’da güvenilir çalışması için domain doğrulaması şart.

### Yapılacaklar
- [ ] Resend üzerinde domain veya subdomain doğrula
- [ ] SPF kaydını ekle
- [ ] DKIM kaydını ekle
- [ ] DMARC kaydını ekle
- [ ] From adresini marka domaininle kullan
- [ ] Form submit sonrası başarı ve hata mesajlarını test et
- [ ] Spam klasörü testi yap
- [ ] Aynı anda çoklu gönderimde davranışı kontrol et

### Önerilen gönderici yapısı
- `noreply@...`
- `teklif@...`
- `info@...`
- veya `send.domain.com` alt alanı

### Test senaryoları
- [ ] Formdan normal teklif gönderimi
- [ ] Boş alan validasyonu
- [ ] Çok uzun mesaj
- [ ] Aynı IP’den peş peşe istek
- [ ] Hatalı API key senaryosu

---

## 8) Uygulama güvenliği

### Yapılacaklar
- [ ] Form endpoint’lerine rate limit ekle
- [ ] Basit bot koruması ekle (honeypot / turnstile / captcha)
- [ ] Input validation server-side doğrulansın
- [ ] Hata mesajları secret sızdırmasın
- [ ] `X-Frame-Options`, `Referrer-Policy`, `Content-Security-Policy` gibi başlıkları değerlendir
- [ ] Admin ve form uçlarında gereksiz verbose log göstermemeye dikkat et
- [ ] Üçüncü parti scriptleri minimize et

### Özellikle kontrol et
- [ ] `/api` endpoint’leri public ise abuse riski var mı?
- [ ] Contact form spam’e açık mı?
- [ ] Image upload varsa dosya tipi ve boyut limiti var mı?

---

## 9) SEO ve görünürlük

Bu site satıştan çok tanıtım/katalog ağırlıklı olduğu için SEO daha da önemli.

### Yapılacaklar
- [ ] Her sayfada benzersiz `title` ve `description`
- [ ] Open Graph etiketleri
- [ ] Favicon
- [ ] `robots.txt`
- [ ] `sitemap.xml`
- [ ] Canonical URL
- [ ] 404 sayfası
- [ ] Ürün ve kategori sayfalarında anlamlı başlık yapısı
- [ ] Görseller için `alt` metinleri
- [ ] Kurumsal iletişim bilgileri net olsun

### İçerik önerileri
- [ ] Hakkımızda
- [ ] İletişim
- [ ] Katalog
- [ ] Ürün kategorileri
- [ ] Baskı / üretim / kumaş özellikleri
- [ ] Sık sorulan sorular
- [ ] Gizlilik politikası
- [ ] Çerez politikası
- [ ] KVKK / aydınlatma metni

---

## 10) Performans ve frontend kalite kontrolü

### Yapılacaklar
- [ ] Lighthouse ölç
- [ ] Mobil performansı test et
- [ ] En büyük görselleri optimize et
- [ ] `next/image` kullanımı doğru mu kontrol et
- [ ] CLS/LCP sorunlarını incele
- [ ] Font yüklemesini doğrula
- [ ] Lazy loading kontrolü yap
- [ ] Katalog PDF büyükse yükleme davranışını kontrol et

### Test cihazları
- [ ] iPhone Safari
- [ ] Android Chrome
- [ ] Masaüstü Chrome
- [ ] Masaüstü Safari/Edge mümkünse

### Sayfa bazlı test
- [ ] Ana sayfa
- [ ] Ürün listeleme
- [ ] Ürün detay
- [ ] Kategori sayfaları
- [ ] İletişim / teklif formu
- [ ] Admin login

---

## 11) İzleme, log ve hata takibi

### Yapılacaklar
- [ ] Hosting platformunda runtime logs aç
- [ ] 404 ve 500 hataları izle
- [ ] Form submit hatalarını logla
- [ ] Admin login başarısızlıklarını logla
- [ ] Web analytics aç
- [ ] Speed / performance ölçümü aç
- [ ] Mümkünse harici hata takibi ekle (ör. Sentry)

### En az izlenmesi gereken olaylar
- [ ] Form gönderildi
- [ ] Form başarısız oldu
- [ ] Admin login başarılı
- [ ] Admin login başarısız
- [ ] Kritik sayfa 500 verdi
- [ ] Mail gönderimi başarısız oldu

---

## 12) Hukuki ve kurumsal içerik

Türkiye’de kurumsal site için en azından şu sayfaları düşün:

- [ ] Gizlilik Politikası
- [ ] KVKK Aydınlatma Metni
- [ ] Çerez Politikası
- [ ] İletişim / şirket bilgileri
- [ ] Ticari unvan / adres / e-posta bilgileri

Eğer teklif topluyorsan, form verilerinin nasıl işlendiğini açıkça belirtmen iyi olur.

---

## 13) Launch öncesi son test günü

### İçerik
- [ ] Logo doğru
- [ ] Telefon numarası doğru
- [ ] WhatsApp linki doğru
- [ ] E-posta adresleri doğru
- [ ] Katalog linki doğru
- [ ] Ürün görselleri kırık değil
- [ ] Yazım hataları kontrol edildi

### Teknik
- [ ] Production build hatasız
- [ ] Migration başarıyla geçti
- [ ] Seed kontrollü çalıştı
- [ ] 404/500 sayfaları çalışıyor
- [ ] HTTPS aktif
- [ ] Redirect’ler doğru
- [ ] robots ve sitemap erişilebilir
- [ ] Form gerçekten mail gönderiyor
- [ ] Spam koruması çalışıyor

### Güvenlik
- [ ] Secret’lar repoda yok
- [ ] Admin cookie güvenli
- [ ] Rate limit var
- [ ] Güvenlik başlıkları kontrol edildi

---

## 14) Canlıya çıktıktan sonra ilk 48 saat

- [ ] Form teslimatlarını takip et
- [ ] Hata loglarını izle
- [ ] Mobil trafik davranışını izle
- [ ] En çok ziyaret edilen sayfaları incele
- [ ] SEO indexlenmesini kontrol et
- [ ] Kullanıcıdan gelen ilk geri bildirimleri topla
- [ ] Hızlı düzeltme listesi oluştur

---

## 15) Bu repo için net karar özeti

### Hemen yap
1. Production için staging aç
2. `db push` yerine `migrate deploy` akışına geç
3. Admin auth’ı session/cookie güvenliği ile sertleştir
4. Domain + canonical + SSL yapısını tamamla
5. Resend domain doğrulamasını bitir
6. Backup/PITR planı oluştur
7. Vercel logs + analytics aç
8. Secret scanning / push protection aç

### Yayına çıkmadan önce bitmiş olmalı
- [ ] DNS tamam
- [ ] SSL tamam
- [ ] Production env tamam
- [ ] Migration tamam
- [ ] Mail doğrulama tamam
- [ ] Form testi tamam
- [ ] SEO temel set tamam
- [ ] Hukuki sayfalar tamam
- [ ] Güvenlik sertleştirmeleri tamam

---

## 16) Önerilen minimum production stack kararı

### Hosting
- Vercel

### Database
- Supabase Postgres

### ORM
- Prisma + migration deploy

### Mail
- Resend + verified domain

### Observability
- Vercel Logs + Analytics
- mümkünse ek hata takibi

### Security
- Signed session cookie
- rate limit
- bot koruması
- secret scanning

---

## 17) İstersen sonraki adım olarak hazırlanabilecek ek dosyalar

1. `PRODUCTION_ENV_TEMPLATE.md`
2. `VERCEL_DEPLOY_STEPS.md`
3. `SUPABASE_PROD_SETUP.md`
4. `ADMIN_SECURITY_HARDENING.md`
5. `GO_LIVE_RUNBOOK.md`

