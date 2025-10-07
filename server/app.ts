import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import ErrorHandler from "./utils/errorHandler";
import rateLimit from "express-rate-limit";
require("dotenv").config();

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
   cors({
      origin: process.env.ORIGIN,
      credentials:true,
   })
);

//testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
   res.status(200).json({
      success: true,
      message: "Api Woring Fine",
   });
});

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100, 
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
	ipv6Subnet: 56, 
	
})


//routes
app.use("/api/v1", userRouter,courseRouter,orderRouter,notificationRouter,analyticsRouter,layoutRouter);


//all
app.all("*", (req: Request, res: Response, next: NextFunction) => {
   next(new ErrorHandler(`Route ${req.originalUrl} not exists.`, 404));
});

//Middlewares
app.use(limiter)
app.use(errorMiddleware);