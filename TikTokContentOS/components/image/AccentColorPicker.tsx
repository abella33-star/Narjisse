'use client'
import type { AccentColor } from '@/lib/types'

interface Props {
  value:    AccentColor
  onChange: (v: AccentColor) => void
}

const COLORS: { id: AccentColor; hex: string; glow: string }[] = [
  { id: 'gold',   hex: '#D4AF37', glow: 'glow-gold' },
  { id: 'orange', hex: '#FF6B00', glow: 'glow-orange' },
  { id: 'pink',   hex: '#E91E8C', glow: 'glow-pink' },
  { id: 'green',  hex: '#00C896', glow: 'glow-green' },
  { id: 'purple', hex: '#9B59B6', glow: 'glow-purple' },
]

export default function AccentColorPicker({ value, onChange }: Props) {
  return (
    <div>
      <p className="text-[10px] font-bold tracking-[0.15em] text-muted uppercase mb-3">
        Couleur d'accent
      </p>
      <div className="flex gap-3">
        {COLORS.map(c => (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={`w-11 h-11 rounded-xl border-2 transition-all duration-150 ${
              value === c.id
                ? `border-white ${c.glow} scale-110`
                : 'border-transparent opacity-60 hover:opacity-90 hover:scale-105'
            }`}
            style={{ backgroundColor: c.hex }}
            aria-label={c.id}
          />
        ))}
      </div>
    </div>
  )
}
