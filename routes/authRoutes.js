const authController = require("../controllers/authController");
const authRouter = require("express").Router();

authRouter.get("/login", authController.getLogin);

authRouter.get("/dashboard", authController.getDashboard);

authRouter.get("/register", authController.getRegister);

//Register logic
authRouter.post("/register", authController.register);

//Login logic
authRouter.post("/login", authController.login);

module.exports = authRouter;
