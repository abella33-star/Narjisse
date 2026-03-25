'use client'
import type { RefObject } from 'react'

interface Props {
  canvasRef: RefObject<HTMLCanvasElement>
  template:  'thumbnail' | 'caption'
}

export default function CanvasPreview({ canvasRef, template }: Props) {
  const isThumbnail = template === 'thumbnail'

  return (
    <div className="flex justify-center">
      <div
        className={`relative overflow-hidden rounded-xl border border-border/50 bg-black shadow-2xl ${
          isThumbnail ? 'w-[168px]' : 'w-[220px]'
        }`}
        style={{ aspectRatio: isThumbnail ? '9/16' : '1/1' }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: 'block' }}
        />
      </div>
    </div>
  )
}
