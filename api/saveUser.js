export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: 'Missing email' });

    const r = await fetch(process.env.SHEET_SAVE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, status: "Free" })
    });

    const text = await r.text();
    res.status(200).json({ ok: true, resp: text });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
