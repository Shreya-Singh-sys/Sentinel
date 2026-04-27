const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini configuration
const genAI = new GoogleGenerativeAI("AIzaSyClbWIUOgvPFMXFMsfE1Yk_sn6kT1_17a4");

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
// src/controllers/geminiController.js mein add karein

const triggerDispatch = async (req, res) => {
  const { incidentId, unit } = req.body;
  
  try {
    // 1. Gemini se tactical advice lein (Optional but cool)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Emergency Dispatch: Unit ${unit} is enroute to Incident ${incidentId}. 
                    Hazard: Electrical Fire 7th Floor. 
                    Briefly state 1 safety priority for the enroute team.`;
    
    const result = await model.generateContent(prompt);
    const tacticalAdvice = result.response.text();

    // 2. Firestore update karein (Using firebase-admin)
    const db = admin.firestore();
    await db.collection("incidents").doc(incidentId).update({
      status: "dispatched",
      enrouteUnit: unit,
      aiAdvice: tacticalAdvice,
      dispatchedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, advice: tacticalAdvice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getEmergencyInsight, triggerDispatch };