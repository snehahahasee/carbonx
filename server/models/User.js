const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    business_type: {
      type: String,
      enum: ["factory", "restaurant", "logistics", "warehouse"],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
