const userController = require("../controllers/userController");
const userRouter = require("express").Router();
const isAuthenticated = require("../middlewares/auth");
const upload = require("../config/multer");

userRouter.get("/profile", isAuthenticated, userController.getUserProfile);

userRouter.get("/edit", isAuthenticated, userController.getEditProfileForm);

userRouter.put(
  "/edit",
  isAuthenticated,
  upload.single("profilePicture"),
  userController.updateProfile
);

userRouter.delete("/delete", isAuthenticated, userController.deleteUser);

module.exports = userRouter;
