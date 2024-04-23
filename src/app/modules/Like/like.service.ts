import httpStatus from "http-status";
import prisma from "../../../shared/prismaClient";
import { HTTPError } from "../../errors/HTTPError";

const like = async (id: string, user: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const existingLike = await prisma.like.findFirst({
    where: {
      blogId: id,
      userId: userData.id,
    },
  });
  if (existingLike) {
    throw new HTTPError(
      httpStatus.BAD_REQUEST,
      "User has already liked this blog"
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    await prisma.like.create({
      data: {
        blogId: id,
        userId: userData.id,
      },
    });

    await prisma.blog.update({
      where: { id: id },
      data: { likeCount: { increment: 1 } },
    });
  });

  console.log(result);

  return result;
};

const unLike = async (id: string, user: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  console.log(userData);

  const existingLike = await prisma.like.findFirst({
    where: {
      blogId: id,
      userId: userData.id,
    },
  });

  if (!existingLike) {
    throw new Error("User has not liked this blog");
  }

  await prisma.like.delete({
    where: {
      id: existingLike.id,
    },
  });

  // Decrement the likeCount in the blog model
  await prisma.blog.update({
    where: { id },
    data: { likeCount: { decrement: 1 } },
  });
};

export const LikeServices = {
  like,
  unLike,
};
