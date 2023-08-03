// Alternative to initialize router used in Auth route

// const express = require("express");
// const router = new express.Router();

const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.get("/", (req, res) => {
  res.send("Welcome to user route");
});

// update user data

router.put("/:id", async (req, res) => {
  // doesn't make sense to write the first try and catch block review it later
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt();
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        res.status(500).send(error);
      }
    }

    // only this part will  work
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      res.status(200).json("Updated");
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    return res.status(500).json("Cannot update user");
  }
});

// Delete User

router.delete("/:id", async (req, res) => {
  // doesn't make sense to write the first try and catch block review it later
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    // only this part will work
    try {
      const user = await User.deleteOne({ _id: req.params.id });

      res.status(200).json("Deleted");
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    return res.status(500).json("Cannot delete user");
  }
});

// //use try and catch block below

// router.delete("/:id", async (req, res) => {
//   try {
//     const user = await User.findOneAndDelete({ _id: req.params.id });
//     // you are already logged in so doesn't make sense for the message "user not found"
//     !user && res.status(404).json("No User Found");
//     res.status(202).json("Deleted User Successfully");
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// Get a User

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // if no user present not required if you are getting your own account

    const { password, updatedAt, isAdmin, createdAt, ...other } = user._doc;

    res.status(200).json(other);
  } catch (error) {
    res.status(500).send(error);
  }
});

// follow

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });

        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You Already Follow a user");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(400).json("You Cannot Follow Yourself");
  }
});

// Unfollow

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });

        res.status(200).json("User has been Unfollowed");
      } else {
        res.status(403).json("You Don't Follow a user");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(400).json("You Cannot Unfollow Yourself");
  }
});

module.exports = router;
