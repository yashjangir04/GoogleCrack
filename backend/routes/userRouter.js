  const express = require("express");
  const router = express.Router();
  const user = require("../models/user-model");
  const Application = require("../models/application-model");
  const jobFetch = require("../models/job-model");
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");

  router.post("/update", async (req, res) => {
    const userData = req.body;
    const { id, firstName, lastName, email, password, phone, experience } =
      userData;

    await user.findOneAndUpdate(
      { _id: id },
      {
        firstName,
        lastName,
        email,
        password,
        phone,
        experience,
      }
    );

    return res.status(200).json({ msg: "Userdata Updated Successfully" });
  });

  router.post("/saveJob", async (req, res) => {
    try {
      const { job, userDets } = req.body;

      const updatedUser = await user
        .findByIdAndUpdate(
          userDets.id,
          { $addToSet: { savedJobs: job._id } }, 
          { new: true }
        )
        .populate("savedJobs");

      return res.status(200).json({ msg: "Job added to save list" });
    } catch (err) {
      console.error("Error saving job:", err);
      return res.status(500).json({ msg: "Error saving job" });
    }
  });

  router.post("/removeJob", async (req, res) => {
    try {
      const { jobId, userDets } = req.body;

      const updatedUser = await user
        .findByIdAndUpdate(
          userDets.id,
          { $pull: { savedJobs: jobId } },
          { new: true }
        )
        .populate("savedJobs");

      if (!updatedUser) {
        return res.status(404).json({ msg: "User not found" });
      }

      return res.status(200).json({
        msg: "Job removed from save list",
        savedones: updatedUser.savedJobs,
      });
    } catch (err) {
      console.error("Error removing job:", err);
      return res.status(500).json({ msg: "Error removing job" });
    }
  });

  router.post("/savedjobs", async (req, res) => {
    const { userDets } = req.body;
    const updatedUser = await user
      .findOne({ _id: userDets.id })
      .populate("savedJobs");

    //   console.log(updatedUser);

    return res.status(200).send({ savedjobslist: updatedUser.savedJobs });
  });

  router.post("/apply", async (req, res) => {
    try {
      const { userDets, jobId, resumeURL, coverLetter } = req.body;

      if (!userDets || !jobId || !resumeURL) {
        return res.status(400).json({ msg: "Missing required fields" });
      }

      const application = await Application.create({
        userId: userDets.id,
        jobId,
        resumeUrl: resumeURL,
        coverLetter,
        status: "Under Review",
      });

      return res
        .status(201)
        .json({ msg: "Application submitted successfully", application });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Server error" });
    }
  });

  router.post('/getApplications', async (req, res) => {
    try {
      const { id } = req.body;

      const applications = await Application.find({ userId: id })
        .select("jobId status appliedAt");

      const jobIds = applications.map(app => app.jobId);

      const jobs = await jobFetch.find({ _id: { $in: jobIds } }).select("title");

      const jobMap = {};
      jobs.forEach(job => {
        jobMap[job._id] = job.title;
      });

      const result = applications.map(app => ({
        jobTitle: jobMap[app.jobId] || "Unknown",
        status: app.status,
        date: app.appliedAt
      }));
      
      return res.status(200).json({ apps: result });
    } catch (err) {
      console.error("Error fetching applications:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  router.post('/getJobDetails' , async (req , res) => {
    const { jobID } = req.body ;
    const jobData  = await jobFetch.findOne({_id : jobID}) ;
    return res.status(200).json(jobData);
  })

  module.exports = router;
