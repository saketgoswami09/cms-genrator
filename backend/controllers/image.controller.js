require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { InferenceClient } = require("@huggingface/inference");
const mongoose = require("mongoose");
const { z } = require("zod"); // 1. Added Zod for consistency

const { RESOLUTION_MAP } = require("../constant");
const Image = require("../models/image.model");

const client = new InferenceClient(process.env.HF_TOKEN);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// 2. Define validation schema
const generateImageSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").trim(),
  resolution: z.string().optional(),
});

exports.generateImage = async (req, res) => {
  try {
    console.log("AUTH USER 👉", req.user);

    // 3. Apply Zod Validation
    const validation = generateImageSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error.issues[0].message,
      });
    }

    const { prompt, resolution } = validation.data;

    if (!process.env.HF_TOKEN) {
      return res.status(500).json({ 
        success: false, 
        message: "HF_TOKEN missing" 
      });
    }

    // Resolution
    const dimension = RESOLUTION_MAP[resolution] ||
      RESOLUTION_MAP["1024x1024"] || { width: 1024, height: 1024 };

    // Generate Image
    const imageBlob = await client.textToImage({
      provider: "hf-inference",
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: prompt,
      parameters: {
        num_inference_steps: 5,
        width: dimension.width,
        height: dimension.height,
      },
    });

    // Blob → Buffer
    const buffer = Buffer.from(await imageBlob.arrayBuffer());

    // Upload to Cloudinary
    const uploadResult = await uploadImage(buffer);

    // Save to MongoDB
    const savedImage = await Image.create({
      prompt,
      resolution,
      image_url: uploadResult?.secure_url,
      user_id: req.user.userId,
    });

    // 4. Standardized Response
    return res.status(201).json({
      success: true,
      message: "Image generated successfully",
      data: savedImage, 
    });
  } catch (error) {
    console.error("Image generation failed:", error);
    return res.status(500).json({
      success: false,
      message: "Image generation failed",
      error: error.message,
    });
  }
};

// ☁️ Cloudinary Upload Helper
function uploadImage(buffer) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder: "generated-ai-images",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });
}

exports.history = async (req, res) => {
  try {
    const userId = req.user.userId;

    const images = await Image.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          user_id: 1,
          // 3️⃣ Fix old HTTP links on the fly
          image_url: {
            $replaceOne: {
              input: "$image_url",
              find: "http://",
              replacement: "https://",
            },
          },
          prompt: 1,
          resolution: { $ifNull: ["$resolution", "1024x1024"] },
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error("Failed to fetch image history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch image history",
      error: error.message, 
    });
  }
};
