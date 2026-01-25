const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ===============================
// Generate Interview Questions
// ===============================
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const prompt = `
Generate ${numberOfQuestions || 10} interview questions for a ${role}
with ${experience} years of experience.
Focus on: ${topicsToFocus}.
Return as a numbered list only.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices[0].message.content;

    const questions = text
      .split("\n")
      .map((q) => q.replace(/^[0-9.\-\s]+/, "").trim())
      .filter(Boolean);

const formattedQuestions = questions.map((q) => ({
  question: q,
  answer: "",
  pinned: false,
  note: "",
}));

return res.status(200).json(formattedQuestions);

  } catch (error) {
    console.error("GROQ AI ERROR:", error.message);
    return res.status(500).json({
      message: "Failed to generate questions",
    });
  }
};

// ===============================
// Generate Explanation
// ===============================
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: `Explain this interview question clearly:\n${question}` }],
    });

    return res.status(200).json({
      explanation: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("GROQ EXPLAIN ERROR:", error.message);
    return res.status(500).json({
      message: "Failed to generate explanation",
    });
  }
};

module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation,
};
