'use client'
import { useState, useCallback } from 'react'
import type { ContentIdea, Category } from './types'

export function useIdeas(
  onAdd: (ideas: ContentIdea[]) => void,
) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const generate = useCallback(async (category: Category) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, count: 8 }),
      })
      if (!res.ok) throw new Error('Erreur serveur')
      const ideas = await res.json() as ContentIdea[]
      onAdd(ideas)
    } catch {
      setError('Impossible de générer les idées. Réessaie.')
    } finally {
      setLoading(false)
    }
  }, [onAdd])

  return { loading, error, generate }
}
