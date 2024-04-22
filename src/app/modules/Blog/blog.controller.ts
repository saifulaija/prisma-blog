import { Request, Response } from 'express';


import { sendResponse } from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { blogServicres } from './blog.service';
import { VerifiedUser } from '../../interfaces/common';
import { filterValidQueryParams } from '../../../shared/filterValidQueryParams';

import { paginationAndSortingParams } from '../../../shared/appConstants';
import { blogValidParams } from './blog.constant';

const createBlog = catchAsync(async (req: Request& {user?:any}, res: Response) => {
   const user =req.user
   console.log(user)

    const data=req.body
   const result = await blogServicres.craeteBlogIntoDb(data,user);
   sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Blog Created Successfully!',
      data: result,
   });
});

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
   const validQueryParams = filterValidQueryParams(req.query, blogValidParams);
   const paginationAndSortingQueryParams = filterValidQueryParams(
      req.query,
      paginationAndSortingParams
   );

   const result = await blogServicres.getAllBlogFomDB(
      validQueryParams,
      paginationAndSortingQueryParams
   );

   sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Blog data fetched successfully!',
      meta: result.meta,
      data: result.result,
   });
});

const getSingleBlog = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;

   const result = await blogServicres.getSingleBlogFromDB(id);
   sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Blog data fetched successfully!',
      data: result,
   });
});


export const blogController = {
   createBlog,getAllBlogs,getSingleBlog
};
