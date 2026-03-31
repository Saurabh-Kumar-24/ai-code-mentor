// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import OpenAI from "openai";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ✅ NVIDIA (OpenAI-compatible)
// const client = new OpenAI({
//   apiKey: process.env.NVIDIA_API_KEY,
//   baseURL: "https://integrate.api.nvidia.com/v1", // ✅ IMPORTANT
// });

// app.post("/analyze", async (req, res) => {
//   try {
//     const { code } = req.body;

//     if (!code) {
//       return res.status(400).json({ error: "Code is required" });
//     }

//     const response = await client.chat.completions.create({
//       model: "meta/llama3-70b-instruct", // ✅ powerful model
//       messages: [
//         {
//           role: "system",
//           content: "You are a strict DSA expert.",
//         },
//         {
//           role: "user",
//           content: `
//           You are a strict DSA mentor.

// Rules:
// - Only report REAL errors (logic/syntax)
// - Do NOT give full optimized code
// - Give only HINTS for improvement (not full solution)
// - Be concise and compact




// Output format:

// Errors:
// - bullet points (only real issues)

// Time Complexity:
// - Big-O with 1 line explanation

// Space Complexity:
// - Big-O with 1 line explanation

// - If no errors exist, explicitly write: "No major logical errors"

// Hint to Optimize:
// - Give direction only (no full code)
// - Example: "Use hashmap to reduce lookup time"


// Code:
// ${code}
//           `,
//         },
//       ],
//       temperature: 0.2,
//     });

//     const result = response.choices[0].message.content;

//     res.json({ analysis: result });

//   } catch (error) {
//     console.error("NVIDIA Error:", error);

//     res.status(500).json({
//       analysis: "❌ NVIDIA API failed",
//     });
//   }
// });

// app.listen(process.env.PORT || 5000, () => {
//   console.log("Server running on http://localhost:5000");
// });



import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ NVIDIA (OpenAI-compatible)
const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1", // ✅ IMPORTANT
});

app.post("/analyze", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    const response = await client.chat.completions.create({
      model: "meta/llama3-70b-instruct", // ✅ powerful model
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
    console.error("NVIDIA Error:", error);

    res.status(500).json({
      analysis: "❌ NVIDIA API failed",
    });
  }
});

// 🔹 Approach API
app.post("/approach", async (req, res) => {
  try {
    const { question } = req.body;

    const response = await client.chat.completions.create({
      model: "meta/llama3-70b-instruct",
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

    res.json({
      analysis: response.choices[0].message.content,
    });

  } catch (error) {
    console.error(error);
    res.json({ analysis: "❌ Error generating approach" });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on http://localhost:5000");
});
