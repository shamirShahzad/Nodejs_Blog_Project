require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.port;
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const User = require("./models/User");
const authRouter = require("./routes/authRoutes");
const postsRouter = require("./routes/postsRoutes");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./config/passport");

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
    }),
  })
);

passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
    user: req.user,
    error: "",
  });
});

//routes
app.use("/auth", authRouter);
app.use("/posts", postsRouter);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    //start the server
    app.listen(port, () => {
      console.log(`Server started on port ${port} and  MongoDB connected`);
    });
  })
  .catch((err) => console.error("Some err occurred", err.message));
