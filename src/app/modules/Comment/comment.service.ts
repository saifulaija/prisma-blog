import { Comment } from "@prisma/client";
import prisma from "../../../shared/prismaClient";
import { TComment } from "./comment.constant";

const createCommentIntoDB = async (payload: TComment) => {
  const blogData = await prisma.blog.findUniqueOrThrow({
    where: {
      id: payload.blogId,
      authorId: payload.authorId,
    },
  });

  const result = await prisma.comment.create({
    data: payload,
  });

  return result;
};

const updateCommentIntoDb = async (
    id: string,
    data: Partial<Comment>
 ) => {
    await prisma.blog.findUniqueOrThrow({
       where: {
          id,
         
       },
    });
 
    const result = await prisma.blog.update({
       where: {
          id,
       },
       data,
    });
   return result
 };  

export const CommentServices = {
  createCommentIntoDB,updateCommentIntoDb
};
