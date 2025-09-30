import { NextFunction, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import courseModel from "../models/course.model";
import { redis } from "../utils/redis";

export const createCourse = catchAsyncErrors(
   async (data: any, res: Response) => {
      const course = await courseModel.create(data);
      // Update Redis cache
    const allCourses = (await redis.get("allCourses")) as any[];
    if (Array.isArray(allCourses)) {
      // append new course
      allCourses.push(course);
      await redis.set("allCourses", allCourses);
    } else {
      // if no courses in cache yet, just set with new one
      await redis.set("allCourses", [course]);
    }
      res.status(200).json({
         success: true,
         course,
      });
   }
);

//get all courses
export const getAllCoursesService = async (res: Response) => {
   const courses = await courseModel.find().sort({ createdAt: -1 });
   res.status(201).json({
      success: true,
      courses,
   });
};
