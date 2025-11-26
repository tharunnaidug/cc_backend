// controllers/commentController.js
import Comment from "../models/Comment.js";

//
// GET /api/posts/:postId/comments
//
export const getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("author", "name department year avatarUrl")
      .sort({ createdAt: 1 }); // oldest first

    res.json(comments);
  } catch (err) {
    console.error("getCommentsForPost error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

//
// POST /api/posts/:postId/comments
//
export const addCommentToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      text: text.trim(),
    });

    const populated = await comment.populate(
      "author",
      "name department year avatarUrl"
    );

    res.status(201).json(populated);
  } catch (err) {
    console.error("addCommentToPost error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
