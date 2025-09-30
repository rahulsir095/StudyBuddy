import express from "express";
import {
   activateAccount,
   registerUser,
   loginUser,
   logoutUser,
   refreshTokensMiddleware,
   refreshTokensRoute,
   getUserInfo,
   socialAuth,
   updatePassword,
   updateProfilePicture,
   getAllUsers,
   updateUserRole,
   deleteUser,
   UpdateUserInfo,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/activate-account", activateAccount);
userRouter.post("/login", loginUser);
userRouter.post("/social-auth", socialAuth);
userRouter.get("/logout",refreshTokensMiddleware, isAuthenticated, logoutUser);
userRouter.get("/refresh", refreshTokensRoute);
userRouter.get("/me", isAuthenticated, getUserInfo);
userRouter.put("/update-user-info",refreshTokensMiddleware, isAuthenticated, UpdateUserInfo);
userRouter.put("/update-user-password",refreshTokensMiddleware, isAuthenticated, updatePassword);
userRouter.put("/update-user-avatar",refreshTokensMiddleware, isAuthenticated, updateProfilePicture);
userRouter.get(
   "/get-users",
   refreshTokensMiddleware,
   isAuthenticated,
   authorizeRoles("admin"),
   getAllUsers
);
userRouter.put(
   "/update-user",
   refreshTokensMiddleware,
   isAuthenticated,
   authorizeRoles("admin"),
   updateUserRole
);
userRouter.delete(
   "/delete-user/:id",
   refreshTokensMiddleware,
   isAuthenticated,
   authorizeRoles("admin"),
   deleteUser
);
 
export default userRouter;
