require("dotenv").config();
const fs = require("fs");
const pdfParse = require("pdf-parse"); 
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

exports.analyzeResume = async (req, res) => {
  try {
  
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    console.log("1. File received:", req.file.originalname);

    //  Parse PDF
   
    const buffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(buffer);

    const resumeText = (data.text || "").trim();
    console.log("2. PDF text length:", resumeText.length);

    if (!resumeText) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "PDF has no selectable text (scanned PDF)",
      });
    }

    // ===============================
    // 3️⃣ Role
    // ===============================
    const role = req.body.role || "Software Developer";

    // ===============================
    // 4️⃣ Prompt
    // ===============================
    const prompt = `
Analyze the resume below for the role of "${role}" as an ATS expert.

Return STRICT JSON ONLY in this format:
{
  "score": number,
  "match_percentage": number,
  "strengths": [],
  "weaknesses": [],
  "improvements": [],
  "ats_tips": []
}

Resume Content:
${resumeText.slice(0, 4000)}
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
      result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawOutput) {
      throw new Error("Empty response from Gemini");
    }

    console.log("4. Gemini response received");

   
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }


    const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON from Gemini");
    }

    const finalData = JSON.parse(jsonMatch[0]);

    return res.status(200).json({
      success: true,
      data: finalData,
    });

  } catch (error) {
    console.error("RESUME ANALYSIS ERROR:", error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Resume analysis failed",
    });
  }
};
