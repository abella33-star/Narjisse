const KEY = Buffer.from('cjhfS0xhUXZQcXhxcjlhaXRwY0RjSzlWM3E3MW9Ld3ZjODJWZVYycw==', 'base64').toString();

// Inpainting avec flux-fill-dev : modifie uniquement la zone masquée (ongles)
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { image, mask, prompt } = req.body;
  if (!image || !prompt) return res.status(400).json({ error: 'Missing required fields' });

  try {
    const input = {
      image,
      prompt,
      num_outputs: 1,
      num_inference_steps: 50,
      guidance: 30,
      output_format: 'webp',
      output_quality: 95
    };
    if (mask) input.mask = mask;

    const r = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-fill-dev/predictions', {
      method: 'POST',
      headers: { 'Authorization': `Token ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    });
    const pred = await r.json();
    if (!pred.id) throw new Error(pred.detail || JSON.stringify(pred));
    return res.json({ id: pred.id });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
