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

postsRouter.get("/", postsController.getAllPosts);

postsRouter.get("/:id", postsController.getPostById);

postsRouter.put(
  "/:id",
  isAuthenticated,
  upload.array("images", 5),
  postsController.updatePost
);

postsRouter.delete("/:id", isAuthenticated, postsController.deletePost);

postsRouter.get("/:id/edit", postsController.getEditPostFrom);
module.exports = postsRouter;
