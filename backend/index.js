const express = require("express");
const app = express();
const db = require("./models/db");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const apiCaller = require("./routes/apiCalls");
const appsRouter = require("./routes/appsRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/auth", authRouter);
app.use("/user" , userRouter);
app.use("/api" , apiCaller)
app.use("/apps/" , appsRouter)

app.listen(3000, () => {
  console.log("Server running on 3000 ✅");
});
