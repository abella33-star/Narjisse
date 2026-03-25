'use client'
import type { ContentIdea } from '@/lib/types'
import IdeaCard from './IdeaCard'

interface Props {
  ideas:    ContentIdea[]
  onSave:   (idea: ContentIdea) => void
  onUnsave: (id: string) => void
}

export default function SavedIdeasList({ ideas, onSave, onUnsave }: Props) {
  const saved = ideas.filter(i => i.saved)

  if (saved.length === 0) {
    return (
      <div className="rounded-xl border border-border/50 bg-surface p-6 text-center">
        <p className="text-2xl mb-2">⭐</p>
        <p className="text-sm text-muted">Aucune idée sauvegardée</p>
        <p className="text-xs text-muted/60 mt-1">Génère des idées et clique sur ☆ pour les garder</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {saved.map(idea => (
        <IdeaCard key={idea.id} idea={idea} onSave={onSave} onUnsave={onUnsave} />
      ))}
    </div>
  )
}
