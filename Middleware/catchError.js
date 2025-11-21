const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Something went wrong";

    // Development mode
    if (process.env.NODE_ENV === "development") {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: err,
            stack: err.stack
        });
    }

    // Production mode
    let message = err.message;
    let error = new ErrorHandler(message, err.statusCode);

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        message = Object.values(err.errors).map(v => v.message).join(", ");
        error = new ErrorHandler(message, 400);
    }

    // Wrong MongoDB ID
    if (err.name === "CastError") {
        message = `Resource not found: ${err.path}`;
        error = new ErrorHandler(message, 400);
    }

    // Duplicate key
    if (err.code === 11000) {
        message = `Duplicate field: ${Object.keys(err.keyValue)}`;
        error = new ErrorHandler(message, 400);
    }

    // Invalid JWT
    if (err.name === "JsonWebTokenError") {
        error = new ErrorHandler("Invalid JSON Web Token", 401);
    }

    // Expired JWT
    if (err.name === "TokenExpiredError") {
        error = new ErrorHandler("JSON Web Token expired", 401);
    }

    return res.status(error.statusCode).json({
        success: false,
        message: error.message
    });
};
