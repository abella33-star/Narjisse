'use client'
import { useState } from 'react'
import type { ContentIdea, AgendaEntry } from '@/lib/types'
import { useWeek, formatMonth } from '@/lib/useAgenda'
import WeekGrid   from './WeekGrid'
import IdeaPicker from './IdeaPicker'

interface Props {
  agenda:    AgendaEntry[]
  ideas:     ContentIdea[]
  onAssign:  (date: string, ideaId: string) => void
  onRemove:  (date: string) => void
}

export default function AgendaTab({ agenda, ideas, onAssign, onRemove }: Props) {
  const { getWeekDays, goNext, goPrev, goNow, weekOffset } = useWeek()
  const [pickerDate, setPickerDate] = useState<string | null>(null)

  const days = getWeekDays()
  const plannedCount = days.filter(d => {
    const iso = d.toISOString().split('T')[0]
    return agenda.some(e => e.date === iso)
  }).length

  return (
    <div className="px-4 py-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl tracking-widest text-white">AGENDA</h2>
          <p className="text-xs text-muted mt-0.5 capitalize">{formatMonth(days)}</p>
        </div>
        <div className="flex items-center gap-1">
          {weekOffset !== 0 && (
            <button
              onClick={goNow}
              className="px-2 py-1 rounded-lg border border-border text-[10px] text-muted hover:text-white hover:border-white/20 transition-all"
            >
              Auj.
            </button>
          )}
          <button
            onClick={goPrev}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted hover:text-white hover:border-white/20 transition-all"
          >
            ‹
          </button>
          <button
            onClick={goNext}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted hover:text-white hover:border-white/20 transition-all"
          >
            ›
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-3">
        <div className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-center">
          <p className="font-display text-2xl text-accent-gold">{plannedCount}</p>
          <p className="text-[10px] text-muted uppercase tracking-wide">Planifiés</p>
        </div>
        <div className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-center">
          <p className="font-display text-2xl text-white">{7 - plannedCount}</p>
          <p className="text-[10px] text-muted uppercase tracking-wide">Disponibles</p>
        </div>
        <div className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-center">
          <p className="font-display text-2xl text-accent-purple">{ideas.filter(i => i.saved).length}</p>
          <p className="text-[10px] text-muted uppercase tracking-wide">En stock</p>
        </div>
      </div>

      {/* Week grid */}
      <WeekGrid
        days={days}
        entries={agenda}
        ideas={ideas}
        onAdd={date => setPickerDate(date)}
        onRemove={onRemove}
      />

      {/* Idea picker modal */}
      {pickerDate && (
        <IdeaPicker
          ideas={ideas}
          date={pickerDate}
          onPick={onAssign}
          onClose={() => setPickerDate(null)}
        />
      )}

      {/* Hint */}
      <p className="text-[10px] text-muted/50 text-center">
        Appuie sur + pour assigner une idée sauvegardée à un jour
      </p>
    </div>
  )
}
