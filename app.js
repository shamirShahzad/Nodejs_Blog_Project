require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.port;
const mongoose = require("mongoose");

//Middlewares
app.use(express.json({ urlencoded: true }));
app.set("view engine", "ejs");

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
