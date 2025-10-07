import express from "express";
import {
   AddAnswer,
   addQuestion,
   addReplyToReview,
   addReview,
   deleteCourse,
   editCourse,
   getAdminAllCourses,
   getAllCourses,
   getCourseByUser,
   getSingleCourse,
   uploadCourse,
} from "../controllers/course.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { refreshTokensMiddleware } from "../controllers/user.controller";
const courseRouter = express.Router();

courseRouter.post(
   "/create-course",
   refreshTokensMiddleware,
   isAuthenticated,
   authorizeRoles("admin"),
   uploadCourse
);
courseRouter.put(
   "/edit-course/:id",
   refreshTokensMiddleware,
   isAuthenticated,
   authorizeRoles("admin"),
   editCourse
);
courseRouter.get("/get-course/:id", getSingleCourse);
courseRouter.get("/get-courses", getAllCourses);
courseRouter.get("/get-admin-courses",refreshTokensMiddleware, isAuthenticated,authorizeRoles("admin"),  getAdminAllCourses);
courseRouter.get("/get-course-content/:id",refreshTokensMiddleware, isAuthenticated, getCourseByUser);
courseRouter.post("/add-question",refreshTokensMiddleware, isAuthenticated, addQuestion);
courseRouter.put("/add-answer",refreshTokensMiddleware, isAuthenticated, AddAnswer);
courseRouter.put("/add-review/:id",refreshTokensMiddleware, isAuthenticated, addReview);  
courseRouter.put("/add-reply",refreshTokensMiddleware, isAuthenticated,authorizeRoles("admin"), addReplyToReview);  
courseRouter.get("/get-all-courses",refreshTokensMiddleware, isAuthenticated,authorizeRoles("admin"), getAllCourses);  
courseRouter.delete("/delete-course/:id",refreshTokensMiddleware, isAuthenticated,authorizeRoles("admin"), deleteCourse);  

export default courseRouter;
