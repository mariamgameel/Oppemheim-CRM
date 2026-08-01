const AppError = require("../utils/AppError");

const notFound = (req, res, next) => {
    const err = new AppError(`Route not found: ${req.originalUrl}`, 404);
    next(err);
};

const errorHandler = (err, req, res, next) => {
    let error = err;

    if (error.name === "CastError") {
        error = new AppError(`Invalid ${error.path}: ${error.value}`, 400);
    }
    
    if (error.code === 11000) {
        const fields = Object.keys(error.keyValue || {}).join(", ");
        error = new AppError(`Duplicate value for field(s): ${fields}`, 409);
    }

    if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((val) => val.message);
        error = new AppError(messages.join(", ", 400));
    }

    if (error.name === "JsonWebTokenError") {
        error = new AppError("Invalid token", 401);
    }

    if (error.name === "TokenExpiredError") {
        error = new AppError("Token expired", 401);
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";

    if (statusCode === 500) {
        console.error("UNEXPECTED ERROR:", err);
    }
    
        res.status(statusCode).json({
            message,
            ...(process.env.NODE_ENV === "development" && { stack: err.stack}),
        });
};

module.exports = { notFound, errorHandler };