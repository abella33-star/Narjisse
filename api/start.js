const KEY = 'r8_AQLguPNGCVSycdz6cnclxbfAGKVmI0n4Lb4D7';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt, image } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  try {
    const r = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions', {
      method: 'POST',
      headers: { 'Authorization': `Token ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: {
          prompt,
          image,                  // photo de la main en base64
          prompt_strength: 0.55,  // garde la main, modifie les ongles
          num_inference_steps: 28,
          guidance: 3.5,
          output_format: 'webp',
          output_quality: 90
        }
      })
    });
    const pred = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: pred.detail || JSON.stringify(pred) });
    return res.json({ id: pred.id, status: pred.status, output: pred.output });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
