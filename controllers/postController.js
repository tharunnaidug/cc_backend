// controllers/postController.js
import Post from "../models/Post.js";

//
// GET /api/posts
// query: ?tag=xyz&author=userid&project=projectId
//
export const getPosts = async (req, res) => {
  try {
    const { tag, author, project } = req.query;
    const filter = {};

    if (tag) filter.tags = { $in: [tag] };
    if (author) filter.author = author;
    if (project) filter.project = project;

    const posts = await Post.find(filter)
      .populate("author", "name department year avatarUrl")
      .sort({ createdAt: -1 });

    res.json({ message: "Posts Fetched Successfully",posts });
  } catch (err) {
    console.error("getPosts error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

//
// POST /api/posts
//
export const createPost = async (req, res) => {
  try {
    const { content, imageUrl, tags, project } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content is required" });
    }

    const post = await Post.create({
      author: req.user._id,
      content: content.trim(),
      imageUrl: imageUrl || null,
      tags: tags || [],
      project: project || null,
    });

    const populated = await post.populate("author", "name department year avatarUrl");

    res.status(201).json(populated);
  } catch (err) {
    console.error("createPost error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

//
// GET /api/posts/:id
//
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "name department year avatarUrl"
    );

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (err) {
    console.error("getPostById error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

//
// POST /api/posts/:id/like
// toggles like/unlike
//
export const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id.toString();
    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({
      message: alreadyLiked ? "Unliked post" : "Liked post",
      likesCount: post.likes.length,
    });
  } catch (err) {
    console.error("toggleLikePost error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
