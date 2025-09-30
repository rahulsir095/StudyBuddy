import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    // MongoDB CastError (Invalid ID Format)
    if (err.name === "CastError") {
        err.statusCode = 404;
        err.message = `Resource not found. Invalid: ${err.path}`;
    }

    // Duplicate Key Error (MongoDB Unique Constraint)
    if (err.code === 11000) {
        err.statusCode = 400;
        err.message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    }

    // Invalid JWT Error
    if (err.name === "JsonWebTokenError") {
        err.statusCode = 401;
        err.message = `Invalid JSON Web Token. Please try again.`;
    }

    // Expired JWT Error
    if (err.name === "TokenExpiredError") {
        err.statusCode = 401;
        err.message = `Your session has expired. Please log in again.`;
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
