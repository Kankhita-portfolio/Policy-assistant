import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { prompt, customApiKey } = body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const apiKey = customApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return res.status(401).json({
        error:
          "No Gemini API key provided. Please configure GEMINI_API_KEY in Vercel environment variables or enter an API key in the app.",
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
        maxOutputTokens: 1000,
      },
    });

    const text = response.text || "No response generated.";
    return res.status(200).json({ text });
  } catch (err: any) {
    console.error("Gemini API error:", err);
    return res.status(500).json({
      error: err.message || "Failed to generate response from Gemini API",
    });
  }
}
