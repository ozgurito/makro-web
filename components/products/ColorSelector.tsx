'use client'

import { useState } from 'react'

type Color = { id: string; colorName: string; colorHex: string }

export default function ColorSelector({ colors }: { colors: Color[] }) {
  const [selected, setSelected] = useState(colors[0]?.colorHex ?? '')

  if (colors.length === 0) return null

  const selectedColor = colors.find((c) => c.colorHex === selected)

  return (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
        RENK
        {selectedColor && (
          <span className="ml-2 text-gray-600 normal-case font-normal">
            — {selectedColor.colorName}
          </span>
        )}
      </p>
      <div className="flex flex-wrap gap-3">
        {colors.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelected(c.colorHex)}
            title={c.colorName}
            className="w-9 h-9 rounded-full transition-all"
            style={{
              backgroundColor: c.colorHex,
              outline: c.colorHex === '#F5F5F5' ? '1px solid #e5e7eb' : undefined,
              boxShadow:
                selected === c.colorHex
                  ? '0 0 0 3px #F57C28'
                  : '0 0 0 2px #e5e7eb',
            }}
          />
        ))}
      </div>
    </div>
  )
}
