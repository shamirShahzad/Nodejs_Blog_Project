const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcryptjs");
module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const foundUser = await User.findOne({ email });
          if (!foundUser)
            return done(null, false, { message: "No user with this email" });
          const isMatch = await bcrypt.compare(password, foundUser.password);
          if (!isMatch)
            return done(null, false, { message: "Invalid Credentials" });
          return done(null, foundUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });
};
