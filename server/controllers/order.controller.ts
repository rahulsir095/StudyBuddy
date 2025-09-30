import { Request, Response, NextFunction } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import  { IOrder } from "../models/orderModel";
import userModel from "../models/user.model";
import courseModel, { ICourse } from "../models/course.model";
import sendMail from "../utils/sendMail";
import { newOrder, getAllOrdersService } from "../services/order.services";
import { redis } from "../utils/redis";
import notificationModel from "../models/notificationModel";

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// ================= CREATE ORDER ==================
export const createOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;

      // ---- Payment Validation ----
      if (payment_info && "id" in payment_info) {
        const paymentId = payment_info.id;
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

        if (paymentIntent.status !== "succeeded") {
          return next(new ErrorHandler("Payment not authorized!", 400));
        }
      }

      // ---- Check User ----
      const user = await userModel.findById(req.user?._id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      // ---- Prevent Duplicate Purchase ----
      const courseExist = user.courses.some(
        (course: any) => course.courseId.toString() === courseId
      );
      if (courseExist) {
        return next(
          new ErrorHandler("You have already purchased this course.", 400)
        );
      }

      // ---- Check Course ----
      const course: ICourse | null = await courseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      // ---- Order Data ----
      const data: any = {
        courseId: course._id,
        userId: user._id,
        payment_info,
      };

      // ---- Mail Data ----
      const mailData = {
        _id: course._id.toString().slice(0, 6),
        name: course.name,
        price: course.price,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };

      // ---- Send Confirmation Mail ----
      try {
        await sendMail({
          email: user.email,
          subject: "Course Purchase Confirmation",
          template: "order-conformation.ejs",
          data: {
            user: { name: user.name },
            order: mailData,
          },
        });
      } catch (error: any) {
        console.error("Email sending failed:", error.message);
      }

      // ---- Optional: Update User & Course ----
      user.courses.push({ courseId: course._id });
      await redis.set(String(req.user?._id), JSON.stringify(user));
      await user.save();
      await notificationModel.create({
        user: user._id,
        title: "New Order",
        message: `You purchased ${course.name}`,
      });
      course.purchased = course.purchased + 1;
      await course.save();

      // ---- Save Order ----
      newOrder(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// ================= GET ALL ORDERS (Admin Only) ==================
export const getAllOrders = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// ================= STRIPE KEYS ==================
export const sendStripePublishableKey = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      success: true,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  }
);

// ================= NEW PAYMENT ==================
export const newPayment = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const amount = Math.round(req.body.amount * 100);

      const myPayment = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        metadata: {
          company: "StudyBuddy",
          userId: req.user?._id || "guest",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return res.status(200).json({
        success: true,
        clientSecret: myPayment.client_secret,
      });
    } catch (error: any) {
      console.error("Stripe Payment Error:", error.message);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
