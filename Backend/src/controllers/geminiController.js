const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini configuration
const genAI = new GoogleGenerativeAI("AIzaSyDd97_NcE9HXgeRL78GOq15NW7nyTe7TZ8");

const getEmergencyInsight = async (req, res) => {
  try {
    const { trapped, total, hazards, progress } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an AI Emergency Command Assistant. 
      Current Stats:
      - Trapped People: ${trapped}
      - Total People: ${total}
      - Active Hazards: ${hazards}
      - Evacuation Progress: ${progress}%
      
      Task: Provide a 1-sentence tactical advice for the Admin dashboard. 
      Be professional and urgent. Do not use bold text or markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ insight: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to generate AI insight" });
  }
};

module.exports = { getEmergencyInsight };