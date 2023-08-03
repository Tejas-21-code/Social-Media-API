const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");

// router.get("/", (req, res) => {
//   res.send("authorization router");
// });

// Register

router.post("/register", async (req, res) => {
  const user = new User(req.body);

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user.password = hashedPassword;

    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    !user && res.status(404).json("User not Found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    !validPassword && res.status(400).json("Wrong Password");

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
