'use client'
import { useState, useCallback } from 'react'

export function useWeek() {
  const [weekOffset, setWeekOffset] = useState(0)

  const getWeekDays = useCallback((): Date[] => {
    const today = new Date()
    const day = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - ((day + 6) % 7) + weekOffset * 7)
    monday.setHours(0, 0, 0, 0)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      return d
    })
  }, [weekOffset])

  const goNext = useCallback(() => setWeekOffset(w => w + 1), [])
  const goPrev = useCallback(() => setWeekOffset(w => w - 1), [])
  const goNow  = useCallback(() => setWeekOffset(0), [])

  return { getWeekDays, goNext, goPrev, goNow, weekOffset }
}

export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function formatDay(date: Date): string {
  return date.toLocaleDateString('fr-FR', { weekday: 'short' }).toUpperCase().replace('.', '')
}

export function formatMonth(days: Date[]): string {
  const first = days[0]
  const last  = days[6]
  const sameMonth = first.getMonth() === last.getMonth()
  if (sameMonth) {
    return first.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  }
  return `${first.toLocaleDateString('fr-FR', { month: 'short' })} — ${last.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}`
}
