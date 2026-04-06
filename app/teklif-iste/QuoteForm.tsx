'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSearchParams } from 'next/navigation'

const schema = z.object({
  fullName: z.string().min(2, 'Adınızı giriniz'),
  companyName: z.string().min(1, 'Firma adı zorunludur'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
  email: z.string().email('Geçerli bir e-posta giriniz'),
  productInterests: z.array(z.string()).optional(),
  quantityEstimate: z.string().min(1, 'Lütfen tahmini adet seçin'),
  printOption: z.string().optional(),
  specialNotes: z.string().optional(),
  website: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const CATEGORIES = ['Tişört & Polo', 'Sweat & Kışlık', 'Polar & Eşofman', 'İş Pantolonu']

export default function QuoteForm() {
  const searchParams = useSearchParams()
  const urun = searchParams.get('urun')

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (urun) {
      setValue('specialNotes', `İlgilendiğim ürün: ${urun}`)
    }
  }, [urun, setValue])

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: 'quote', message: data.specialNotes ?? '' }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: '#dcfce7' }}
        >
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Talebiniz Alındı!</h3>
        <p className="text-gray-500 mb-6">En kısa sürede sizi arayacağız.</p>
        <a
          href="https://wa.me/905418771635"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 text-white font-bold rounded-lg"
          style={{ backgroundColor: '#25D366' }}
        >
          💬 WhatsApp ile de Ulaşın
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="text" {...register('website')} className="hidden" tabIndex={-1} aria-hidden="true" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Adı Soyadı *</label>
          <input
            {...register('fullName')}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
            placeholder="Ad Soyad"
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Firma Adı *</label>
          <input
            {...register('companyName')}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
            placeholder="Firma Adı"
          />
          {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Telefon *</label>
          <input
            {...register('phone')}
            type="tel"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
            placeholder="0541 000 00 00"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">E-posta *</label>
          <input
            {...register('email')}
            type="email"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
            placeholder="ornek@firma.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">İlgilendiğiniz Ürünler</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-full cursor-pointer text-sm hover:border-orange-300 transition-colors"
            >
              <input type="checkbox" value={cat} {...register('productInterests')} className="accent-orange-500" />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tahmini Adet *</label>
          <select
            {...register('quantityEstimate')}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
          >
            <option value="">Seçiniz</option>
            {['10-50', '50-100', '100-250', '250-500', '500+'].map((q) => (
              <option key={q} value={q}>{q} adet</option>
            ))}
          </select>
          {errors.quantityEstimate && <p className="text-red-500 text-xs mt-1">{errors.quantityEstimate.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Baskı İsteği</label>
          <select
            {...register('printOption')}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
          >
            <option value="">Seçiniz</option>
            {['DTF Baskı', 'Nakış', 'İkisi de', 'Baskı Yok', 'Görüşelim'].map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Özel Notlar</label>
        <textarea
          {...register('specialNotes')}
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none"
          placeholder="Ek notlarınız..."
        />
      </div>

      {status === 'error' && (
        <p className="text-red-500 text-sm text-center">
          Bir hata oluştu. Lütfen tekrar deneyin veya WhatsApp&apos;tan yazın.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 text-white font-bold rounded-lg transition-colors disabled:opacity-60"
        style={{ backgroundColor: '#F57C28' }}
      >
        {status === 'loading' ? 'Gönderiliyor...' : 'Teklif Talebi Gönder'}
      </button>
    </form>
  )
}
