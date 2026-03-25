'use client'
import { useState, useCallback } from 'react'
import type { ScriptConfig, ScriptResult } from './types'

export function useScript() {
  const [result,  setResult]  = useState<ScriptResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const generate = useCallback(async (config: ScriptConfig) => {
    if (!config.topic.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      if (!res.ok) throw new Error('Erreur serveur')
      const data = await res.json() as ScriptResult
      setResult(data)
    } catch {
      setError('Impossible de générer le script. Réessaie.')
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return { result, loading, error, generate, reset }
}
