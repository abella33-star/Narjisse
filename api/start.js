const KEY = Buffer.from('cjhfS0xhUXZQcXhxcjlhaXRwY0RjSzlWM3E3MW9Ld3ZjODJWZVYycw==', 'base64').toString();

// Utilise flux-dev img2img avec prompt_strength bas pour préserver la main
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { image, prompt } = req.body;
  if (!image || !prompt) return res.status(400).json({ error: 'Missing image or prompt' });

  try {
    const r = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions', {
      method: 'POST',
      headers: { 'Authorization': `Token ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: {
          image,
          prompt,
          prompt_strength: 0.45,
          num_inference_steps: 28,
          guidance: 3.5,
          output_format: 'webp',
          output_quality: 90
        }
      })
    });
    const pred = await r.json();
    if (!pred.id) throw new Error(pred.detail || JSON.stringify(pred));
    return res.json({ id: pred.id });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
