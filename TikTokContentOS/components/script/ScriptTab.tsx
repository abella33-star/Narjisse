'use client'
import { useScript } from '@/lib/useScript'
import ScriptForm   from './ScriptForm'
import ScriptOutput from './ScriptOutput'

export default function ScriptTab() {
  const { result, loading, error, generate, reset } = useScript()

  return (
    <div className="px-4 py-5 space-y-5">
      <div>
        <h2 className="font-display text-xl tracking-widest text-white">SCRIPT VIDÉO</h2>
        <p className="text-xs text-muted mt-0.5">Génère un script viral adapté à ton style</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {result ? (
        <ScriptOutput result={result} onReset={reset} />
      ) : (
        <ScriptForm onGenerate={generate} loading={loading} />
      )}
    </div>
  )
}
