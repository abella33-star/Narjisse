'use client'
import type { ContentIdea } from '@/lib/types'

interface Props {
  ideas:    ContentIdea[]
  date:     string
  onPick:   (date: string, ideaId: string) => void
  onClose:  () => void
}

export default function IdeaPicker({ ideas, date, onPick, onClose }: Props) {
  const saved = ideas.filter(i => i.saved)

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-surface border-t border-border rounded-t-2xl max-h-[70vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        <div className="px-4 pb-2">
          <p className="font-display text-base tracking-widest text-white">CHOISIR UNE IDÉE</p>
          <p className="text-xs text-muted">Pour le {date}</p>
        </div>

        <div className="flex-1 overflow-y-auto scroll-zone px-4 pb-6 space-y-2">
          {saved.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-2xl mb-2">⭐</p>
              <p className="text-sm text-muted">Sauvegarde des idées d'abord</p>
              <p className="text-xs text-muted/60 mt-1">Onglet Idées → étoile ☆</p>
            </div>
          ) : (
            saved.map(idea => (
              <button
                key={idea.id}
                onClick={() => { onPick(date, idea.id); onClose() }}
                className="w-full text-left rounded-xl border border-border bg-card p-3 space-y-1 hover:border-accent-gold/40 transition-all active:scale-98"
              >
                <p className="text-sm font-semibold text-white leading-snug">{idea.text}</p>
                <p className="text-xs text-muted italic">"{idea.hook}"</p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
