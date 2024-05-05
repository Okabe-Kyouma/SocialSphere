const router = require("express").Router();
const bodyParser = require("body-parser");
const postModel = require("../Models/post");
const userModel = require("../Models/user");
const { v4: uuidv4 } = require("uuid");

router.post("/comment/:id", async (req, res) => {
  if (req.isAuthenticated()) {
    const postId = req.params.id;
    const { comment } = req.body;

    console.log(`the comment is : ${comment} and the postId is ${postId}`);

    try {
      const post = await postModel.findById(postId);
      if (!post) {
        console.log("Post not found");
        return res.redirect("/home");
      }

      const user = req.user;

      if (!user) {
        console.log("User not found");
        return res.redirect("/home");
      }

      const uuid = uuidv4();
      const username = req.user.username;

      console.log(username);

      post.comments.push({
        personCommented: user._id,
        comment,
        username,
        uuid,
      });
      await post.save();
      console.log("Comment added successfully");
      res.redirect("/home");
    } catch (error) {
      console.log(error);
      res.redirect("/home");
    }
  } else {
    res.redirect("/");
  }
});

router.post("/comment/delete/:uuid", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const commentUuid = req.params.uuid;

      const post = await postModel.findOne({ "comments.uuid": commentUuid });

      if (!post) {
        return res.status(404).json({ error: "Comment not found" });
      }

      const commentIndex = post.comments.findIndex(
        (comment) => comment.uuid === commentUuid
      );

      if (commentIndex === -1) {
        return res.status(404).json({ error: "Comment not found" });
      }

      post.comments.splice(commentIndex, 1);
      await post.save();

      res.redirect("/home");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

module.exports = router;
