require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const Content = require("../models/content.model"); // Ensure this matches your filename
// const { rewriteContent } = require("../../frontend/services/content");

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const ACTION = {
  rewrite: {},
};
// ===============================
// 🔁 REWRITE & SAVE
// ===============================
exports.generateContent = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { content, tone } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    // Free-tier safety
    const MAX_CHARS = 1200;
    const safeContent = content.slice(0, MAX_CHARS);
    const selectedTone = tone || "Professional";

    const prompt = `
Rewrite the content below.

Tone: ${selectedTone}

Rules:
- Same meaning
- Better grammar and clarity
- Only rewritten text

${safeContent}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // ✅ Correct response parsing
    const rewrittenText =
      response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!rewrittenText) {
      return res.status(503).json({
        success: false,
        message: "AI temporarily unavailable. Please retry.",
      });
    }

    const savedContent = await Content.create({
      user_id: req.user.userId,
      input_content: safeContent,
      output_content: rewrittenText,
      tone: selectedTone,
      type: "rewrite",
    });

    return res.status(201).json({
      success: true,
      message: "Content rewritten successfully",
      content: savedContent.output_content,
      data: savedContent,
    });
  } catch (error) {
    console.error("Rewrite failed:", error);

    // Gemini quota / throttling
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

    return res.status(500).json({
      success: false,
      message: "Something went wrong on our side.",
    });
  }
};

// ===============================
// 📜 GET HISTORY
// ===============================
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
      input_content: item.input_content, // Or item.original if you changed schema
      output_content: item.output_content, // Or item.result
      tone: item.tone || "Professional",
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

// ===============================
// 🗑️ DELETE HISTORY ITEM
// ===============================
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
