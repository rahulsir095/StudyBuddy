import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/errorHandler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
require("dotenv").config();
import sendMail from "../utils/sendMail";
import { accessTokenOptions, sendToken,refreshTokenOptions } from "../utils/jwt";
import { redis } from "../utils/redis";
import {
   getAllUsersService,
   getUserById,
   updateUserRoleService,
} from "../services/user.service";
import cloudinary from "cloudinary";

//register user
interface IRegisterUser {
   name: string;
   email: string;
   password: string;
   avatar?: string;
}

export const registerUser = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { name, email, password }: IRegisterUser = req.body;

         let isEmailExists = await userModel.findOne({ email });
         if (isEmailExists) {
            return next(new ErrorHandler("Email already exists", 400));
         }

         // Generate activation token with user details
         const activationToken = createActivationToken({
            name,
            email,
            password,
         } as IUser);
         const activationCode = activationToken.activationCode;
         const data = { user: { name }, activationCode };

         // Send activation email
         try {
            await sendMail({
               email,
               subject: "Account Activation",
               template: "activation-mail.ejs",
               data,
            });

            res.status(201).json({
               success: true,
               message: `Please check your email ${email} to activate your account.`,
               activationToken: activationToken.token,
            });
         } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
         }
      } catch (error: any) {
         next(new ErrorHandler(error.message, 500));
      }
   }
);

interface IactivationToken {
   token: string;
   activationCode: string;
}

export const createActivationToken = (user: IUser): IactivationToken => {
   const activationCode = Math.floor(
      100000 + Math.random() * 900000
   ).toString();
   const token = jwt.sign(
      { user, activationCode },
      process.env.JWT_SECRET as Secret,
      {
         expiresIn: "5m",
      }
   );
   return { token, activationCode };
};

//Activate account
interface IActivateAccount {
   activationCode: string;
   activationToken: string;
}

export const activateAccount = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { activationCode, activationToken }: IActivateAccount =
            req.body as IActivateAccount;
         const decodedData = jwt.verify(
            activationToken,
            process.env.JWT_SECRET as Secret
         ) as { user: IUser; activationCode: string };

         if (decodedData.activationCode !== activationCode) {
            return next(new ErrorHandler("Invalid activation code", 400));
         }

         const { name, email, password } = decodedData.user;

         const existUser = await userModel.findOne({ email });
         if (existUser) {
            return next(new ErrorHandler("Email already exists", 400));
         }

         // Create user after successful activation
         await userModel.create({
            name,
            email,
            password,
         });

         res.status(200).json({
            success: true,
            message: "Account activated successfully",
         });
      } catch (error: any) {
         next(new ErrorHandler(error.message, 400));
      }
   }
);

//login user
interface ILoginUser {
   email: string;
   password: string;
}

export const loginUser = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { email, password }: ILoginUser = req.body;

         if (!email || !password) {
            return next(
               new ErrorHandler("Please enter email and password", 400)
            );
         }

         const user = await userModel.findOne({ email }).select("+password");
         if (!user) {
            return next(new ErrorHandler("Your email is not valid", 401));
         }
         if (user.isSocialAuth) {
            return next(
               new ErrorHandler(
                  "Please log in using social authentication",
                  400
               )
            );
         }

         const isPasswordMatched = await user.comparePassword(password);
         if (!isPasswordMatched) {
            return next(new ErrorHandler("Your password is incorrect", 401));
         }
         

         sendToken(user, 200, res);
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);

//logout user

export const logoutUser = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const userId = String(req.user._id) || "";
         await redis.del(userId);
         res.cookie("access_token", "", { maxAge: 1 });
         res.cookie("refresh_token", "", { maxAge: 1 });


         res.status(200).json({
            success: true,
            message: "Logged out successfully",
         });
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);

//  Middleware-style refresh 
export const refreshTokensMiddleware = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;

      if (!refresh_token) {
        return next(new ErrorHandler("No refresh token provided", 401));
      }

      let decoded: JwtPayload;
      try {
        decoded = jwt.verify(
          refresh_token,
          process.env.REFRESH_TOKEN as string
        ) as JwtPayload;
      } catch (err: any) {
        return next(new ErrorHandler("Invalid or expired refresh token", 401));
      }
      const session = await redis.get(String(decoded.id));
      if (!session) {
        return next(new ErrorHandler("Session not found", 400));
      }

      const user = typeof session === "string" ? JSON.parse(session) : session;

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        { expiresIn: "5m" }
      );

      const newRefreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        { expiresIn: "5d" }
      );

      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", newRefreshToken, refreshTokenOptions);

      // refresh session in Redis
      await redis.set(user._id.toString(), JSON.stringify(user), {
        ex: 60 * 60 * 24 * 7,
      });

      // Continue to next middleware instead of ending response
      next();
    } catch (error: any) {
      return next(new ErrorHandler(error.message || "Token refresh failed", 500));
    }
  }
);

