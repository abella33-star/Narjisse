const KEY = 'r8_HX0K5OrMgD2EuY6gW7gFHVj1AcHIE2329IdJc';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  try {
    // Prefer: wait demande à Replicate de répondre directement sans polling
    const createRes = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait=55'
      },
      body: JSON.stringify({
        input: {
          prompt,
          num_outputs: 1,
          aspect_ratio: '1:1',
          output_format: 'webp',
          output_quality: 90
        }
      })
    });

    const pred = await createRes.json();

    if (pred.status === 'succeeded') {
      const url = Array.isArray(pred.output) ? pred.output[0] : pred.output;
      return res.json({ url });
    }

    // Fallback polling si needed
    let current = pred;
    const deadline = Date.now() + 50000;
    while (current.status !== 'succeeded' && current.status !== 'failed') {
      if (Date.now() > deadline) return res.status(408).json({ error: 'Timeout' });
      await new Promise(r => setTimeout(r, 2000));
      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${current.id}`, {
        headers: { 'Authorization': `Token ${KEY}` }
      });
      current = await pollRes.json();
    }

    if (current.status === 'failed') return res.status(500).json({ error: current.error });

    const url = Array.isArray(current.output) ? current.output[0] : current.output;
    return res.json({ url });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
