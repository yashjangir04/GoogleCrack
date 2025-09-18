const express = require("express");
const router = express.Router();
const user = require("../models/user-model");
const Application = require("../models/application-model");
const job = require("../models/job-model");

// Get all applications with user and job details
router.get("/getApplications", async (req, res) => {
  try {
    const applications = await Application.find({})
      .populate("userId", "firstName lastName email") // fetch user details
      .populate("jobId", "title");                    // fetch job details

    const result = applications.map(app => ({
      id: app._id,
      jobTitle: app.jobId?.title || "Unknown Job",
      applicant: `${app.userId?.firstName || ""} ${app.userId?.lastName || ""}`.trim() || "Unknown User",
      email: app.userId?.email || "No Email",
      status: app.status,
      appliedAt: app.appliedAt,
      resume: app.resumeUrl || "#"
    }));

    res.status(200).json({ applications: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/updateStatus", async (req, res) => {
  try {
    const { applicationId, status } = req.body;

    if (!applicationId || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.status(200).json({ msg: "Status updated successfully", application: updatedApplication });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
