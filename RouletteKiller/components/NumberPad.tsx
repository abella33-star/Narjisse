'use client'
import { useMemo } from 'react'
import { getColor } from '@/lib/constants'
import type { Spin } from '@/lib/types'

interface Props {
  onSpin:      (n: number) => void
  recentSpins: Spin[]
  disabled:    boolean
}

const TABLE_ROWS: number[][] = [
  [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
  [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
  [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
]

function vibrate() {
  try { window.navigator.vibrate(12) } catch {}
}

export default function NumberPad({ onSpin, recentSpins, disabled }: Props) {
  const lastHit  = recentSpins[recentSpins.length - 1]?.number ?? null
  const prevHits = useMemo(
    () => new Set(recentSpins.slice(-5).map(s => s.number)),
    [recentSpins]
  )

  function handleSpin(n: number) {
    if (disabled) return
    vibrate()
    onSpin(n)
  }

  function renderBtn(n: number) {
    const color  = getColor(n)
    const isLast = n === lastHit
    const isPrev = prevHits.has(n) && !isLast

    const base = 'num-btn h-full w-full'
    const cls  = isLast  ? `${base} num-hit num-${color}` :
                 isPrev  ? `${base} num-${color} opacity-60 ring-1 ring-white/20` :
                           `${base} num-${color}`

    return (
      <button
        key={n}
        className={cls}
        onClick={() => handleSpin(n)}
        disabled={disabled}
        aria-label={`Numéro ${n}`}
      >
        {n}
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-1 select-none h-full">
      {/* Zero — full width, fixed height (no aspect-square) */}
      <button
        className={`w-full h-8 rounded-lg text-sm font-black select-none active:scale-95
                    transition-transform duration-75 cursor-pointer flex items-center justify-center
                    num-zero ${lastHit === 0 ? 'num-hit' : ''}`}
        onClick={() => handleSpin(0)}
        disabled={disabled}
        aria-label="Zéro"
      >
        0
      </button>

      {/* 3-row × 12-col grid */}
      <div className="grid grid-cols-12 gap-0.5 flex-1">
        {TABLE_ROWS.map((row) =>
          row.map(n => (
            <div key={n} className="aspect-square">
              {renderBtn(n)}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
