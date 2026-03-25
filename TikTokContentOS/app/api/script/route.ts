import { NextRequest, NextResponse } from 'next/server'

const MOCK_SCRIPT = {
  hook: "La plupart des gens pensent que le succès est une question de chance. Ils ont tort. Complètement.",
  body: "Voici ce que personne ne t'a dit : le succès suit des règles mathématiques précises. Chaque décision que tu prends a une probabilité de succès calculable. Les gens qui réussissent ne travaillent pas plus dur — ils éliminent les variables négatives et maximisent les probabilités positives.\n\nJ'ai passé 3 ans à analyser les patterns des entrepreneurs qui génèrent plus de 10k€/mois. Et j'ai trouvé 3 règles qui reviennent systématiquement...",
  cta: "Sauvegarde cette vidéo pour y revenir. Et dis-moi en commentaire : tu appliques laquelle de ces règles ?",
  notes: "Parle face caméra, regard direct. Éclairage naturel côté fenêtre. Coupe rapide entre chaque point clé. Ajoute des sous-titres grands et contrastés.",
}

export async function POST(req: NextRequest) {
  const body = await req.json() as { topic: string; tone: string; duration: string; category: string }
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    // Return mock data so the app works without API key
    return NextResponse.json(MOCK_SCRIPT)
  }

  try {
    const { Anthropic } = await import('@anthropic-ai/sdk')
    const client = new Anthropic({ apiKey })

    const durationMap: Record<string, string> = {
      '15s': '15 secondes (environ 40 mots)',
      '30s': '30 secondes (environ 80 mots)',
      '60s': '60 secondes (environ 150 mots)',
    }

    const prompt = `Tu es un expert en contenu TikTok viral pour Leonie (@leonie.marceau3), une créatrice française dans la niche luxury lifestyle et entrepreneuriat parisien. Son style est sophistiqué, mystérieux, provocateur — elle parle de succès, de mathématiques du succès, de contrôle et de précision.

Génère un script TikTok pour le sujet suivant :
- Sujet : ${body.topic}
- Ton : ${body.tone}
- Durée cible : ${durationMap[body.duration] ?? '30 secondes'}
- Catégorie : ${body.category}

Réponds en JSON strict avec ce format :
{
  "hook": "La phrase d'accroche (5-10 mots percutants pour les 3 premières secondes)",
  "body": "Le corps du script (développement du sujet, 2-3 points clés)",
  "cta": "L'appel à l'action final (engagement commentaires ou sauvegarde)",
  "notes": "Conseils de tournage pour Leonie (angle caméra, éclairage, montage)"
}`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = (message.content[0] as { type: string; text: string }).text
    const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, ''))
    return NextResponse.json(parsed)

  } catch (err) {
    console.error('Script API error:', err)
    return NextResponse.json(MOCK_SCRIPT)
  }
}
