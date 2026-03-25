import { NextRequest, NextResponse } from 'next/server'
import type { ContentIdea } from '@/lib/types'

const MOCK_IDEAS_ENTREPRENEURIAT: Omit<ContentIdea, 'id' | 'saved' | 'createdAt'>[] = [
  { text: "Les 3 erreurs qui m'ont coûté 5000€ en 3 mois", hook: "J'aurais aimé que quelqu'un me dise ça avant...", category: 'entrepreneuriat' },
  { text: "Pourquoi travailler plus ne te rendra pas riche", hook: "La vérité que personne ne veut entendre.", category: 'entrepreneuriat' },
  { text: "Ce que les riches font différemment le matin", hook: "Leur routine n'a rien à voir avec ce que tu crois.", category: 'entrepreneuriat' },
  { text: "Comment j'ai généré 10k€ sans diplôme", hook: "Le système t'a menti depuis le début.", category: 'entrepreneuriat' },
  { text: "Les 5 business modèles qui marchent encore en 2026", hook: "Pendant que tu cherches, eux encaissent.", category: 'entrepreneuriat' },
  { text: "Pourquoi tu es sous-payé et comment y remédier", hook: "Ton image est la raison. Voilà la solution.", category: 'entrepreneuriat' },
  { text: "La mathématique du succès : ce que personne n'enseigne", hook: "Le succès n'est pas aléatoire. C'est calculable.", category: 'entrepreneuriat' },
  { text: "Comment négocier son salaire sans stresser", hook: "3 phrases qui changent tout dans une négociation.", category: 'entrepreneuriat' },
]

const MOCK_IDEAS_LIFESTYLE: Omit<ContentIdea, 'id' | 'saved' | 'createdAt'>[] = [
  { text: "Ma routine du soir qui a changé ma vie", hook: "Je ne suis plus la même depuis que j'ai arrêté ça.", category: 'lifestyle' },
  { text: "Vivre en solo à Paris : la vérité", hook: "Tout le monde idéalise. Voilà ce que c'est vraiment.", category: 'lifestyle' },
  { text: "Ce que j'ai arrêté de faire pour être plus heureuse", hook: "La chose la plus simple qui m'a libérée.", category: 'lifestyle' },
  { text: "Mon morning routine de productivité en 45 min", hook: "Aucun réveil 5h. Aucune torture. Juste de l'efficacité.", category: 'lifestyle' },
  { text: "Pourquoi j'ai supprimé Instagram pendant 30 jours", hook: "Ce que j'ai découvert sur moi m'a choquée.", category: 'lifestyle' },
  { text: "Les livres qui ont changé ma façon de penser l'argent", hook: "3 livres. Ma relation à l'argent n'est plus la même.", category: 'lifestyle' },
  { text: "Comment j'habille mon appartement parisien pour rien", hook: "Luxe apparent. Budget réel.", category: 'lifestyle' },
  { text: "Ce que m'ont appris mes erreurs en 2025", hook: "L'année la plus dure. Aussi la plus transformatrice.", category: 'lifestyle' },
]

export async function POST(req: NextRequest) {
  const body = await req.json() as { category: string; count?: number }
  const apiKey = process.env.ANTHROPIC_API_KEY
  const count = body.count ?? 8
  const now = Date.now()

  if (!apiKey) {
    const pool = body.category === 'lifestyle' ? MOCK_IDEAS_LIFESTYLE : MOCK_IDEAS_ENTREPRENEURIAT
    const ideas: ContentIdea[] = pool.slice(0, count).map((idea, i) => ({
      ...idea,
      id: `mock-${now}-${i}`,
      saved: false,
      createdAt: now - i * 1000,
    }))
    return NextResponse.json(ideas)
  }

  try {
    const { Anthropic } = await import('@anthropic-ai/sdk')
    const client = new Anthropic({ apiKey })

    const prompt = `Tu es un expert en contenu TikTok viral pour Leonie (@leonie.marceau3), créatrice française dans la niche ${body.category === 'lifestyle' ? 'luxury lifestyle parisien' : 'entrepreneuriat et business'}.

Son style : sophistiqué, mystérieux, provocateur. Elle parle à des femmes ambitieuses qui veulent réussir financièrement et vivre une belle vie.

Génère ${count} idées de vidéos TikTok très virales pour la catégorie "${body.category}".

Réponds en JSON strict avec ce format (tableau) :
[
  {
    "text": "Titre accrocheur de la vidéo (max 70 caractères)",
    "hook": "Phrase d'accroche orale pour les 3 premières secondes",
    "category": "${body.category}"
  }
]

Chaque idée doit être originale, adaptée à son style premium et à son audience féminine ambitieuse.`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = (message.content[0] as { type: string; text: string }).text
    const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, '')) as Array<{
      text: string; hook: string; category: string
    }>

    const ideas: ContentIdea[] = parsed.map((idea, i) => ({
      id: `ai-${now}-${i}`,
      text: idea.text,
      hook: idea.hook,
      category: body.category as 'entrepreneuriat' | 'lifestyle',
      saved: false,
      createdAt: now - i * 100,
    }))

    return NextResponse.json(ideas)
  } catch (err) {
    console.error('Ideas API error:', err)
    const pool = body.category === 'lifestyle' ? MOCK_IDEAS_LIFESTYLE : MOCK_IDEAS_ENTREPRENEURIAT
    const ideas: ContentIdea[] = pool.slice(0, count).map((idea, i) => ({
      ...idea,
      id: `fallback-${now}-${i}`,
      saved: false,
      createdAt: now - i * 1000,
    }))
    return NextResponse.json(ideas)
  }
}
