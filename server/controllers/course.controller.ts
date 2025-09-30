import { Request, Response, NextFunction } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";
import courseModel from "../models/course.model";
import notificationModel from "../models/notificationModel";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import sendMail from "../utils/sendMail";
require("dotenv").config();

//upload course
export const uploadCourse = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         let data = req.body;
         let thumbnail = data.thumbnail;
         if (thumbnail) {
            const mycloud = await cloudinary.v2.uploader.upload(thumbnail, {
               folder: "courses",
            });

            data.thumbnail = {
               public_id: mycloud.public_id,
               url: mycloud.secure_url,
            };
         }
         createCourse(data, res, next);
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);

//edit course

export const editCourse = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         let data = req.body;
         const courseId = req.params.id;

         const courseData = (await courseModel.findById(courseId)) as any;
         if (!courseData) {
            return next(new ErrorHandler("Course not found", 404));
         }

         const thumbnail = data.thumbnail;

         // Case 1: new thumbnail uploaded (base64 string, not https url)
         if (thumbnail && !thumbnail.startsWith("https")) {
            // destroy old thumbnail
            if (courseData.thumbnail?.public_id) {
               await cloudinary.v2.uploader.destroy(
                  courseData.thumbnail.public_id
               );
            }

            // upload new thumbnail
            const mycloud = await cloudinary.v2.uploader.upload(thumbnail, {
               folder: "courses",
            });

            data.thumbnail = {
               public_id: mycloud.public_id,
               url: mycloud.secure_url,
            };
         }

         // Case 2: thumbnail is unchanged (still https url)
         if (thumbnail && thumbnail.startsWith("https")) {
            data.thumbnail = {
               public_id: courseData.thumbnail.public_id,
               url: courseData.thumbnail.url,
            };
         }

         const course = await courseModel.findByIdAndUpdate(
            courseId,
            { $set: data },
            { new: true, runValidators: true }
         );

         res.status(200).json({
            success: true,
            course,
         });
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);

// get single course -- without purchased
export const getSingleCourse = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const courseId = req.params.id;
         let course;

         const isCacheExist = await redis.get<string>(courseId);
         if (isCacheExist) {
            course = isCacheExist;
         } else {
            course = await courseModel
               .findById(courseId)
               .select(
                  "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
               );

            // Cache for 7 days
            await redis.set(courseId, JSON.stringify(course), { ex: 604800 });
         }

         res.status(200).json({
            success: true,
            course,
         });
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);

// get all courses -- without purchased
export const getAllCourses = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         let courses;

         const cached = await redis.get("allCourses");

         if (cached) {
            courses = cached;
         } else {
            courses = await courseModel
               .find({})
               .select(
                  "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
               );

            //  Cache for 7 days
            await redis.set("allCourses", JSON.stringify(courses), {
               ex: 60 * 60 * 24 * 7, // 7 days
            });
         }

         res.status(200).json({
            success: true,
            courses,
         });
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);

//get single course -- purchased

export const getCourseByUser = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const userCourseList = req.user?.courses;
         const courseId = req.params.id;
         const courseExists = userCourseList?.find(
            (course: any) => course.courseId === courseId
         );

         if (!courseExists) {
            return next(
               new ErrorHandler(
                  "You are not eligible to access this course",
                  404
               )
            );
         }

         const course = await courseModel.findById(courseId);
         const content = course?.courseData;

         res.status(200).json({
            success: true,
            content,
         });
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);

// add question in course
interface IAddQuestionData {
   question: string;
   courseId: string;
   contentId: string;
}

export const addQuestion = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { question, courseId, contentId }: IAddQuestionData = req.body;
         const course = await courseModel.findById(courseId);

         if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid Content Id", 400));
         }
         const courseContent = course?.courseData?.find((item: any) =>
            item._id.equals(contentId)
         );
         if (!courseContent) {
            return next(new ErrorHandler("Invalid Content Id", 400));
         }
         //create new question object
         const newQuestion: any = {
            user: req.user,
            question,
            questionReplies: [],
         };

         //add this question to our course content
         courseContent.questions.push(newQuestion);

         const notification = await notificationModel.create({
            user: req.user?._id,
            title: "New Question Received",
            message: `You have a new question from ${courseContent?.title}`,
         });

         //save the updated course
         await course?.save();

         res.status(200).json({
            success: true,
            message: "Question Added Successfully!",
         });
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);

// add answer in course question

