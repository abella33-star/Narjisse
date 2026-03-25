'use client'
import type { Category } from '@/lib/types'

interface Props {
  value:    Category
  onChange: (v: Category) => void
}

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: 'entrepreneuriat', label: 'Entrepreneuriat', emoji: '💼' },
  { id: 'lifestyle',       label: 'Lifestyle',       emoji: '✨' },
]

export default function CategorySelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {CATEGORIES.map(c => {
        const active = value === c.id
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-sm tracking-wide transition-all duration-150 ${
              active
                ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                : 'border-border bg-card text-muted hover:border-white/20 hover:text-white/60'
            }`}
          >
            <span>{c.emoji}</span>
            <span>{c.label}</span>
          </button>
        )
      })}
    </div>
  )
}
