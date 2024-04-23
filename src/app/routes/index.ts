import express from 'express';

import { authRoutes } from '../modules/auth/auth.routes';
import { userRoutes } from '../modules/User/user.routes';
import { AdminRoutes } from '../modules/Admin/admin.routes';
import { blogRoutes } from '../modules/Blog/blog.routes';
import { AuthorRoutes } from '../modules/Author/author.routes';
import { ModeratorRoutes } from '../modules/Moderator/moderator.routes';
import { CommentRoutes } from '../modules/Comment/comment.routes';

const router = express.Router();

const moduleRoutes = [
   {
      path: '/user',
      route: userRoutes,
   },
   {
      path: '/admin',
      route: AdminRoutes,
   },
   {
      path: '/author',
      route: AuthorRoutes,
   },
   {
      path: '/moderator',
      route: ModeratorRoutes,
   },
   {
      path: '/auth',
      route: authRoutes,
   },
   {
      path: '/blog',
      route: blogRoutes,
   },
   {
      path: '/comment',
      route: CommentRoutes,
   },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
