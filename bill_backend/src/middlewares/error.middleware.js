// 404 Not Found Handler
export const notFoundHandler = (req, res, next) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};

// Global Error Handler
export const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

// Async Handler Wrapper
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export default { notFoundHandler, errorHandler, asyncHandler };
