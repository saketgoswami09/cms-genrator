const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    user_id: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    prompt: {
      required: true,
      type: String,
      trim: true,
    },
    image_url: {
      required: true,
      type: String,
    },
    resolution: {
      type: String,
      default: "1024x1024",
    },
  },
  { timestamps: true },
);

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
