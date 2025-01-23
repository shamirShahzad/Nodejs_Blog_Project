require("dotenv").config();

// Packages
const express = require("express");
const app = express();
const port = process.env.port;
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const session = require("express-session");
const methodOverride = require("method-override");

// Routes and Models
const authRouter = require("./routes/authRoutes");
const postsRouter = require("./routes/postsRoutes");
const passportConfig = require("./config/passport");
const errorHandler = require("./middlewares/errorHandler");
const commentRouter = require("./routes/commentRoutes");
const userRouter = require("./routes/userRoutes");

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
app.use(methodOverride("_method"));

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
app.use("/user", userRouter);
app.use("/", commentRouter);

// app.use(errorHandler);

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
