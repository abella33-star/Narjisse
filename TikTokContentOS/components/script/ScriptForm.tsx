'use client'
import { useState } from 'react'
import type { ScriptConfig, ScriptTone, ScriptDuration, Category } from '@/lib/types'

interface Props {
  onGenerate: (config: ScriptConfig) => void
  loading:    boolean
}

const TONES: { id: ScriptTone; label: string; emoji: string }[] = [
  { id: 'provocateur', label: 'Provocateur', emoji: '🔥' },
  { id: 'inspirant',   label: 'Inspirant',   emoji: '✨' },
  { id: 'éducatif',    label: 'Éducatif',    emoji: '📚' },
  { id: 'mystérieux',  label: 'Mystérieux',  emoji: '🌙' },
]

const DURATIONS: { id: ScriptDuration; label: string }[] = [
  { id: '15s', label: '15s' },
  { id: '30s', label: '30s' },
  { id: '60s', label: '60s' },
]

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'entrepreneuriat', label: 'Entrepreneuriat' },
  { id: 'lifestyle',       label: 'Lifestyle' },
]

export default function ScriptForm({ onGenerate, loading }: Props) {
  const [topic,    setTopic]    = useState('')
  const [tone,     setTone]     = useState<ScriptTone>('provocateur')
  const [duration, setDuration] = useState<ScriptDuration>('30s')
  const [category, setCategory] = useState<Category>('entrepreneuriat')

  const handleSubmit = () => {
    if (!topic.trim() || loading) return
    onGenerate({ topic, tone, duration, category })
  }

  return (
    <div className="space-y-5">
      {/* Topic */}
      <div>
        <p className="text-[10px] font-bold tracking-[0.15em] text-muted uppercase mb-2">
          Sujet de la vidéo
        </p>
        <textarea
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="Ex: Comment j'ai gagné 3000€ en une semaine..."
          rows={3}
          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-muted resize-none focus:outline-none focus:border-accent-gold/50 transition-colors"
        />
      </div>

      {/* Category */}
      <div>
        <p className="text-[10px] font-bold tracking-[0.15em] text-muted uppercase mb-2">
          Catégorie
        </p>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`py-2.5 rounded-xl border text-xs font-bold tracking-wide transition-all ${
                category === c.id
                  ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                  : 'border-border bg-card text-muted hover:border-white/20'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tone */}
      <div>
        <p className="text-[10px] font-bold tracking-[0.15em] text-muted uppercase mb-2">
          Ton
        </p>
        <div className="grid grid-cols-2 gap-2">
          {TONES.map(t => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={`flex items-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                tone === t.id
                  ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                  : 'border-border bg-card text-muted hover:border-white/20'
              }`}
            >
              <span>{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <p className="text-[10px] font-bold tracking-[0.15em] text-muted uppercase mb-2">
          Durée
        </p>
        <div className="grid grid-cols-3 gap-2">
          {DURATIONS.map(d => (
            <button
              key={d.id}
              onClick={() => setDuration(d.id)}
              className={`py-2.5 rounded-xl border text-sm font-bold tracking-wider transition-all ${
                duration === d.id
                  ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                  : 'border-border bg-card text-muted hover:border-white/20'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!topic.trim() || loading}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed bg-accent-gold text-black hover:brightness-110 active:scale-95"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            Génération...
          </>
        ) : (
          <>✍️ Générer le script</>
        )}
      </button>
    </div>
  )
}
