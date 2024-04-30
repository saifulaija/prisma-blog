import { Blog, Prisma, UserRole, Visibility } from "@prisma/client";
import prisma from "../../../shared/prismaClient";
import { IBlogFilterParams } from "./blog.interface";
import {
  IPaginationParams,
  ISortingParams,
} from "../../interfaces/paginationSorting";
import { generatePaginateAndSortOptions } from "../../../helpers/paginationHelpers";
import { blogSearchableFields } from "./blog.constant";

const craeteBlogIntoDb = async (payload: Blog, user: any) => {
  console.log({user})
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

// const getSingleBlogFromDB = async (id: string, user: any) => {
//   console.log({user})
//   const blogPost = await prisma.$transaction(async (tx) => {
//     let includeOptions = {};
//     console.log({includeOptions})

//     switch (user.role) {
//       case UserRole.ADMIN:
//         includeOptions = {
//           admin: true,
//         };
//         break;
//       case UserRole.BLOGGER:
//         includeOptions = {
//           blogger: true,
//         };
//         break;
//       case UserRole.SUBSCRIBER:
//         includeOptions = {
//           subscriber: true,
//         };
//         break;

//       default:
//         break;
//     }

//     // Find the blog post and return it
//     const post = await tx.blog.findUnique({
//       where: {
//         id,
//       },
//       include: {
//         author: true,

//         comment: {
//           include: {
//             comment: {
//               include: includeOptions
//             },
//           },
//         },
//       },
//     });

//     // const post = await tx.blog.findUnique({
//     //   where: {
//     //     id,
//     //   },
//     //   include: {
//     //     author: true,
//     //     comment: {
//     //       include: {
//     //         comment: {
//     //           select: {
//     //             id: true,
//     //             email: true,
//     //             role: true,
//     //             profilePhoto:true
//     //             ...(user:any) => {
//     //               switch (user.role) {
//     //                 case " SUBSCRIBER":
//     //                   return { subscriber: true };
//     //                 case " ADMIN":
//     //                   return { admin: true };
//     //                 case " MODERATOR":
//     //                   return { moderator: true };
//     //                 default:
//     //                   return {};
//     //               }
//     //             },
//     //           },
//     //         },
//     //       },
//     //     },
//     //   },
//     // });

//     // Increment views within the transaction
//     await tx.blog.update({
//       where: {
//         id,
//       },
//       data: {
//         views: {
//           increment: 1,
//         },
//       },
//     });

//     return post;
//   });

//   return blogPost;
// };


const getSingleBlogFromDB = async (id: string, user: any) => {
  console.log({user})
  const blogPost = await prisma.$transaction(async (tx) => {
    let includeOptions = {};

    switch (user.role) {
      case UserRole.ADMIN:
        includeOptions = {
          admin: true,
        };
        break;
      case UserRole.BLOGGER:
        includeOptions = {
          author: true,
        };
        break;
      case UserRole.SUBSCRIBER:
        includeOptions = {
          subscriber: true,
        };
        break;

      default:
        break;
    }

    // Find the blog post and return it
    const post = await tx.blog.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
        comment: {
          include: {
            comment :{
              include:includeOptions
            }
          },
        },
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
