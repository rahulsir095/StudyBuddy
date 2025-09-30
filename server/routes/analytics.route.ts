import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getCourseAnalytics, getOrderAnalytics, getUserAnalytics } from "../controllers/analytics.controller";
import { refreshTokensMiddleware } from "../controllers/user.controller";
const analyticsRouter = express.Router();

analyticsRouter.get(
   "/get-users-analytics",
   refreshTokensMiddleware,
   isAuthenticated,
   authorizeRoles("admin"),
   getUserAnalytics
);
analyticsRouter.get(
   "/get-courses-analytics",
   refreshTokensMiddleware,
   isAuthenticated,
   authorizeRoles("admin"),
   getCourseAnalytics
);
analyticsRouter.get(
   "/get-orders-analytics",
   refreshTokensMiddleware,
   isAuthenticated,
   authorizeRoles("admin"),
   getOrderAnalytics
);
export default analyticsRouter;