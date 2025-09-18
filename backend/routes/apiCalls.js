const express = require("express");
const router = express.Router();
const job = require("../models/job-model");
const nodemailer = require("nodemailer");

router.get("/jobs", async (req, res) => {
  try {
    const data = await job.find();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ err: error });
  }
});

router.post("/sendEmail", async (req, res) => {
  const { email } = req.body;
  console.log(email);
  

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "blinderspeaky1995@gmail.com",
      pass: "zsif luhl wvkc kphh",
    },
  });

  const interviewDate = new Date();
  interviewDate.setDate(interviewDate.getDate() + 3);

  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = interviewDate.toLocaleDateString("en-IN", options);
  const time = "4:00 PM IST";

  const accessCode = Math.floor(100000 + Math.random() * 900000).toString();

  const mailOptions = {
    from: '"GoogleCrack" <blinderspeaky1995@gmail.com>',
    to: `${email}`,
    subject: "Interview Selection - Scheduled Interview Details",
    text: `Dear Candidate,

Congratulations! You have been selected for an interview.

📅 Date & Time: ${formattedDate}, ${time}

Please join using the following link:
https://intervu-app.vercel.app/

Meeting code will be shared soon

Best regards,
Interview Team
`,
    html: `
      <p>Dear Candidate,</p>
      <p>🎉 <b>Congratulations!</b> You have been <b>selected for an interview.</b></p>
      <p><b>📅 Date & Time:</b> ${formattedDate}, ${time}</p>
      <p>Please join using the following link:</p>
      <p><a href="https://intervu-app.vercel.app/" target="_blank">Click here to join Interview</a></p>
      <p><b>Access Code:</b> ${accessCode} </p>
      <br>
      <p>Best regards,<br>Interview Team</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
  return res.json({ roomCode: accessCode , emailID : email });
});

module.exports = router;
