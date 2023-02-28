const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const app = express();
const users = require("./app/api/v1/users/router");
const handlerError = require("./app/middleware/handler-error");
const notFound = require("./app/middleware/not-found");

app.use(logger("common"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "LessCode API",
  });
});
app.use("/api/v1/users", users);

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

app.use(notFound);
app.use(handlerError);

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

module.exports = app;
