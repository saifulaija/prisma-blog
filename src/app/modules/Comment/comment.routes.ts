import express from 'express'
import { CommentControllers } from './comment.controller'
const router = express.Router()

router.post('/create-comment',CommentControllers.createComment)
router.patch('/update-comment')


export const CommentRoutes=router