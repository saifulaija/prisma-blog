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
  paginationAndSortingQueryParams: IPaginationParams & ISortingParams,
  
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
  return await prisma.blog.findUniqueOrThrow({
    where: {
      id,
    },
  });
};
const getMyAllBlogsFomDB = async (
   queryParams: IBlogFilterParams,
   paginationAndSortingQueryParams: IPaginationParams & ISortingParams,
   user:any
   
 ) => {
   
    const userData=await prisma.user.findUniqueOrThrow({
      where:{
         email:user.email
      }
    })

   const authorData=await prisma.author.findUniqueOrThrow({
      where:{
         email:userData.email
      }
   })


    console.log(authorData.id)


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
 
   // const result = await prisma.blog.findMany({
   //   where: { AND: conditions ,authorId:userData.id},
   //   skip,
   //   take: limit,
   //   orderBy: {
   //     [sortBy]: sortOrder,
   //   },
   // });

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
     }
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

export const blogServicres = {
  getAllBlogFomDB,
  craeteBlogIntoDb,
  getSingleBlogFromDB,
  getMyAllBlogsFomDB
};
