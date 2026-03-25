'use client'
import type { ContentIdea } from '@/lib/types'

interface Props {
  idea:     ContentIdea
  onSave:   (idea: ContentIdea) => void
  onUnsave: (id: string) => void
}

export default function IdeaCard({ idea, onSave, onUnsave }: Props) {
  const toggle = () => idea.saved ? onUnsave(idea.id) : onSave(idea)

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2 transition-all duration-150 hover:border-white/20">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-white leading-snug flex-1">{idea.text}</p>
        <button
          onClick={toggle}
          className={`shrink-0 text-xl transition-all duration-150 ${
            idea.saved ? 'scale-110' : 'opacity-40 hover:opacity-80'
          }`}
          aria-label={idea.saved ? 'Retirer des favoris' : 'Sauvegarder'}
        >
          {idea.saved ? '⭐' : '☆'}
        </button>
      </div>
      <p className="text-xs text-muted italic leading-snug">"{idea.hook}"</p>
      <div className="flex items-center gap-2 pt-1">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider ${
          idea.category === 'entrepreneuriat'
            ? 'bg-accent-gold/15 text-accent-gold'
            : 'bg-accent-purple/15 text-accent-purple'
        }`}>
          {idea.category === 'entrepreneuriat' ? '💼' : '✨'} {idea.category}
        </span>
      </div>
    </div>
  )
}
