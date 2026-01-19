const { default: mongoose } = require("mongoose");
const moongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamp: true }
);

const User = moongoose.model("User", userSchema);

module.exports = User;
