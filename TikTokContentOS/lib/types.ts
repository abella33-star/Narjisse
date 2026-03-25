// ── Image Tab ──────────────────────────────────────────────────
export type Template    = 'thumbnail' | 'caption'
export type Category    = 'entrepreneuriat' | 'lifestyle'
export type AccentColor = 'gold' | 'orange' | 'pink' | 'green' | 'purple'

export interface ImageConfig {
  template:    Template
  category:    Category
  accentColor: AccentColor
  subject:     string
}

// ── Script Tab ─────────────────────────────────────────────────
export type ScriptDuration = '15s' | '30s' | '60s'
export type ScriptTone     = 'provocateur' | 'inspirant' | 'éducatif' | 'mystérieux'

export interface ScriptConfig {
  topic:    string
  tone:     ScriptTone
  duration: ScriptDuration
  category: Category
}

export interface ScriptResult {
  hook:  string
  body:  string
  cta:   string
  notes: string
}

// ── Ideas Tab ──────────────────────────────────────────────────
export interface ContentIdea {
  id:        string
  text:      string
  hook:      string
  category:  Category
  saved:     boolean
  createdAt: number
}

// ── Agenda Tab ─────────────────────────────────────────────────
export interface AgendaEntry {
  date:   string  // ISO "YYYY-MM-DD"
  ideaId: string
}

// ── App State ──────────────────────────────────────────────────
export type ActiveTab = 'image' | 'script' | 'ideas' | 'agenda'
