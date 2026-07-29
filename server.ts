import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for Gemini Chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `You are Workshop's AI Assistant, the friendly and knowledgeable AI customer assistant for Bishnu Motorcycle Workshop.
Workshop Details:
- Name: Bishnu Motorcycle Workshop
- Address: Butwal-12, Tamnagar, Rupandehi, Nepal
- Phone: 9857032691 (+977-9857032691)
- Opening Hours: Sunday to Friday, 07:00 AM – 08:00 PM (Saturday: Closed)
- Core Services: Routine Servicing & Safety Tune-ups, Engine Diagnostics & Overhauls, Brake Pad & Suspension Repairs, Electrical Wiring & Battery, Genuine Spare Parts, Tyre Replacement & Wheel Balancing.

Instructions:
1. Provide concise, friendly, and helpful responses (2-4 sentences maximum).
2. Always refer accurately to the workshop address (Butwal-12, Tamnagar, Rupandehi, Nepal) and phone number (9857032691) whenever asked.
3. Help customers with service options, opening hours, directions, and how to contact the workshop.`;

      // Use chat or generateContent with system instruction
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: message,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || "Thank you for contacting Bishnu Motorcycle Workshop. Please call 9857032691 for immediate assistance.";
      return res.json({ reply });
    } catch (err: any) {
      console.error("Gemini API Chat Error:", err);
      return res.status(500).json({
        error: "Failed to generate AI response",
        details: err?.message || "Unknown error",
      });
    }
  });

  // Vite middleware for development vs static serve for production
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
