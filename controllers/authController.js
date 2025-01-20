const bcrypt = require("bcryptjs");
const User = require("../models/User");
const passport = require("passport");

function getLogin(req, res) {
  res.render("login", {
    title: "Login",
    user: "",
    error: "",
  });
}

async function login(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("login", {
        title: "Login",
        user: req.user,
        error: info.message,
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/auth/dashboard");
    });
  })(req, res, next);
}

function getRegister(req, res) {
  res.render("register", {
    title: "Register",
    user: "",
    error: "",
  });
}

async function register(req, res) {
  const { username, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.render("register", {
        title: "Register",
        user: username,
        error: `User with email ${email} already exists`,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.redirect("/auth/login");
  } catch (error) {
    res.render("register", {
      title: "Register",
      user: username,
      error: error.message,
    });
  }
}

function getDashboard(req, res) {
  res.render("dashboard", {
    username: req.userObj ? req.userObj.username : "",
  });
}

const authController = {
  getLogin,
  login,
  getRegister,
  register,
  getDashboard,
};

module.exports = authController;
