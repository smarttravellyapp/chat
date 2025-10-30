export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, tab } = req.body;

  const prompt = `
You are SmartTravelly AI — a friendly travel assistant.

User tab: ${tab}
Question: ${message}

Answer in Vietnamese, concise and clear.
`;

  try {
    const aiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a travel assistant. Reply concisely and friendly." },
          { role: "user", content: prompt }
        ],
        max_tokens: 512,
        temperature: 0.2
      })
    });

    const aiJson = await aiResp.json();
    const reply = aiJson.choices?.[0]?.message?.content || "Sorry, I don't understand the question.";
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
