'use client'
import type { ScriptResult } from '@/lib/types'

interface Props {
  result: ScriptResult
  onReset: () => void
}

function Section({ label, icon, content, accent }: {
  label:   string
  icon:    string
  content: string
  accent?: boolean
}) {
  return (
    <div className={`rounded-xl border p-4 space-y-2 ${
      accent ? 'border-accent-gold/30 bg-accent-gold/5' : 'border-border bg-card'
    }`}>
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <span className={`text-[10px] font-bold tracking-[0.15em] uppercase ${
          accent ? 'text-accent-gold' : 'text-muted'
        }`}>
          {label}
        </span>
      </div>
      <p className="text-sm text-white/90 leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  )
}

export default function ScriptOutput({ result, onReset }: Props) {
  const copyAll = () => {
    const text = `HOOK:\n${result.hook}\n\nCORPS:\n${result.body}\n\nCTA:\n${result.cta}`
    navigator.clipboard.writeText(text).catch(() => {})
  }

  return (
    <div className="space-y-4">
      <Section label="Hook (3 premières secondes)" icon="⚡" content={result.hook} accent />
      <Section label="Corps de la vidéo"            icon="📝" content={result.body} />
      <Section label="Appel à l'action"             icon="🎯" content={result.cta} />
      {result.notes && (
        <div className="rounded-xl border border-border/50 bg-surface p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span>🎬</span>
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted">Conseils tournage</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">{result.notes}</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={copyAll}
          className="py-3 rounded-xl border border-border bg-card text-white text-xs font-bold tracking-wide hover:border-white/30 transition-all active:scale-95"
        >
          📋 Copier tout
        </button>
        <button
          onClick={onReset}
          className="py-3 rounded-xl border border-accent-gold/30 bg-accent-gold/10 text-accent-gold text-xs font-bold tracking-wide hover:bg-accent-gold/20 transition-all active:scale-95"
        >
          🔄 Nouveau script
        </button>
      </div>
    </div>
  )
}
