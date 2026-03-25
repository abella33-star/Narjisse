'use client'
import type { ContentIdea, AgendaEntry } from '@/lib/types'
import { formatDay, toISODate } from '@/lib/useAgenda'

interface Props {
  date:     Date
  entries:  AgendaEntry[]
  ideas:    ContentIdea[]
  onAdd:    (date: string) => void
  onRemove: (date: string) => void
}

export default function DayCell({ date, entries, ideas, onAdd, onRemove }: Props) {
  const dateStr = toISODate(date)
  const today   = toISODate(new Date())
  const isToday = dateStr === today
  const entry   = entries.find(e => e.date === dateStr)
  const idea    = entry ? ideas.find(i => i.id === entry.ideaId) : null

  return (
    <div
      className={`rounded-xl border p-2.5 flex flex-col gap-1.5 min-h-[100px] transition-all ${
        isToday ? 'border-accent-gold/50 bg-accent-gold/5' : 'border-border bg-card'
      }`}
    >
      {/* Day label */}
      <div className="flex items-center justify-between">
        <p className={`text-[10px] font-bold tracking-widest ${isToday ? 'text-accent-gold' : 'text-muted'}`}>
          {formatDay(date)}
        </p>
        <p className={`text-xs font-bold ${isToday ? 'text-accent-gold' : 'text-white/50'}`}>
          {date.getDate()}
        </p>
      </div>

      {/* Content */}
      {idea ? (
        <div className="flex-1 flex flex-col gap-1">
          <p className="text-[10px] text-white/90 leading-tight font-medium line-clamp-3">
            {idea.text}
          </p>
          <button
            onClick={() => onRemove(dateStr)}
            className="text-[9px] text-red-400/70 hover:text-red-400 mt-auto text-left transition-colors"
          >
            ✕ Retirer
          </button>
        </div>
      ) : (
        <button
          onClick={() => onAdd(dateStr)}
          className="flex-1 flex items-center justify-center text-muted hover:text-white/50 transition-colors"
        >
          <span className="text-lg">+</span>
        </button>
      )}
    </div>
  )
}
