const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverLetter: { type: String, trim: true, required: true, default: "I am Interested" },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    score: { type: String, default: null }, // Store candidate's assessment score
  },
  { timestamps: true } // ✅ Adds createdAt & updatedAt
);

module.exports = mongoose.model("Application", applicationSchema);
