import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user.model";
import { catchAsyncErrors } from "./catchAsyncErrors";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler";
import { redis } from "../utils/redis"; // Upstash Redis client
import { accessTokenOptions, refreshTokenOptions } from "../utils/jwt";

export const isAuthenticated = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      const access_token = req.cookies.access_token as string | undefined;

      if (!access_token) {
         return next(
            new ErrorHandler("Login first to access this resource", 401)
         );
      }
      let decoded: JwtPayload;
      try {
         decoded = jwt.verify(
            access_token,
            process.env.ACCESS_TOKEN as string
         ) as JwtPayload;
      } catch (error) {
         return next(new ErrorHandler("Invalid or expired token", 401));
      }
      const user = await redis.get(decoded.id);
      if (!user) {
        return next(new ErrorHandler("User not found", 400));

      }
      req.user = user as IUser;
      next();
   }
);

//  role authorization
export const authorizeRoles = (...roles: string[]) => {
   return (req: Request, res: Response, next: NextFunction) => {
      if (!roles.includes(req.user.role)) {
         return next(
            new ErrorHandler(
               `Role (${req.user.role}) is not allowed to access this resource`,
               403
            )
         );
      }
      next();
   };
};
