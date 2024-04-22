import { Request, Response } from 'express';


import { sendResponse } from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { userServices } from './user.service';
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  
   
   const result = await userServices.createAdmin(req.body);
   sendResponse(res, {
     statusCode: httpStatus.OK,
     success: true,
     message: 'Admin created successfully!',
     data: result,
   });
 });
const createAuthor = catchAsync(async (req: Request, res: Response) => {
  
   
   const result = await userServices.createAuthor(req.body);
   sendResponse(res, {
     statusCode: httpStatus.OK,
     success: true,
     message: 'Author created successfully!',
     data: result,
   });
 });

export const userController = {
   createAdmin,createAuthor
};
