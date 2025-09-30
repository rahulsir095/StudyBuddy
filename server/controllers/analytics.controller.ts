import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import { generateLast12MonthData } from "../utils/analytics.generator";
import courseModel from "../models/course.model";
import orderModel from "../models/orderModel";
import userModel from "../models/user.model";

// get users analytics -- only admin
export const getUserAnalytics = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const users = await generateLast12MonthData(userModel);
         res.status(200).json({
            success: true,
            users,
         }); 
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);
// get courses analytics -- only admin
export const getCourseAnalytics = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const courses = await generateLast12MonthData(courseModel);
         res.status(200).json({
            success: true,
            courses,
         }); 
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);
// get orders analytics -- only admin
export const getOrderAnalytics = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const orders = await generateLast12MonthData(orderModel);
         res.status(200).json({
            success: true,
            orders,
         }); 
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);
