require("dotenv").config();
const fs = require("fs");
const { InferenceClient } = require("@huggingface/inference");
const RESOLUTION_MAP = require("../constant"); 

const client = new InferenceClient(process.env.HF_TOKEN);

exports.generateImage = async (req, res) => {
  try {
    console.log("Started processing image generation request...");
    const { prompt, resolution } = req.body;

    // --- Validation ---
    if (!process.env.HF_TOKEN) {
      return res.status(500).json({ message: "Internal server error: HF_TOKEN missing" });
    }
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    // --- Logic ---
    console.log(`Prompt: "${prompt}" | Resolution: ${resolution}`);
    
    // Default to 1024x1024 if resolution is invalid or missing
    const dimension = RESOLUTION_MAP[resolution] || RESOLUTION_MAP["1024x1024"] || { width: 1024, height: 1024 };
    
    // 1. Generate the image (returns a Blob)
    const imageBlob = await generateImageBlob(prompt, dimension);

    // 2. Convert Blob to Buffer (Required for Node.js fs)
    const buffer = Buffer.from(await imageBlob.arrayBuffer());

    // 3. Save locally to disk
    const fileName = "output.png";
    fs.writeFileSync(fileName, buffer);
    console.log(`Image saved successfully to ${fileName}`);

    // --- Response ---
    return res.status(200).json({ 
        message: "Image generated and saved locally", 
        path: fileName 
    });

  } catch (error) {
    console.error(`Error in generating image: ${error.message}`);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Hugging Face Service
async function generateImageBlob(prompt, dimension) {
  return await client.textToImage({
    provider: "auto",
    model: "black-forest-labs/FLUX.1-schnell",
    inputs: prompt,
    parameters: { 
      num_inference_steps: 5, 
      width: dimension.width, 
      height: dimension.height 
    },
  });
}