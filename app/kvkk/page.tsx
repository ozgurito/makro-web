import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni | Makro İş Elbiseleri',
}

export default function KVKKPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1
        className="mb-8"
        style={{ fontFamily: 'var(--font-heading)', fontSize: '40px', fontWeight: 800, color: '#0F2240' }}
      >
        KVKK Aydınlatma Metni
      </h1>

      <div className="prose max-w-none text-gray-700 space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-2">1. Veri Sorumlusu</h2>
          <p>
            Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca
            Makro İş Elbiseleri tarafından hazırlanmıştır.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-2">2. Kişisel Verilerin İşlenme Amacı</h2>
          <p>
            Tarafınızdan toplanan kişisel veriler; iletişim taleplerinizin karşılanması, teklif
            süreçlerinin yönetilmesi ve sizinle iletişime geçilmesi amacıyla işlenmektedir.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-2">3. Toplanan Kişisel Veriler</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Ad, soyad</li>
            <li>E-posta adresi</li>
            <li>Telefon numarası</li>
            <li>Firma adı (opsiyonel)</li>
            <li>İletişim mesajı içeriği</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-2">4. Kişisel Verilerin Aktarımı</h2>
          <p>
            Kişisel verileriniz, yasal zorunluluklar dışında üçüncü kişilerle paylaşılmamaktadır.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-2">5. Kişisel Veri Sahibinin Hakları</h2>
          <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
            <li>Silinmesini veya yok edilmesini isteme</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-2">6. İletişim</h2>
          <p>
            Haklarınızı kullanmak veya sorularınız için:{' '}
            <a href="mailto:info@makro.com.tr" className="font-semibold" style={{ color: '#F57C28' }}>
              info@makro.com.tr
            </a>{' '}
            adresinden bize ulaşabilirsiniz.
          </p>
        </section>
      </div>
    </div>
  )
}
