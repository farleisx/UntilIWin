import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Missing or invalid prompt" });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server misconfigured: GOOGLE_API_KEY not set." });
  }

  const model = process.env.GOOGLE_MODEL || "text-bison-001";
  const url = `https://generativelanguage.googleapis.com/v1beta2/models/${encodeURIComponent(model)}:generate`;

  const body = {
    prompt: { text: prompt },
    temperature: 0.7,
    maxOutputTokens: 800
  };

  try {
    const gRes = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      timeout: 30000
    });

    const data = gRes.data || {};
    let text = "";

    if (data.candidates && data.candidates.length) {
      const candidate = data.candidates[0];
      if (typeof candidate.output === "string") text = candidate.output;
      else if (candidate.content && Array.isArray(candidate.content)) {
        text = candidate.content.map(i => i.text || "").join("\n");
      }
    }

    if (!text && typeof data.output === "string") text = data.output;
    if (!text && data.result?.output) text = data.result.output;
    if (!text) text = JSON.stringify(data).slice(0, 8000);

    return res.status(200).json({ text });
  } catch (err) {
    console.error("AI error:", err.response?.data || err.message || err);
    const message = err.response?.data || err.message || "Unknown error contacting Google API";
    return res.status(500).json({ error: message });
  }
}
