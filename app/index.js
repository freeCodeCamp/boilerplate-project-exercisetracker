/**
 * Environment configuration
 */
require("dotenv").config();

/**
 * Express set up
 */
const express = require("express");
const app = express();

/**
 * Express utility modules
 */
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

/**
 * Mongo Database connection
 */
const { connectToDatabase } = require("./models/index");

/**
 * Routers
 */
const userRouter = require("./routes/user");
const exerciseRouter = require("./routes/exercise");
const logRouter = require("./routes/log");

/**
 * App set up
 */
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * Connect to Mongo DB
 */
connectToDatabase();

/**
 * Root Endpoint
 */
app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "../views/index.html"));
});

/**
 * User Endpoint
 */
app.use("/api/users", userRouter);

/**
 * Exercise Endpoint
 */
app.use("/api/users/:_id/exercises", exerciseRouter);

/**
 * Log Endpoint
 */
app.use("/api/users/:_id/logs", logRouter);

module.exports = app;
