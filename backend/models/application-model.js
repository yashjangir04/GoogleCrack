const mongoose = require("mongoose") ;

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "job", required: true },
  resumeUrl: { type: String, required: true },
  coverLetter: { type: String },
  status: { type: String, enum: ["Under Review", "Accepted", "Rejected"], default: "Under Review" },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("application", applicationSchema);
