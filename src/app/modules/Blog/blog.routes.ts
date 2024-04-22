import express, { Request, Response, NextFunction } from "express";

import authGuard from "../../middlewares/authGuard";
import { UserRole } from "@prisma/client";
// import { fileUploader } from "../../../helpers/fileUploader";
import { blogValidationSchema } from "./blog.validation";
import { blogController } from "./blog.controller";
import { userController } from "../User/user.controller";

const router = express.Router();
router.get('/', 
// authGuard(UserRole.ADMIN,UserRole.SUPER_ADMIN),
blogController.getAllBlogs);

router.get('/my-blogs',authGuard(UserRole.BLOGGER), blogController.getMyAllBlogs);
router.get('/:id', blogController.getSingleBlog);

router.post(
  "/create-blog",
//   (req: Request, res: Response, next: NextFunction) => {
//     req.body = blogValidationSchema.createBlogSchema.parse(
//       JSON.parse(req.body.data)
//     );

//     return blogController.createBlog(req, res, next);
//   }
authGuard(UserRole.BLOGGER),
blogController.createBlog
);



export const blogRoutes = router;
