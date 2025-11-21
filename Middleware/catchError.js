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
    if (process.env.NODE_ENV === "production") {
        let error = { ...err };
        error.message = err.message;

        // Mongoose Validation Error
        if (err.name === "ValidationError") {
            const message = Object.values(err.errors).map(value => value.message).join(", ");
            error = new ErrorHandler(message, 400);
        }

        // Wrong MongoDB ID
        if (err.name === "CastError") {
            const message = `Resource not found: ${err.path}`;
            error = new ErrorHandler(message, 400);
        }

        // Duplicate key error
        if (err.code === 11000) {
            const message = `Duplicate field: ${Object.keys(err.keyValue)}`;
            error = new ErrorHandler(message, 400);
        }

        // JWT error
        if (err.name === "JsonWebTokenError") {
            error = new ErrorHandler("Invalid JSON Web Token", 401);
        }

        // JWT expired
        if (err.name === "TokenExpiredError") {
            error = new ErrorHandler("JSON Web Token expired", 401);
        }

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