interface IAddAnswerData {
   answer: string;
   courseId: string;
   contentId: string;
   questionId: string;
}

export const AddAnswer = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { answer, courseId, contentId, questionId }: IAddAnswerData =
            req.body;
         const course = await courseModel.findById(courseId);

         if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid Content Id", 400));
         }
         const courseContent = course?.courseData?.find((item: any) =>
            item._id.equals(contentId)
         );
         if (!courseContent) {
            return next(new ErrorHandler("Invalid Content Id", 400));
         }
         const question = courseContent?.questions?.find((item: any) =>
            item._id.equals(questionId)
         );
         if (!question) {
            return next(new ErrorHandler("Please add a question", 400));
         }
         const newAnswer: any = {
            user: req.user,
            answer,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
         };

         question?.questionReplies?.push(newAnswer);

         await course?.save();
         if (req?.user?._id === question?.user?._id) {
            const notification = await notificationModel.create({
               user: req.user?._id,
               title: "New Question Reply Received",
               message: `You have a new question reply in  ${courseContent?.title}`,
            });
         } else {
            const data = {
               name: question?.user.name,
               title: courseContent.title,
               answer: answer || "No answer provided",
               courseUrl: process.env.ORIGIN+"/course-access/"+courseId,
            };
            try {
               await sendMail({
                  email: question.user.email,
                  subject: "Question Reply",
                  template: "question-reply.ejs",
                  data,
               });
            } catch (error: any) {
               return next(new ErrorHandler(error.message, 500));
            }
         }
         res.status(200).json({
            success: true,
            course,
         });
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);

// add Review in course

interface IAddReviewData {
   review: string;
   rating: number;
   userId: string;
}

export const addReview = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const userCourseList = req.user?.courses;
         const courseId = req.params.id;

         // check if the courseId already exists in userCourseList based on id
         const courseExists = userCourseList.some(
            (course: any) => courseId.toString() === courseId.toString()
         );
         if (!courseExists) {
            return next(
               new ErrorHandler(
                  "You are not eligible to access this course",
                  404
               )
            );
         }
         const course = await courseModel.findById(courseId);
         const { review, rating } = req.body as IAddReviewData;
         const reviewData: any = {
            user: req.user,
            comment: review,
            rating,
         };
         course?.reviews.push(reviewData);

         let avg = 0;
         course?.reviews.forEach((rev: any) => {
            avg += rev.rating;
         });

         if (course) {
            course.ratings = avg / course?.reviews.length;
         }
         await course?.save();

         await redis.set(courseId, JSON.stringify(course), {
            ex: 60 * 60 * 24 * 7,
         });
         // create notification
         const notification = await notificationModel.create({
            user: req.user?._id,
            title: "New Review Received",
            message: `You have a new review from ${course?.name}`,
         });
         res.status(200).json({
            success: true,
            course,
         });
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);

//add reply in review
interface IAddReviewData {
   comment: string;
   courseId: string;
   reviewId: string;
}
export const addReplyToReview = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { comment, reviewId, courseId } = req.body as IAddReviewData;
         const course = await courseModel.findById(courseId);
         if (!course) {
            return next(new ErrorHandler("Course not found", 404));
         }
         const review = course?.reviews?.find(
            (rev: any) => rev._id.toString() === reviewId
         );
         if (!review) {
            return next(new ErrorHandler("Error not found", 404));
         }
         const replyData: any = {
            user: req.user,
            comment,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
         };
         if (!review.commentReplies) {
            review.commentReplies = [];
         }
         review.commentReplies.push(replyData);
         await course?.save();
         await redis.set(courseId, JSON.stringify(course), {
            ex: 60 * 60 * 24 * 7,
         });
         res.status(200).json({
            success: true,
            course,
         });
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);

//get all course --only for admin
export const getAdminAllCourses = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         getAllCoursesService(res);
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 400));
      }
   }
);

//delete course --admin only
export const deleteCourse = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { id } = req.params;
         const course = await courseModel.findById(id);
         if (!course) {
            return next(new ErrorHandler("Course not found", 404));
         }
         await courseModel.deleteOne({ _id: id });

         // delete from allCourses list in cache

         const allCourses = (await redis.get("allCourses")) as any[];
         if (Array.isArray(allCourses)) {
            const updatedCourses = allCourses.filter((c) => c._id !== id);
            await redis.set("allCourses", updatedCourses);
         }

         res.status(200).json({
            success: true,
            course
         });
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);
