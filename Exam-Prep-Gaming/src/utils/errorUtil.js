const mongoose = require("mongoose");
extractErrorMessages = (error) => {
  if (error instanceof mongoose.Error) {
    // return Object.values(error.errors).map((e) => e.message);
    return Object.values(error.errors)[0].message;
  } else if (error instanceof Error) {
    // return [error.message];
    return error.message;
  }
};

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  //Return res.status.json({with statusCode and message }) and catch in client!
  // res.status(error.statusCode).json({
  //   status: error.status,
  //   message: error.message,
  // });
  res.redirect("/404");
};

module.exports = {
  extractErrorMessages,
  CustomError,
  globalErrorHandler,
};
