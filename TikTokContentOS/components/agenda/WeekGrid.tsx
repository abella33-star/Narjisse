'use client'
import type { ContentIdea, AgendaEntry } from '@/lib/types'
import DayCell from './DayCell'

interface Props {
  days:     Date[]
  entries:  AgendaEntry[]
  ideas:    ContentIdea[]
  onAdd:    (date: string) => void
  onRemove: (date: string) => void
}

export default function WeekGrid({ days, entries, ideas, onAdd, onRemove }: Props) {
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {days.map(day => (
        <DayCell
          key={day.toISOString()}
          date={day}
          entries={entries}
          ideas={ideas}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}
