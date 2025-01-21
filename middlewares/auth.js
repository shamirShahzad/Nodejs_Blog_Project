const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.render("login", {
      title: "Login",
      user: req.user,
      error: "Please login first",
    });
  }
};

module.exports = isAuthenticated;
