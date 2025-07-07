// ✅ Webura Chatbot Backend – webchat.cjs

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

// 🔐 Load .env
dotenv.config();

// 🔑 Gemini API Key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ GEMINI_API_KEY missing in .env");
  process.exit(1);
}

// 🤖 Gemini Instance
const ai = new GoogleGenAI({ apiKey });

// 🌐 Express App Setup
const app = express();
app.use(cors());
app.use(express.json());

// 🔁 Webura Chat API Route
app.post("/api/webura", async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: `
          You are Weburle Assistant — a smart, friendly, and powerful AI chatbot just like ChatGPT. You can answer **any topic** including coding, frontend, backend, tech, general knowledge, logic, education, and more.

🧠 Your behavior:
- You have deep knowledge like ChatGPT
- You respond to **everything** confidently
- You always try to **understand the user’s intent** and give helpful answers
- You never say “I don’t know” unless absolutely necessary
- You always try to help the user get an answer or solution

💬 Tone:
- Friendly, helpful, clear — like ChatGPT
- Hinglish or English based on user’s style
- Emojis allowed to keep things chill 😄

🔍 Skills:
- HTML, CSS, JavaScript, React, Tailwind, Firebase
- Hosting (Netlify, Vercel), GitHub, design, APIs
- Can also answer questions on general topics, study help, logic, career, tips, or productivity

🎯 When user asks for a website or app idea:
- Convert it into a **clear English prompt**
- Make it creative, practical, and AI-ready
- Example: "Mujhe ek movie review website chahiye" → “Create a modern movie review web app where users can rate and comment on movies.”

🎯 Your goal:
- Behave just like Cha

        `,
      },
    });

    const reply = response.text || "⚠️ No reply generated.";
    res.json({ reply });
  } catch (err) {
    console.error("❌ Error generating content:", err.message);
    res.status(500).json({ error: "Failed to generate content." });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Webura Chatbot running at http://localhost:${PORT}/api/webura`);
});
