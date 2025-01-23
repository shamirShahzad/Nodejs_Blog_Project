const asyncHandler = require("express-async-handler");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

const createComment = asyncHandler(async function (req, res) {
  const { content } = req.body;
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post) {
    return res.render("postDetails", {
      title: "Post Details",
      user: req.user,
      error: "Post not found",
      success: "",
      post,
    });
  }
  if (!content) {
    res.render("postDetails", {
      title: "Post Details",
      success: "",
      error: "Please enter a comment",
      user: req.user,
      post,
    });
  }
  const newComment = await Comment.create({
    content: req.body.content,
    post: postId,
    author: req.user._id,
  });
  post.comments.push(newComment._id);
  await post.save();
  console.log(post);
  res.redirect(`/posts/${postId}`);
});

const commentEditForm = asyncHandler(async function (req, res) {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.render("postDetails", {
      title: "Post Details",
      success: "",
      error: "Comment not found",
      user: req.user,
    });
  }
  res.render("editComment", {
    title: "Edit Comment",
    user: req.user,
    comment,
  });
});

const updateComment = asyncHandler(async function (req, res) {
  const { content } = req.body;
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.render("postDetails", {
      title: "Post Details",
      success: "",
      error: "Comment not found",
      user: req.user,
    });
  }
  comment.content = content;
  await comment.save();
  res.redirect(`/posts/${comment.post}`);
});

const deleteComment = asyncHandler(async function (req, res) {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.render("postDetails", {
      title: "Post Details",
      success: "",
      error: "Comment not found",
      user: req.user,
    });
  }
  await Comment.findByIdAndDelete(req.params.id);
  res.redirect(`/posts/${comment.post}`);
});

const commentController = {
  createComment,
  commentEditForm,
  updateComment,
  deleteComment,
};

module.exports = commentController;
