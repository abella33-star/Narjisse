import type { ContentIdea, AgendaEntry } from './types'

const KEYS = {
  ideas:  'leonie_ideas',
  agenda: 'leonie_agenda',
} as const

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or unavailable
  }
}

export const storage = {
  loadIdeas:   (): ContentIdea[]  => safeGet(KEYS.ideas,  []),
  saveIdeas:   (ideas: ContentIdea[]) => safeSet(KEYS.ideas, ideas),
  loadAgenda:  (): AgendaEntry[]  => safeGet(KEYS.agenda, []),
  saveAgenda:  (agenda: AgendaEntry[]) => safeSet(KEYS.agenda, agenda),
}
