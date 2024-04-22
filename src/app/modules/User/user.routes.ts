import express, { Request, Response, NextFunction } from "express";

import authGuard from "../../middlewares/authGuard";
import { UserRole } from "@prisma/client";

import { userValidationSchema } from "./user.validationSchema";
import { userController } from "./user.controller";
import { FileUploadHelper } from "../../../helpers/fileUploader";


const router = express.Router();
router.get('/',authGuard(UserRole.ADMIN,UserRole.SUPER_ADMIN),userController.getAllUsers)

router.post(
  '/create-admin',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
 
  // (req: Request, res: Response, next: NextFunction) => {
  //   req.body = userValidationSchema.createAdminSchema.parse(JSON.parse(req.body))
  //   return userController.createAdmin(req, res, next)
  // }
  userController.createAdmin
);

router.post('/create-author', userController.createAuthor)

export const userRoutes = router;
