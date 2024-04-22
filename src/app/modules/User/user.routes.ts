import express, { Request, Response, NextFunction } from "express";

import authGuard from "../../middlewares/authGuard";
import { UserRole } from "@prisma/client";

import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { userValidationSchema } from "./user.validationSchema";



const router = express.Router();
router.get('/',authGuard(UserRole.ADMIN,UserRole.SUPER_ADMIN),userController.getAllUsers)
router.get(
  '/me',
  authGuard(UserRole.ADMIN,UserRole.BLOGGER,UserRole.MODERATOR,UserRole.SUPER_ADMIN),
  userController.getMyProfile
)

router.patch(
  '/update-my-profile',
  authGuard(UserRole.ADMIN,UserRole.BLOGGER,UserRole.MODERATOR,UserRole.SUPER_ADMIN),
  userController.updateMyProfile

);
router.patch(
  '/:id/status',
  authGuard(UserRole.ADMIN,UserRole.SUPER_ADMIN),
  validateRequest(userValidationSchema.userUpdateStatus),
  userController.changeProfileStatus,
);

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
