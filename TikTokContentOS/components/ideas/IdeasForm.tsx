'use client'
import { useState } from 'react'
import type { Category } from '@/lib/types'

interface Props {
  onGenerate: (category: Category) => void
  loading:    boolean
}

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: 'entrepreneuriat', label: 'Entrepreneuriat', emoji: '💼' },
  { id: 'lifestyle',       label: 'Lifestyle',       emoji: '✨' },
]

export default function IdeasForm({ onGenerate, loading }: Props) {
  const [category, setCategory] = useState<Category>('entrepreneuriat')

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold tracking-wide transition-all ${
              category === c.id
                ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                : 'border-border bg-card text-muted hover:border-white/20'
            }`}
          >
            <span>{c.emoji}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => onGenerate(category)}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-accent-gold text-black font-bold text-sm tracking-widest uppercase transition-all duration-150 disabled:opacity-40 hover:brightness-110 active:scale-95"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            Génération...
          </>
        ) : (
          <>🧠 Générer 8 idées</>
        )}
      </button>
    </div>
  )
}
