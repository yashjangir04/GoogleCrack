const mongoose = require("mongoose") ;

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  type: String,
  experience: String,
  salary: String,
  postedDate: String,
  description: String,
  skills: [String],
});

module.exports = mongoose.model("job", jobSchema);
