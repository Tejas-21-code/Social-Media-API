const router = require("express").Router();

const Post = require("../models/Post");
const User = require("../models/User");

router.get("/", (req, res) => {});

// Create a Post

router.post("/", async (req, res) => {
  const post = new Post(req.body);

  try {
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update a Post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("The Post has been updated");
    } else {
      res.status(404).json("post not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete a Post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("The post was deleted");
    } else {
      res.status(400).json("You can delete only your post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Like and dislike a Post

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).send("post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).send("post has been Disliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get a Post

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get Timeline Post

router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);

    const userPosts = await Post.find({ userId: currentUser._id });

    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );

    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
