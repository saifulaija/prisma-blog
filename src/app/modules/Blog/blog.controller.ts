import { Request, Response } from 'express';


import { sendResponse } from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { blogServicres } from './blog.service';

const createBlog = catchAsync(async (req: Request, res: Response) => {
    const data=req.body
   const result = await blogServicres.craeteBlogIntoDb(data);
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
