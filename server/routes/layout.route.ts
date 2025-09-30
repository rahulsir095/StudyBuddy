import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
   createLayout,
   editLayout,
   getLayoutByType,
} from "../controllers/layout.controller";
import { refreshTokensMiddleware } from "../controllers/user.controller";
const layoutRouter = express.Router();

layoutRouter.post(
   "/create-layout",
   refreshTokensMiddleware,
   isAuthenticated,
   authorizeRoles("admin"),
   createLayout
);
layoutRouter.put(
   "/edit-layout",
   refreshTokensMiddleware,
   isAuthenticated,
   authorizeRoles("admin"),
   editLayout
);
layoutRouter.get("/get-layout/:type", getLayoutByType);

export default layoutRouter;
