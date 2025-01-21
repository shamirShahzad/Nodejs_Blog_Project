const Post = require("../models/Post");
const User = require("../models/User");
const File = require("../models/File");

function getPostsForm(req, res) {
  res.render("newPosts", {
    title: "Add Post",
    user: req.user,
    error: "",
    success: "",
  });
}

async function createPost(req, res) {
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
}

const postsController = {
  getPostsForm,
  createPost,
};

module.exports = postsController;
