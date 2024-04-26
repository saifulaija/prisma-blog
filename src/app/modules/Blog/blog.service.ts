import { Blog, Prisma, Visibility } from "@prisma/client";
import prisma from "../../../shared/prismaClient";
import { IBlogFilterParams } from "./blog.interface";
import {
  IPaginationParams,
  ISortingParams,
} from "../../interfaces/paginationSorting";
import { generatePaginateAndSortOptions } from "../../../helpers/paginationHelpers";
import { blogSearchableFields } from "./blog.constant";

const craeteBlogIntoDb = async (payload: Blog, user: any) => {
  const authorData = await prisma.author.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const result = await prisma.blog.create({
    data: { ...payload, authorId: authorData.id },
  });
  return result;
};

const getAllBlogFomDB = async (
  queryParams: IBlogFilterParams,
  paginationAndSortingQueryParams: IPaginationParams & ISortingParams
) => {
  const { q, ...otherQueryParams } = queryParams;

  const { limit, skip, page, sortBy, sortOrder } =
    generatePaginateAndSortOptions({
      ...paginationAndSortingQueryParams,
    });

  //  const conditions: Prisma.BlogWhereInput[] = [];
  const conditions: Prisma.BlogWhereInput[] = [];

  // filtering out the soft deleted users
  conditions.push({
    visibility: Visibility.PUBLIC,
  });

  //@ searching
  if (q) {
    const searchConditions = blogSearchableFields.map((field) => ({
      [field]: { contains: q, mode: "insensitive" },
    }));
    conditions.push({ OR: searchConditions });
  }

  //@ filtering with exact value
  if (Object.keys(otherQueryParams).length > 0) {
    const filterData = Object.keys(otherQueryParams).map((key) => ({
      [key]: (otherQueryParams as any)[key],
    }));
    conditions.push(...filterData);
  }

  const result = await prisma.blog.findMany({
    where: { AND: conditions },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      author: true,
    },
  });

  const total = await prisma.blog.count({
    where: { AND: conditions },
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    result,
  };
};

const getSingleBlogFromDB = async (id: string) => {
  const blogPost = await prisma.$transaction(async (tx) => {
    // Find the blog post and return it
    const post = await tx.blog.findUnique({
      where: {
        id,
      },
    });

    // Increment views within the transaction
    await tx.blog.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return post;
  });

  return blogPost;
};

const getMyAllBlogsFomDB = async (
  queryParams: IBlogFilterParams,
  paginationAndSortingQueryParams: IPaginationParams & ISortingParams,
  user: any,
  userId: string
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const authorData = await prisma.author.findUniqueOrThrow({
    where: {
      email: userData.email,
    },
  });

  const { q, ...otherQueryParams } = queryParams;

  const { limit, skip, page, sortBy, sortOrder } =
    generatePaginateAndSortOptions({
      ...paginationAndSortingQueryParams,
    });

  //  const conditions: Prisma.BlogWhereInput[] = [];
  const conditions: Prisma.BlogWhereInput[] = [];

  // filtering out the soft deleted users
  conditions.push({
    visibility: Visibility.PUBLIC,
  });

  //@ searching
  if (q) {
    const searchConditions = blogSearchableFields.map((field) => ({
      [field]: { contains: q, mode: "insensitive" },
    }));
    conditions.push({ OR: searchConditions });
  }

  //@ filtering with exact value
  if (Object.keys(otherQueryParams).length > 0) {
    const filterData = Object.keys(otherQueryParams).map((key) => ({
      [key]: (otherQueryParams as any)[key],
    }));
    conditions.push(...filterData);
  }

  const result = await prisma.blog.findMany({
    where: {
      AND: [...conditions, { authorId: authorData.id }],
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.blog.count({
    where: {
      AND: [...conditions, { authorId: authorData.id }],
    },
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    result,
  };
};

const deleteBlogFromDB = async (id: string) => {
  await prisma.blog.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.blog.delete({
    where: {
      id,
    },
  });

  return result;
};

const updateBlogIntoDB = async (
  id: string,
  data: Partial<Blog>
): Promise<Blog> => {
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
  return result;
};

export const blogServicres = {
  getAllBlogFomDB,
  craeteBlogIntoDb,
  getSingleBlogFromDB,
  getMyAllBlogsFomDB,
  deleteBlogFromDB,
  updateBlogIntoDB,
};
