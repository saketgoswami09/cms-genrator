// require("dotenv").config();

// const {GoogleGenAI} = require('@google/genai');
// const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
// const Content = require("../models/content.model");

// exports.rewrite = async (req,res) => {
//     try {
//         console.log(`Started processing of reqrite request for user id ${req.user.userId}`);
//         const {content} = req.body
//         if (!content) {
//             return res.status(400).json({
//                  message: "Content is required"
//                 });
//           }
//         const prompt = `Rewrite the following content but keep the content meaning same.
//         content is : ${content}`;

//         //   use service
//         const response = await Geminie(prompt)

//         // save the content

//         // return the content

//     } catch (error) {
//         console.error("Error in rewrite failed:", error);
//     return res.status(500).json({
//       message: "Rewrite failed",
//       error: error.message,
//     });
//     }
// }

// async function Geminie(prompt) {
//     const response = await ai.models.generateContent({
//         model: 'gemini-2.5-flash',
//         contents: prompt,
//       });
//       console.log(response.text);
//       return response.text
// }

require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");
const Content = require("../models/content.model");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ===============================
// 🔁 REWRITE CONTROLLER
// ===============================
exports.rewriteContent = async (req, res) => {
  try {
    // 🔐 Auth guard
    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { content } = req.body;

    // ✅ Validation
    if (!content) {
      return res.status(400).json({
        message: "Content is required",
      });
    }

    console.log(`Rewrite request by user ${req.user.userId}`);

    // 🧠 Prompt
    const prompt = `
Rewrite the following content.

Rules:
- Keep the meaning the same
- Improve grammar, clarity, and flow
- Return ONLY the rewritten content
- Do NOT explain
- Do NOT give multiple options

Content:
${content}
`;

    // 🤖 Gemini call
    const rewrittenText = await generateWithGemini(prompt);

    // 💾 Save to MongoDB
    const savedContent = await Content.create({
      user_id: req.user.userId,
      input_content: content,
      output_content: rewrittenText,
      type: "rewrite",
    });

    // 🚀 Response
    return res.status(201).json({
      message: "Content rewritten successfully",
      content: savedContent.output_content,
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
// 🤖 GEMINI SERVICE
// ===============================
async function generateWithGemini(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
}
