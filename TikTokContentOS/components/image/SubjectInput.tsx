'use client'

interface Props {
  value:    string
  onChange: (v: string) => void
}

export default function SubjectInput({ value, onChange }: Props) {
  return (
    <div>
      <p className="text-[10px] font-bold tracking-[0.15em] text-muted uppercase mb-3">
        Sujet de la vidéo
      </p>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Ex: Mes 3 erreurs qui m'ont coûté 5000€..."
        rows={3}
        className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-muted resize-none focus:outline-none focus:border-accent-gold/50 transition-colors font-mono"
      />
    </div>
  )
}
