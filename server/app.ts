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

//routes
app.use("/api/v1", userRouter,courseRouter,orderRouter,notificationRouter,analyticsRouter,layoutRouter);


//all
app.all("*", (req: Request, res: Response, next: NextFunction) => {
   next(new ErrorHandler(`Route ${req.originalUrl} not exists.`, 404));
});
app.use(errorMiddleware);