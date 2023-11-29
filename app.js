var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const comppression = require("compression");
const helmet = require("helmet");

// Import routes
var indexRouter = require("./routes/index");
var dioRouter = require("./routes/dio");
// var usersRouter = require("./routes/users");
var executionRouter = require("./routes/execution");
var ceoProfilRouter = require("./routes/ceoprofil");
var executionBoardRouter = require("./routes/executionBoard");
var reviewRouter = require("./routes/review");
var loginRouter = require("./routes/backLogin");
var userdetailsRouter = require("./routes/usersdetails");
var parmetersRouter = require("./routes/parameters");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(comppression());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);

app.use(cors());

app.use("/", indexRouter);
// app.use("/users", usersRouter);
app.use("/dio", dioRouter);
app.use("/execution", executionRouter);
app.use("/ceoprofil", ceoProfilRouter);
app.use("/executionBoard", executionBoardRouter);
app.use("/review", reviewRouter);
app.use("/login", loginRouter);
app.use("/usersdetails", userdetailsRouter);
app.use("/parameters", parmetersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
