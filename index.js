const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./Routers/User");
const authRouter = require("./Routers/Auth");
const postRouter = require("./Routers/Posts");

dotenv.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }).then(() => {
  console.log("Connected to the database");
});

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// app.use(userRouter);   Alternative to use routes in different files

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Homepage");
});

app.listen(8800, () => {
  console.log("Backend Server is Running");
});
