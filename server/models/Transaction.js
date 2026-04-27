const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    credits: { type: Number, required: true },
    type: { type: String, enum: ["buy", "sell"], required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
