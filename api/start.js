const KEY = process.env.NM_API;

// Démarre la segmentation SAM et retourne l'ID immédiatement (pas d'attente)
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { image } = req.body;
  if (!image) return res.status(400).json({ error: 'Missing image' });

  try {
    const r = await fetch('https://api.replicate.com/v1/models/schananas/grounded_sam/predictions', {
      method: 'POST',
      headers: { 'Authorization': `Token ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: {
          image,
          prompt: 'fingernails, nails on fingers',
          box_threshold: 0.3,
          text_threshold: 0.25
        }
      })
    });
    const pred = await r.json();
    if (!pred.id) throw new Error(pred.detail || 'No prediction ID from SAM');
    return res.json({ id: pred.id });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
