'use client'
import type { ActiveTab } from '@/lib/types'

interface TabBarProps {
  active:   ActiveTab
  onChange: (tab: ActiveTab) => void
}

const TABS: { id: ActiveTab; label: string; emoji: string }[] = [
  { id: 'image',  label: 'Image',  emoji: '🖼️' },
  { id: 'script', label: 'Script', emoji: '✍️' },
  { id: 'ideas',  label: 'Idées',  emoji: '🧠' },
  { id: 'agenda', label: 'Agenda', emoji: '📅' },
]

export default function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav
      className="flex bg-surface border-t border-border"
      style={{ paddingBottom: 'var(--sab)' }}
    >
      {TABS.map(tab => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-all duration-150 ${
              isActive ? 'text-accent-gold' : 'text-muted hover:text-white/60'
            }`}
          >
            <span className="text-xl leading-none">{tab.emoji}</span>
            <span className={`text-[10px] font-semibold tracking-widest uppercase leading-none ${
              isActive ? 'text-accent-gold' : 'text-muted'
            }`}>
              {tab.label}
            </span>
            {isActive && (
              <span className="absolute bottom-[var(--sab)] h-0.5 w-8 bg-accent-gold rounded-full mt-0.5" />
            )}
          </button>
        )
      })}
    </nav>
  )
}
