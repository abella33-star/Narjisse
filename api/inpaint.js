const KEY = 'r8_AQLguPNGCVSycdz6cnclxbfAGKVmI0n4Lb4D7';

// Démarre l'inpainting et retourne l'ID immédiatement (pas d'attente)
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { image, mask, prompt } = req.body;
  if (!image || !mask || !prompt) return res.status(400).json({ error: 'Missing image, mask or prompt' });

  try {
    const r = await fetch('https://api.replicate.com/v1/models/stability-ai/stable-diffusion-inpainting/predictions', {
      method: 'POST',
      headers: { 'Authorization': `Token ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: {
          image,
          mask,
          prompt,
          negative_prompt: 'blurry, deformed, extra fingers, distorted nails, watermark, text',
          num_inference_steps: 30,
          guidance_scale: 8,
          strength: 0.99
        }
      })
    });
    const pred = await r.json();
    if (!pred.id) throw new Error(pred.detail || 'No prediction ID from inpainting');
    return res.json({ id: pred.id });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
