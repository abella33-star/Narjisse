const KEY = Buffer.from('cjhfS0xhUXZQcXhxcjlhaXRwY0RjSzlWM3E3MW9Ld3ZjODJWZVYycw==', 'base64').toString();

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  try {
    const r = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { 'Authorization': `Token ${KEY}` }
    });
    const pred = await r.json();
    return res.json({ status: pred.status, output: pred.output, error: pred.error });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
