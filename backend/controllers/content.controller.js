require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const Content = require("../models/content.model"); // Ensure this matches your filename
const { ACTIONS, HTTP_STATUS } = require("../constant");
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


exports.generateContent = async (req, res) => {
  try {
    //  Auth check
    if (!req.user?.userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { action } = req.params;
    const { content, tone } = req.body;

    //  Validate action
    if (!ACTIONS[action]) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Invalid content action",
      });
    }

    //  Validate input
    if (!content || !content.trim()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Content is required",
      });
    }

    //  Free-tier safety
    const MAX_CHARS = 1200;
    const safeContent = content.slice(0, MAX_CHARS);
    const selectedTone = tone || "Professional";

    const actionConfig = ACTIONS[action];

    //  Build prompt dynamically
    const prompt = `
${actionConfig.prompt}

Tone: ${selectedTone}

User Content:
${safeContent}
`;

    //  Gemini call
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const outputText =
      response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!outputText) {
      return res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
        success: false,
        message: "AI temporarily unavailable. Please retry.",
      });
    }

    //  Save to DB
    const savedContent = await Content.create({
      user_id: req.user.userId,
      input_content: safeContent,
      output_content: outputText,
      tone: selectedTone,
      type: action,
    });

    //  Success response
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: actionConfig.message,
      content: outputText,
      data: savedContent,
    });
  } catch (error) {
    console.error("Content generation failed:", error);

    //  Gemini quota handling
    if (
      error.status === 429 ||
      error.message?.includes("Quota") ||
      error.message?.includes("RESOURCE_EXHAUSTED")
    ) {
      return res.status(429).json({
        success: false,
        message: "AI busy hai 😮‍💨 30 seconds baad try karo.",
      });
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong on our side.",
    });
  }
};


exports.getContentHistory = async (req, res) => {
  try {
    const history = await Content.find({ user_id: req.user.userId })
      .sort({ createdAt: -1 }) // Newest first
      .limit(50);

    // Map fields if your Frontend expects "original/result"
    // but your DB has "input_content/output_content"
    const formattedHistory = history.map((item) => ({
      _id: item._id,
      user_id: item.user_id,
      input_content: item.input_content, 
      output_content: item.output_content,
      tone: item.tone,
      createdAt: item.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: formattedHistory,
    });
  } catch (error) {
    console.error("History Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


exports.deleteContentHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await Content.findOneAndDelete({
      _id: id,
      user_id: req.user.userId,
    });

    if (!content) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
