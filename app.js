const createError = require("http-errors");
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
require("dotenv").config();

const indexRouter = require("./routes/index");
const storeRouter = require("./routes/store");

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
});

const app = express();
app.use(compression());
app.use(helmet());
app.use(limiter);

mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URL;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(methodOverride("_method"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/store", storeRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
