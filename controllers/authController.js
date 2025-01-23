const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const passport = require("passport");

const getLogin = asyncHandler(function (req, res) {
  console.log(req.user);
  res.render("login", {
    title: "Login",
    user: req.user,
    error: "",
  });
});

const login = asyncHandler(async function (req, res, next) {
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
      return res.redirect("/user/profile");
    });
  })(req, res, next);
});

const getRegister = asyncHandler(function (req, res) {
  res.render("register", {
    title: "Register",
    user: req.user,
    error: "",
  });
});

const register = asyncHandler(async function (req, res) {
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
      user: req.user,
      error: error.message,
    });
  }
});

const logout = asyncHandler(function (req, res, next) {
  req.logout((err) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    res.redirect("/auth/login");
  });
});

const authController = {
  getLogin,
  login,
  getRegister,
  register,
  logout,
};

module.exports = authController;
