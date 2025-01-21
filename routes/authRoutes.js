const authController = require("../controllers/authController");
const isAuthenticated = require("../middlewares/auth");
const authRouter = require("express").Router();

authRouter.get("/login", authController.getLogin);

authRouter.get("/register", authController.getRegister);

//Register logic
authRouter.post("/register", authController.register);

//Login logic
authRouter.post("/login", authController.login);

//logout logic
authRouter.get("/logout", isAuthenticated, authController.logout);

module.exports = authRouter;
