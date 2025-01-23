const Post = require("../models/Post");
const User = require("../models/User");
const File = require("../models/File");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");

const getPostsForm = asyncHandler(function (req, res) {
  res.render("newPosts", {
    title: "Add Post",
    user: req.user,
    error: "",
    success: "",
  });
});

const createPost = asyncHandler(async function (req, res) {
  const { title, content } = req.body;
  // check if files are uploaded before proceeding
  if (!req.files || req.files.length === 0) {
    return res.render("newPosts", {
      title: "Add Post",
      user: req.user,
      error: "Please upload at least one image",
      success: "",
    });
  }
  //create files for uploaded images
  const images = await Promise.all(
    req.files.map(async (file) => {
      const newFile = new File({
        url: file.path,
        public_id: file.filename,
        uploaded_by: req.user._id,
      });
      await newFile.save();
      return {
        url: newFile.url,
        public_id: newFile.public_id,
      };
    })
  );
  //create new post with images
  const newPost = await Post.create({
    title,
    content,
    author: req.user._id,
    images,
  });
  // add post to users post array
  if (newPost) {
    const user = await User.findById(req.user._id);
    user.posts.push(newPost._id);
    await user.save();
  }
  res.render("newPosts", {
    title: "Add Post",
    user: req.user,
    error: "",
    success: "Post created successfully",
  });
});

const getAllPosts = asyncHandler(async function (req, res) {
  const posts = await Post.find().populate("author", "username");
  res.render("posts", {
    title: "Posts",
    error: "",
    user: req.user,
    posts,
    success: "",
  });
});

const getPostById = asyncHandler(async function (req, res) {
  const post = await Post.findOne({ _id: req.params.id })
    .populate("author", "username")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        model: "User",
        select: "username",
      },
    });
  res.render("postDetails", {
    title: "Post Details",
    user: req.user,
    error: "",
    success: "",
    post,
  });
});

const getEditPostFrom = asyncHandler(async function (req, res) {
  const post = await Post.findOne({ _id: req.params.id });

  if (!post) {
    return res.render("posts", {
      title: "Posts",
      user: req.user,
      error: "Post not found",
      success: "",
    });
  }

  res.render("editPost", {
    title: "Edit Post",
    user: req.user,
    error: "",
    success: "",
    post,
  });
});

const updatePost = asyncHandler(async function (req, res) {
  const { title, content } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.render("postDetails", {
      title: "Post Details",
      user: req.user,
      error: "Post not found",
      success: "",
    });
  }
  if (post.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Post Details",
      user: req.user,
      error: "You are not authorized to edit this post",
      success: "",
    });
  }
  post.title = title || post.title;
  post.content = content || post.content;
  if (req.files) {
    await Promise.all(
      post.images.map(async (image) => {
        await cloudinary.uploader.destroy(image.public_id);
      })
    );
  }
  post.images = await Promise.all(
    req.files.map(async (file) => {
      const newFile = await File.create({
        url: file.path,
        public_id: file.filename,
        uploaded_by: req.user._id,
      });
      return {
        url: newFile.url,
        public_id: newFile.public_id,
      };
    })
  );
  await post.save();

  res.redirect(`/posts/${post._id}`);
});

const deletePost = asyncHandler(async function (req, res) {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.render("posts", {
      title: "Posts",
      success: "",
      error: "Post not found",
      user: req.user,
    });
  }
  if (req.user._id.toString() !== post.author.toString()) {
    return res.render("postDetails", {
      title: "Post Details",
      success: "",
      error: "You are not authorized to delete this post",
      user: req.user,
      post,
    });
  }
  await Promise.all(
    post.images.map(async (image) => {
      await cloudinary.uploader.destroy(image.public_id);
    })
  );
  await Post.findByIdAndDelete(req.params.id);

  res.redirect("/posts");
});

const postsController = {
  getPostsForm,
  createPost,
  getAllPosts,
  getPostById,
  getEditPostFrom,
  updatePost,
  deletePost,
};

module.exports = postsController;
