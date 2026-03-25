'use client'
import { useAppState } from '@/lib/useAppState'
import TabBar    from '@/components/TabBar'
import ImageTab  from '@/components/image/ImageTab'
import ScriptTab from '@/components/script/ScriptTab'
import IdeasTab  from '@/components/ideas/IdeasTab'
import AgendaTab from '@/components/agenda/AgendaTab'

export default function Home() {
  const state = useAppState()

  return (
    <main
      className="flex flex-col bg-bg h-[100dvh] overflow-hidden relative"
      style={{ paddingTop: 'var(--sat)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-gold flex items-center justify-center text-black text-sm">
            🎬
          </div>
          <div>
            <p className="font-display text-sm tracking-wider text-white leading-none">TIKTOK CONTENT OS</p>
            <p className="text-[10px] text-muted tracking-widest uppercase leading-none mt-0.5">BY LEONIE</p>
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse-slow" />
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-y-auto scroll-zone">
        <div className="tab-content">
          {state.activeTab === 'image'  && (
            <ImageTab
              config={state.imageConfig}
              onUpdate={state.updateImageConfig}
            />
          )}
          {state.activeTab === 'script' && <ScriptTab />}
          {state.activeTab === 'ideas'  && (
            <IdeasTab
              ideas={state.ideas}
              onSave={state.saveIdea}
              onUnsave={state.unsaveIdea}
              onAdd={state.addIdeas}
            />
          )}
          {state.activeTab === 'agenda' && (
            <AgendaTab
              agenda={state.agenda}
              ideas={state.ideas}
              onAssign={state.assignIdea}
              onRemove={state.removeEntry}
            />
          )}
        </div>
      </div>

      {/* Bottom tab bar */}
      <TabBar active={state.activeTab} onChange={state.setActiveTab} />
    </main>
  )
}
