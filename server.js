import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
console.log("GROQ API KEY loaded:", process.env.GROQ_API_KEY ? "YES ✅" : "NO ❌");

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 🔹 Analyze Code API
app.post("/analyze", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || code.trim() === "") {
      return res.status(400).json({ error: "Code is required" });
    }

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content: "You are a strict DSA expert.",
        },
        {
          role: "user",
          content: `
You are a strict DSA mentor.

Rules:
- Only report REAL errors (logic/syntax)
- Do NOT give full optimized code
- Give only HINTS for improvement (not full solution)
- Be concise and compact

Output format:

Errors:
- bullet points (only real issues)

Time Complexity:
- Big-O with 1 line explanation

Space Complexity:
- Big-O with 1 line explanation

- If no errors exist, explicitly write: "No major logical errors"

Hint to Optimize:
- Give direction only (no full code)
- Example: "Use hashmap to reduce lookup time"

Code:
${code}
          `,
        },
      ],
      temperature: 0.2,
    });

    const result = response.choices[0].message.content;
    res.json({ analysis: result });

  } catch (error) {
    console.error("Groq error:", error.message);
    res.status(500).json({ analysis: "❌ Groq API failed: " + error.message });
  }
});

// 🔹 Approach API
app.post("/approach", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({ error: "Question is required" });
    }

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content: "You are a DSA mentor to guide student on their coding journey.",
        },
        {
          role: "user",
          content: `
Give:
1. Intuition
2. Approach to solve as brute force and then how to optimize that code
3. Data Structures which can be used
4. Edge Cases

DO NOT give code.

Problem:
${question}
          `,
        },
      ],
      temperature: 0.3,
    });

    res.json({ analysis: response.choices[0].message.content });

  } catch (error) {
    console.error("Groq error:", error.message);
    res.status(500).json({ analysis: "❌ Groq API failed: " + error.message });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
});