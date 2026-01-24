require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const Content = require("../models/content.model"); // Ensure this matches your filename

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ===============================
// 🔁 REWRITE & SAVE
// ===============================
exports.rewriteContent = async (req, res) => {
  try {
    // 🔐 Auth guard
    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { content, tone } = req.body;

    // ✅ Validation
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    // 🧠 Dynamic Prompt based on Tone
    const selectedTone = tone || "Professional";
    const prompt = `
      Rewrite the following content.
      
      Tone: ${selectedTone}
      
      Rules:
      - Keep the meaning the same
      - Improve grammar, clarity, and flow
      - Return ONLY the rewritten content
      - Do NOT explain or include quotes
      
      Content:
      ${content}
    `;

    // 🤖 Gemini call
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Updated to latest stable model
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const rewrittenText = response.data.candidates[0].content.parts[0].text.trim();

    // 💾 Save to MongoDB (Using your specific Schema fields)
    const savedContent = await Content.create({
      user_id: req.user.userId,
      input_content: content,      // Matches Schema: input_content
      output_content: rewrittenText, // Matches Schema: output_content
      tone: selectedTone,          // Matches Schema: tone (Make sure to add this to your Model!)
      type: "rewrite",
    });

    // 🚀 Response
    return res.status(201).json({
      success: true,
      message: "Content rewritten successfully",
      content: savedContent.output_content, 
      data: savedContent // Return full object for history updates
    });

  } catch (error) {
    console.error("Rewrite failed:", error);
    return res.status(500).json({
      message: "Rewrite failed",
      error: error.message,
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
    const formattedHistory = history.map(item => ({
        _id: item._id,
        user_id: item.user_id,
        input_content: item.input_content, // Or item.original if you changed schema
        output_content: item.output_content, // Or item.result
        tone: item.tone || "Professional",
        createdAt: item.createdAt
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