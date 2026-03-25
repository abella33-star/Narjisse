'use client'
import { useRef, useCallback, useEffect } from 'react'
import type { ImageConfig } from './types'

const ACCENT_HEX: Record<string, string> = {
  gold:   '#D4AF37',
  orange: '#FF6B00',
  pink:   '#E91E8C',
  green:  '#00C896',
  purple: '#9B59B6',
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  maxWidth: number,
  lineHeight: number,
): string[] {
  const words = text.toUpperCase().split(' ')
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines
}

export function useImageCanvas(config: ImageConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null as unknown as HTMLCanvasElement)

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const accent = ACCENT_HEX[config.accentColor] ?? '#D4AF37'
    const isThumbnail = config.template === 'thumbnail'
    const subject = config.subject.trim() || 'VOTRE SUJET ICI'

    // Dimensions
    if (isThumbnail) {
      canvas.width  = 675
      canvas.height = 1200
    } else {
      canvas.width  = 1080
      canvas.height = 1080
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height

    // ── BACKGROUND ────────────────────────────────────────────
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, W, H)

    if (isThumbnail) {
      // Vignette radiale
      const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, H * 0.85)
      vignette.addColorStop(0, 'rgba(0,0,0,0)')
      vignette.addColorStop(1, 'rgba(0,0,0,0.7)')
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, W, H)

      // Subtle grid texture
      ctx.strokeStyle = 'rgba(255,255,255,0.03)'
      ctx.lineWidth = 1
      for (let y = 0; y < H; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }
      for (let x = 0; x < W; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }

      // ── CATEGORY BADGE ──────────────────────────────────────
      const catLabel = config.category === 'entrepreneuriat' ? '💼 ENTREPRENEURIAT' : '✨ LIFESTYLE'
      ctx.font = 'bold 28px Inter, sans-serif'
      const badgeW = ctx.measureText(catLabel).width + 40
      const badgeH = 44
      const badgeX = 36
      const badgeY = 60
      ctx.fillStyle = accent
      roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 8)
      ctx.fillStyle = '#000'
      ctx.font = 'bold 22px Inter, sans-serif'
      ctx.textBaseline = 'middle'
      ctx.fillText(catLabel, badgeX + 20, badgeY + badgeH / 2)

      // ── MAIN SUBJECT TEXT ────────────────────────────────────
      ctx.font = `bold 100px "Bebas Neue", Impact, sans-serif`
      ctx.textBaseline = 'alphabetic'
      const lines = wrapText(ctx, subject, W / 2, W - 80, 110)
      const totalH = lines.length * 110
      const startY = H / 2 - totalH / 2 + 40

      lines.forEach((line, i) => {
        const y = startY + i * 110
        // Text shadow
        ctx.fillStyle = 'rgba(0,0,0,0.6)'
        ctx.textAlign = 'center'
        ctx.fillText(line, W / 2 + 3, y + 3)
        // Accent color text
        ctx.fillStyle = accent
        ctx.fillText(line, W / 2, y)
      })

      // ── BOTTOM ACCENT LINE ───────────────────────────────────
      ctx.fillStyle = accent
      ctx.fillRect(0, H - 8, W, 8)

      // ── WATERMARK ────────────────────────────────────────────
      ctx.font = '28px "Bebas Neue", Impact, sans-serif'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'bottom'
      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      ctx.fillText('@leonie.marceau3', W - 36, H - 28)

    } else {
      // ── VISUEL CAPTION (1:1) ─────────────────────────────────
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, W, H)

      // Noise texture overlay (simulated)
      for (let i = 0; i < 8000; i++) {
        const x = Math.random() * W
        const y = Math.random() * H
        const a = Math.random() * 0.04
        ctx.fillStyle = `rgba(255,255,255,${a})`
        ctx.fillRect(x, y, 1, 1)
      }

      // Accent border
      ctx.strokeStyle = accent
      ctx.lineWidth = 12
      ctx.strokeRect(6, 6, W - 12, H - 12)

      // Inner border line (thinner)
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      ctx.lineWidth = 1
      ctx.strokeRect(26, 26, W - 52, H - 52)

      // ── MAIN SUBJECT TEXT ────────────────────────────────────
      ctx.font = `bold 130px "Bebas Neue", Impact, sans-serif`
      ctx.textBaseline = 'alphabetic'
      ctx.textAlign = 'center'
      const lines = wrapText(ctx, subject, W / 2, W - 120, 140)
      const totalH = lines.length * 140
      const startY = H / 2 - totalH / 2 + 50

      lines.forEach((line, i) => {
        const y = startY + i * 140
        // Drop shadow
        ctx.fillStyle = 'rgba(0,0,0,0.8)'
        ctx.fillText(line, W / 2 + 4, y + 4)
        // Main text in accent
        ctx.fillStyle = accent
        ctx.fillText(line, W / 2, y)
      })

      // ── CATEGORY LABEL ───────────────────────────────────────
      ctx.font = 'bold 32px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'alphabetic'
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      const catLabel = config.category === 'entrepreneuriat' ? 'ENTREPRENEURIAT' : 'LIFESTYLE'
      ctx.fillText(catLabel, W / 2, H - 80)

      // ── ACCENT DOT ───────────────────────────────────────────
      ctx.fillStyle = accent
      ctx.beginPath()
      ctx.arc(W / 2, H - 48, 6, 0, Math.PI * 2)
      ctx.fill()

      // ── WATERMARK ────────────────────────────────────────────
      ctx.font = '26px "Bebas Neue", Impact, sans-serif'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'bottom'
      ctx.fillStyle = 'rgba(255,255,255,0.12)'
      ctx.fillText('@leonie.marceau3', W - 44, H - 44)
    }
  }, [config])

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  const download = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const isThumbnail = config.template === 'thumbnail'
    const filename = `leonie-${isThumbnail ? 'thumbnail' : 'caption'}-${Date.now()}.png`
    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [config.template])

  return { canvasRef, download }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  ctx.fill()
}
