const commentController = require("../controllers/commentController");
const commentRouter = require("express").Router();
const isAuthenticated = require("../middlewares/auth");

commentRouter.post(
  "/posts/:id/comments",
  isAuthenticated,
  commentController.createComment
);

commentRouter.get(
  "/comments/:id/edit",
  isAuthenticated,
  commentController.commentEditForm
);

commentRouter.put(
  "/comments/:id",
  isAuthenticated,
  commentController.updateComment
);

commentRouter.delete(
  "/comments/:id",
  isAuthenticated,
  commentController.deleteComment
);

module.exports = commentRouter;
