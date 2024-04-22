import express, { Request, Response, NextFunction } from "express";

import authGuard from "../../middlewares/authGuard";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import { blogValidationSchema } from "./blog.validation";
import { blogController } from "./blog.controller";

const router = express.Router();

router.post(
  "/create-blog",
//   (req: Request, res: Response, next: NextFunction) => {
//     req.body = blogValidationSchema.createBlogSchema.parse(
//       JSON.parse(req.body.data)
//     );

//     return blogController.createBlog(req, res, next);
//   }
blogController.createBlog
);

export const blogRoutes = router;
