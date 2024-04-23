import { Comment } from "@prisma/client";
import prisma from "../../../shared/prismaClient";
import { TComment } from "./comment.constant";

const createCommentIntoDB = async (user: any, payload: TComment) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const blogData = await prisma.blog.findUniqueOrThrow({
    where: {
      id: payload.blogId,
      authorId: payload.authorId,
    },
  });

  const result = await prisma.comment.create({
    data: { ...payload, commentorId: userData.id },
  });

  return result;
};

const updateCommentIntoDb = async (
  id: string,
  data: Partial<Comment>,
  user: any
) => {
  const commentorData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  await prisma.comment.findUniqueOrThrow({
    where: {
      id,
      commentorId: commentorData.id,
    },
  });

  const result = await prisma.comment.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteCommentFromDB=async(id:string,user:any)=>{

   await prisma.user.findUniqueOrThrow({
    where:{
      email:user.email
    }
  })

  await prisma.comment.findUniqueOrThrow({
    where:{
      id
    }
  })

  const result = await prisma.comment.delete({
    where:{
      id
    }
  })

  console.log(result)
  return result
}

export const CommentServices = {
  createCommentIntoDB,
  updateCommentIntoDb,
  deleteCommentFromDB
};
