'use client'
import { useState, useCallback } from 'react'
import type { ActiveTab, ImageConfig, ContentIdea, AgendaEntry } from './types'
import { storage } from './storage'

const DEFAULT_IMAGE_CONFIG: ImageConfig = {
  template:    'thumbnail',
  category:    'entrepreneuriat',
  accentColor: 'gold',
  subject:     '',
}

export function useAppState() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('image')

  // Image
  const [imageConfig, setImageConfig] = useState<ImageConfig>(DEFAULT_IMAGE_CONFIG)
  const updateImageConfig = useCallback((patch: Partial<ImageConfig>) => {
    setImageConfig(prev => ({ ...prev, ...patch }))
  }, [])

  // Ideas (loaded lazily from localStorage)
  const [ideas, setIdeas] = useState<ContentIdea[]>(() => storage.loadIdeas())
  const saveIdea = useCallback((idea: ContentIdea) => {
    setIdeas(prev => {
      const next = prev.some(i => i.id === idea.id)
        ? prev.map(i => i.id === idea.id ? { ...i, saved: true } : i)
        : [...prev, { ...idea, saved: true }]
      storage.saveIdeas(next)
      return next
    })
  }, [])
  const unsaveIdea = useCallback((id: string) => {
    setIdeas(prev => {
      const next = prev.filter(i => i.id !== id)
      storage.saveIdeas(next)
      return next
    })
  }, [])
  const addIdeas = useCallback((newIdeas: ContentIdea[]) => {
    setIdeas(prev => {
      const next = [...newIdeas, ...prev]
      storage.saveIdeas(next)
      return next
    })
  }, [])

  // Agenda
  const [agenda, setAgenda] = useState<AgendaEntry[]>(() => storage.loadAgenda())
  const assignIdea = useCallback((date: string, ideaId: string) => {
    setAgenda(prev => {
      const next = [...prev.filter(e => e.date !== date), { date, ideaId }]
      storage.saveAgenda(next)
      return next
    })
  }, [])
  const removeEntry = useCallback((date: string) => {
    setAgenda(prev => {
      const next = prev.filter(e => e.date !== date)
      storage.saveAgenda(next)
      return next
    })
  }, [])

  return {
    activeTab, setActiveTab,
    imageConfig, updateImageConfig,
    ideas, saveIdea, unsaveIdea, addIdeas,
    agenda, assignIdea, removeEntry,
  }
}
