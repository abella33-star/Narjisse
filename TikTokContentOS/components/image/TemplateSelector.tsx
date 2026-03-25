'use client'
import type { Template } from '@/lib/types'

interface Props {
  value:    Template
  onChange: (v: Template) => void
}

const TEMPLATES: { id: Template; label: string; sub: string; emoji: string }[] = [
  { id: 'thumbnail', label: 'Thumbnail TikTok', sub: '9:16 · Dark premium', emoji: '🎬' },
  { id: 'caption',   label: 'Visuel Caption',    sub: '1:1 · Texte bold',   emoji: '💥' },
]

export default function TemplateSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {TEMPLATES.map(t => {
        const active = value === t.id
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex flex-col items-center gap-1.5 py-4 px-3 rounded-xl border transition-all duration-150 ${
              active
                ? 'border-accent-gold bg-accent-gold/10 text-white'
                : 'border-border bg-card text-muted hover:border-white/20'
            }`}
          >
            <span className="text-2xl">{t.emoji}</span>
            <span className={`text-xs font-bold tracking-wide ${active ? 'text-accent-gold' : 'text-white/70'}`}>
              {t.label}
            </span>
            <span className="text-[10px] text-muted">{t.sub}</span>
          </button>
        )
      })}
    </div>
  )
}
