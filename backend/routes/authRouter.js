const express = require("express");
const router = express.Router();
const user = require("../models/user-model");
const admin = require("../models/admin-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  let isAdmin = false ;
  try {
    const { email, password } = req.body;

    const current_user = await user.findOne({ email }).populate("savedJobs");
    if (!current_user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const comp_password = await bcrypt.compare(password, current_user.password);
    if (!comp_password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: current_user._id }, "secretkey", {
      expiresIn: "1d"
    });

    const adminCheck = await admin.findOne({ email }) ;

    if(adminCheck) isAdmin = true ;
    

    res.cookie("token", token, { httpOnly: true, secure: false });
    
    return res.status(201).json({
      message: "Login Successful",
      token: token ,
      user: {
        id: current_user._id,
        email: current_user.email,
        firstName: current_user.firstName,
        lastName: current_user.lastName,
        isAdmin : isAdmin,
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    let { firstName, lastName, email, password, phone, experience } = req.body;

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    password = await bcrypt.hash(password, 10);

    const newUser = await user.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      experience
    });

    return res.status(201).json({
      message: "Signup Successful",
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/signup/admin", async (req, res) => {
  try {
    let { email } = req.body;

    const existingUser = await admin.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await admin.create({
      email
    });

    return res.status(201).json({
      email : email
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/verify" , async (req , res) => {
  let token = req.body.token ;


  jwt.verify(token, 'secretkey', async function(err, decoded) {
    if (err) {
      console.error("JWT verification failed:", err.message);
      return res.status(401).json({ msg: "Invalid or expired token" });
    }
    const data = await user.findOne({_id : decoded.id}) ;
    console.log(data) ;
    
    return res.status(200).json(data) ;
  });
})

module.exports = router;
