const mongoose = require("mongoose");

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
      lowercase: true, // Performance: ensures "User@Gmail.com" and "user@gmail.com" are the same
      index: true,     // Explicitly tells MongoDB to optimize searches by email
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { 
    timestamps: true,
    versionKey: false, // Performance: stops Mongoose from adding/tracking the __v field
    autoIndex: false   // Recommended for production: handles indexing manually for speed
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;