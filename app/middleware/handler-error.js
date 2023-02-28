const { StatusCodes } = require("http-status-codes");

const handlerError = (err, req, res, next) => {
  let custom = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Internal Server Error",
  };

  if (err.name === "ValidationError") {
    custom.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    custom.statusCode = 400;
  }

  if (err.code && err.code === 11000) {
    custom.message = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    custom.statusCode = 400;
  }

  if (err.name === "CastError") {
    custom.message = `No item found with id : ${err.value}`;
    custom.statusCode = 404;
  }

  return res.status(custom.statusCode).json({
    message: custom.message,
  });
};

module.exports = handlerError;
