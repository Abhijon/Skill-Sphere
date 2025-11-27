const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["candidate", "recruiter"],
      default: "candidate",
      required: true,
    },
    organization: {
      type: String,
      required: function () {
        return this.role === "recruiter";
      },
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

module.exports = mongoose.model("User", userSchema);
