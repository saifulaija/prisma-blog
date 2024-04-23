import express from 'express'
import { CommentControllers } from './comment.controller'
import authGuard from '../../middlewares/authGuard'
import { UserRole } from '@prisma/client'
const router = express.Router()
router.delete('/:id',authGuard(UserRole.ADMIN,UserRole.SUBSCRIBER,UserRole.MODERATOR,UserRole.SUPER_ADMIN),CommentControllers.deleteComment)
router.patch('/update-comment/:id',authGuard(UserRole.ADMIN,UserRole.SUBSCRIBER,UserRole.MODERATOR,UserRole.SUPER_ADMIN),CommentControllers.updateMyComment)
router.post('/create-comment', authGuard(UserRole.ADMIN,UserRole.SUBSCRIBER,UserRole.MODERATOR,UserRole.SUPER_ADMIN), CommentControllers.createComment)



export const CommentRoutes=router