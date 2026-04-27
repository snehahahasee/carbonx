const mongoose = require("mongoose");

const emissionSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    electricity: { type: Number, required: true },
    fuel: { type: Number, required: true },
    transport: { type: Number, required: true },
    total_emissions: { type: Number, required: true },
    carbon_score: { type: Number, required: true },
    certificate_hash: { type: String, required: true },
    reduced_emissions: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Emission", emissionSchema);
