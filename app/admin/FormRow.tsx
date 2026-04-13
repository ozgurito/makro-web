'use client'

import { useState } from 'react'

type Form = {
  id: string
  createdAt: Date
  fullName: string
  companyName: string | null
  phone: string
  email: string
  message: string
  type: string
  status: string
}

export default function FormRow({ form }: { form: Form }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <tr
        className="hover:bg-gray-50 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
          {form.createdAt.toLocaleDateString('tr-TR')}
        </td>
        <td className="px-6 py-4 font-semibold text-gray-800">
          {form.fullName}
          {form.companyName && (
            <span className="block text-xs font-normal text-gray-400">{form.companyName}</span>
          )}
        </td>
        <td className="px-6 py-4 text-xs text-gray-600">
          <a href={`tel:${form.phone}`} className="block hover:text-orange-500" onClick={(e) => e.stopPropagation()}>{form.phone}</a>
          <a href={`mailto:${form.email}`} className="block hover:text-orange-500" onClick={(e) => e.stopPropagation()}>{form.email}</a>
        </td>
        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
          <p className={expanded ? '' : 'line-clamp-2'} style={{ WebkitLineClamp: expanded ? 'unset' : 2 }}>
            {form.message}
          </p>
        </td>
        <td className="px-6 py-4">
          <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
            form.type === 'quote' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {form.type === 'quote' ? 'Teklif' : 'İletişim'}
          </span>
        </td>
        <td className="px-4 py-4 text-gray-400">
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </td>
      </tr>
    </>
  )
}
