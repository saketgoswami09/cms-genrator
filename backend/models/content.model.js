const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    input_content: {
      type: String,
      required: true,
      trim: true,
    },

    output_content: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["rewrite", "shorten", "expand", "article"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Content", contentSchema);
