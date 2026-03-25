'use client'
import { useState } from 'react'
import type { ContentIdea, Category } from '@/lib/types'
import { useIdeas } from '@/lib/useIdeas'
import IdeasForm      from './IdeasForm'
import IdeaCard       from './IdeaCard'
import SavedIdeasList from './SavedIdeasList'

interface Props {
  ideas:    ContentIdea[]
  onSave:   (idea: ContentIdea) => void
  onUnsave: (id: string) => void
  onAdd:    (ideas: ContentIdea[]) => void
}

type View = 'generate' | 'saved'

export default function IdeasTab({ ideas, onSave, onUnsave, onAdd }: Props) {
  const [view, setView] = useState<View>('generate')
  const [lastCategory, setLastCategory] = useState<Category>('entrepreneuriat')
  const { loading, error, generate } = useIdeas(onAdd)

  const handleGenerate = async (category: Category) => {
    setLastCategory(category)
    await generate(category)
  }

  const recentIdeas = ideas
    .filter(i => !i.saved)
    .slice(0, 8)
    .sort((a, b) => b.createdAt - a.createdAt)

  const savedCount = ideas.filter(i => i.saved).length

  return (
    <div className="px-4 py-5 space-y-5">
      {/* Header */}
      <div>
        <h2 className="font-display text-xl tracking-widest text-white">IDÉES CONTENU</h2>
        <p className="text-xs text-muted mt-0.5">Génère des idées virales pour ton compte</p>
      </div>

      {/* Toggle */}
      <div className="flex bg-surface rounded-xl border border-border p-1 gap-1">
        {(['generate', 'saved'] as View[]).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
              view === v
                ? 'bg-accent-gold text-black'
                : 'text-muted hover:text-white'
            }`}
          >
            {v === 'generate' ? '🧠 Générer' : `⭐ Sauvegardées (${savedCount})`}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {view === 'generate' ? (
        <>
          <IdeasForm onGenerate={handleGenerate} loading={loading} />
          {recentIdeas.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-bold tracking-[0.15em] text-muted uppercase">
                Dernières générées — {lastCategory}
              </p>
              {recentIdeas.map(idea => (
                <IdeaCard key={idea.id} idea={idea} onSave={onSave} onUnsave={onUnsave} />
              ))}
            </div>
          )}
        </>
      ) : (
        <SavedIdeasList ideas={ideas} onSave={onSave} onUnsave={onUnsave} />
      )}
    </div>
  )
}
