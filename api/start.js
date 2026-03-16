const KEY = 'r8_AQLguPNGCVSycdz6cnclxbfAGKVmI0n4Lb4D7';

// Étape 1 : génère le masque des ongles via SAM
async function segmentNails(image) {
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
  let pred = await r.json();
  const deadline = Date.now() + 30000;
  while (pred.status !== 'succeeded' && pred.status !== 'failed') {
    if (Date.now() > deadline) throw new Error('SAM timeout');
    await new Promise(r => setTimeout(r, 2000));
    const p = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { 'Authorization': `Token ${KEY}` }
    });
    pred = await p.json();
  }
  if (pred.status === 'failed') throw new Error('SAM failed: ' + pred.error);
  // Retourne le masque (première image de sortie)
  const out = pred.output;
  return Array.isArray(out) ? out[0] : out;
}

// Étape 2 : inpainting uniquement sur le masque des ongles
async function inpaintNails(image, mask, prompt) {
  const r = await fetch('https://api.replicate.com/v1/models/stability-ai/stable-diffusion-inpainting/predictions', {
    method: 'POST',
    headers: { 'Authorization': `Token ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: {
        image,
        mask,
        prompt,
        negative_prompt: 'blurry, deformed, extra fingers, watermark, text',
        num_inference_steps: 30,
        guidance_scale: 8,
        strength: 0.99
      }
    })
  });
  let pred = await r.json();
  const deadline = Date.now() + 60000;
  while (pred.status !== 'succeeded' && pred.status !== 'failed') {
    if (Date.now() > deadline) throw new Error('Inpaint timeout');
    await new Promise(r => setTimeout(r, 2000));
    const p = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { 'Authorization': `Token ${KEY}` }
    });
    pred = await p.json();
  }
  if (pred.status === 'failed') throw new Error('Inpaint failed: ' + pred.error);
  const out = pred.output;
  return Array.isArray(out) ? out[0] : out;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt, image } = req.body;
  if (!prompt || !image) return res.status(400).json({ error: 'Missing prompt or image' });

  try {
    // 1. Détecter les ongles et générer le masque
    const mask = await segmentNails(image);

    // 2. Inpainter uniquement les ongles avec le style choisi
    const url = await inpaintNails(image, mask, prompt);

    return res.json({ url });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
