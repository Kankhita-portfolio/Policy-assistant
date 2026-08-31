import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint to check server status and key presence
  app.get("/api/health", (req, res) => {
    const hasEnvKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY");
    res.json({ status: "ok", hasEnvKey });
  });

  // API endpoint for policy Q&A grounded generation
  app.post("/api/ask", async (req, res) => {
    try {
      const { prompt, customApiKey } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Missing prompt" });
      }

      const apiKey = customApiKey || process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.status(401).json({
          error: "No Gemini API key provided. Please enter an API key in the top banner or configure GEMINI_API_KEY.",
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
      res.json({ text });
    } catch (err: any) {
      console.error("Gemini API error:", err);
      res.status(500).json({
        error: err.message || "Failed to generate response from Gemini API",
      });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Policy Assistant Server running on http://localhost:${PORT}`);
  });
}

startServer();
