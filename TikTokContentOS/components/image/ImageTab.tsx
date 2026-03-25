'use client'
import type { ImageConfig } from '@/lib/types'
import { useImageCanvas } from '@/lib/useImageCanvas'
import TemplateSelector  from './TemplateSelector'
import CategorySelector  from './CategorySelector'
import AccentColorPicker from './AccentColorPicker'
import SubjectInput      from './SubjectInput'
import CanvasPreview     from './CanvasPreview'

interface Props {
  config:   ImageConfig
  onUpdate: (patch: Partial<ImageConfig>) => void
}

export default function ImageTab({ config, onUpdate }: Props) {
  const { canvasRef, download } = useImageCanvas(config)

  return (
    <div className="px-4 py-5 space-y-5">
      {/* Preview */}
      <CanvasPreview canvasRef={canvasRef} template={config.template} />

      {/* Template */}
      <TemplateSelector
        value={config.template}
        onChange={v => onUpdate({ template: v })}
      />

      {/* Category */}
      <CategorySelector
        value={config.category}
        onChange={v => onUpdate({ category: v })}
      />

      {/* Accent color */}
      <AccentColorPicker
        value={config.accentColor}
        onChange={v => onUpdate({ accentColor: v })}
      />

      {/* Subject */}
      <SubjectInput
        value={config.subject}
        onChange={v => onUpdate({ subject: v })}
      />

      {/* CTA */}
      <button
        onClick={download}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-accent-gold text-black font-bold text-sm tracking-widest uppercase transition-all duration-150 hover:brightness-110 active:scale-95"
      >
        🖼️ Télécharger l'image
      </button>
    </div>
  )
}
