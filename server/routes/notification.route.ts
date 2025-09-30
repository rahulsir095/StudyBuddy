import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
   getNotification,
   updateNotification,
} from "../controllers/notification.controller";
import { refreshTokensMiddleware } from "../controllers/user.controller";
const notificationRouter = express.Router();

notificationRouter.get(
   "/get-all-notifications",
   refreshTokensMiddleware,
   isAuthenticated,
   authorizeRoles("admin"),
   getNotification
);
notificationRouter.put(
   "/update-notification/:id",
   refreshTokensMiddleware,
   isAuthenticated,
   authorizeRoles("admin"),
   updateNotification
);

export default notificationRouter;