//  Route-style refresh (explicit endpoint)
export const refreshTokensRoute = [
  refreshTokensMiddleware,
  (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Tokens refreshed successfully",
    });
  },
];



//get user by id
export const getUserInfo = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction, id: string) => {
      try {
         const userId = String(req.user._id) || "";
         getUserById(res, next, userId);
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);

interface ISocialAuthBody {
   name: string;
   email: string;
   avatar: string;
}

//social auth
export const socialAuth = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { name, email, avatar } = req.body as ISocialAuthBody;

         let user = await userModel.findOne({ email });

         if (!user) {
            user = await userModel.create({
               name,
               email,
               avatar:{
                public_id: `social_${Date.now()}`,
                url:avatar,
               },
               isSocialAuth: true,
            });
         }

         sendToken(user, 200, res);
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);

// update user info
interface IUpdateUserInfo {
   name?: string;
   email?: string;
}

export const UpdateUserInfo = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { name } = req.body as IUpdateUserInfo;
         const userId = req.user?._id;

         const user = await userModel.findById(userId);

         if (name && user) {
            user.name = name;
         }
         await user?.save();

         await redis.set(String(userId), JSON.stringify(user));

         res.status(200).json({
            success: true,
            user,
         });
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);

// update user password
interface IupdatePassword {
   oldPassword: string;
   newPassword: string;
}

export const updatePassword = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { oldPassword, newPassword }: IupdatePassword = req.body;

         if (!oldPassword || !newPassword) {
            return next(
               new ErrorHandler("Please enter old and new password", 400)
            );
         }

         if (!req.user) {
            return next(new ErrorHandler("User not authenticated", 401));
         }

         const user = await userModel
            .findById(req.user._id)
            .select("+password");

         if (!user) {
            return next(new ErrorHandler("User not found", 404));
         }

         // If the user registered via social authentication, reject the password update
         if (user.isSocialAuth) {
            return next(
               new ErrorHandler(
                  "Cannot update password for social login users",
                  400
               )
            );
         }

         // Compare old password
         const isPasswordMatched = await user.comparePassword(oldPassword);
         if (!isPasswordMatched) {
            return next(new ErrorHandler("Old password is incorrect", 401));
         }

         // Update password
         user.password = newPassword;
         await user.save();

         redis.set(String(req.user._id), JSON.stringify(user));

         res.status(200).json({
            success: true,
            message: "Password updated successfully",
         });
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);

interface IUpdateProfilePicture {
   avatar: string;
}

//update profile picture
export const updateProfilePicture = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const userId = String(req.user?._id) || "";
         const currUser = req.user as IUser;
         const { avatar } = req.body;

         if (!avatar) {
            return next(new ErrorHandler("Please upload an image", 400));
         }

         // Delete previous avatar if it exists
         if (currUser?.avatar?.public_id) {
            await cloudinary.v2.uploader.destroy(currUser.avatar.public_id);
         }

         // Upload new avatar
         const result = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
         });

         const newAvatar = {
            public_id: result.public_id,
            url: result.secure_url,
         };

         // Update user in DB
         const user = await userModel.findByIdAndUpdate(
            userId,
            { avatar: newAvatar },
            { new: true, runValidators: true }
         );

         if (!user) {
            return next(new ErrorHandler("User not found", 404));
         }

         // Update cache in Redis
         await redis.set(userId, JSON.stringify(user));

         res.status(200).json({
            success: true,
            user,
         });
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);

//get all user --only for admin
export const getAllUsers = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         getAllUsersService(res);
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 400));
      }
   }
);

//update user roles --only for admin
export const updateUserRole = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { id, role } = req.body;
         updateUserRoleService(res, id, role);
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);

//delete user
export const deleteUser = catchAsyncErrors(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { id } = req.params;
         const user = await userModel.findById(id);
         if (!user) {
            return next(new ErrorHandler("User not found", 404));
         }
         await userModel.deleteOne({ _id: id });
         await redis.del(id);
         res.status(200).json({
            success: true,
            message: "User deleted successfully",
         });
      } catch (error: any) {
         return next(new ErrorHandler(error.message, 500));
      }
   }
);
