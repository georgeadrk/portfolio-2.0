import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Using Gemini 1.5 Flash (free)
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemma-3n-e2b-it:generateContent?key=${GEMINI_API_KEY}`;

// Handle chat requests
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  console.log("➡️  Question from frontend:", userMessage);

  if (!userMessage || !userMessage.trim()) {
    return res.status(400).json({ reply: "Message cannot be empty." });
  }

  try {
    // We can prepend a system instruction to act like you
    const systemInstruction =
      "You are acting as George Adriel Kurniawan, the portfolio owner. Answer in a friendly, confident tone as if you’re him, and know details about his projects.";

    const body = {
      contents: [
        {
          parts: [
            { text: systemInstruction }, // system-like instruction
            { text: userMessage }, // user’s actual message
          ],
        },
      ],
    };

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const raw = await response.json();
    console.log("⬅️  Gemini raw response:", raw);

    if (!response.ok || raw.error) {
      return res.status(500).json({
        reply: `Gemini error: ${raw.error?.message || "Unknown error"}`,
      });
    }

    const text =
      raw?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No reply from Gemini.";

    res.json({ reply: text });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ reply: "Server error." });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);