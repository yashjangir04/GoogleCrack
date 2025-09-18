const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  phone: String,
  experience: String,
  savedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job",
    },
  ],
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'application' }]
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
