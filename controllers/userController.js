const User = require("../models/User");
const Post = require("../models/Post");
const File = require("../models/File");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const Comment = require("../models/Comment");

const getUserProfile = asyncHandler(async function (req, res) {
  //find the user
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return res.render("login", {
      title: "Login",
      error: "User not found",
    });
  }
  //Find all post made by user
  const posts = await Post.find({ author: req.user._id }).sort({
    createdAt: -1,
  });
  console.log(posts);

  if (!posts) {
    return res.render("profile", {
      title: "Profile",
      user: req.user,
      error: "Posts not found",
      success: "",
      postCount: 0,
    });
  }

  res.render("profile", {
    title: "Profile",
    user: req.user,
    posts,
    error: "",
    success: "",
    postCount: posts.length,
  });
});

const getEditProfileForm = asyncHandler(async function (req, res) {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.render("login", {
      title: "Login",
      error: "User not found",
    });
  }
  if (user._id.toString() !== req.user._id.toString()) {
    return res.render("login", {
      title: "Login",
      error: "You are not authorized to edit this profile",
    });
  }
  res.render("editProfile", {
    title: "Edit Profile",
    user: req.user,
    error: "",
  });
});

const updateProfile = asyncHandler(async function (req, res) {
  const { username, email, bio } = req.body;

  console.log("This is executing");
  const user = await User.findById(req.user._id);
  if (!user) {
    res.render("login", {
      title: "Login",
      error: "User not found",
    });
  }
  if (user._id.toString() !== req.user._id.toString()) {
    res.render("login", {
      title: "Login",
      error: "You are not Authorized to edit this profile",
    });
  }
  if (req.file) {
    const newFile = new File({
      url: req.file.path,
      public_id: req.file.filename,
      uploaded_by: req.user._id,
    });
    console.log(req.file);
    await newFile.save();
    console.log(user);
    user.profilePic = {
      url: newFile.url,
      public_id: newFile.public_id,
    };
  }
  user.username = username || user.username;
  user.email = email || user.email;
  user.bio = bio || user.bio;
  await user.save();
  console.log(user);
  res.redirect("/user/profile");
});

const deleteUser = asyncHandler(async function (req, res) {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    res.render("login", {
      title: "Login",
      error: "User not found",
    });
  }
  if (user._id.toString() !== req.user._id.toString()) {
    res.render("login", {
      title: "Login",
      error: "You are not Authorized to delete this profile",
    });
  }
  if (user.profilePic && user.profilePic.public_id) {
    await cloudinary.uploader.destroy(user.profilePic.public_id);
  }
  const posts = await Post.find({ author: req.user._id });
  if (posts) {
    for (const post of posts) {
      if (post.images && post.images.length > 0) {
        for (const image of post.images) {
          await cloudinary.uploader.destroy(image.public_id);
        }
      }
      await Comment.deleteMany({ post: post._id });
      await Post.findByIdAndDelete(post._id);
    }
  }
  await Comment.deleteMany({ author: req.user._id });
  const files = await File.find({ uploaded_by: req.user._id });
  if (files) {
    for (const file of files) {
      await cloudinary.uploader.destroy(file.public_id);
      await File.findByIdAndDelete(file._id);
    }
  }
  await User.findByIdAndDelete(req.user._id);
  res.redirect("/auth/register");
});

const userController = {
  getUserProfile,
  getEditProfileForm,
  updateProfile,
  deleteUser,
};

module.exports = userController;
