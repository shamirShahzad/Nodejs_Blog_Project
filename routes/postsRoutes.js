const upload = require("../config/multer");
const postsController = require("../controllers/postsController");
const isAuthenticated = require("../middlewares/auth");
const postsRouter = require("express").Router();

postsRouter.get("/add", isAuthenticated, postsController.getPostsForm);

postsRouter.post(
  "/add",
  isAuthenticated,
  upload.array("images", 5),
  postsController.createPost
);

module.exports = postsRouter;
