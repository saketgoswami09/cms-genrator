require("dotenv").config();
const fs = require("fs/promises");
const path = require("path");
const { z } = require("zod");
const pdfParse = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ✅ AI response validation schema
const analysisSchema = z.object({
  score: z.number().min(0).max(100),
  match_percentage: z.number().min(0).max(100),
  breakdown: z.object({
    Structure: z.number().min(0).max(100),
    Impact: z.number().min(0).max(100),
    Keywords: z.number().min(0).max(100),
    Technical: z.number().min(0).max(100),
  }),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  improvements: z.array(z.string()),
  ats_tips: z.array(z.string()),
});

exports.analyzeResume = async (req, res) => {
  let filePath;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    filePath = req.file.path;
    console.log("1. File received:", req.file.originalname);

    // ✅ Async file read (non-blocking)
    const buffer = await fs.readFile(filePath);
    const data = await pdfParse(buffer);

    const resumeText = (data.text || "").trim();
    console.log("2. PDF text length:", resumeText.length);

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: "PDF has no selectable text (possibly scanned PDF)",
      });
    }

    const role = req.body.role?.trim() || "Software Developer";

    // ✅ Token optimized cleaned text
    const cleanedResumeText = resumeText
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 4000);

    const prompt = `
You are an expert ATS resume analyzer and technical recruiter.

Analyze the following resume for the role of "${role}".

Return STRICT JSON ONLY in this exact format:
{
  "score": number,
  "match_percentage": number,
  "breakdown": {
    "Structure": number,
    "Impact": number,
    "Keywords": number,
    "Technical": number
  },
  "strengths": ["string"],
  "weaknesses": ["string"],
  "improvements": ["string"],
  "ats_tips": ["string"]
}

Rules:
- score and match_percentage must be between 0 and 100
- Keep points concise and actionable
- Focus on ATS optimization, technical depth, and recruiter appeal
- Return valid JSON only, no markdown

Resume Content:
${cleanedResumeText}
`;

    console.log("3. Sending to Gemini...");

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const rawOutput =
      result?.text?.trim?.() ||
      result?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text)
        ?.join("")
        ?.trim();

    if (!rawOutput) {
      throw new Error("Empty response from Gemini");
    }

    console.log("4. Gemini response received");

    // ✅ Clean markdown wrappers if model adds them
    const cleanedOutput = rawOutput
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // ✅ Validate AI response using Zod
    const parsedData = analysisSchema.parse(JSON.parse(cleanedOutput));

    // ✅ Safe frontend-friendly fallback object
    const finalData = {
      score: parsedData.score ?? 0,
      match_percentage: parsedData.match_percentage ?? 0,
      breakdown: {
        Structure: parsedData.breakdown.Structure ?? 0,
        Impact: parsedData.breakdown.Impact ?? 0,
        Keywords: parsedData.breakdown.Keywords ?? 0,
        Technical: parsedData.breakdown.Technical ?? 0,
      },
      strengths: parsedData.strengths ?? [],
      weaknesses: parsedData.weaknesses ?? [],
      improvements: parsedData.improvements ?? [],
      ats_tips: parsedData.ats_tips ?? [],
    };

    return res.status(200).json({
      success: true,
      data: finalData,
    });
  } catch (error) {
    console.error("RESUME ANALYSIS ERROR:", {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      message: "Resume analysis failed",
    });
  } finally {
    // ✅ Guaranteed cleanup
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (cleanupError) {
        console.error("File cleanup failed:", cleanupError.message);
      }
    }
  }
};
