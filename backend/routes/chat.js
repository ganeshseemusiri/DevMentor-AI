import express from "express";
import client from "../services/openrouter.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message, mode } = req.body;

    let systemPrompt = "";

    if (mode === "interview") {
      systemPrompt = `
You are a technical interviewer for a frontend developer role.

Rules:
- Ask ONE interview question at a time.
- When the user answers, first give short feedback (2-3 lines).
- Then give a better sample answer (short and clear).
- Then ask the NEXT interview question.
- Start from basics: "Tell me about yourself", then HTML, CSS, JavaScript, React, Projects.
- Keep language simple and clear.
- Do not write very long paragraphs.
`;
    } else {
      systemPrompt = `
You are DevMentor AI, a helpful assistant for coding, English, and interview preparation.
Answer clearly and simply.
`;
    }

    const completion = await client.chat.completions.create({
      model: "stepfun/step-3.5-flash:free",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const botReply = completion.choices[0].message.content;

    res.json({ reply: botReply });
  } catch (error) {
    console.error("OPENROUTER ERROR:", error.response?.data || error.message);
    res.status(500).json({ reply: "AI error. Please try again." });
  }
});

export default router;
