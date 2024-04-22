import { Request, Response } from 'express';


import { sendResponse } from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { blogServicres } from './blog.service';
import { VerifiedUser } from '../../interfaces/common';

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

export const blogController = {
   createBlog,
};
